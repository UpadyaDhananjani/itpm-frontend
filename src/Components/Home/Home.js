import React from 'react';
import Nav from '../Nav/Nav';  // Ensure this path is correct
import './Home.css'; // Import the CSS file

function Home() {
  return (
    <div>
      <Nav />
      <div className="home-container">
        <h1>Welcome to the Menu Management </h1>
        <div>
          {/* Additional content or components can be added here */}
        </div>
      </div>
    </div>
  );
}

export default Home;
