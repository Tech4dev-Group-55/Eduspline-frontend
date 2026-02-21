import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../Button/Button';
import './Navbar.css';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleMenuItem = (item) => {
    setExpandedItems({
      ...expandedItems,
      [item]: !expandedItems[item]
    });
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
       
        <div className="navbar-logo">
          <img src="/images/EdusplineLogo.png" alt="Logo" className="logo-image" />
        </div>

        <ul className="navbar-menu">
          <li><a href="#about">About us</a></li>
          <li><a href="#solutions">Solutions</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#why-choose">Why choose us</a></li>
          <li><a href="#contact">Contact us</a></li>
        </ul>

        
        <div className="navbar-auth">
          <Link to="/login">
            <Button variant="secondary" size="nav" outline={true}>
              Log in
            </Button>
          </Link>
          <Link to="/signup">
            <Button variant="primary" size="nav">
              Sign up
            </Button>
          </Link>
        </div>

       
        <button 
          className="hamburger" 
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {/* Replace with icon image when ready */}
          <img src="/icons/hamburger-menu.svg" alt="menu" className="hamburger-icon" />
        </button>
      </div>

      
      <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        
        {/* Logo Section */}
        <div className="mobile-menu-header">
          <img src="/images/EdusplineLogo.png" alt="Logo" className="mobile-logo" />
          <button 
            className="close-btn" 
            onClick={toggleMobileMenu}
            aria-label="Close menu"
          >
            <img src="/icons/close-icon.png" alt="close" className="close-icon" />
          </button>
        </div>

        <div className="mobile-menu-content">
          
          {/* Navigation Links Section */}
          <div className="mobile-nav-section">
            <ul className="mobile-nav-links">
              <li onClick={() => toggleMenuItem('about')}>
                <span className="plus-icon">+</span>
                <a href="#about" onClick={toggleMobileMenu}>About us</a>
              </li>
              <li onClick={() => toggleMenuItem('solutions')}>
                <span className="plus-icon">+</span>
                <a href="#solutions" onClick={toggleMobileMenu}>Solutions</a>
              </li>
              <li onClick={() => toggleMenuItem('pricing')}>
                <span className="plus-icon">+</span>
                <a href="#pricing" onClick={toggleMobileMenu}>Pricing</a>
              </li>
              <li onClick={() => toggleMenuItem('why')}>
                <span className="plus-icon">+</span>
                <a href="#why-choose" onClick={toggleMobileMenu}>Why choose us</a>
              </li>
              <li onClick={() => toggleMenuItem('contact')}>
                <span className="plus-icon">+</span>
                <a href="#contact" onClick={toggleMobileMenu}>Contact us</a>
              </li>
            </ul>
          </div>

          {/* Search Section */}
          <div className="mobile-search-section">
            <div className="mobile-search">
              <input 
                type="text" 
                placeholder="Can't find what you're looking for?" 
                className="search-input"
              />
              <button className="search-btn">
                <img src="/icons/search-icon.png" alt="search" className="search-icon" />
              </button>
            </div>
          </div>

          {/* Auth Buttons Section */}
          <div className="mobile-auth-section">
            <Link to="/login" onClick={toggleMobileMenu} className="mobile-auth-link">
              <Button variant="secondary" size="nav" outline={true} className="mobile-btn">
                Log in
              </Button>
            </Link>
            <Link to="/signup" onClick={toggleMobileMenu} className="mobile-auth-link">
              <Button variant="primary" size="nav" className="mobile-btn">
                Sign up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;