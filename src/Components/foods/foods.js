import React, { useState, useEffect } from "react";
import "./foods.css";

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Item");
  const [showModal, setShowModal] = useState(false);
  const [foodItems, setFoodItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);
  const [promoImages, setPromoImages] = useState([]);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [promoInputUrl, setPromoInputUrl] = useState("");
  const [newItem, setNewItem] = useState({
    id: Date.now(),
    name: "",
    description: "",
    category: "",
    currentPrice: "",
    originalPrice: "",
    image: "",
  });
  const [imagePreview, setImagePreview] = useState("");

  const categories = [
    { name: "All Item", icon: "🍽️" },
    { name: "Salad", icon: "🥗" },
    { name: "Burger", icon: "🍔" },
    { name: "Pizza", icon: "🍕" },
    { name: "Pasta", icon: "🍝" },
    { name: "Drinks", icon: "🥤" },
    { name: "Sweets", icon: "🍬" },
    { name: "Healthy Food", icon: "🥑" },
  ];

  const sampleFoodItems = [
    {
      id: 1,
      name: "Caesar Salad",
      description: "Fresh romaine lettuce with Caesar dressing",
      category: "Salad",
      currentPrice: "8.99",
      originalPrice: "10.99",
      image: "https://images.unsplash.com/photo-1546793665-c74683f339c1",
    },
    {
      id: 2,
      name: "Cheeseburger",
      description: "Classic beef burger with cheese",
      category: "Burger",
      currentPrice: "7.99",
      originalPrice: "9.99",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
    },
    {
      id: 3,
      name: "Pepperoni Pizza",
      description: "Classic pizza with pepperoni toppings",
      category: "Pizza",
      currentPrice: "12.99",
      originalPrice: "14.99",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
    },
  ];

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/menus");
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        const data = await response.json();
        setFoodItems(data.data);
      } catch (err) {
        const storedFoodItems = JSON.parse(localStorage.getItem("foodItems"));
        if (storedFoodItems?.length) {
          setFoodItems(storedFoodItems);
        } else {
          setFoodItems(sampleFoodItems);
          localStorage.setItem("foodItems", JSON.stringify(sampleFoodItems));
        }
      }

      const storedCartItems = JSON.parse(localStorage.getItem("cartItems"));
      if (storedCartItems) setCartItems(storedCartItems);

      const storedPromos = JSON.parse(localStorage.getItem("promoImages"));
      if (storedPromos) {
        setPromoImages(storedPromos);
      } else {
        const defaultPromos = [
          { id: 1, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c" },
          { id: 2, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836" },
          { id: 3, image: "https://images.unsplash.com/photo-1555992336-03a23c2d84f4" }
        ];
        setPromoImages(defaultPromos);
        localStorage.setItem("promoImages", JSON.stringify(defaultPromos));
      }
    };

    fetchMeals();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromoIndex((prev) => (prev + 1) % promoImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [promoImages.length]);

  useEffect(() => {
    localStorage.setItem("promoImages", JSON.stringify(promoImages));
  }, [promoImages]);

  const handleCategoryClick = (categoryName) => setSelectedCategory(categoryName);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setNewItem((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newFoodItem = {
      ...newItem,
      id: Date.now(),
      image: newItem.image || "https://via.placeholder.com/150",
    };
    const updatedItems = [...foodItems, newFoodItem];
    setFoodItems(updatedItems);
    localStorage.setItem("foodItems", JSON.stringify(updatedItems));
    toggleModal();
  };

  const handleAddToCart = (item) => {
    const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);
    const updatedCartItems = existingItem
      ? cartItems.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: (cartItem.quantity || 1) + 1 } : cartItem
        )
      : [...cartItems, { ...item, quantity: 1 }];
    setCartItems(updatedCartItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
  };

  const handleDeleteItem = (itemId) => {
    const updatedItems = foodItems.filter((item) => item.id !== itemId);
    setFoodItems(updatedItems);
    localStorage.setItem("foodItems", JSON.stringify(updatedItems));
    const updatedCart = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };

  const toggleModal = () => {
    setShowModal(!showModal);
    if (!showModal) {
      setNewItem({
        id: Date.now(),
        name: "",
        description: "",
        category: "",
        currentPrice: "",
        originalPrice: "",
        image: "",
      });
      setImagePreview("");
    }
  };

  const togglePromoModal = () => {
    setShowPromoModal(!showPromoModal);
    setPromoInputUrl("");
  };

  const addPromoImage = () => {
    if (promoInputUrl.trim() === "") return;
    const newPromo = { id: Date.now(), image: promoInputUrl };
    const updatedPromos = [...promoImages, newPromo];
    setPromoImages(updatedPromos);
    togglePromoModal();
  };

  const filteredItems =
    selectedCategory === "All Item"
      ? foodItems.filter((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : foodItems.filter(
          (item) =>
            item.category === selectedCategory &&
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">
          <span className="logo-icon">G</span>
          <span className="logo-text">Goldilox</span>
        </div>
        <div className="sidebar-menu">
          <div className="menu-item active">🏠 Home</div>
          <div className="menu-item">📋 Menu</div>
          <div className="menu-item">⚙ More</div>
          <button className="add-menu-button" onClick={toggleModal}>+ Add Menu</button>
          <button className="add-menu-button" onClick={togglePromoModal}>+ Add Promo</button>
        </div>
        <div className="logout">🚪 Log Out</div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search your favorite food"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="search-button">🔍</button>
        </div>

        {/* Promo Slider */}
        <div className="promo-slider">
          {promoImages.map((promo, index) => (
            <div
              key={promo.id}
              className={`promo-slide ${index === currentPromoIndex ? "active" : ""}`}
            >
              <img src={promo.image} alt={`Promo ${index + 1}`} />
              <div className="promo-overlay">
                <h3>Special Offer</h3>
              </div>
            </div>
          ))}
          <div className="promo-dots">
            {promoImages.map((_, index) => (
              <button
                key={index}
                className={`promo-dot ${index === currentPromoIndex ? "active" : ""}`}
                onClick={() => setCurrentPromoIndex(index)}
              />
            ))}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="category-tabs">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className={`category-tab ${selectedCategory === cat.name ? "active" : ""}`}
              onClick={() => handleCategoryClick(cat.name)}
            >
              <div className="category-icon">{cat.icon}</div>
              <div className="category-name">{cat.name}</div>
            </div>
          ))}
        </div>

        {/* Food Grid */}
        <div className="food-grid">
          {filteredItems.map((item) => (
            <div className="food-card" key={item.id}>
              <div className="food-image">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="food-details">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <div className="price-section">
                  <div className="current-price">${item.currentPrice}</div>
                  <div className="original-price">${item.originalPrice}</div>
                </div>
                <div className="button-group">
                  <button
                    className="add-to-cart-button"
                    onClick={() => handleAddToCart(item)}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Menu */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add New Menu</h3>
              <button className="close-button" onClick={toggleModal}>
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="menu-form">
              <div className="form-group">
                <label>Name</label>
                <input name="name" value={newItem.name} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea name="description" value={newItem.description} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={newItem.category} onChange={handleInputChange}>
                  {categories.slice(1).map((cat) => (
                    <option key={cat.name} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Current Price</label>
                <input type="number" name="currentPrice" value={newItem.currentPrice} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Original Price</label>
                <input type="number" name="originalPrice" value={newItem.originalPrice} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Image</label>
                <input type="file" onChange={handleImageChange} />
                {imagePreview && <div className="image-preview"><img src={imagePreview} alt="preview" /></div>}
              </div>
              <div className="form-actions">
                <button type="submit">Save</button>
                <button type="button" onClick={toggleModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Promo Modal */}
      {showPromoModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add Promo Image</h3>
              <button className="close-button" onClick={togglePromoModal}>&times;</button>
            </div>
            <div className="form-group">
              <label>Image URL</label>
              <input type="text" value={promoInputUrl} onChange={(e) => setPromoInputUrl(e.target.value)} />
            </div>
            <div className="form-actions">
              <button onClick={addPromoImage}>Add</button>
              <button onClick={togglePromoModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
