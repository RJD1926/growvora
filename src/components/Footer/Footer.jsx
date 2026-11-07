import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiLinkedin, FiYoutube, FiMail, FiPhone } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <Link to="/" className="logo">
              <img src="/logo.png" alt="GrowVora Logo" />
              <span>GROWVORA</span>
              <span className="brand-dot" />
            </Link>
            <p>We create result-driven digital solutions to help your business stand out and succeed online.</p>
            <div className="social-links">
              <a href="https://www.instagram.com/thegrowvora.co.in/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FiInstagram /></a>
              <a href="#" aria-label="LinkedIn"><FiLinkedin /></a>
              <a href="#" aria-label="YouTube"><FiYoutube /></a>
            </div>
          </div>
          
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/instagram-management">Instagram Management</Link></li>
              <li><Link to="/web-development">Web Services</Link></li>
              <li><Link to="/graphic-designing">Graphic Designing</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          
          <div className="footer-contact">
            <h4>Contact Info</h4>
            <div className="contact-item">
              <FiMail />
              <span>novamanagement819@gmail.com</span>
            </div>
            <div className="contact-item">
              <FiPhone />
              <span>8141953998</span>
            </div>
            <div className="contact-item">
              <FiPhone />
              <span>www.growvora.co.in</span>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} GrowVora Marketing Agency. All rights reserved.</p>
          
          <div className="developer-credit">
            <span>Developed and Designed by : </span>
            <a 
              href="https://coderboyz.vercel.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="coderboyz-link"
            >
              CoderBoyz : coderboyz.vercel.app
            </a>
          </div>

          <Link 
            to="/admin" 
            className="footer-admin-link"
          >
            Admin Portal
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
