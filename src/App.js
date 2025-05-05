import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";

import Nav from "./Components/Nav/Nav";
import Foods from "./Components/foods/foods";
import Menu from "./Components/Menu/Menu";
import MenuDetails from "./Components/MenuDetails/MenuDetails";
import UpdateMenu from "./Components/UpdateMenu/UpdateMenu";

// ❌ Removed unused: import Home from "./Components/Home/Home";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Nav />} />
        <Route path="/foods" element={<Foods />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/menudetails" element={<MenuDetails />} />
        <Route path="/updatemenu/:id" element={<UpdateMenu />} />
      </Routes>
    </div>
  );
}

export default App;
