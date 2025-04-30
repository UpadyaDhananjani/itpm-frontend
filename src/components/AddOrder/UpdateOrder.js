import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import backgroundImage from "../Img/order6.jpg";

const UpdateOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState({
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

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/orders/${id}`);
        setOrder(res.data.order || {});
      } catch (err) {
        console.error("Error fetching order:", err);
      }
    };
    fetchOrder();
  }, [id]);

  const validateForm = () => {
    let newErrors = {};

    // Validation for required fields with name format check
    if (!order.firstName.trim()) {
      newErrors.firstName = "First Name is required.";
    } else if (!/^[A-Za-z]+$/.test(order.firstName)) {
      newErrors.firstName = "First Name should only contain letters.";
    }

    if (!order.lastName.trim()) {
      newErrors.lastName = "Last Name is required.";
    } else if (!/^[A-Za-z]+$/.test(order.lastName)) {
      newErrors.lastName = "Last Name should only contain letters.";
    }

    // Email validation (check if the email is valid format)
    if (!order.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(order.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!order.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone Number is required.";
    } else if (!/^\d{10}$/.test(order.phoneNumber)) {
      newErrors.phoneNumber = "Phone Number must be exactly 10 digits and contain no letters or special characters.";
    }
    if (!order.address.trim()) newErrors.address = "Address is required.";
    if (!order.city.trim()) newErrors.city = "City is required.";
    if (!order.orderId.trim()) newErrors.orderId = "Order ID is required.";

    // Pickup time validation
    if (!order.pickupTime.trim()) {
      newErrors.pickupTime = "Pickup Time is required.";
    } else {
      const currentTime = new Date();
      const selectedTime = new Date(order.pickupTime);
      if (selectedTime <= currentTime) {
        newErrors.pickupTime = "Pickup Time must be in the future.";
      }
    }

    if (!order.orderStatus.trim()) newErrors.orderStatus = "Order Status is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newErrors = { ...errors };
    
    // Update the state for all fields
    setOrder({ ...order, [name]: value });
    
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await axios.put(`http://localhost:5000/orders/${id}`, order);
      alert("Order updated successfully!");
      navigate("/all-orders");
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update the order. Try again.");
    }
  };

  if (!order || Object.keys(order).length === 0) {
    return <div style={{ textAlign: "center", padding: "20px" }}>Loading order details...</div>;
  }

  // Fixed list of fields in specific order to display in the form
  const fieldList = [
    { name: "firstName", label: "First Name", type: "text" },
    { name: "lastName", label: "Last Name", type: "text" },
    { name: "email", label: "Email", type: "email" },
    { name: "phoneNumber", label: "Phone Number", type: "text" },
    { name: "address", label: "Address", type: "text" },
    { name: "city", label: "City", type: "text" },
    { name: "orderId", label: "Order ID", type: "text" },
    { name: "specialInstructions", label: "Special Instructions", type: "text" },
    { name: "pickupTime", label: "Pickup Time", type: "datetime-local" },
    { name: "orderStatus", label: "Order Status", type: "text" },
  ];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
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
          maxWidth: "600px",
          boxSizing: "border-box",
        }}
      >
        <h2 style={{ textAlign: "center", color: "#8B0000", fontWeight: "bold", marginBottom: "20px" }}>
          Update Order
        </h2>
        <form onSubmit={handleSubmit}>
          {fieldList.map((field) => (
            <div key={field.name} style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", fontWeight: "bold" }}>
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={order[field.name] || ""}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  boxSizing: "border-box",
                }}
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
              width: "100%",
              marginBottom: "10px",
            }}
          >
            Update Order
          </button>
        </form>
        <button
          onClick={() => navigate("/all-orders")}
          style={{
            backgroundColor: "#dc2626",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
            width: "100%",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default UpdateOrder;