const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Import routes
const user = require("./routes/api/user");
// const product = require("./routes/api/product");
// const order = require("./routes/api/order");
// const cart = require("./routes/api/cart");

// Use routes
app.use("/api/user", user);
// app.use("/api/product", product);
// app.use("/api/order", order);
// app.use("/api/cart", cart);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to the Perfume E-commerce Server!");
});
app.get("/api", (req, res) => {
  res.json({ message: "API is running" });
});
