const Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { PrismaClient } = require("../../generated/prisma/client");

const prisma = new PrismaClient();

const stripeCheckout = async (req, res) => {
  const { items, orderId } = req.body;
  console.log("Items for checkout: Here");
  if (orderId && !items) {
    try {
      console.log("order here id:", orderId);
      const fetchingOrder = await prisma.order.findUnique({
        where: { id: orderId },
      });

      if (fetchingOrder.sessionId) {
        console.log("Session already exists for order:", orderId);
        const session = await Stripe.checkout.sessions.retrieve(
          fetchingOrder.sessionId
        );
        return res.json({
          message: "Session already created",
          id: session.id,
          url: session.url,
        });
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else if (items) {
    try {
      const newSession = await Stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: items.map((item) => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: item.name,
              images: [item.image],
            },
            unit_amount: Math.round(item.price * 141.044), // Convert to cents
          },
          quantity: item.quantity,
        })),
        mode: "payment",
        success_url: `http://localhost:8080/#/successful?orderId=${orderId}`,
        cancel_url: `http://localhost:8080/#/cancelled`,
        metadata: {
          userId: req.user.userId, // Assuming user ID is available in req.user
          orderId: orderId,
        },
        invoice_creation: {
          enabled: true,
        },
      });
      res.json({ id: newSession.id, url: newSession.url });
    } catch (error) {
      console.error("Error creating Stripe checkout session:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

module.exports = stripeCheckout;
