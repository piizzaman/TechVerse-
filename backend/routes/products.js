const express = require("express");
const router = express.Router();

const prisma = require("../lib/prisma");
const requireAdmin = require("../middleware/auth");

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await prisma.product.findMany();

    res.json(products);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch products.",
    });
  }
});

// Get one product
router.get("/:id", async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });

    if (!product) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    res.json(product);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
});

// Create product
router.post("/", requireAdmin, async (req, res) => {
  try {
    const {
      name,
      price,
      stock,
      image,
      category,
      description,
    } = req.body;

    if (
      !name ||
      price === undefined ||
      stock === undefined ||
      !image ||
      !category ||
      !description
    ) {
      return res.status(400).json({
        error: "All product fields are required.",
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
        price: Number(price),
        stock: Number(stock),
        image,
        category,
        description,
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to create product.",
    });
  }
});

// Update product
router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const {
      name,
      price,
      stock,
      image,
      category,
      description,
    } = req.body;

    if (
      !name ||
      price === undefined ||
      stock === undefined ||
      !image ||
      !category ||
      !description
    ) {
      return res.status(400).json({
        error: "All product fields are required.",
      });
    }

    const product = await prisma.product.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        name,
        price: Number(price),
        stock: Number(stock),
        image,
        category,
        description,
      },
    });

    res.json(product);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to update product.",
    });
  }
});

// Delete product
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const product = await prisma.product.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    res.json({
      message: "Product deleted successfully.",
      product,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to delete product.",
    });
  }
});

module.exports = router;