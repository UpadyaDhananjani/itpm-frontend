import React from 'react';

const App = () => {
  const navItems = ['HOME', 'MENU', 'ABOUT US', 'GALLERY', 'CONTACT', 'RESERVATIONS'];
  const specialDishes = [
    { name: 'FINES TARTARE STEAK', price: '$50', description: 'Served with persillade and aromatic herbs' },
    { name: 'CREAMY CHICKEN SOUP', price: '$40', description: 'Served with persillade and aromatic herbs' },
    { name: 'BOILED EGGS ON TOAST', price: '$30', description: 'Served with persillade and aromatic herbs' },
    { name: 'BEST ROASTED RUMPSTEAK', price: '$60', description: 'Served with persillade and aromatic herbs' },
    { name: 'RISOTTO & MUSHROOMS', price: '$45', description: 'Served with persillade and aromatic herbs' },
  ];

 
  const heroSectionStyle = {
    backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("/Img/Menu1.jpg")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
  };

  return (
    <div className="restaurant-container">
      {/* Navigation */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-logo">
            <h1>BITESFOOD</h1>
            <p className="tagline">Restaurant & Bistro</p>
          </div>

          <div className="navbar-links">
            {navItems.map((item, index) => (
              <button key={index} className="nav-link" onClick={() => alert(`${item} clicked`)}>
                {item}
              </button>
            ))}
          </div>

          <div className="navbar-actions">
            <span className="search-icon">
              {/* Search Icon SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <button className="btn btn-primary">RESERVATIONS</button>
            <div className="mobile-menu-toggle">
              {/* Mobile Menu Toggle Button */}
              <button>
                {/* Hamburger Icon SVG - You might need to manage state for open/close */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section" style={heroSectionStyle}>
        <div className="hero-content">
          <p className="subtitle">Welcome to our delicious dishes</p>
          <h2 className="title">BEHIND THE DISHES</h2>
          <p className="description">
            Take a gastronomic adventure with our hand-crafted dishes,
            where taste meets passion and quality meets value.
          </p>
          <button className="btn btn-primary">LEARN MORE</button>
        </div>
        <div className="scroll-indicator">
          {/* Scroll Indicator SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="section-container">
          <div className="section-header">
            <p className="subtitle">Special moments</p>
            <h2 className="title">ABOUT US</h2>
          </div>

          <div className="about-grid">
            <div className="about-image">
              <img src="/Img/Menu2.jpg" alt="Dish showcase" />
            </div>

            <div className="about-content">
              <p className="subtitle">Taste perfection</p>
              <h3 className="subtitle-large">TRADITIONAL & MODERN</h3>
              <p className="description">
                Find a harmonious balance between the best traditional recipes and signature modern style.
              </p>
              <button className="btn btn-primary">READ MORE</button>
            </div>

            <div className="about-image right">
              <img src="/Img/Menu3.jpg" alt="Another dish" />
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section className="menu-section">
        <div className="section-container">
          <div className="menu-grid">
            <div className="menu-image right">
              <img src="/Img/Menu4.jpg" alt="Menu dish" />
            </div>

            <div className="menu-content">
              <p className="subtitle">Our healthy food</p>
              <h2 className="title">OUR SPECIAL</h2>

              <div className="menu-items">
                {specialDishes.map((dish, index) => (
                  <div key={index} className="menu-item">
                    <div className="menu-item-info">
                      <h3 className="menu-item-name">{dish.name}</h3>
                      <p className="menu-item-desc">{dish.description}</p>
                    </div>
                    <p className="menu-item-price">{dish.price}</p>
                  </div>
                ))}
              </div>

              <button className="btn btn-primary">VIEW MENU</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-section">
        <div className="section-container">
          <div className="footer-grid">
            <div className="footer-col">
              <h3 className="footer-title">BITESFOOD</h3>
              <p className="footer-text">
                A culinary journey that brings the finest ingredients to your table with passion and creativity.
              </p>
            </div>

            <div className="footer-col">
              <h4 className="footer-subtitle">OPENING HOURS</h4>
              <p className="footer-text">Mon - Fri: 10:00 - 23:00</p>
              <p className="footer-text">Sat: 12:00 - 23:00</p>
              <p className="footer-text">Sun: 12:00 - 21:00</p>
            </div>

            <div className="footer-col">
              <h4 className="footer-subtitle">CONTACT INFO</h4>
              <p className="footer-text">123 Gourmet Street</p>
              <p className="footer-text">Culinary City, CC 10000</p>
              <p className="footer-text">+1 234 567 890</p>
              <p className="footer-text">info@bitesfood.com</p>
            </div>

            <div className="footer-col">
              <h4 className="footer-subtitle">NEWSLETTER</h4>
              <p className="footer-text">Subscribe to our newsletter for special offers and updates.</p>
              <div className="newsletter-form">
                <input type="email" placeholder="Your email" className="newsletter-input" />
                <button className="newsletter-btn">SEND</button>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 BITESFOOD. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};