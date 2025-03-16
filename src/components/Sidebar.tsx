import React from "react";
import { Link, useLocation } from "react-router-dom";
import { MdStore, MdViewList, MdAssessment, MdTimeline } from "react-icons/md";
import "../styles/Sidebar.css";

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li>
            <Link 
              to="/" 
              className={`nav-item ${location.pathname === "/" ? "active" : ""}`}
            >
              <MdStore /> Store
            </Link>
          </li>
          <li>
            <Link 
              to="/sku" 
              className={`nav-item ${location.pathname === "/sku" ? "active" : ""}`}
            >
              <MdViewList /> SKU
            </Link>
          </li>
          <li>
            <Link 
              to="/planning" 
              className={`nav-item ${location.pathname === "/planning" ? "active" : ""}`}
            >
              <MdAssessment /> Planning
            </Link>
          </li>
          <li>
            <Link 
              to="/charts" 
              className={`nav-item ${location.pathname === "/charts" ? "active" : ""}`}
            >
              <MdTimeline /> Charts
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
