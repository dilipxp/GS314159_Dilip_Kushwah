// src/components/Sidebar.tsx
import React from "react";
import { Link } from "react-router-dom";
import { MdStore, MdViewList, MdAssessment, MdTimeline } from "react-icons/md";
import "../styles/Sidebar.css";

const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li><Link to="/" className="nav-item"><MdStore /> Store</Link></li>
          <li><Link to="/sku" className="nav-item"><MdViewList /> SKU</Link></li>
          <li><Link to="/planning" className="nav-item"><MdAssessment /> Planning</Link></li>
          <li><Link to="/charts" className="nav-item"><MdTimeline /> Charts</Link></li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
