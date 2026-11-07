import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiCheckCircle } from 'react-icons/fi';
import SectionTitle from '../../components/SectionTitle/SectionTitle';
import Button from '../../components/Button/Button';
import { addInquiry } from '../../admin/services/adminStorage';
import './Contact.scss';

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    budget: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.fullName.trim()) tempErrors.fullName = 'Please enter your name.';
    if (!formData.email.trim()) {
      tempErrors.email = 'Please enter your email address.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Please enter a valid email address.';
    }
    if (!formData.service) tempErrors.service = 'Please select a service.';
    if (!formData.message.trim()) tempErrors.message = 'Please enter your message.';
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      // Record inquiry in local storage for Admin Panel
      try {
        addInquiry({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          service: formData.service,
          budget: formData.budget,
          message: formData.message,
          status: 'New'
        });
      } catch (storageErr) {
        console.warn('Could not save inquiry to local storage', storageErr);
      }

      const response = await fetch('https://formsubmit.co/ajax/novamanagement819@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          service: formData.service,
          budget: formData.budget,
          message: formData.message
        })
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      setIsSubmitted(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        company: '',
        service: '',
        budget: '',
        message: ''
      });
    } catch (error) {
      setErrors({
        submit: 'Something went wrong while sending your message. Please try again or email us directly.'
      });
    }
  };

  return (
    <div className="contact-page pt-20 pb-20">
      <div className="container">
        <div className="contact-grid">
          <motion.div 
            className="contact-info"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SectionTitle 
              title="Let's Talk About Your Project" 
              subtitle="Fill out the form and our team will get back to you within 24 hours."
            />
            
            <div className="info-cards">
              <div className="info-card">
                <FiMail className="icon" />
                <div>
                  <h4>Email Us</h4>
                  <p>novamanagement819@gmail.com</p>
                </div>
              </div>
              <div className="info-card">
                <FiPhone className="icon" />
                <div>
                  <h4>Call Us</h4>
                  <p>8141953998</p>
                </div>
              </div>
              <div className="info-card">
                <FiMapPin className="icon" />
                <div>
                  <h4>Visit Us</h4>
                  <p>Surat, Gujarat, India</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="contact-form-container card"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {isSubmitted ? (
              <div className="success-state text-center py-10">
                <FiCheckCircle className="text-green text-6xl mx-auto mb-4" style={{ fontSize: '64px', color: '#32A852' }} />
                <h3 className="text-2xl mb-2">Thank you!</h3>
                <p className="text-secondary">Your project inquiry has been received. Our team will get back to you soon.</p>
                <Button onClick={() => setIsSubmitted(false)} variant="outline" className="mt-6">
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="form-control" placeholder="John Doe" />
                    {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" placeholder="john@example.com" />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Phone</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="form-control" placeholder="+91 0000000000" />
                  </div>
                  <div className="form-group">
                    <label>Company</label>
                    <input type="text" name="company" value={formData.company} onChange={handleChange} className="form-control" placeholder="Your Company" />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Service *</label>
                    <div className="select-field">
                      <select name="service" value={formData.service} onChange={handleChange} className="form-control">
                        <option value="">Select a service</option>
                        <option value="Instagram Management">Instagram Management</option>
                        <option value="Web Development">Web Development</option>
                        <option value="Graphic Designing">Graphic Designing</option>
                        <option value="Branding">Branding</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    {errors.service && <span className="error-message">{errors.service}</span>}
                  </div>
                  <div className="form-group">
                    <label>Budget</label>
                    <div className="select-field">
                      <select name="budget" value={formData.budget} onChange={handleChange} className="form-control">
                        <option value="">Select a budget</option>
                        <option value="₹10K – ₹25K">₹10K – ₹25K</option>
                        <option value="₹25K – ₹50K">₹25K – ₹50K</option>
                        <option value="₹50K – ₹1L">₹50K – ₹1L</option>
                        <option value="₹1L+">₹1L+</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Message *</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} className="form-control" placeholder="Tell us about your project..."></textarea>
                  {errors.message && <span className="error-message">{errors.message}</span>}
                </div>
                
                {errors.submit && <div className="error-message text-center mb-4">{errors.submit}</div>}
                
                <Button type="submit" variant="primary" size="lg" className="w-full">
                  Send Message
                </Button>
                {errors.submit && <span className="error-message mt-3 d-block">{errors.submit}</span>}
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
