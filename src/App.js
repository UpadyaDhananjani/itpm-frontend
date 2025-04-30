import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import Home from "./components/Home/Home";
import Nav from "./components/Nav/Nav";
import AddOrder from "./components/AddOrder/AddOrder";
import OrderUpdate from "./components/AddOrder/UpdateOrder";
import AllOrders from "./components/AddOrder/AllOrders";
import { OrderProvider } from './components/AddOrder/OrderContext'; // Correct import path

function App() {
    return (
        <Router>
            <OrderProvider>
                <AppContent />
            </OrderProvider>
        </Router>
    );
}

function AppContent() {
    const location = useLocation();

    return (
        <div>
            {location.pathname === "/" && <Nav />}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/add-order" element={<AddOrder />} />
                <Route path="/all-orders" element={<AllOrders />} />
                <Route path="/update-order/:id" element={<OrderUpdate />} />
            </Routes>
        </div>
    );
}

export default App;