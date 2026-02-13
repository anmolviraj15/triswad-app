const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// Signup
router.post("/signup", async (req,res)=>{
  const { name,email,password } = req.body;
  try{
    let user = await User.findOne({ email });
    if(user) return res.status(400).json({ msg:"User already exists" });
    const hashed = await bcrypt.hash(password,10);
    user = new User({ name,email,password:hashed });
    await user.save();

    // Email confirmation
    let transporter = nodemailer.createTransport({
      service:"gmail",
      auth:{ user:process.env.EMAIL_USER, pass:process.env.EMAIL_PASS }
    });
    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to Triswad",
      text: `Hello ${name}, Thanks for signing up!`
    };
    transporter.sendMail(mailOptions);

    const token = jwt.sign({ id:user._id }, process.env.JWT_SECRET, { expiresIn:"1d" });
    res.json({ token, user:{ name,email, id:user._id } });
  } catch(err){ res.status(500).send(err.message); }
});

// Login
router.post("/login", async (req,res)=>{
  const { email,password } = req.body;
  try{
    const user = await User.findOne({ email });
    if(!user) return res.status(400).json({ msg:"User not found" });
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch) return res.status(400).json({ msg:"Invalid password" });
    const token = jwt.sign({ id:user._id }, process.env.JWT_SECRET, { expiresIn:"1d" });
    res.json({ token, user:{ name:user.name,email,id:user._id } });
  } catch(err){ res.status(500).send(err.message); }
});

module.exports = router;
