const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET
});

// Create Razorpay order
router.post("/create", async (req,res)=>{
  try {
    const { items, total, email } = req.body;
    
    if (!total || !email) {
      return res.status(400).json({ success: false, error: "Missing total or email" });
    }
    
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_SECRET) {
      console.error("Razorpay credentials missing in .env");
      return res.status(500).json({ success: false, error: "Payment gateway not configured" });
    }
    
    const options = { 
      amount: total * 100, 
      currency: "INR", 
      receipt: "order_" + Date.now()
    };
    
    console.log("Creating Razorpay order:", options);
    const order = await razorpay.orders.create(options);
    console.log("Razorpay order created:", order.id);
    
    res.json({
      success: true,
      orderId: order.id,
      razorpayKey: process.env.RAZORPAY_KEY_ID,
      amount: total
    });
  } catch(err) {
    console.error("Order creation error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Save order after payment
router.post("/save-order", async (req,res)=>{
  try {
    const { userId, products, amount, paymentId, email } = req.body;
    const order = new Order({ user: userId, products, amount, paymentId, email });
    await order.save();
    res.json({ success: true, order });
  } catch(err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
