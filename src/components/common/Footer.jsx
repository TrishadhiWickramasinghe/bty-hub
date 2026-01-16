import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-5 pt-4 pb-2">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h5>BTY-HUB</h5>
            <p>Your one-stop shop for quality products at affordable prices.</p>
            <div className="social-icons">
              <a href="#" className="text-white me-3"><FaFacebook size={20} /></a>
              <a href="#" className="text-white me-3"><FaTwitter size={20} /></a>
              <a href="#" className="text-white"><FaInstagram size={20} /></a>
            </div>
          </div>
          
          <div className="col-md-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/products" className="text-white text-decoration-none">Products</a></li>
              <li><a href="/about" className="text-white text-decoration-none">About Us</a></li>
              <li><a href="/contact" className="text-white text-decoration-none">Contact Us</a></li>
              <li><a href="/privacy" className="text-white text-decoration-none">Privacy Policy</a></li>
            </ul>
          </div>
          
          <div className="col-md-4">
            <h5>Contact Info</h5>
            <p><FaMapMarkerAlt className="me-2" /> 123 Business St, City, Country</p>
            <p><FaPhone className="me-2" /> +1 (555) 123-4567</p>
            <p><FaEnvelope className="me-2" /> info@btyhub.com</p>
          </div>
        </div>
        
        <hr className="bg-light" />
        
        <div className="text-center">
          <p className="mb-0">&copy; {new Date().getFullYear()} BTY-HUB. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;