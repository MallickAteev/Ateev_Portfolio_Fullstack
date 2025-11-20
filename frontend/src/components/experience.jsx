// src/components/Experience.jsx
import React from 'react';
import './experience.css';

const Experience = () => {
  return (
    <section id="experience" className="experience-section">
      <h2 className="experience-title">Experience</h2>
      <div className="timeline">

        <div className="timeline-item">
          <div className="timeline-line">
            <span className="date-top">Apr 2025</span>
            <span className="timeline-dot"></span>
            <span className="date-bottom">Feb 2025</span>
          </div>
          <div className="timeline-content">
            <h3>Graphic Designer <span>United Nations Volunteers</span></h3>
            <p className="location">Remote · Part-time</p>
          </div>
        </div>

        <div className="timeline-item">
          <div className="timeline-line">
            <span className="date-top">Feb 2025</span>
            <span className="timeline-dot"></span>
            <span className="date-bottom">Jun 2024</span>
          </div>
          <div className="timeline-content">
            <h3>Dashing Graphics Designer <span>LOCUS</span></h3>
            <p className="location">Lalitpur, Nepal · Hybrid · Part-time</p>
          </div>
        </div>

        <div className="timeline-item">
          <div className="timeline-line">
            <span className="date-top">Present</span>
            <span className="timeline-dot"></span>
            <span className="date-bottom">Dec 2022</span>
          </div>
          <div className="timeline-content">
            <h3>Physics, Math & Computer Science Teacher <span>Freelance</span></h3>
            <p className="location">Hybrid · Freelance</p>
            <ul>
              <li>NEB +2, A Levels (AS & A2), Edexcel (IAS & IA2)</li>
              <li>BCA (2nd semester Mathematics-II), IGNOU (1st semester Mathematics)</li>
              <li>International Baccalaureate (IB)</li>
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Experience;
