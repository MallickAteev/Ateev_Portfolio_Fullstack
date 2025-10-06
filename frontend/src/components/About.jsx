// src/components/About.jsx
import React, { useEffect, useRef } from "react";
import "./About.css";

const About = () => {
  const skillsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const bars = entry.target.querySelectorAll(".bar-fill");
            bars.forEach((bar) => {
              bar.style.width = bar.dataset.width;
            });
            observer.unobserve(entry.target); // Animate only once
          }
        });
      },
      { threshold: 0.4 }
    );

    if (skillsRef.current) {
      observer.observe(skillsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="about-section">
      <div className="about-wrapper">
        <h2 className="section-title">About</h2>
        <p className="section-subtitle">Me</p>

        <div className="about-content">
          {/* Left Column: Education */}
          <div className="about-box">
            <h3 className="about-heading">Education</h3>
            <ul className="education-list">
              <li>
                <strong>Institute of Engineering, Pulchowk Campus</strong><br />
                B.E. in Electrical Engineering (3rd Year)<br />
                <em>Expected Graduation: 2027</em>
              </li>
              <li>
                <strong>Mithila Institute of Technology</strong><br />
                Physics, Mathematics and Computer Science<br />
                <em>Grade: 3.6 / 4 (Apr 2020 – Apr 2022)</em>
              </li>
            </ul>
          </div>

          {/* Right Column: Skills */}
          <div className="about-box" ref={skillsRef}>
            <h3 className="about-heading">Skills</h3>
            <div className="skills-grid">
              {[
                { name: "Python", level: "60%" },
                { name: "C", level: "75%" },
                { name: "C++", level: "80%" },
                { name: "React", level: "50%" },
                { name: "MATLAB", level: "55%" },
              ].map((skill, i) => (
                <div className="skill-bar" key={i}>
                  <span>{skill.name}</span>
                  <div className="bar-track">
                    <div className="bar-fill" data-width={skill.level}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
