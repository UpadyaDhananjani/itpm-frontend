import React, { useState, useEffect, useContext } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

// Checkout Form Component
const CheckoutForm = ({ clientSecret, paymentIntentId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [billingDetails, setBillingDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "US",
    },
  });

  const { processPayment, token } = useContext(StoreContext);
  const navigate = useNavigate();

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested address fields
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setBillingDetails((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setBillingDetails((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    // Validate form fields
    const requiredFields = [
      "name",
      "email",
      "phone",
      "address.line1",
      "address.city",
      "address.state",
      "address.postal_code",
    ];

    for (const field of requiredFields) {
      if (field.includes(".")) {
        const [parent, child] = field.split(".");
        if (!billingDetails[parent][child]) {
          setError(`${child.replace("_", " ")} is required`);
          return;
        }
      } else if (!billingDetails[field]) {
        setError(`${field} is required`);
        return;
      }
    }

    setProcessing(true);

    // Confirm card payment with Stripe
    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: billingDetails.name,
          email: billingDetails.email,
          phone: billingDetails.phone,
          address: billingDetails.address,
        },
      },
    });

    if (payload.error) {
      setError(`Payment failed: ${payload.error.message}`);
      setProcessing(false);
    } else {
      setError(null);
      setSucceeded(true);

      // Process the payment with our backend
      const success = await processPayment(paymentIntentId);

      if (success) {
        setTimeout(() => {
          navigate("/order-success", {
            state: { orderId: paymentIntentId },
          });
        }, 1000);
      } else {
        setError("Payment was processed but there was an error updating your order. Please contact support.");
        setProcessing(false);
      }
    }
  };

  // Card element styling
  const cardStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: "Outfit, sans-serif",
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Billing Information</h3>
      
      <div className="form-group">
        <label htmlFor="name">Full Name</label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Jane Doe"
          required
          value={billingDetails.name}
          onChange={handleChange}
        />
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="jane.doe@example.com"
            required
            value={billingDetails.email}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="(941) 555-0123"
            required
            value={billingDetails.phone}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <h3>Shipping Address</h3>
      
      <div className="form-group">
        <label htmlFor="address.line1">Street Address</label>
        <input
          id="address.line1"
          name="address.line1"
          type="text"
          placeholder="123 Main St"
          required
          value={billingDetails.address.line1}
          onChange={handleChange}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="address.line2">Apt, Suite, etc. (optional)</label>
        <input
          id="address.line2"
          name="address.line2"
          type="text"
          placeholder="Apartment 4B"
          value={billingDetails.address.line2}
          onChange={handleChange}
        />
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="address.city">City</label>
          <input
            id="address.city"
            name="address.city"
            type="text"
            placeholder="New York"
            required
            value={billingDetails.address.city}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="address.state">State</label>
          <input
            id="address.state"
            name="address.state"
            type="text"
            placeholder="NY"
            required
            value={billingDetails.address.state}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="address.postal_code">Zip Code</label>
          <input
            id="address.postal_code"
            name="address.postal_code"
            type="text"
            placeholder="10001"
            required
            value={billingDetails.address.postal_code}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <h3>Payment Details</h3>
      
      <div className="form-group card-element">
        <label htmlFor="card-element">Credit or Debit Card</label>
        <CardElement id="card-element" options={cardStyle} />
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <button 
        className={`payment-button ${processing || !stripe ? 'disabled' : ''}`} 
        type="submit" 
        disabled={processing || !stripe}
      >
        {processing ? "Processing..." : "Pay Now"}
      </button>
      
      {succeeded && (
        <div className="success-message">
          Payment successful! Redirecting you to your order confirmation...
        </div>
      )}
    </form>
  );
};

// Main Checkout Component
const Checkout = () => {
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getStripePublicKey, createPaymentIntent, getTotalCartAmount, token, setToken } = useContext(StoreContext);
  const navigate = useNavigate();

  // Check if token exists in localStorage on component mount
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken && !token) {
      setToken(savedToken);
    }
  }, [token, setToken]);

  // Initialize Stripe
  useEffect(() => {
    const initializeStripe = async () => {
      try {
        console.log("Getting Stripe public key...");
        const publicKey = await getStripePublicKey();
        console.log("Stripe public key:", publicKey);
        
        if (publicKey) {
          const stripeInstance = await loadStripe(publicKey);
          setStripePromise(stripeInstance);
        } else {
          console.error("No Stripe public key received");
          setError("Could not initialize payment system");
        }
      } catch (err) {
        console.error("Error initializing Stripe:", err);
        setError("Failed to initialize payment system");
      }
    };

    initializeStripe();
  }, [getStripePublicKey]);

  // Create payment intent
  useEffect(() => {
    const getPaymentIntent = async () => {
      setLoading(true);
      console.log("Token status:", !!token);
      
      // Only create payment intent if user is logged in
      if (token) {
        try {
          console.log("Creating payment intent...");
          const paymentData = await createPaymentIntent();
          console.log("Payment data:", paymentData);
          
          if (paymentData) {
            setClientSecret(paymentData.clientSecret);
            setPaymentIntentId(paymentData.paymentIntentId);
            setLoading(false);
          } else {
            console.error("No payment data received");
            setError("Could not create payment. Please try again.");
            setLoading(false);
            
            // Don't redirect immediately, show error instead
            // setTimeout(() => navigate('/cart'), 3000);
          }
        } catch (err) {
          console.error("Error creating payment intent:", err);
          setError("Error creating payment. Please try again.");
          setLoading(false);
          
          // Don't redirect immediately, show error instead
          // setTimeout(() => navigate('/cart'), 3000);
        }
      } else {
        // Check if we have items in cart before showing login message
        const cartTotal = getTotalCartAmount();
        
        if (cartTotal <= 0) {
          console.log("Empty cart, redirecting to cart page");
          navigate('/cart');
        } else {
          console.log("No token but cart has items");
          setError("Please log in to complete your purchase");
          setLoading(false);
          
          // Don't redirect immediately, show login button instead
        }
      }
    };

    // Only try to create payment intent if Stripe is initialized
    if (stripePromise) {
      getPaymentIntent();
    }
  }, [createPaymentIntent, navigate, token, stripePromise, getTotalCartAmount]);

  const totalAmount = getTotalCartAmount();
  
  // Handle login button click
  const handleLoginClick = () => {
    // You can either navigate to login page or trigger login popup
    // This depends on your app's login flow
    navigate('/login', { state: { returnTo: '/checkout' } });
    // Or trigger login popup if you have one
    // setShowLoginPopup(true);
  };

  // Show error state
  if (error) {
    return (
      <div className="checkout error-state">
        <div className="checkout-container">
          <div className="checkout-header">
            <h1>Checkout</h1>
            <p>Total: ${totalAmount.toFixed(2)}</p>
          </div>
          
          <div className="checkout-body">
            <div className="error-message-container">
              <h3>We encountered an issue</h3>
              <p>{error}</p>
              
              {!token && (
                <button className="login-button" onClick={handleLoginClick}>
                  Login to Continue
                </button>
              )}
              
              <button className="back-to-cart" onClick={() => navigate('/cart')}>
                Return to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state until Stripe is initialized
  if (loading || !stripePromise || !clientSecret) {
    return (
      <div className="checkout loading">
        <div className="loading-spinner"></div>
        <p>Preparing checkout...</p>
      </div>
    );
  }

  return (
    <div className="checkout">
      <div className="checkout-container">
        <div className="checkout-header">
          <h1>Complete Your Order</h1>
          <p>Total: ${totalAmount.toFixed(2)}</p>
        </div>
        
        <div className="checkout-body">
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm 
              clientSecret={clientSecret} 
              paymentIntentId={paymentIntentId} 
            />
          </Elements>
        </div>
      </div>
    </div>
  );
};

export default Checkout;