// src/App.tsx
import "./styles/App.css";

import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import TopNavbar from "./components/TopNavbar";

import Store from "./pages/Store";
import SKU from "./pages/SKU";
import Planning from "./pages/Planning";
import Charts from "./pages/Charts";


const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <TopNavbar />
        <div className="main-content">
          <Sidebar />
          <div className="page-content">
            <Routes>
              <Route path="/" element={<Store />} />
              <Route path="/sku" element={<SKU />} />
              <Route path="/planning" element={<Planning />} />
              <Route path="/charts" element={<Charts />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  )
}

export default App
