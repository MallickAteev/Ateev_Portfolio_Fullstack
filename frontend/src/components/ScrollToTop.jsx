// src/components/ScrollToTop.jsx
import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import './ScrollToTop.css';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsClicked(true);
    
    // Reset click animation
    setTimeout(() => {
      setIsClicked(false);
    }, 200);

    // Smooth scroll with easing
    const startPosition = window.pageYOffset;
    const startTime = performance.now();
    const duration = 800; // Duration in milliseconds

    const easeInOutCubic = (t) => {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    };

    const animateScroll = (currentTime) => {
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = easeInOutCubic(progress);
      
      window.scrollTo(0, startPosition * (1 - ease));
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  return (
    isVisible && (
      <button 
        className={`scroll-to-top ${isClicked ? 'clicked' : ''}`} 
        onClick={scrollToTop}
        onMouseDown={(e) => e.preventDefault()}
        type="button"
        aria-label="Scroll to top"
      >
        <FaArrowUp />
      </button>
    )
  );
};

export default ScrollToTop;