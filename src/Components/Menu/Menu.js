import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Menu.css';

const AddMenuForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    currentPrice: '',
    originalPrice: '',
    image: null,
    category: '',
  });

  const categories = ['Salad', 'Burger', 'Pizza', 'Pasta', 'Drinks', 'Sweet', 'Healthy Food'];

  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const imageInputRef = useRef(null);

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    } else if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters long';
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
      isValid = false;
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters long';
      isValid = false;
    }

    if (!formData.currentPrice) {
      newErrors.currentPrice = 'Current price is required';
      isValid = false;
    } else if (isNaN(formData.currentPrice) || parseFloat(formData.currentPrice) <= 0) {
      newErrors.currentPrice = 'Current price must be a number greater than 0';
      isValid = false;
    }

    if (formData.originalPrice) {
      if (isNaN(formData.originalPrice) || parseFloat(formData.originalPrice) <= 0) {
        newErrors.originalPrice = 'Original price must be a number greater than 0';
        isValid = false;
      } else if (parseFloat(formData.originalPrice) <= parseFloat(formData.currentPrice)) {
        newErrors.originalPrice = 'Original price must be greater than current price';
        isValid = false;
      }
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
      isValid = false;
    }

    if (!formData.image) {
      newErrors.image = 'Image is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      if (errors.image) setErrors((prev) => ({ ...prev, image: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setError(null);
    setIsSubmitting(true);
    setSuccessMessage('');

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('currentPrice', formData.currentPrice);
    formDataToSend.append('originalPrice', formData.originalPrice);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('image', formData.image);

    try {
      // Use axios for API request
      const response = await axios.post('http://localhost:5001/api/menus', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
        timeout: 10000,
      });

      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Invalid server response');
      }

      setSuccessMessage(response.data.message || '🎉 Menu item added successfully!');
      setFormData({
        name: '',
        description: '',
        currentPrice: '',
        originalPrice: '',
        image: null,
        category: '',
      });

      if (imageInputRef.current) imageInputRef.current.value = '';

      setTimeout(() => {
        navigate('/menudetails');
      }, 2000);
    } catch (error) {
      let errorMessage = 'An error occurred while adding the menu.';
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Server is not responding.';
      } else if (error.response) {
        errorMessage = error.response.data?.message || `Server error (${error.response.status})`;
      } else if (error.request) {
        errorMessage = `No response from server. Possible issues:
1. Backend server is not running
2. Incorrect API endpoint
3. Network issues
4. CORS policy blocking the request`;
      } else {
        errorMessage = `Request error: ${error.message}`;
      }

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="menu-form-container">
      <h2 className="menu-form-title">Add New Menu</h2>

      {successMessage && <div className="success-message">✅ {successMessage}</div>}
      {error && (
        <div className="error-message">
          ❌ {error.split('\n').map((line, i) => <div key={i}>{line}</div>)}
        </div>
      )}

      <form onSubmit={handleSubmit} className="menu-form">
        <fieldset disabled={isSubmitting}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className={`form-input ${errors.name ? 'input-error' : ''}`}
              placeholder="Enter menu item name"
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`form-input ${errors.description ? 'input-error' : ''}`}
              placeholder="Enter menu item description"
            />
            {errors.description && <span className="error-text">{errors.description}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="currentPrice">Current Price ($)</label>
            <input
              id="currentPrice"
              name="currentPrice"
              type="number"
              value={formData.currentPrice}
              onChange={handleChange}
              className={`form-input ${errors.currentPrice ? 'input-error' : ''}`}
              placeholder="Enter current price"
              min="0.01"
              step="0.01"
            />
            {errors.currentPrice && <span className="error-text">{errors.currentPrice}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="originalPrice">Original Price ($) <span className="optional-text">(optional)</span></label>
            <input
              id="originalPrice"
              name="originalPrice"
              type="number"
              value={formData.originalPrice}
              onChange={handleChange}
              className={`form-input ${errors.originalPrice ? 'input-error' : ''}`}
              placeholder="Enter original price"
              min="0.01"
              step="0.01"
            />
            {errors.originalPrice && <span className="error-text">{errors.originalPrice}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`form-input ${errors.category ? 'input-error' : ''}`}
            >
              <option value="">Select a category</option>
              {categories.map((cat, i) => (
                <option key={i} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <span className="error-text">{errors.category}</span>}
          </div>

         <div className="form-group">
  <label htmlFor="image">Image</label>
  <input
    ref={imageInputRef}
    id="image"
    name="image"
    type="file"
    accept="image/*"
    onChange={handleImageChange}
    className={`form-input ${errors.image ? 'input-error' : ''}`}
  />
  {formData.image && (
    <img
      src={URL.createObjectURL(formData.image)} // This should generate the preview URL
      alt="Preview"
      style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', marginTop: '8px' }}
    />
  )}
  {errors.image && <span className="error-text">{errors.image}</span>}
</div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Adding...
              </>
            ) : (
              'Add Menu'
            )}
          </button>
        </fieldset>
      </form>
    </div>
  );
};

export default AddMenuForm;
