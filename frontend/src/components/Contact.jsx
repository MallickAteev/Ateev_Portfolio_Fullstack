import { useState } from 'react';
import axios from 'axios';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitStatus(null);

    // Add console log to see what's being sent
    console.log('🔄 === CONTACT FORM SUBMISSION STARTED ===');
    console.log('📤 Raw form data:', formData);
    console.log('📤 Form data keys:', Object.keys(formData));
    console.log('📤 Form data values:', Object.values(formData));
    console.log('📤 Each field:');
    console.log('  - name:', `"${formData.name}"`, '(length:', formData.name.length, ')');
    console.log('  - email:', `"${formData.email}"`, '(length:', formData.email.length, ')');
    console.log('  - message:', `"${formData.message}"`, '(length:', formData.message.length, ')');
    console.log('🌐 Sending to: https://ateev-portfolio-fullstack.onrender.com/api/contact/submit');

    try {
      const response = await axios.post('https://ateev-portfolio-fullstack.onrender.com/api/contact/submit', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 60000 // 15 second timeout for email sending
      });
      
      console.log('✅ === BACKEND RESPONSE RECEIVED ===');
      console.log('📥 Response data:', response.data);
      console.log('📧 Message ID:', response.data.messageId);
      
      if (response.data.success) {
        setSubmitStatus({
          type: 'success',
          message: response.data.message || 'Message sent successfully! I\'ll get back to you soon!'
        });
        setFormData({ name: '', email: '', message: '' });
        
        console.log('🎉 Message Sent!');
        console.log('📨 Email ID:', response.data.messageId);
      } else {
        setSubmitStatus({
          type: 'error',
          message: response.data.error || 'Something went wrong on the server.'
        });
        console.log('⚠️ Server returned success:false');
      }
    } catch (error) {
      console.error('❌ === ERROR DETAILS ===');
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      
      // Detailed error analysis
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('📡 Server responded with error status:', error.response.status);
        console.error('📄 Server response data:', error.response.data);
        console.error('🔤 Server response headers:', error.response.headers);
        
        let errorMessage = 'Server error occurred';
        
        if (error.response.status === 404) {
          errorMessage = 'API endpoint not found. Check if backend server is running properly.';
        } else if (error.response.status === 400) {
          errorMessage = error.response.data?.error || 'Invalid form data submitted';
        } else if (error.response.status === 500) {
          errorMessage = error.response.data?.error || 'Internal server error occurred';
        } else {
          errorMessage = error.response.data?.error || `Server error: ${error.response.status}`;
        }
        
        setSubmitStatus({
          type: 'error',
          message: errorMessage
        });
      } else if (error.request) {
        // The request was made but no response was received
        console.error('📡 No response received from server');
        console.error('Request details:', error.request);
        
        setSubmitStatus({
          type: 'error',
          message: 'Cannot connect to the server. Please make sure the backend is running on port 5000.'
        });
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('❓ Unexpected error:', error.message);
        
        setSubmitStatus({
          type: 'error',
          message: 'Failed to send message: ' + error.message
        });
      }
      
      // Specific error types
      if (error.code === 'ECONNREFUSED') {
        console.error('🔌 Connection refused - is the backend server running?');
        setSubmitStatus({
          type: 'error',
          message: 'Backend server is not running. Please start the server on port 5000.'
        });
      } else if (error.code === 'ECONNABORTED') {
        console.error('⏰ Request timeout - server took too long to respond');
        setSubmitStatus({
          type: 'error',
          message: 'Request timeout. The server is taking too long to send the email.'
        });
      } else if (error.code === 'ERR_NETWORK') {
        console.error('🌐 Network error - check your connection');
        setSubmitStatus({
          type: 'error',
          message: 'Network error. Please check your internet connection.'
        });
      }
    } finally {
      setIsLoading(false);
      console.log('🔚 === FORM SUBMISSION COMPLETED ===\n');
    }
  };

  return (
    <section id="contact" className="contact-section">
      <h2 className="contact-title">Get In Touch</h2>

      <div className="contact-container">
        {/* Contact Info Card */}
        <div className="contact-info-card">
          <h3 className="contact-info-title">Let's Work Together</h3>
          <p className="contact-info-description">
            I'm always open to discussing new opportunities and creative projects. 
            Whether you have a question or just want to say hi, I'll try my best to get back to you!
          </p>
          
          <div className="contact-details">
            <div className="contact-method">
              <span className="contact-icon">📧</span>
              <span>Email me directly</span>
            </div>
            <div className="contact-method">
              <span className="contact-icon">💬</span>
              <span>Response within 24hr</span>
            </div>
            <div className="contact-method">
              <span className="contact-icon">🚀</span>
              <span>Let's Collaborate</span>
            </div>
          </div>
        </div>

        {/* Contact Form Card */}
        <div className="contact-form-card">
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isLoading}
                placeholder="Enter your full name"
                minLength={2}
                maxLength={50}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
                placeholder="your.email@example.com"
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Your Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                disabled={isLoading}
                rows="5"
                placeholder="Tell me about your project or question..."
                minLength={10}
                maxLength={1000}
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={isLoading || !formData.name || !formData.email || !formData.message}
              className={`submit-button ${isLoading ? 'loading' : ''}`}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner">⏳</span>
                  Sending Email...
                </>
              ) : (
                'Send Message'
              )}
            </button>

            {submitStatus && (
              <div className={`status-message ${submitStatus.type}`}>
                {submitStatus.type === 'success' ? '✅ ' : '❌ '}
                {submitStatus.message}
              </div>
            )}

            {/* Debug info - visible only in development */}
            {process.env.NODE_ENV === 'development' && (
              <div style={{ 
                marginTop: '1rem', 
                padding: '0.5rem', 
                background: '#f0f0f0', 
                borderRadius: '4px', 
                fontSize: '0.8rem',
                color: '#666'
              }}>
                
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;