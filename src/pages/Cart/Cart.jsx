import React, { useContext, useState } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from 'react-router-dom';
import { assets } from "../../assets/assets";

const Cart = () => {
  const { 
    cartItems, 
    food_list, 
    removeFromCart, 
    updateCartItem,
    clearCart,
    getTotalCartAmount, 
    token,
    url,
    loading 
  } = useContext(StoreContext);

  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState("");
  const [promoError, setPromoError] = useState(false);

  const navigate = useNavigate();

  // Calculate cart totals
  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal > 0 ? 2 : 0;
  const total = subtotal + deliveryFee - discount;

  // Handle quantity change for items
  const handleQuantityChange = (itemId, value) => {
    const quantity = parseInt(value);
    if (quantity > 0) {
      updateCartItem(itemId, quantity);
    } else {
      removeFromCart(itemId, 1, true); // Remove the item completely
    }
  };

  // Handle direct quantity input
  const handleQuantityInput = (e, itemId) => {
    const value = e.target.value;
    if (value === "" || parseInt(value) > 0) {
      // Allow empty input temporarily while typing
      updateCartItem(itemId, value === "" ? 1 : parseInt(value));
    }
  };

  // Handle promo code submission
  const applyPromoCode = () => {
    // This is a simple mock promo code logic
    // In a real app, this would validate against backend
    if (promoCode.toLowerCase() === "welcome10") {
      const discountAmount = subtotal * 0.1; // 10% discount
      setDiscount(discountAmount);
      setPromoMessage("10% discount applied!");
      setPromoError(false);
    } else if (promoCode.toLowerCase() === "freeship") {
      setDiscount(deliveryFee);
      setPromoMessage("Free shipping applied!");
      setPromoError(false);
    } else {
      setDiscount(0);
      setPromoMessage("Invalid promo code");
      setPromoError(true);
    }
  };

  // If cart is empty, show empty state
  if (Object.keys(cartItems).length === 0 || !subtotal) {
    return (
      <div className="cart cart-empty">
        <img src={assets.empty_cart} alt="Empty Cart" className="empty-cart-image" />
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything to your cart yet.</p>
        <button 
          className="continue-shopping-btn" 
          onClick={() => navigate('/')}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="cart">
      <div className="cart-header">
        <h1>Your Cart</h1>
        <button 
          className="clear-cart-btn" 
          onClick={clearCart}
        >
          Clear Cart
        </button>
      </div>

      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <hr />
        
        {food_list.map((item) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={item._id}>
                <div className="cart-items-title cart-items-item">
                  <img src={url+"/images/"+item.image} alt={item.name} />
                  <p className="item-name">{item.name}</p>
                  <p className="item-price">${item.price.toFixed(2)}</p>
                  <div className="quantity-control">
                    <button 
                      className="quantity-btn" 
                      onClick={() => handleQuantityChange(item._id, cartItems[item._id] - 1)}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={cartItems[item._id]}
                      onChange={(e) => handleQuantityInput(e, item._id)}
                      onBlur={(e) => {
                        // Make sure we don't leave an empty input
                        if (e.target.value === "") {
                          handleQuantityChange(item._id, 1);
                        }
                      }}
                      className="quantity-input"
                    />
                    <button 
                      className="quantity-btn" 
                      onClick={() => handleQuantityChange(item._id, cartItems[item._id] + 1)}
                    >
                      +
                    </button>
                  </div>
                  <p className="item-total">
                    ${(item.price * cartItems[item._id]).toFixed(2)}
                  </p>
                  <button 
                    className="remove-btn" 
                    onClick={() => removeFromCart(item._id, 1, true)}
                  >
                    ×
                  </button>
                </div>
                <hr />
              </div>
            );
          }
          return null;
        })}
      </div>

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Sub Total</p>
              <p>${subtotal.toFixed(2)}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${deliveryFee.toFixed(2)}</p>
            </div>
            {discount > 0 && (
              <>
                <hr />
                <div className="cart-total-details discount">
                  <p>Discount</p>
                  <p>-${discount.toFixed(2)}</p>
                </div>
              </>
            )}
            <hr />
            <div className="cart-total-details cart-grand-total">
              <p>Total</p>
              <p>${total.toFixed(2)}</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/order')} 
            disabled={loading}
            className={loading ? "loading" : ""}
          >
            {loading ? "Processing..." : "PROCEED TO CHECKOUT"}
          </button>
        </div>

        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, enter it here</p>
            <div className="cart-promocode-input">
              <input 
                type="text" 
                placeholder="promo code" 
                value={promoCode} 
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <button onClick={applyPromoCode}>Apply</button>
            </div>
            {promoMessage && (
              <p className={`promo-message ${promoError ? 'error' : 'success'}`}>
                {promoMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;