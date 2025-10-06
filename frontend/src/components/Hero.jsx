// src/components/Hero.jsx
import React from 'react';
import './Hero.css';
import { FaLinkedin, FaGithub, FaInstagram, FaDownload, FaFileAlt } from 'react-icons/fa';
import profileImg from '../assets/me5.jpg';

const Hero = () => {
  const handleResumeDownload = () => {
    // Replace with your actual resume file path
    const resumeUrl = 'https://github.com/MallickAteev/Resume/blob/main/Resume_AteevMallick.pdf';
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = 'Ateev_Mallick_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="hero">
      <img src={profileImg} alt="Ateev Mallick" className="hero-image" />
      <h1 className="hero-name">Ateev Mallick</h1>
      <p className="hero-bio">
        Electrical Engineering undergrad passionate about Machine Learning, Neural Networks, and building AI-powered systems that connect hardware and intelligence.
      </p>

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

      {/* Resume Download Box */}
      <div className="resume-download-container">
        <div className="resume-download-box">
          <div className="resume-icon">
            <FaFileAlt />
          </div>
          <h3>Resume</h3>
          <button className="download-btn" onClick={handleResumeDownload}>
            <FaDownload />
            Download
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;