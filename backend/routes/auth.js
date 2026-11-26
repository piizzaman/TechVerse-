const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD_HASH =
  process.env.ADMIN_PASSWORD_HASH;
const JWT_SECRET = process.env.JWT_SECRET;

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: "Username and password are required.",
      });
    }

    if (username !== ADMIN_USERNAME) {
      return res.status(401).json({
        error: "Invalid username or password.",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      ADMIN_PASSWORD_HASH
    );

    if (!passwordMatches) {
      return res.status(401).json({
        error: "Invalid username or password.",
      });
    }

    const token = jwt.sign(
      {
        username: ADMIN_USERNAME,
        role: "admin",
      },
      JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );

    res.json({
      message: "Login successful.",
      token,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Login failed.",
    });
  }
});

module.exports = router;