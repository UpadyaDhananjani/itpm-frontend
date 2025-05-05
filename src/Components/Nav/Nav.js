import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Nav.css";

// Import your images from the correct path
// Make sure the file names and paths match exactly (case-sensitive)
import menu1 from "../Img/Menu2.jpg"; // Changed from menu8.jpg to Menu1.jpg
import menu2 from "../Img/Menu1.jpg";
import menu3 from "../Img/Menu3.jpg";
import menu4 from "../Img/Menu..4.jpg";
import menu5 from "../Img/Menu..5.jpg";
import menu6 from "../Img/Menu..6.jpg";
import menu7 from "../Img/Menu.7.jpg";

const images = [menu1, menu2, menu3, menu4, menu5,menu6,menu7];

function Nav() {
  const [bgImage, setBgImage] = useState(images[0]);
  const [loadedImages, setLoadedImages] = useState([]);
  
  // Preload images with error handling
  useEffect(() => {
    const loadImages = async () => {
      try {
        const loaded = await Promise.all(
          images.map((image) => {
            return new Promise((resolve) => {
              const img = new Image();
              img.src = image;
              img.onload = () => {
                console.log(`Successfully loaded: ${image}`);
                resolve(image);
              };
              img.onerror = () => {
                console.error(`Failed to load image: ${image}`);
                resolve(null);
              };
            });
          })
        );
        setLoadedImages(loaded.filter(Boolean));
      } catch (error) {
        console.error("Error loading images:", error);
      }
    };

    loadImages();
  }, []);

  // Set up background rotation
  useEffect(() => {
    if (loadedImages.length === 0) return;
    
    const interval = setInterval(() => {
      setBgImage(prev => {
        const currentIndex = loadedImages.indexOf(prev);
        const nextIndex = (currentIndex + 1) % loadedImages.length;
        console.log(`Rotating to image: ${loadedImages[nextIndex]}`);
        return loadedImages[nextIndex];
      });
    },3500);
    
    return () => clearInterval(interval);
  }, [loadedImages]);

  return (
    <div className="nav-container" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="overlay"></div>
      <div className="top-menu-bar">
        <h2>Logo</h2>
        <nav className="top-menu">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/services">Services</Link>
          <Link to="/contact">Contact</Link>
        </nav>
      </div>
      <ul className="Home-ul">
        <li className="home-11">
          <Link to="/foods" className="home-a Active">
            <h1>Foods</h1>
          </Link>
        </li>
        <li className="home-11">
          <Link to="/menu" className="home-a">
            <h1>Menu</h1>
          </Link>
        </li>
        <li className="home-11">
          <Link to="/menudetails" className="home-a">
            <h1>Menu Details</h1>
          </Link>
        </li>
      </ul>
      <div className="bottom-bar">
        © {new Date().getFullYear()} Online Restaurant Management System - All Rights Reserved
      </div>
    </div>
  );
}

export default Nav;