// App.jsx
import React from 'react';
import Navbar from './components/navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/projects';
import Experience from './components/experience';
import Footer from './components/footer';
import ScrollToTop from './components/ScrollToTop';
import Contact from './components/Contact';



function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Projects/>
      <Experience/>
      <Contact/>
      <Footer/>
      <ScrollToTop/>
    </>
  );
}

export default App;
