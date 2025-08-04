const { PrismaClient } = require("../../generated/prisma/client");

const prisma = new PrismaClient();

// Create a cart for a user ✅
const createCart = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const existingCart = await prisma.cart.findUnique({
      where: { userId: userId },
    });

    if (existingCart) {
      return res
        .status(400)
        .json({ error: "Cart already exists for this user" });
    }

    const newCart = await prisma.cart.create({
      data: {
        userId: userId,
      },
      include: {
        User: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        CartItem: {
          include: {
            Product: {
              include: {
                Category: true,
                ProductImages: true,
              },
            },
          },
        },
      },
    });

    res.status(201).json({ cart: newCart });
  } catch (error) {
    console.error("Cart creation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get cart by ID with all items ✅
const getCartById = async (req, res) => {
  try {
    const { id } = req.params;

    const cart = await prisma.cart.findUnique({
      where: { id: id },
      include: {
        User: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        CartItem: {
          include: {
            Product: {
              include: {
                Category: true,
                ProductImages: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    if (cart.CartItem && cart.CartItem.length > 0) {
      const totalAmount = cart.CartItem.reduce((total, item) => {
        return total + item.Product.price * item.quantity;
      }, 0);

      res.status(200).json({
        cart: {
          ...cart,
          totalAmount: parseFloat(totalAmount.toFixed(2)),
          itemCount: cart.CartItem.length,
        },
      });
    } else {
      res.status(200).json({
        cart: {
          ...cart,
          totalAmount: 0.0,
          itemCount: 0,
        },
      });
    }
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get cart by user ID ✅
const getCartByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await prisma.cart.findUnique({
      where: { userId: userId },
      include: {
        User: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        CartItem: {
          include: {
            Product: {
              include: {
                Category: true,
                ProductImages: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found for this user" });
    }

    if (cart.CartItem && cart.CartItem.length > 0) {
      const totalAmount = cart.CartItem.reduce((total, item) => {
        return total + item.Product.price * item.quantity;
      }, 0);

      res.status(200).json({
        cart: {
          ...cart,
          totalAmount: parseFloat(totalAmount.toFixed(2)),
          itemCount: cart.CartItem.length,
        },
      });
    } else {
      res.status(200).json({
        cart: {
          ...cart,
          totalAmount: 0.0,
          itemCount: 0,
        },
      });
    }
  } catch (error) {
    console.error("Get cart by user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Add item to cart ✅
const addItemToCart = async (req, res) => {
  try {
    const { cartId, productId, quantity = 1 } = req.body;

    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
    });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: "Insufficient stock" });
    }

    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cartId,
        productId: productId,
      },
    });

    let cartItem;

    if (existingCartItem) {
      const newQuantity = existingCartItem.quantity + quantity;

      if (product.stock < newQuantity) {
        return res
          .status(400)
          .json({ error: "Insufficient stock for total quantity" });
      }

      cartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: newQuantity },
        include: {
          Product: true,
        },
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: {
          cartId: cartId,
          productId: productId,
          quantity: quantity,
        },
        include: {
          Product: true,
        },
      });
    }

    res.status(201).json({ cartItem });
  } catch (error) {
    console.error("Add item to cart error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update cart item quantity ✅
const updateCartItem = async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
      return res.status(400).json({ error: "Quantity must be greater than 0" });
    }

    // Get cart item with product info
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: {
        Product: true,
      },
    });

    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    if (cartItem.Product.stock < quantity) {
      return res.status(400).json({ error: "Insufficient stock" });
    }

    const updatedCartItem = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity: quantity },
      include: {
        Product: true,
      },
    });

    res.status(200).json({ cartItem: updatedCartItem });
  } catch (error) {
    console.error("Update cart item error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Remove item from cart ✅
const removeItemFromCart = async (req, res) => {
  try {
    const { cartItemId } = req.params;

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
    });

    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    res.status(200).json({ message: "Item removed from cart successfully" });
  } catch (error) {
    console.error("Remove item from cart error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Clear all items from cart
const clearCart = async (req, res) => {
  try {
    const { cartId } = req.params;

    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
    });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    await prisma.cartItem.deleteMany({
      where: { cartId: cartId },
    });

    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update cart (mainly for updating cart metadata if needed)
const updateCartById = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    delete updateData.id;
    delete updateData.userId;
    delete updateData.createdAt;

    const cart = await prisma.cart.findUnique({
      where: { id: id },
    });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const updatedCart = await prisma.cart.update({
      where: { id: id },
      data: updateData,
      include: {
        User: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        CartItem: {
          include: {
            Product: {
              include: {
                Category: true,
                ProductImages: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json({ cart: updatedCart });
  } catch (error) {
    console.error("Update cart error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete cart by ID
const deleteCartById = async (req, res) => {
  try {
    const { id } = req.params;

    const cart = await prisma.cart.findUnique({
      where: { id: id },
    });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Due to cascade deletion, cart items will be automatically deleted
    await prisma.cart.delete({
      where: { id: id },
    });

    res.status(200).json({ message: "Cart deleted successfully" });
  } catch (error) {
    console.error("Delete cart error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createCart,
  getCartById,
  getCartByUserId,
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
  clearCart,
  updateCartById,
  deleteCartById,
};
