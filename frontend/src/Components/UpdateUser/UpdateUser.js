import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UpdateUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    age: "",
    email: "",
    phone: "",
    address: "",
    healthIssues: "",
  });

  // Fetch user data when component mounts
  useEffect(() => {
    axios
      .get(`http://localhost:5000/users/${id}`)  // Fixed URL template string
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [id]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`http://localhost:5000/users/${id}`, user);  // Fixed URL template string

      if (response.status === 200) {
        alert("User updated successfully!");
        navigate("/userdetails", { state: user }); // Navigate with updated user data
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Update User</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Name:</label>
        <input
          type="text"
          name="name"
          value={user.name}
          onChange={handleChange}
          style={styles.input}
        />

        <label style={styles.label}>Age:</label>
        <input
          type="number"
          name="age"
          value={user.age}
          onChange={handleChange}
          style={styles.input}
        />

        <label style={styles.label}>Email:</label>
        <input
          type="email"
          name="email"
          value={user.email}
          onChange={handleChange}
          style={styles.input}
        />

        <label style={styles.label}>Phone:</label>
        <input
          type="text"
          name="phone"
          value={user.phone}
          onChange={handleChange}
          style={styles.input}
        />

        <label style={styles.label}>Address:</label>
        <input
          type="text"
          name="address"
          value={user.address}
          onChange={handleChange}
          style={styles.input}
        />

        <label style={styles.label}>Health Issues:</label>
        <input
          type="text"
          name="healthIssues"
          value={user.healthIssues}
          onChange={handleChange}
          style={styles.input}
        />

        <button type="submit" style={styles.button}>Update</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "500px",
    margin: "auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    textAlign: "center",
    fontSize: "24px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    margin: "10px 0 5px",
    fontWeight: "bold",
  },
  input: {
    padding: "8px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginBottom: "10px",
  },
  button: {
    backgroundColor: "#28a745",
    color: "white",
    padding: "10px",
    fontSize: "16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
  },
};

export default UpdateUser;
