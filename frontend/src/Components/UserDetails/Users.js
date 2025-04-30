import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Nav from "../Nav/Nav";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const URL = "http://localhost:5000/users";

const fetchHandler = async () => {
  try {
    const response = await axios.get(URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return { users: [] };
  }
};

function Users() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchHandler().then((data) => {
      setUsers(data.users || []);
    });
  }, []);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const deleteHandler = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/users/${id}`); // Fixed URL with backticks
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
      alert("User deleted successfully!");
      // Refetch users after deletion
      fetchHandler().then((data) => {
        setUsers(data.users || []);
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Error deleting the user.");
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("User Details", 14, 10);

    const columns = ["ID", "Name", "Age", "Email", "Phone", "Address", "Health Issues"];
    const rows = filteredUsers.map((user) => [
      user._id,
      user.name,
      user.age,
      user.email,
      user.phone,
      user.address,
      user.healthIssues,
    ]);

    autoTable(doc, {
      startY: 20,
      head: [columns],
      body: rows,
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [22, 160, 133] },
    });

    doc.save("users_details.pdf");
  };

  return (
    <div>
      <Nav />
      <h1 style={{ textAlign: "center", fontSize: "24px", fontWeight: "bold" }}>
        User Details Display Page
      </h1>

      <div style={{ textAlign: "center", margin: "20px" }}>
        <button onClick={generatePDF} style={styles.pdfButton}>
          Generate PDF
        </button>
      </div>

      <div style={{ textAlign: "center", margin: "20px" }}>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchBar}
        />
      </div>

      <table style={styles.table}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
          
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Age</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Phone</th>
            <th style={styles.th}>Address</th>
            <th style={styles.th}>Health Issues</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <tr key={user._id}>
                
                <td style={styles.td}>{user.name}</td>
                <td style={styles.td}>{user.age}</td>
                <td style={styles.td}>{user.email}</td>
                <td style={styles.td}>{user.phone}</td>
                <td style={styles.td}>{user.address}</td>
                <td style={styles.td}>{user.healthIssues}</td>
                <td style={styles.td}>
                  <Link to={`/updateuser/${user._id}`} style={styles.updateButton}> {/* Fixed Link URL */}
                    Update
                  </Link>
                  <button onClick={() => deleteHandler(user._id)} style={styles.deleteButton}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={styles.noUsers}>No Users Found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  th: { border: "1px solid black", padding: "10px", textAlign: "center" },
  td: { border: "1px solid black", padding: "10px", textAlign: "center" },
  updateButton: { backgroundColor: "#1b3ff0", color: "white", padding: "8px", borderRadius: "5px", textDecoration: "none", marginRight: "5px" },
  deleteButton: { backgroundColor: "red", color: "white", padding: "8px", borderRadius: "5px" },
  pdfButton: { backgroundColor: "green", color: "white", padding: "8px", borderRadius: "5px", width: "200px" },
  searchBar: { padding: "8px", fontSize: "16px", borderRadius: "5px", border: "1px solid #ccc", width: "200px" },
  table: { width: "80%", margin: "20px auto", borderCollapse: "collapse", border: "1px solid black" },
  noUsers: { textAlign: "center", padding: "10px", fontSize: "16px" }
};

export default Users;
