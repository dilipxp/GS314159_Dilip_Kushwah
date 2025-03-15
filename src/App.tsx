// Importing global styles
import "./styles/App.css";

import React from "react";

// Importing React Router components for navigation
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Importing UI components
import Sidebar from "./components/Sidebar";
import TopNavbar from "./components/TopNavbar";

// Importing different page components
import Store from "./pages/Store";
import SKU from "./pages/SKU";
import Planning from "./pages/Planning";
import Charts from "./pages/Charts";

// Main application component
const App: React.FC = () => {
  return (
    <Router> {/* Wrapping the app in Router to enable routing */}
      <div className="app-container"> {/* Main wrapper for styling */}
        <TopNavbar /> {/* Top navigation bar */}
        <div className="main-content"> {/* Wrapper for sidebar and page content */}
          <Sidebar /> {/* Sidebar navigation */}
          <div className="page-content"> {/* Wrapper for page-specific content */}
            <Routes>
              {/* Defining routes for different pages */}
              <Route path="/" element={<Store />} />
              <Route path="/sku" element={<SKU />} />
              <Route path="/planning" element={<Planning />} />
              <Route path="/charts" element={<Charts />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
