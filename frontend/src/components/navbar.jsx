// src/components/Navbar.jsx
import React, { useState, useRef, useEffect } from 'react';
import './navbar.css';
import { Link } from 'react-scroll';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';




const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);
  const hamburgerRef = useRef(null);
  const desktopNavRef = useRef(null);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);
  const [prevScrollY, setPrevScrollY] = useState(0);
const [visible, setVisible] = useState(true);

// Scroll hide/show logic
useEffect(() => {
  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > prevScrollY && currentScrollY > 80) {
      setVisible(false); // scrolling down
    } else {
      setVisible(true); // scrolling up
    }

    setPrevScrollY(currentScrollY);
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, [prevScrollY]);



  // Close sidebar on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target)
      ) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Animate desktop nav on mount
  useEffect(() => {
    const isDesktop = window.innerWidth >= 768;
    if (isDesktop && desktopNavRef.current) {
      desktopNavRef.current.classList.add('animate-in');
    }
  }, []);

  return (
    <>
      <div className={`navbar ${visible ? '' : 'navbar--hidden'}`}>


        {/* Hamburger Icon for Mobile */}
        <div
          ref={hamburgerRef}
          className={`hamburger ${isOpen ? 'open' : ''}`}
          onClick={toggleMenu}
        >
          <div className="bar" />
          <div className="bar" />
          <div className="bar" />
        </div>

        {/* Desktop Nav */}
        <div ref={desktopNavRef} className="desktop-nav">
          <ul>
            <li><Link
  to="about"
  smooth={true}
  duration={600}
  offset={-70} // Adjust based on your fixed navbar height
>
  About
</Link>
</li>
            <li><Link
  to="projects"
  smooth={true}
  duration={600}
  offset={-70} // Adjust based on your fixed navbar height
>
  Projects
</Link>
</li>
            <li><Link
  to="experience"
  smooth={true}
  duration={600}
  offset={-70} // Adjust based on your fixed navbar height
>
  Experience
</Link>
</li>

            <li><Link
  to="research"
  smooth={true}
  duration={600}
  offset={-70} // Adjust based on your fixed navbar height
>
  Research
</Link>
</li>
            <li><Link
  to="contact"
  smooth={true}
  duration={600}
  offset={-70} // Adjust based on your fixed navbar height
>
  Contact
</Link>
</li>
          </ul>
        </div>
      </div>

      {/* Sidebar for Mobile */}
      <div ref={sidebarRef} className={`sidebar ${isOpen ? 'open' : ''}`}>
        <ul>
          <li><a href="#about" onClick={closeMenu}>About</a></li>
          <li><a href="#projects" onClick={closeMenu}>Projects</a></li>
          <li><a href="#experience" onClick={closeMenu}>Experience</a></li>

          <li><a href="#research" onClick={closeMenu}>Research</a></li>
          <li><a href="#contact" onClick={closeMenu}>Contact</a></li>
        </ul>
     
      </div>
    </>
  );
};

export default Navbar;
