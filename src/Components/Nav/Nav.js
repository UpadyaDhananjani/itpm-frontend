import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Nav.css";


import menu1 from "../Img/Menu2.jpg";
import menu2 from "../Img/Menu1.jpg";
import menu3 from "../Img/Menu3.jpg";
import menu4 from "../Img/Menu..4.jpg";
import menu5 from "../Img/Menu..5.jpg";
import menu6 from "../Img/Menu..6.jpg";
import menu7 from "../Img/Menu.7.jpg";

const images = [menu1, menu2, menu3, menu4, menu5, menu6, menu7];

function Nav() {
  const [bgImage, setBgImage] = useState(images[0]);
  const [loadedImages, setLoadedImages] = useState([]);

  useEffect(() => {
    const loadImages = async () => {
      const loaded = await Promise.all(
        images.map((image) =>
          new Promise((resolve) => {
            const img = new Image();
            img.src = image;
            img.onload = () => resolve(image);
            img.onerror = () => resolve(null);
          })
        )
      );
      setLoadedImages(loaded.filter(Boolean));
    };
    loadImages();
  }, []);

  useEffect(() => {
    if (!loadedImages.length) return;
    const interval = setInterval(() => {
      setBgImage((prev) => {
        const current = loadedImages.indexOf(prev);
        const next = (current + 1) % loadedImages.length;
        return loadedImages[next];
      });
    }, 3500);
    return () => clearInterval(interval);
  }, [loadedImages]);

  return (
    <div
      className="nav-container"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="nav-links-wrapper">
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
      </div>
      <div className="bottom-bar">
        © {new Date().getFullYear()} Online Restaurant Management System - All Rights Reserved
      </div>
    </div>
  );
}

export default Nav;
