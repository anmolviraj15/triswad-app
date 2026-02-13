const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  email: String,
  items: [
    {
      name: String,
      weight: String,
      price: Number,
      image: String
    }
  ],
  amount: Number,
  status: { type: String, default:"Pending" },
  paymentId: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", OrderSchema);
