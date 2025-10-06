// src/components/Projects.jsx
import React from 'react';
import './Projects.css';

const Projects = () => {
  return (
    <section id="projects" className="projects-section">
      <h2 className="projects-title">Projects</h2>

      {/* Flex container for cards */}
      <div className="projects-container">
        {/* RC Car Project */}
        <div className="project-card">
          <h3 className="project-name">RC Car for RoboPop</h3>
          <p className="project-description">
            Designed and built an RC car for the RoboPop event, controllable via Wi-Fi and Bluetooth. The chassis and circuitry were custom-developed for responsive real-time control. Future plans include AI integration and image processing to detect and pop balloons based on color recognition.
          </p>
          <ul className="tech-stack">
            <li>Arduino</li>
            <li>Bluetooth Module</li>
            <li>ESP8266 (Wi-Fi)</li>
            <li>Motor Driver</li>
            <li>Future: AI & Computer Vision</li>
          </ul>
        </div>

        {/* Image Processing Project */}
        <div className="project-card">
          <h3 className="project-name">Image Processing using Deep Learning Model</h3>
          <p className="project-description">
            Developed an interactive image classification web app using <strong>Streamlit</strong> and a <strong>MobileNet</strong> model. The app allows users to upload images and outputs predictions with confidence scores, enabling intuitive deep learning inference in real-time.
          </p>
          <ul className="tech-stack">
            <li>Python</li>
            <li>TensorFlow / Keras</li>
            <li>MobileNet</li>
            <li>Streamlit</li>
            <li>NumPy / OpenCV</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Projects;
