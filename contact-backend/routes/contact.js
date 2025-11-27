const express = require('express');
const Joi = require('joi');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const router = express.Router();

// Google OAuth2 setup
const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

// Input validation schema
const contactSchema = Joi.object({
  name: Joi.string().min(2).max(50).pattern(/^[a-zA-Z\s]+$/).required(),
  email: Joi.string().email().required(),
  message: Joi.string().min(10).max(1000).required()
});

// In-memory store
let contacts = [];

// Utility function to sanitize input
const sanitizeInput = (input) => input?.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') || '';

// Send email with OAuth2
async function sendEmailNotification(contact) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken
      },
    });

    const mailOptions = {
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.CONTACT_EMAIL,
      subject: `New Message from ${contact.name}`,
      text: `Name: ${contact.name}\nEmail: ${contact.email}\n\nMessage:\n${contact.message}`,
      html: `
        <h2>New Portfolio Contact</h2>
        <p><strong>Name:</strong> ${contact.name}</p>
        <p><strong>Email:</strong> ${contact.email}</p>
        <p><strong>Message:</strong><br>${contact.message.replace(/\n/g, '<br>')}</p>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;

  } catch (error) {
    console.error("❌ EMAIL SEND ERROR:", error);
    return false;
  }
}

// Contact form route
router.post("/submit", async (req, res) => {
  const { error, value } = contactSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  const newContact = {
    id: Date.now(),
    name: sanitizeInput(value.name),
    email: sanitizeInput(value.email),
    message: sanitizeInput(value.message),
    timestamp: new Date().toISOString()
  };

  contacts.push(newContact);
  if (contacts.length > 100) contacts = contacts.slice(-100);

  const emailSent = await sendEmailNotification(newContact);

  res.json({
    success: true,
    message: emailSent
      ? "Message sent successfully — Thank you for contacting!"
      : "Message stored but email failed to send",
  });
});

// Get all messages
router.get("/messages", (req, res) => {
  const authHeader = req.headers.authorization;
  if (process.env.NODE_ENV === 'production' && (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_TOKEN}`)) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  res.json({ success: true, data: contacts });
});

module.exports = router;
