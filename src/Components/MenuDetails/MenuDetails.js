import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./MenuDetails.css";

//
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MenuDetails = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchMeals = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5001/api/menus");
      if (!response.ok) throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
      const data = await response.json();
      setMeals(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5001/api/menus/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
      setMeals(meals.filter((meal) => meal._id !== id));
      alert("Meal deleted successfully!");
    } catch {
      alert("Failed to delete meal.");
    }
  };

  const handleUpdate = (id) => navigate(`/updatemenu/${id}`);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const filteredMeals = meals.filter((meal) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (meal.name && meal.name.toLowerCase().includes(searchLower)) ||
      (meal.description && meal.description.toLowerCase().includes(searchLower)) ||
      (meal.currentPrice && meal.currentPrice.toString().includes(searchLower)) ||
      (meal.category && meal.category.toLowerCase().includes(searchLower))
    );
  });

  const chartData = {
    labels: filteredMeals.map((meal) => meal.name),
    datasets: [
      {
        label: "Current Price ($)",
        data: filteredMeals.map((meal) => meal.currentPrice),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Original Price ($)",
        data: filteredMeals.map((meal) => meal.originalPrice || null),
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      }
    ],
  };

  const generatePDF = () => {
    if (meals.length === 0) {
      alert("No meals available to generate the report.");
      return;
    }

    const userConfirmed = window.confirm("Do you want to download the meal report?");
    if (!userConfirmed) return;

    const doc = new jsPDF();
    const currentDate = new Date().toISOString().split("T")[0];

    doc.setFontSize(18);
    doc.text("Meal Report", 14, 20);
    doc.setFontSize(12);
    doc.text(`Date: ${currentDate}`, 14, 30);

    const tableColumn = ["#", "Name", "Category", "Current Price", "Original Price", "Description"];
    const tableRows = meals.map((meal, index) => [
      index + 1,
      meal.name,
      meal.category,
      `$${meal.currentPrice ? meal.currentPrice.toFixed(2) : "0.00"}`,
      meal.originalPrice ? `$${meal.originalPrice.toFixed(2)}` : "-",
      meal.description.substring(0, 50) + (meal.description.length > 50 ? "..." : "")
    ]);

    autoTable(doc, {
      startY: 40,
      head: [tableColumn],
      body: tableRows,
      styles: { fontSize: 10, cellPadding: 2 },
      columnStyles: {
        5: { cellWidth: 60 } // Description column width
      }
    });

    doc.save("Meal_Report.pdf");
  };

  if (loading) return <div className="loading">Loading meal details...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (filteredMeals.length === 0) return <div className="no-meals">No meals found.</div>;

  return (
    <div className="menudetails-container">
      <h2>Meal Details</h2>
      <input
        type="text"
        placeholder="Search meals by name, description, price or category..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-bar"
      />

      <div className="chart-container">
        <h3>Meal Price Comparison</h3>
        <Bar 
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              title: { display: true, text: 'Current vs Original Prices' }
            }
          }}
        />
      </div>

      <div className="report-container">
        <button onClick={generatePDF} className="report-button">
          📄 Download PDF Report
        </button>
      </div>

      <table className="meal-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Current Price</th>
            <th>Original Price</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredMeals.map((meal) => (
            <tr key={meal._id}>
              <td>
                {meal.image ? (
                  <img
                    src={`http://localhost:5001/${meal.image}`} 
                    alt={meal.name}
                    className="meal-image"
                  />
                ) : (
                  <img
                    src="/placeholder-image.jpg"
                    alt="No image available"
                    className="meal-image"
                  />
                )}
              </td>
              <td>{meal.name || "Unnamed Meal"}</td>
              <td>{meal.category}</td>
              <td>${meal.currentPrice ? meal.currentPrice.toFixed(2) : "0.00"}</td>
              <td>{meal.originalPrice ? `$${meal.originalPrice.toFixed(2)}` : "-"}</td>
              <td className="description-cell">{meal.description}</td>
              <td className="actions-cell">
                <button onClick={() => handleUpdate(meal._id)} className="update-btn">✏️ Update</button>
                <button onClick={() => handleDelete(meal._id)} className="delete-btn">🗑️ Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={() => navigate("/")} className="back-btn">⬅️ Back to Menu</button>
    </div>
  );
};

export default MenuDetails;
