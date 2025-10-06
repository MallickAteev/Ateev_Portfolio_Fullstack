import React from "react";
import "./Footer.css";
import { FaGithub, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="social-icons">
        <a href="https://www.linkedin.com/in/ateev-m-6196aa256/" target="_blank" rel="noopener noreferrer">
                 <FaLinkedin />
               </a>
               <a href="https://github.com/MallickAteev" target="_blank" rel="noopener noreferrer">
                 <FaGithub />
               </a>
               <a href="https://instagram.com/mlkateev" target="_blank" rel="noopener noreferrer">
                 <FaInstagram />
               </a>
      </div>
      <p className="copyright">© 2025 Ateev Mallick. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
