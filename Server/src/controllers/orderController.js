const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Create a new order from cart
const createOrder = async (req, res) => {
  try {
    const { userId, addressId, sessionId } = req.body;

    if (!addressId) {
      return res.status(400).json({ error: "Address ID is required" });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        CartItem: {
          include: {
            Product: true,
          },
        },
      },
    });

    if (!cart || cart.CartItem.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    let address = null;
    if (addressId) {
      address = await prisma.address.findUnique({
        where: { id: addressId, userId },
      });

      if (!address) {
        return res
          .status(400)
          .json({ error: "Address not found or doesn't belong to user" });
      }
    }

    for (const item of cart.CartItem) {
      if (item.Product.stock < item.quantity) {
        return res.status(400).json({
          error: `Insufficient stock for ${item.Product.name}. Available: ${item.Product.stock}, Requested: ${item.quantity}`,
        });
      }
    }

    const totalAmount = cart.CartItem.reduce((total, item) => {
      return total + item.Product.price * item.quantity;
    }, 0);

    const newOrder = await prisma.order.create({
      data: {
        userId,
        totalAmount: parseFloat(totalAmount.toFixed(2)),
        status: "PENDING",
        addressId: addressId || null,
        sessionId: sessionId || null,
      },
    });

    if (newOrder) {
      for (const item of cart.CartItem) {
        await prisma.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.Product.price,
          },
        });

        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }
    const completeOrder = await prisma.order.findUnique({
      where: { id: newOrder.id },
      include: {
        OrderItem: {
          include: {
            Product: true,
          },
        },
        Address: true,
        User: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    res
      .status(201)
      .json({ message: "Order created successfully", order: completeOrder });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all orders (Admin only)
const getAllOrders = async (req, res) => {
  prisma.order
    .findMany({
      include: {
        OrderItem: {
          include: {
            Product: true,
          },
        },
        Address: true,
        User: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    });
};

// Get order by ID (User can see own orders, Admin can see all) 🔄🔄
const getOrderById = async (req, res) => {
  const id = req.params.id;

  try {
    const order = await prisma.order.findUnique({
      where: { id: id },
      include: {
        OrderItem: {
          include: {
            Product: true,
          },
        },
        Address: true,

        User: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.sessionId) {
      const session = await stripe.checkout.sessions.retrieve(order.sessionId);

      const payment_status = session.payment_status;

      if (payment_status === "paid") {
        // Update order status to PAID
        await prisma.order.update({
          where: { id: order.id },
          data: { status: "CONFIRMED" },
        });
      }
      res.send({
        order,
        payment_status: payment_status,
      });
    }

    res.send({
      order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get user's orders (authenticated user only)
const getUserOrders = async (req, res) => {
  const userId = req.user.userId;

  prisma.order
    .findMany({
      where: { userId: userId },
      include: {
        OrderItem: {
          include: {
            Product: {
              include: {
                ProductImages: true,
              },
            },
          },
        },
        Address: true,
      },
      orderBy: { createdAt: "desc" },
    })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    });
};

// Get orders by user ID (Admin only)
const getOrdersByUserId = async (req, res) => {
  prisma.order
    .findMany({
      where: { userId: req.params.userId },
      include: {
        OrderItem: {
          include: {
            Product: true,
          },
        },
        Address: true,
      },
      orderBy: { createdAt: "desc" },
    })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    });
};

const updateOrderSession = async (req, res) => {
  const id = req.params.id;
  const { sessionId } = req.body;

  try {
    const order = await prisma.order.findUnique({
      where: { id: id },
    });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: id },
      data: { sessionId: sessionId },
    });

    res.send(updatedOrder);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update order status (Admin only)
const updateOrderStatus = async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;

  const validStatuses = [
    "PENDING",
    "CONFIRMED",
    "DELIVERED",
    "CANCELLED",
    "REFUNDED",
  ];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  prisma.order
    .findUnique({
      where: { id: id },
    })
    .then((result) => {
      if (!result) {
        return res
          .status(400)
          .json({ error: "Order with given id doesn't exist" });
      }

      prisma.order
        .update({
          where: { id: id },
          data: { status: status },
        })
        .then((result) => {
          res.send(result);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ error: "Internal server error" });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    });
};

// Delete order by ID (Admin only)
const deleteOrderById = async (req, res) => {
  const id = req.params.id;

  prisma.order
    .delete({
      where: { id: id },
    })
    .then((result) => {
      if (!result) {
        return res
          .status(400)
          .json({ error: "Order with given id doesn't exist" });
      }
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    });
};

// Get successful orders statistics (Admin only)
const getSuccessfulOrdersStats = async (req, res) => {
  try {
    const successfulOrders = await prisma.order.findMany({
      where: {
        status: {
          in: ["DELIVERED", "CONFIRMED"],
        },
      },
    });

    const totalSuccessfulOrders = successfulOrders.length;
    const totalAmount = successfulOrders.reduce((sum, order) => {
      return sum + order.totalAmount;
    }, 0);

    res.json({
      totalSuccessfulOrders,
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      orders: successfulOrders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getUserOrders,
  getOrderById,
  getOrdersByUserId,
  updateOrderSession,
  updateOrderStatus,
  deleteOrderById,
  getSuccessfulOrdersStats,
};
