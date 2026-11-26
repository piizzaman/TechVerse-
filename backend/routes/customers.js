const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");

const router = express.Router();

function requireCustomer(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Authentication required.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
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
      error: "Invalid or expired token.",
    });
  }
}

// Register
router.post("/register", async (req, res) => {
  try {
    const {
      username,
      name,
      email,
      phone,
      password,
      address,
    } = req.body;

    if (
      !username ||
      !name ||
      !email ||
      !phone ||
      !password
    ) {
      return res.status(400).json({
        error:
          "Username, name, email, phone, and password are required.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error:
          "Password must be at least 8 characters.",
      });
    }

    const existingCustomer =
      await prisma.customer.findFirst({
        where: {
          OR: [
            { username },
            { email },
            { phone },
          ],
        },
      });

    if (existingCustomer) {
      return res.status(409).json({
        error:
          "Username, email, or phone number is already in use.",
      });
    }

    const passwordHash = await bcrypt.hash(
      password,
      12
    );

    const customer = await prisma.customer.create({
      data: {
        username,
        name,
        email,
        phone,
        passwordHash,
        address: address || null,
      },
    });

    res.status(201).json({
      message: "Account created successfully.",
      customer: {
        id: customer.id,
        username: customer.username,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to create account.",
    });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      return res.status(400).json({
        error:
          "Username/email and password are required.",
      });
    }

    const customer =
      await prisma.customer.findFirst({
        where: {
          OR: [
            { username: login },
            { email: login },
          ],
        },
      });

    if (!customer) {
      return res.status(401).json({
        error:
          "Invalid username/email or password.",
      });
    }

    const passwordMatches =
      await bcrypt.compare(
        password,
        customer.passwordHash
      );

    if (!passwordMatches) {
      return res.status(401).json({
        error:
          "Invalid username/email or password.",
      });
    }

    const token = jwt.sign(
      {
        id: customer.id,
        username: customer.username,
        role: "customer",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );

    res.json({
      message: "Login successful.",
      token,
      customer: {
        id: customer.id,
        username: customer.username,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Login failed.",
    });
  }
});

// Get customer's addresses
router.get(
  "/addresses",
  requireCustomer,
  async (req, res) => {
    try {
      const addresses =
        await prisma.address.findMany({
          where: {
            customerId: req.customer.id,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

      res.json(addresses);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: "Failed to fetch addresses.",
      });
    }
  }
);

// Add an address
router.post(
  "/addresses",
  requireCustomer,
  async (req, res) => {
    try {
      const {
        type,
        firstName,
        lastName,
        addressLine1,
        addressLine2,
        city,
        state,
        zipCode,
        country,
        isDefault,
      } = req.body;

      if (
        !type ||
        !firstName ||
        !lastName ||
        !addressLine1 ||
        !city ||
        !state ||
        !zipCode
      ) {
        return res.status(400).json({
          error:
            "Please fill out all required address fields.",
        });
      }

      if (
        type !== "shipping" &&
        type !== "billing"
      ) {
        return res.status(400).json({
          error:
            "Address type must be shipping or billing.",
        });
      }

      if (isDefault) {
        await prisma.address.updateMany({
          where: {
            customerId: req.customer.id,
            type,
          },
          data: {
            isDefault: false,
          },
        });
      }

      const address =
        await prisma.address.create({
          data: {
            customerId: req.customer.id,
            type,
            firstName,
            lastName,
            addressLine1,
            addressLine2:
              addressLine2 || null,
            city,
            state,
            zipCode,
            country:
              country || "United States",
            isDefault: !!isDefault,
          },
        });

      res.status(201).json(address);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: "Failed to add address.",
      });
    }
  }
);

// Delete an address
router.delete(
  "/addresses/:id",
  requireCustomer,
  async (req, res) => {
    try {
      const address =
        await prisma.address.findFirst({
          where: {
            id: Number(req.params.id),
            customerId: req.customer.id,
          },
        });

      if (!address) {
        return res.status(404).json({
          error: "Address not found.",
        });
      }

      await prisma.address.delete({
        where: {
          id: address.id,
        },
      });

      res.json({
        message: "Address deleted successfully.",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: "Failed to delete address.",
      });
    }
  }
);

module.exports = router;