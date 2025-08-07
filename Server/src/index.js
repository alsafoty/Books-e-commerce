const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Import routes
const user = require("./routes/user");
const product = require("./routes/product");
const category = require("./routes/category");
const cart = require("./routes/cart");
const address = require("./routes/address");
const wishlist = require("./routes/wishlist");
const order = require("./routes/order");

// Use routes
app.use("/api/user", user);
app.use("/api/product", product);
app.use("/api/category", category);
app.use("/api/cart", cart);
app.use("/api/address", address);
app.use("/api/wishlist", wishlist);
app.use("/api/order", order);

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to the Perfume E-commerce Server!");
});
app.get("/api", (req, res) => {
  res.json({ message: "API is running" });
});
