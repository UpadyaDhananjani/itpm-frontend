import React from "react";
import Nav from "../Nav/Nav";
import "./Home.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const handleAddOrderClick = () => {
    navigate("/add-order");
  };

  const handleAllOrdersClick = () => {
    navigate("/all-orders");
  };

  return (
    <div className="home-container">
      <Nav />

      <div className="welcome-rectangle">
        <h3>Welcome to our order Management system!</h3>

        <div className="button-container">
          <button className="add-order-button" onClick={handleAddOrderClick}>
            Add Order
          </button>
          <button className="all-orders-button" onClick={handleAllOrdersClick}>
            All Orders
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;