import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './OrderSuccess.css';
import { assets } from '../../assets/assets';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get orderId from location state (passed during navigation)
  const orderId = location.state?.orderId || 'Unknown';
  
  return (
    <div className="order-success">
      <div className="success-container">
        <div className="success-icon">
          <img src={assets.success_icon} alt="Success" />
        </div>
        
        <h1>Order Placed Successfully!</h1>
        
        <div className="order-details">
          <p>Thank you for your order. We've received your payment and are processing your order now.</p>
          <div className="order-id">
            <span>Order ID:</span> {orderId}
          </div>
        </div>
        
        <p className="email-notification">
          You will receive an email confirmation shortly with your order details.
        </p>
        
        <div className="action-buttons">
          <button 
            className="home-button"
            onClick={() => navigate('/')}
          >
            Return to Home
          </button>
          
          <button 
            className="orders-button"
            onClick={() => navigate('/orders')}
          >
            View My Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;