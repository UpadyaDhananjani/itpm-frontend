import React from 'react';
import { Link } from 'react-router-dom';
import './nav.css'; // Make sure this CSS file exists

function Nav() {
  return (
    <div>
      <div className="horizontal-line"></div>
      <div className="top-bar">
       
        <nav className="top">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link> {/* Corrected to /about */}
          <Link to="/services">Services</Link> {/* Corrected to /services */}
          <Link to="/contact">Contact</Link> {/* Corrected to /contact */}
        </nav>
      </div>
      <div className="bottom-bar"></div>
    </div>
  );
}

export default Nav;