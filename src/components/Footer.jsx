// src/components/Footer.jsx
import React from 'react';
import './Footer.css';
import { Facebook, Instagram, Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

const Footer = () => (
  <footer className="footer">
    <div className="footer-content">
      <h3>አድራሻ</h3>
      <p><MapPin size={16} /> አዲስ አበባ, ኢትዮጵያ</p>
      <p><Phone size={16} /> 0984735563/ 0984438542</p>
      <p><Mail size={16} /> melitabdu@gmail.com</p>
      <p><Clock size={16} /> ስራ ሰዓት፡ ሰኞ - ዓርብ፣ 2:30 - 11:00 ሰአት ድረስ</p>

      <div className="social-icons">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
          <Facebook size={20} />
        </a>
        <a href="https://t.me" target="_blank" rel="noopener noreferrer">
          <Send size={20} />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <Instagram size={20} />
        </a>
      </div>
    </div>

    <div className="footer-bottom">
      <p>© {new Date().getFullYear()} የቤት አገልግሎት መተግበሪያ. መብቱ የተጠበቀ ነው።</p>
    </div>
  </footer>
);

export default Footer;
