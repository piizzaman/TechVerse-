const express = require("express");
const cors = require("cors");
require("dotenv").config();

const productRoutes = require("./routes/products");
const authRoutes = require("./routes/auth");
const customerRoutes = require("./routes/customers");
const orderRoutes = require("./routes/orders");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🚀 TechVerse API is running!");
});

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});