import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { food_list } from "../assets/assets";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [cartTotal, setCartTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const url = "http://localhost:4000";
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);

  // Convert array-based cart from API to object format for UI
  const convertCartItems = (items) => {
    const itemMap = {};
    
    items.forEach(item => {
      itemMap[item.foodId] = item.quantity;
    });
    
    return itemMap;
  };

  // Update cart state from API response
  const updateCartState = (data) => {
    if (data.cartItems && Array.isArray(data.cartItems)) {
      setCartItems(convertCartItems(data.cartItems));
      setCartTotal(data.cartTotal || 0);
      setItemCount(data.itemCount || 0);
    }
  };

  // Calculate cart total (for local cart)
  const calculateLocalTotal = () => {
    let total = 0;
    let count = 0;
    
    for (const itemId in cartItems) {
      if (cartItems[itemId] > 0) {
        const item = food_list.find((product) => product._id === itemId);
        if (item) {
          total += item.price * cartItems[itemId];
          count += cartItems[itemId];
        }
      }
    }
    
    setCartTotal(total);
    setItemCount(count);
    return total;
  };

  // Add item to cart
  const addToCart = async (itemId, quantity = 1) => {
    if (!token) {
      // Handle locally if not logged in
      const newQuantity = (cartItems[itemId] || 0) + quantity;
      setCartItems((prev) => ({ ...prev, [itemId]: newQuantity }));
      calculateLocalTotal();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(
        `${url}/api/cart/add`,
        { itemId, quantity },
        { headers: { token } }
      );
      
      if (response.data.success) {
        updateCartState(response.data);
      } else {
        setError(response.data.message || "Failed to add item to cart");
      }
    } catch (error) {
      setError("Network error while adding to cart");
      console.error("Error adding to cart:", error);
    } finally {
      setLoading(false);
    }
  };

  // Remove from cart
  const removeFromCart = async (itemId, quantity = 1, removeAll = false) => {
    if (!token) {
      // Handle locally if not logged in
      if (removeAll || cartItems[itemId] <= quantity) {
        const newCart = { ...cartItems };
        delete newCart[itemId];
        setCartItems(newCart);
      } else {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - quantity }));
      }
      calculateLocalTotal();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(
        `${url}/api/cart/remove`,
        { itemId, quantity, removeAll },
        { headers: { token } }
      );
      
      if (response.data.success) {
        updateCartState(response.data);
      } else {
        setError(response.data.message || "Failed to remove item from cart");
      }
    } catch (error) {
      setError("Network error while removing from cart");
      console.error("Error removing from cart:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update cart item quantity
  const updateCartItem = async (itemId, quantity) => {
    if (!token) {
      // Handle locally if not logged in
      if (quantity > 0) {
        setCartItems((prev) => ({ ...prev, [itemId]: quantity }));
        calculateLocalTotal();
      }
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(
        `${url}/api/cart/update`,
        { itemId, quantity },
        { headers: { token } }
      );
      
      if (response.data.success) {
        updateCartState(response.data);
      } else {
        setError(response.data.message || "Failed to update cart");
      }
    } catch (error) {
      setError("Network error while updating cart");
      console.error("Error updating cart:", error);
    } finally {
      setLoading(false);
    }
  };

  // Clear the entire cart
  const clearCart = async () => {
    if (!token) {
      // Handle locally if not logged in
      setCartItems({});
      setCartTotal(0);
      setItemCount(0);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(
        `${url}/api/cart/clear`,
        {},
        { headers: { token } }
      );
      
      if (response.data.success) {
        setCartItems({});
        setCartTotal(0);
        setItemCount(0);
      } else {
        setError(response.data.message || "Failed to clear cart");
      }
    } catch (error) {
      setError("Network error while clearing cart");
      console.error("Error clearing cart:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get total cart amount
  const getTotalCartAmount = () => {
    return cartTotal;
  };

  // Get item count
  const getItemCount = () => {
    return itemCount;
  };

  // Fetch food list
  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setFoodList(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching food list:", error);
    }
  };

  // Load cart data
  const loadCartData = async (token) => {
    try {
      const response = await axios.get(
        `${url}/api/cart/get`,
        { headers: { token } }
      );
      
      if (response.data.success) {
        updateCartState(response.data);
      }
    } catch (error) {
      console.error("Error loading cart data:", error);
    }
  };

  // Create a payment intent with Stripe
  const createPaymentIntent = async () => {
    if (!token) {
      setError("You must be logged in to checkout");
      return null;
    }
    
    try {
      setLoading(true);
      const response = await axios.post(
        `${url}/api/payment/create-payment-intent`,
        {},
        { headers: { token } }
      );
      
      if (response.data.success) {
        return response.data;
      } else {
        setError(response.data.message || "Failed to create payment");
        return null;
      }
    } catch (error) {
      setError("Error creating payment");
      console.error("Payment error:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Process a completed payment
  const processPayment = async (paymentIntentId) => {
    if (!token) {
      return false;
    }
    
    try {
      setLoading(true);
      const response = await axios.post(
        `${url}/api/payment/process-payment`,
        { paymentIntentId },
        { headers: { token } }
      );
      
      if (response.data.success) {
        // Clear the cart after successful payment
        setCartItems({});
        setCartTotal(0);
        setItemCount(0);
        return true;
      } else {
        setError(response.data.message || "Payment processing failed");
        return false;
      }
    } catch (error) {
      setError("Error processing payment");
      console.error("Payment processing error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Get Stripe public key
  const getStripePublicKey = async () => {
    try {
      const response = await axios.get(`${url}/api/payment/public-key`);
      if (response.data.success) {
        return response.data.publicKey;
      }
      return null;
    } catch (error) {
      console.error("Error getting Stripe key:", error);
      return null;
    }
  };
  
  // Initialize on component mount
  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
        await loadCartData(savedToken);
      }
    }
    
    loadData();
  }, []);

  const contextValue = {
    food_list,
    cartItems,
    cartTotal,
    itemCount,
    loading,
    error,
    setCartItems,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    getTotalCartAmount,
    getItemCount,
    url,
    token,
    setToken,
    createPaymentIntent,
    processPayment,
    getStripePublicKey
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;