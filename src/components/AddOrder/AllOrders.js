import React, { useState, useEffect, useContext } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // Correct import
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import SearchBar from "./SearchBar";
import { OrderContext } from "./OrderContext";
import backgroundImage from "../Img/order9.jpg"; // Import background image

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { ordersChanged, setOrdersChanged } = useContext(OrderContext);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/orders/");
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [ordersChanged, location.state?.refresh]);

  const filterOrders = orders.filter((order) =>
    Object.values(order)
      .filter((value) => typeof value === "string")
      .some((value) => value.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const generateReport = () => {
    if (filterOrders.length === 0) {
      alert("No orders available for the report.");
      return;
    }

    const doc = new jsPDF();
    doc.text("Order Management Report", 14, 16);

    const columns = [
      "First Name", "Last Name", "Email", "Phone", "Address",
      "City", "Order ID", "Instructions", "Pickup Time", "Status"
    ];

    const rows = filterOrders.map((order) => [
      order.firstName || "N/A",
      order.lastName || "N/A",
      order.email || "N/A",
      order.phoneNumber || "N/A",
      order.address || "N/A",
      order.city || "N/A",
      order.orderId || "N/A",
      order.specialInstructions || "N/A",
      order.pickupTime || "N/A",
      order.orderStatus || "N/A",
    ]);

    autoTable(doc, { head: [columns], body: rows, startY: 22 }); // Use autoTable correctly
    doc.save("Orders_report.pdf");
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      await axios.delete(`http://localhost:5000/orders/${orderId}`);
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
      setOrdersChanged((prev) => !prev);
      alert("Order deleted successfully!");
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Failed to delete the order. Try again.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundBlendMode: "multiply",
        padding: "20px"
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: "1200px",
          boxSizing: "border-box",
        }}
      >
        <h1 style={{ textAlign: "center", fontSize: "2.25rem", fontWeight: "bold", marginBottom: "1.5rem" }}>
          All Orders
        </h1>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
          <SearchBar onSearch={setSearchQuery} />
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "20px" }}>Loading orders...</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#fff", textAlign: "left" }}>
            <thead>
              <tr style={{ backgroundColor: "#ddd" }}>
                {[
                  "First Name", "Last Name", "Email", "Phone", "Address",
                  "City", "Order ID", "Instructions", "Pickup Time", "Status", "Actions"
                ].map((header, index) => (
                  <th key={index} style={{ padding: "10px", borderBottom: "2px solid #ccc" }}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filterOrders.length > 0 ? (
                filterOrders.map((order) => (
                  <tr key={order._id} style={{ borderBottom: "1px solid #ddd" }}>
                    {[
                      order.firstName, order.lastName, order.email, order.phoneNumber,
                      order.address, order.city, order.orderId, order.specialInstructions,
                      order.pickupTime, order.orderStatus
                    ].map((value, index) => (
                      <td key={index} style={{ padding: "10px" }}>
                        {value || "N/A"}
                      </td>
                    ))}
                    <td style={{ padding: "10px" }}>
                      <Link
                        to={`/update-order/${order._id}`}
                        style={{
                          backgroundColor: "#dc2626", color: "#fff",
                          padding: "6px 12px", borderRadius: "4px", textDecoration: "none",
                          marginRight: "10px"
                        }}
                      >
                        Update
                      </Link>
                      <button
                        onClick={() => handleDelete(order._id)}
                        style={{
                          backgroundColor: "black", color: "#fff",
                          padding: "6px 12px", borderRadius: "4px", cursor: "pointer"
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" style={{ textAlign: "center", padding: "10px" }}>
                    No orders available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "20px" }}>
          <button onClick={generateReport} style={buttonStyle}>Generate Report</button>
          <button onClick={() => navigate("/")} style={buttonStyleRed}>Back to Home</button>
        </div>
      </div>
    </div>
  );
};

const buttonStyle = {
  padding: "12px 20px", backgroundColor: "black", color: "white",
  border: "none", borderRadius: "5px", cursor: "pointer",
  fontSize: "16px", width: "200px", marginBottom: "15px"
};

const buttonStyleRed = {
  ...buttonStyle, backgroundColor: "#dc2626"
};

export default AllOrders;
