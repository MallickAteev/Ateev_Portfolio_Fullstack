const express = require('express');
const Joi = require('joi');
const nodemailer = require('nodemailer');
const router = express.Router();

// Input validation schema
const contactSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s]+$/)
    .required()
    .messages({
      'string.pattern.base': 'Name can only contain letters and spaces',
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 50 characters',
      'any.required': 'Name is required'
    }),
  
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  
  message: Joi.string()
    .min(10)
    .max(1000)
    .required()
    .messages({
      'string.min': 'Message must be at least 10 characters long',
      'string.max': 'Message cannot exceed 1000 characters',
      'any.required': 'Message is required'
    })
});

// Enhanced transporter configuration
const createTransporter = () => {
  console.log('🔧 Creating Gmail transporter...');
  console.log('📧 Using email:', process.env.EMAIL_USER);
  console.log('🔑 Password exists:', !!process.env.EMAIL_PASS);
  
  return nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// In-memory store
let contacts = [];

// Utility function to sanitize input
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};

// Enhanced email notification function with detailed logging
async function sendEmailNotification(contact) {
  try {
    console.log('📧 === STARTING EMAIL NOTIFICATION ===');
    console.log('From:', process.env.EMAIL_USER);
    console.log('To:', process.env.CONTACT_EMAIL);
    console.log('Email user exists:', !!process.env.EMAIL_USER);
    console.log('Email pass exists:', !!process.env.EMAIL_PASS);
    console.log('Contact email exists:', !!process.env.CONTACT_EMAIL);
    
    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('❌ Email credentials not configured in environment variables');
      return false;
    }
    
    if (!process.env.CONTACT_EMAIL) {
      console.log('❌ CONTACT_EMAIL not configured');
      return false;
    }

    const transporter = createTransporter();
    
    // Test the connection first
    console.log('🔌 Testing SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully');
    
    const mailOptions = {
      from: `"Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.CONTACT_EMAIL,
      subject: `New Contact Form Submission from ${contact.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1f8eb0;">New Contact Form Submission</h2>
          <div style="background: #f9f9ff; padding: 20px; border-radius: 8px;">
            <p><strong>Name:</strong> ${contact.name}</p>
            <p><strong>Email:</strong> ${contact.email}</p>
            <p><strong>Message:</strong></p>
            <p style="background: white; padding: 15px; border-radius: 5px;">${contact.message.replace(/\n/g, '<br>')}</p>
            <p><strong>Submitted:</strong> ${new Date(contact.timestamp).toLocaleString()}</p>
          </div>
        </div>
      `,
      text: `
New Contact Form Submission

Name: ${contact.name}
Email: ${contact.email}
Message: ${contact.message}

Submitted: ${new Date(contact.timestamp).toLocaleString()}
      `
    };

    console.log('📧 Sending email...');
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Message Sent!');
    console.log('Message ID:', result.messageId);
    console.log('Response:', result.response);
    
    return true;
  } catch (error) {
    console.error('❌ === EMAIL ERROR DETAILS ===');
    console.error('Error name:', error.name);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Full error:', error);
    
    // Specific error handling
    if (error.code === 'EAUTH') {
      console.error('❌ AUTHENTICATION FAILED');
      console.error('💡 This usually means:');
      console.error('   - Wrong email or password');
      console.error('   - Using regular password instead of App Password');
      console.error('   - 2FA not enabled');
      console.error('   - App Password not generated correctly');
    } else if (error.code === 'ECONNECTION') {
      console.error('❌ CONNECTION FAILED');
      console.error('💡 Check your internet connection or firewall settings');
    } else if (error.code === 'EENVELOPE') {
      console.error('❌ ENVELOPE ERROR - Invalid email address');
    } else {
      console.error('❌ UNKNOWN ERROR TYPE');
    }
    
    return false;
  }
}

// Contact form submission endpoint
router.post('/submit', async (req, res) => {
  try {
    console.log('📨 === NEW CONTACT FORM SUBMISSION ===');
    console.log('Request body received:', req.body);

    // Check if request body exists
    if (!req.body) {
      console.log('❌ No request body received');
      return res.status(400).json({
        success: false,
        message: 'Request body is required'
      });
    }

    // Validate request body
    const { error, value } = contactSchema.validate(req.body);
    
    if (error) {
      console.log('❌ Validation error:', error.details[0].message);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
        field: error.details[0].path[0]
      });
    }

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(value.name),
      email: sanitizeInput(value.email),
      message: sanitizeInput(value.message)
    };

    console.log('✅ Data validated and sanitized');

    // Create contact object
    const newContact = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      ...sanitizedData,
      timestamp: new Date().toISOString(),
      status: 'new'
    };

    // Store contact
    contacts.push(newContact);
    
    // Keep only last 100 messages
    if (contacts.length > 100) {
      contacts = contacts.slice(-100);
    }

    // Send email notification
    console.log('🚀 Attempting to send email notification...');
    const emailSent = await sendEmailNotification(newContact);

    // Log the submission result
    console.log('📊 === SUBMISSION RESULT ===');
    console.log('Contact ID:', newContact.id);
    console.log('Name:', newContact.name);
    console.log('Email:', newContact.email);
    console.log('Message sent successfully:', emailSent);
    console.log('Timestamp:', newContact.timestamp);

    res.status(201).json({
      success: true,
      message: 'Message sent successfully! I will get back to you soon.',
      emailSent: emailSent,
      data: {
        id: newContact.id,
        name: newContact.name,
        timestamp: newContact.timestamp
      }
    });

  } catch (error) {
    console.error('❌ Error processing contact form:', error);
    
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
});

// Get all messages
router.get('/messages', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (process.env.NODE_ENV === 'production' && (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_TOKEN}`)) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    res.json({
      success: true,
      data: contacts.map(contact => ({
        id: contact.id,
        name: contact.name,
        email: contact.email,
        message: contact.message,
        timestamp: contact.timestamp,
        status: contact.status
      }))
    });
  } catch (error) {
    console.error('❌ Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;