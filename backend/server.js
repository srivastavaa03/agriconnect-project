const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server running");
});
let products = [
  { id: 1, name: "Tomato", price: 30 },
  { id: 2, name: "Potato", price: 20 }
];

app.get("/products", (req, res) => {
  res.json(products);
});

app.post("/products", (req, res) => {
  const product = req.body;
  products.push(product);
  res.json({ message: "Product added" });
});
let orders = [];

app.post("/order", (req, res) => {
  const order = req.body;
  orders.push(order);
  res.json({ message: "Order placed" });
});

app.listen(5000, () => {
  console.log("Server started");
});
