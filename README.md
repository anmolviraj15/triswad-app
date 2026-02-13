# Triswad - Spices E-commerce

A full-stack e-commerce application for selling spices online.

## Features
- Product catalog with images
- Shopping cart functionality
- Razorpay payment integration
- Order management

## Tech Stack
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Payments:** Razorpay

## Local Setup

### Backend
```bash
cd backend
npm install
node server.js
```

### Frontend
Open `frontend/index.html` in browser or serve on `http://localhost:5000`

## Environment Variables (.env)
```
MONGO_URI=mongodb://localhost:27017/triswad
RAZORPAY_KEY_ID=your_key_here
RAZORPAY_SECRET=your_secret_here
JWT_SECRET=your_secret
EMAIL_USER=your_email
EMAIL_PASS=your_password
```

## Deployment
Deployed on Render.com
