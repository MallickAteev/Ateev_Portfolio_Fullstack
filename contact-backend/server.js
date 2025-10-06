const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}));
app.use(express.json());

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use Gmail service
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // Your app password
  }
});

// Test email configuration on startup
const testEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log('✅ Email server is ready');
  } catch (error) {
    console.error('❌ Email configuration error:', error);
  }
};

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    console.log('📥 Received contact form data:', req.body);
    console.log('📊 Request body keys:', Object.keys(req.body));
    console.log('📊 Request body values:', Object.values(req.body));
    
    const { name, email, subject, message } = req.body;
    
    console.log('🔍 Extracted fields:');
    console.log('  - name:', name, '(type:', typeof name, ')');
    console.log('  - email:', email, '(type:', typeof email, ')');
    console.log('  - message:', message, '(type:', typeof message, ')');
    console.log('  - subject:', subject, '(type:', typeof subject, ')');

    // Validate required fields with detailed logging
    const missingFields = [];
    if (!name || name.trim() === '') missingFields.push('name');
    if (!email || email.trim() === '') missingFields.push('email');
    if (!message || message.trim() === '') missingFields.push('message');
    
    if (missingFields.length > 0) {
      console.log('❌ Missing or empty fields:', missingFields);
      return res.status(400).json({
        success: false,
        error: `Missing or empty fields: ${missingFields.join(', ')}`,
        missingFields: missingFields,
        receivedData: req.body
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    // Email options
    const mailOptions = {
      from: {
        name: 'Contact Form',
        address: process.env.EMAIL_USER
      },
      to: process.env.CONTACT_EMAIL,
      replyTo: email,
      subject: `Contact Form: ${subject || 'No Subject'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #007bff; margin-top: 0;">Contact Details</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject || 'No Subject'}</p>
          </div>

          <div style="background-color: #ffffff; padding: 20px; border: 1px solid #dee2e6; border-radius: 8px;">
            <h3 style="color: #333; margin-top: 0;">Message</h3>
            <p style="line-height: 1.6; color: #555;">${message.replace(/\n/g, '<br>')}</p>
          </div>

          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #6c757d; font-size: 12px;">
            <p>This email was sent from your contact form on ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `,
      text: `
        New Contact Form Submission
        
        Name: ${name}
        Email: ${email}
        Subject: ${subject || 'No Subject'}
        
        Message:
        ${message}
        
        Sent on: ${new Date().toLocaleString()}
      `
    };

    // Send email
    console.log('📧 Attempting to send email...');
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Message Sent:', info.messageId);
    console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(info));

    res.json({
      success: true,
      message: 'Email sent successfully',
      messageId: info.messageId
    });

  } catch (error) {
    console.error('❌ Error sending email:', error);
    
    // Handle specific Gmail errors
    let errorMessage = 'Failed to send email';
    if (error.code === 'EAUTH') {
      errorMessage = 'Email authentication failed. Check your credentials.';
    } else if (error.code === 'ECONNECTION') {
      errorMessage = 'Unable to connect to email server';
    } else if (error.responseCode === 535) {
      errorMessage = 'Invalid email credentials or app password';
    }

    res.status(500).json({
      success: false,
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    email: process.env.EMAIL_USER ? 'Configured' : 'Not configured',
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('🚀 Server is running on port', PORT);
  console.log('📧 Email configured:', process.env.EMAIL_USER ? 'Yes' : 'No');
  console.log('🌐 Frontend URL:', process.env.FRONTEND_URL);
  console.log('🔧 Environment:', process.env.NODE_ENV);
  
  // Test email connection
  testEmailConnection();
});