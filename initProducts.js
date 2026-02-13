require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");
const connectDB = require("./config/db");

connectDB();

const products = [
  { 
    name:"Red Chilli Powder", 
    description:"Spicy red chilli powder",
    image:"images/red chilli (2).jpg", 
    stock:50,
    options: [
      { weight: "100g", price: 150 },
      { weight: "250g", price: 320 },
      { weight: "500g", price: 600 }
    ]
  },
  { 
    name:"Garam Masala", 
    description:"Aromatic garam masala blend",
    image:"images/garam masala.jpg", 
    stock:50,
    options: [
      { weight: "100g", price: 120 },
      { weight: "250g", price: 280 },
      { weight: "500g", price: 520 }
    ]
  },
  { 
    name:"Sabji Masala", 
    description:"Perfect for vegetable dishes",
    image:"images/sabji masala 2.jpg", 
    stock:50,
    options: [
      { weight: "100g", price: 90 },
      { weight: "250g", price: 210 },
      { weight: "500g", price: 400 }
    ]
  },
  { 
    name:"Dhaniya Powder", 
    description:"Fresh coriander powder",
    image:"images/dhaniya powder.jpg", 
    stock:50,
    options: [
      { weight: "100g", price: 140 },
      { weight: "250g", price: 320 },
      { weight: "500g", price: 600 }
    ]
  },
  { 
    name:"Haldi Powder", 
    description:"Pure turmeric powder",
    image:"images/haldi powder.jpg", 
    stock:50,
    options: [
      { weight: "100g", price: 110 },
      { weight: "250g", price: 250 },
      { weight: "500g", price: 480 }
    ]
  }
];

const addProducts = async () => {
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log("Products added!");
  mongoose.disconnect();
};

addProducts();
