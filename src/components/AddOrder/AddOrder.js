import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { OrderContext } from "./OrderContext"; // Importing OrderContext
import backgroundImage from "../Img/order8.jpg";

const AddOrder = () => {
  const [orderData, setOrderData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    orderId: "",
    specialInstructions: "",
    pickupTime: "",
    orderStatus: "",
  });

  const [errors, setErrors] = useState({});
  const { setOrdersChanged } = useContext(OrderContext); // Accessing setOrdersChanged from context
  const navigate = useNavigate();

  const validateForm = () => {
    let newErrors = {};

    // Validation for required fields with name format check
    if (!orderData.firstName.trim()) {
      newErrors.firstName = "First Name is required.";
    } else if (!/^[A-Za-z]+$/.test(orderData.firstName)) {
      newErrors.firstName = "First Name should only contain letters.";
    }

    if (!orderData.lastName.trim()) {
      newErrors.lastName = "Last Name is required.";
    } else if (!/^[A-Za-z]+$/.test(orderData.lastName)) {
      newErrors.lastName = "Last Name should only contain letters.";
    }

    // Email validation (check if the email is valid format)
    if (!orderData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(orderData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!orderData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone Number is required.";
    } else if (!/^\d{10}$/.test(orderData.phoneNumber)) {
      newErrors.phoneNumber = "Phone Number must be exactly 10 digits and contain no letters or special characters.";
    }
    if (!orderData.address.trim()) newErrors.address = "Address is required.";
    if (!orderData.city.trim()) newErrors.city = "City is required.";
    if (!orderData.orderId.trim()) newErrors.orderId = "Order ID is required.";

    // Pickup time validation
    if (!orderData.pickupTime.trim()) {
      newErrors.pickupTime = "Pickup Time is required.";
    } else {
      const currentTime = new Date();
      const selectedTime = new Date(orderData.pickupTime);
      if (selectedTime <= currentTime) {
        newErrors.pickupTime = "Pickup Time must be in the future.";
      }
    }

    if (!orderData.orderStatus.trim()) newErrors.orderStatus = "Order Status is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newErrors = { ...errors };
    
    // Update the state for all fields
    setOrderData({ ...orderData, [name]: value });
    
    // Validate first name and last name to only allow letters
    if (name === "firstName" || name === "lastName") {
      if (value.trim() !== "" && !/^[A-Za-z]+$/.test(value)) {
        if (/\d/.test(value)) {
          newErrors[name] = `${name === "firstName" ? "First Name" : "Last Name"} cannot contain numbers.`;
        } else if (/[^A-Za-z]/.test(value)) {
          newErrors[name] = `${name === "firstName" ? "First Name" : "Last Name"} cannot contain special characters.`;
        }
      } else {
        // Clear error if valid
        delete newErrors[name];
      }
    }
    
    // Validate email format
    if (name === "email") {
      if (value.trim() !== "") {
        if (!/@/.test(value)) {
          newErrors.email = "Email must contain @ symbol.";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          newErrors.email = "Email format is invalid. Please use format: example@domain.com";
        } else {
          delete newErrors.email;
        }
      } else {
        delete newErrors.email;
      }
    }
    
    // Validate phone number
    if (name === "phoneNumber") {
      if (value.trim() !== "") {
        if (!/^\d*$/.test(value)) {
          newErrors.phoneNumber = "Phone Number must only contain digits.";
        } else if (value.length !== 10 && value.length > 0) {
          newErrors.phoneNumber = `Phone Number must be 10 digits. Currently: ${value.length} digits.`;
        } else {
          delete newErrors.phoneNumber;
        }
      } else {
        delete newErrors.phoneNumber;
      }
    }
    
    // Validate pickup time
    if (name === "pickupTime" && value.trim() !== "") {
      const currentTime = new Date();
      const selectedTime = new Date(value);
      if (selectedTime <= currentTime) {
        newErrors.pickupTime = "Pickup Time must be in the future.";
      } else {
        delete newErrors.pickupTime;
      }
    }
    
    setErrors(newErrors);
  };

  const sendData = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    axios
      .post("http://localhost:5000/orders/", orderData)
      .then(() => {
        alert("Order Added");
        setOrderData({
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          address: "",
          city: "",
          orderId: "",
          specialInstructions: "",
          pickupTime: "",
          orderStatus: "",
        });

        // Trigger change in context to update AllOrders
        setOrdersChanged((prev) => !prev);

        navigate("/all-orders");
      })
      .catch((err) => {
        alert(err);
      });
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "130vh",
        backgroundColor: "#f0f0f0",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundBlendMode: "multiply",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: "700px",
          boxSizing: "border-box",
        }}
      >
        <h1 style={{ color: "#8B0000", fontWeight: "bold", textAlign: "center", marginBottom: "20px" }}>
          Add Order
        </h1>
        <form onSubmit={sendData} style={{ width: "100%" }}>
          {[ 
            { name: "firstName", type: "text", label: "First Name" },
            { name: "lastName", type: "text", label: "Last Name" },
            { name: "email", type: "email", label: "Email" },
            { name: "phoneNumber", type: "text", label: "Phone Number" },
            { name: "address", type: "text", label: "Address" },
            { name: "city", type: "text", label: "City" },
            { name: "orderId", type: "text", label: "Order ID" },
            { name: "specialInstructions", type: "text", label: "Special Instructions" },
            { name: "pickupTime", type: "datetime-local", label: "Pickup Time" },
            { name: "orderStatus", type: "text", label: "Order Status" },
          ].map((field) => (
            <div key={field.name} style={{ marginBottom: "15px" }}>
              <label htmlFor={field.name} style={{ display: "block", fontWeight: "bold" }}>
                {field.label}
              </label>
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  boxSizing: "border-box",
                }}
                placeholder={`Enter ${field.label}`}
                value={orderData[field.name]}
                onChange={handleChange}
              />
              {errors[field.name] && <p style={{ color: "red", fontSize: "14px" }}>{errors[field.name]}</p>}
            </div>
          ))}
          <button
            type="submit"
            style={{
              backgroundColor: "#b30000",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
              marginBottom: "10px",
            }}
          >
            Submit
          </button>
        </form>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            onClick={handleBackToHome}
            style={{
              backgroundColor: "#b30000",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
              width: "30%",
              marginTop: "10px",
            }}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddOrder;