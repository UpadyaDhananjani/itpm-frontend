import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./UpdateMenu.css";

function UpdateMenu() {
  const [inputs, setInputs] = useState({
    name: "",
    description: "",
    currentPrice: "",
    originalPrice: "",
    category: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/menus/${id}`);
        if (response.data && response.data.data) {
          const menuData = response.data.data;
          setInputs({
            name: menuData.name || "",
            description: menuData.description || "",
            currentPrice: menuData.currentPrice || "",
            originalPrice: menuData.originalPrice || "",
            category: menuData.category || "",
          });
        } else {
          setMessage("Menu item not found.");
        }
      } catch (error) {
        console.error("Error fetching menu:", error);
        setMessage("Error fetching menu details!");
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [id]);

  const validateForm = () => {
    let newErrors = {};

    if (!inputs.name.trim()) {
      newErrors.name = "Meal Name is required!";
    } else if (inputs.name.length > 100) {
      newErrors.name = "Meal Name can't exceed 100 characters!";
    }

    if (!inputs.description.trim()) {
      newErrors.description = "Description is required!";
    } else if (inputs.description.length > 500) {
      newErrors.description = "Description can't exceed 500 characters!";
    }

    if (!inputs.currentPrice || isNaN(inputs.currentPrice) || Number(inputs.currentPrice) <= 0) {
      newErrors.currentPrice = "Enter a valid current price!";
    } else if (!/^\d+(\.\d{1,2})?$/.test(inputs.currentPrice)) {
      newErrors.currentPrice = "Current price should have at most two decimal places!";
    }

    if (inputs.originalPrice && (isNaN(inputs.originalPrice) || Number(inputs.originalPrice) <= 0)) {
      newErrors.originalPrice = "Enter a valid original price!";
    } else if (inputs.originalPrice && !/^\d+(\.\d{1,2})?$/.test(inputs.originalPrice)) {
      newErrors.originalPrice = "Original price should have at most two decimal places!";
    }

    if (!inputs.category.trim()) {
      newErrors.category = "Category is required!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.put(`http://localhost:5001/api/menus/${id}`, {
        name: inputs.name,
        description: inputs.description,
        currentPrice: parseFloat(inputs.currentPrice),
        originalPrice: inputs.originalPrice ? parseFloat(inputs.originalPrice) : "",
        category: inputs.category,
      });

      console.log("API Response:", response);

      setInputs({
        name: response.data.name,
        description: response.data.description,
        currentPrice: response.data.currentPrice,
        originalPrice: response.data.originalPrice,
        category: response.data.category,
      });

      setMessage("Menu updated successfully!");
      setTimeout(() => navigate("/menudetails"), 1500);
    } catch (error) {
      console.error("Error updating menu:", error);
      if (error.response) {
        setMessage("Failed to update menu: " + error.response.data.message);
      } else {
        setMessage("Error updating menu.");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({ ...prevInputs, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  return (
    <div className="update-menu-container">
      <h1>Update Menu Item</h1>
      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <form onSubmit={handleSubmit} className="update-menu-form">
          <div className="form-group">
            <label htmlFor="name">Meal Name:</label>
            <input
              id="name"
              type="text"
              name="name"
              value={inputs.name}
              onChange={handleChange}
              placeholder="Enter meal name"
            />
            {errors.name && <p className="error-message">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={inputs.description}
              onChange={handleChange}
              placeholder="Enter meal description"
            />
            {errors.description && <p className="error-message">{errors.description}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="currentPrice">Current Price:</label>
            <input
              id="currentPrice"
              type="number"
              name="currentPrice"
              value={inputs.currentPrice}
              onChange={handleChange}
              placeholder="Enter current price"
              step="0.01"
            />
            {errors.currentPrice && <p className="error-message">{errors.currentPrice}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="originalPrice">Original Price (Optional):</label>
            <input
              id="originalPrice"
              type="number"
              name="originalPrice"
              value={inputs.originalPrice}
              onChange={handleChange}
              placeholder="Enter original price (if applicable)"
              step="0.01"
            />
            {errors.originalPrice && <p className="error-message">{errors.originalPrice}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="category">Category:</label>
            <input
              id="category"
              type="text"
              name="category"
              value={inputs.category}
              onChange={handleChange}
              placeholder="Enter meal category"
            />
            {errors.category && <p className="error-message">{errors.category}</p>}
          </div>

          <button type="submit" className="submit-button">
            Update Menu Item
          </button>
        </form>
      )}
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default UpdateMenu;