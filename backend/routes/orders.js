const express = require("express");
const jwt = require("jsonwebtoken");
const Stripe = require("stripe");
const prisma = require("../lib/prisma");

const router = express.Router();

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

function requireCustomer(req, res, next) {
  const authHeader = req.headers.authorization;

  if (
    !authHeader ||
    !authHeader.startsWith("Bearer ")
  ) {
    return res.status(401).json({
      error: "Authentication required.",
    });
  }

  try {
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (decoded.role !== "customer") {
      return res.status(403).json({
        error: "Customer access required.",
      });
    }

    req.customer = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      error: "Invalid or expired login.",
    });
  }
}

function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;

  if (
    !authHeader ||
    !authHeader.startsWith("Bearer ")
  ) {
    return res.status(401).json({
      error: "Admin authentication required.",
    });
  }

  try {
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (decoded.role !== "admin") {
      return res.status(403).json({
        error: "Admin access required.",
      });
    }

    req.admin = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      error: "Invalid or expired admin login.",
    });
  }
}

/* Create Stripe Checkout Session */

router.post(
  "/create-checkout-session",
  requireCustomer,
  async (req, res) => {
    try {
      if (!stripe) {
        return res.status(503).json({ error: "Online payments are not configured for this demo." });
      }
      const {
        items,
        shippingAddressId,
      } = req.body;

      if (
        !items ||
        !Array.isArray(items) ||
        items.length === 0
      ) {
        return res.status(400).json({
          error: "Your cart is empty.",
        });
      }

      if (!shippingAddressId) {
        return res.status(400).json({
          error:
            "A shipping address is required.",
        });
      }

      const address =
        await prisma.address.findFirst({
          where: {
            id: Number(shippingAddressId),
            customerId: req.customer.id,
            type: "shipping",
          },
        });

      if (!address) {
        return res.status(404).json({
          error: "Shipping address not found.",
        });
      }

      const productIds = items.map(
        (item) => Number(item.productId)
      );

      const products =
        await prisma.product.findMany({
          where: {
            id: {
              in: productIds,
            },
          },
        });

      if (products.length !== items.length) {
        return res.status(400).json({
          error:
            "One or more products could not be found.",
        });
      }

      const lineItems = [];

      for (const item of items) {
        const product = products.find(
          (product) =>
            product.id === Number(item.productId)
        );

        const quantity = Number(item.quantity);

        if (
          !Number.isInteger(quantity) ||
          quantity < 1
        ) {
          return res.status(400).json({
            error:
              "Invalid product quantity.",
          });
        }

        if (product.stock < quantity) {
          return res.status(400).json({
            error: `${product.name} does not have enough stock.`,
          });
        }

        lineItems.push({
          price_data: {
            currency: "usd",

            product_data: {
              name: product.name,
              description:
                product.description,
            },

            unit_amount: Math.round(
              product.price * 100
            ),
          },

          quantity,
        });
      }

      const session =
        await stripe.checkout.sessions.create({
          mode: "payment",

          line_items: lineItems,

          customer_email:
            req.customer.email,

          success_url:
            "http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}",

          cancel_url:
            "http://localhost:5173/checkout",

          metadata: {
            customerId: String(
              req.customer.id
            ),

            shippingAddressId: String(
              shippingAddressId
            ),
          },
        });

      res.json({
        url: session.url,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error:
          "Failed to create payment session.",
      });
    }
  }
);

/* CUSTOMER: Get their orders */

router.get(
  "/my-orders",
  requireCustomer,
  async (req, res) => {
    try {
      const orders =
        await prisma.order.findMany({
          where: {
            customerId: req.customer.id,
          },

          include: {
            items: {
              include: {
                product: true,
              },
            },
          },

          orderBy: {
            createdAt: "desc",
          },
        });

      res.json(orders);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: "Failed to fetch orders.",
      });
    }
  }
);

/* ADMIN: Get every order */

router.get(
  "/admin",
  requireAdmin,
  async (req, res) => {
    try {
      const orders =
        await prisma.order.findMany({
          include: {
            customer: {
              select: {
                id: true,
                username: true,
                name: true,
                email: true,
                phone: true,
              },
            },

            items: {
              include: {
                product: true,
              },
            },
          },

          orderBy: {
            createdAt: "desc",
          },
        });

      res.json(orders);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: "Failed to fetch orders.",
      });
    }
  }
);

/* ADMIN: Update order status */

router.patch(
  "/admin/:id/status",
  requireAdmin,
  async (req, res) => {
    try {
      const { status } = req.body;

      const validStatuses = [
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          error: "Invalid order status.",
        });
      }

      const order =
        await prisma.order.update({
          where: {
            id: Number(req.params.id),
          },

          data: {
            status,
          },
        });

      res.json({
        message:
          "Order status updated successfully.",

        order,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error:
          "Failed to update order status.",
      });
    }
  }
);

module.exports = router;