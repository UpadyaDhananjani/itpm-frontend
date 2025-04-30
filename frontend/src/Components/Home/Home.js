import React from 'react';
import Nav from '../Nav/Nav';
import { Link } from 'react-router-dom'; // Link to navigate to Add User Details Page


function Home() {
  return (
    <div style={styles.container}>
      <Nav />

      {/* Add Details Button positioned just below the Nav */}
      <div style={styles.addButtonContainer}>
        <Link to="/adduser" style={styles.addButton}>Add Details</Link>
      </div>
    </div>
  );
}

// Inline styles
const styles = {
  
  addButtonContainer: {
    position: 'absolute',
    top: '80px', // Adjust this based on the height of your Nav bar
    right: '20px',
    zIndex: 1000, // Ensure it stays above other content
  },
  addButton: {
    backgroundColor: 'green',
    color: 'white',
    padding: '10px 20px',
    fontSize: '16px',
    borderRadius: '5px',
    textDecoration: 'none',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
};

export default Home;
