const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ==== MIDDLEWARE ====
app.use(cors({
  origin: "https://ateevmallick.netlify.app",
  methods: "GET,POST",
  allowedHeaders: "Content-Type"
}));
app.use(express.json());

// ==== EMAIL TRANSPORTER (GLOBAL) ====
/*const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
module.exports.transporter = transporter;*/

// ==== ROUTES ====
const contactRoutes = require('./routes/contact');
app.use('/api/contact', contactRoutes);

// ==== HEALTH CHECK ====
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    email: process.env.EMAIL_USER ? 'Configured' : 'Not configured',
    timestamp: new Date().toISOString()
  });
});

// ==== START SERVER ====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log('📧 Email configured:', process.env.EMAIL_USER ? 'Yes' : 'No');
  console.log('🌐 Frontend URL:', process.env.FRONTEND_URL);
});
