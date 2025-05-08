import React, { useEffect, useState, useRef } from "react";
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

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const imageInputRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();

  const categories = ["Salad", "Burger", "Pizza", "Pasta", "Drinks", "Sweet", "Healthy Food"];

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

          const imageUrl = menuData.image?.startsWith("http")
            ? menuData.image
            : `http://localhost:5001/${menuData.image}`;
          setCurrentImageUrl(imageUrl);
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
      newErrors.name = "Name is required!";
    } else if (inputs.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters!";
    }

    if (!inputs.description.trim()) {
      newErrors.description = "Description is required!";
    } else if (inputs.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters!";
    }

    if (!inputs.currentPrice || isNaN(inputs.currentPrice) || Number(inputs.currentPrice) <= 0) {
      newErrors.currentPrice = "Enter a valid current price!";
    }

    if (inputs.originalPrice) {
      if (isNaN(inputs.originalPrice) || Number(inputs.originalPrice) <= 0) {
        newErrors.originalPrice = "Original price must be greater than 0!";
      } else if (parseFloat(inputs.originalPrice) <= parseFloat(inputs.currentPrice)) {
        newErrors.originalPrice = "Original price must be greater than current price!";
      }
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

    setSubmitting(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("name", inputs.name);
      formData.append("description", inputs.description);
      formData.append("currentPrice", inputs.currentPrice);
      formData.append("originalPrice", inputs.originalPrice || "");
      formData.append("category", inputs.category);
      if (image) formData.append("image", image);

      const response = await axios.put(`http://localhost:5001/api/menus/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
        timeout: 10000,
      });

      setMessage("✅ Menu updated successfully!");
      setTimeout(() => navigate("/menudetails"), 1500);
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error("Error response:", error.response);
        setMessage(`❌ Failed to update menu. ${error.response.data.message || error.response.statusText}`);
      } else if (error.request) {
        // No response received
        console.error("Error request:", error.request);
        setMessage("❌ No response from server. Please try again.");
      } else {
        // Something happened in setting up the request
        console.error("Error message:", error.message);
        setMessage("❌ Failed to update menu due to an error.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  return (
    <div className="update-menu-container">
      <h2>Update Menu Item</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="form-group">
            <label>Name:</label>
            <input name="name" value={inputs.name} onChange={handleInputChange} />
            {errors.name && <small className="error">{errors.name}</small>}
          </div>

          <div className="form-group">
            <label>Description:</label>
            <textarea name="description" value={inputs.description} onChange={handleInputChange} />
            {errors.description && <small className="error">{errors.description}</small>}
          </div>

          <div className="form-group">
            <label>Current Price:</label>
            <input name="currentPrice" value={inputs.currentPrice} onChange={handleInputChange} />
            {errors.currentPrice && <small className="error">{errors.currentPrice}</small>}
          </div>

          <div className="form-group">
            <label>Original Price (optional):</label>
            <input name="originalPrice" value={inputs.originalPrice} onChange={handleInputChange} />
            {errors.originalPrice && <small className="error">{errors.originalPrice}</small>}
          </div>

          <div className="form-group">
            <label>Category:</label>
            <select name="category" value={inputs.category} onChange={handleInputChange}>
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && <small className="error">{errors.category}</small>}
          </div>

          <div className="form-group">
            <label>Current Image:</label><br />
            {currentImageUrl ? (
              <img src={currentImageUrl} alt="Current" width="120" height="100" />
            ) : (
              <p>No image available</p>
            )}
          </div>

          <div className="form-group">
            <label>Upload New Image (optional):</label>
            <input type="file" accept="image/*" onChange={handleImageChange} ref={imageInputRef} />
            {imagePreview && <img src={imagePreview} alt="Preview" width="120" height="100" />}
          </div>

          <button type="submit" disabled={submitting}>
            {submitting ? "Updating..." : "Update Menu"}
          </button>

          {message && <p className="form-message">{message}</p>}
        </form>
      )}
    </div>
  );
}

export default UpdateMenu;
