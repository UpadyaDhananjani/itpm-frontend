import React, { useState } from "react";
import Nav from "../Nav/Nav";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddUser() {
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({
        name: "",
        age: "",
        email: "",
        phone: "",
        address: "",
        healthIssues: "",
    });

    const [errors, setErrors] = useState({}); // Store validation errors

    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const validateForm = () => {
        let errors = {};

        if (!inputs.name || inputs.name.length < 3) {
            errors.name = "Name must be at least 3 characters long.";
        }
        if (!inputs.age || isNaN(inputs.age) || inputs.age < 1 || inputs.age > 120) {
            errors.age = "Please enter a valid age (1-120).";
        }
        if (!inputs.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputs.email)) {
            errors.email = "Please enter a valid email address.";
        }
        if (!inputs.phone || !/^\d{10}$/.test(inputs.phone)) {
            errors.phone = "Phone number must be 10 digits.";
        }
        if (!inputs.address || inputs.address.length < 5) {
            errors.address = "Address must be at least 5 characters long.";
        }
        if (!inputs.healthIssues) {
            errors.healthIssues = "Please select a health issue.";
        }

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            console.log("Form validation failed:", errors);
            return;
        }

        console.log("Submitting user:", inputs);

        try {
            await sendRequest();
            navigate("/userdetails");
        } catch (error) {
            console.error("Error adding user:", error);
        }
    };

    const sendRequest = async () => {
        try {
            const response = await axios.post("http://localhost:5000/users", {
                name: inputs.name,
                age: Number(inputs.age),
                email: inputs.email,
                phone: inputs.phone,
                address: inputs.address,
                healthIssues: inputs.healthIssues,
            });
            return response.data;
        } catch (error) {
            console.error("API Request Failed:", error);
            throw error;
        }
    };

    return (
        <div style={{ fontFamily: "Times New Roman, serif", padding: "20px" }}>
            <Nav />
            <h1 style={{ textAlign: "center", color: "#333" }}>Add User</h1>
            <form 
                onSubmit={handleSubmit} 
                style={{ 
                    maxWidth: "500px",
                    margin: "auto", 
                    padding: "30px",
                    border: "1px solid #ccc", 
                    borderRadius: "10px",
                    backgroundColor: "#f9f9f9",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)"
                }}
            >
                {[  
                    { label: "Name", type: "text", name: "name" },
                    { label: "Age", type: "number", name: "age" },
                    { label: "Email", type: "email", name: "email" },
                    { label: "Phone", type: "text", name: "phone" },
                    { label: "Address", type: "text", name: "address" },
                ].map((field) => (
                    <div key={field.name} style={{ marginBottom: "15px" }}>
                        <label style={{ fontWeight: "bold" }}>{field.label}:</label>
                        <input
                            type={field.type}
                            name={field.name}
                            value={inputs[field.name]}
                            onChange={handleChange}
                            required
                            style={{
                                width: "100%",
                                padding: "10px",
                                marginTop: "5px",
                                border: "1px solid #ccc",
                                borderRadius: "5px"
                            }}
                        />
                        {errors[field.name] && (
                            <span style={{ color: "red", fontSize: "14px" }}>
                                {errors[field.name]}
                            </span>
                        )}
                    </div>
                ))}

                <div style={{ marginBottom: "15px" }}>
                    <label style={{ fontWeight: "bold" }}>Health Issues:</label>
                    <select
                        name="healthIssues"
                        onChange={handleChange}
                        value={inputs.healthIssues}
                        required
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginTop: "5px",
                            border: "1px solid #ccc",
                            borderRadius: "5px"
                        }}
                    >
                        <option value="">Select Health Issue</option>
                        <option value="Diabetes">Diabetes</option>
                        <option value="Hypertension">Hypertension</option>
                        <option value="Asthma">Asthma</option>
                        <option value="Cancer">Cancer</option>
                        <option value="Heart Disease">Heart Disease</option>
                    </select>
                    {errors.healthIssues && (
                        <span style={{ color: "red", fontSize: "14px" }}>
                            {errors.healthIssues}
                        </span>
                    )}
                </div>

                <button 
                    type="submit" 
                    style={{
                        width: "100%",
                        padding: "12px",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontSize: "18px"
                    }}
                >
                    Submit
                </button>
            </form>
        </div>
    );
}

export default AddUser;
