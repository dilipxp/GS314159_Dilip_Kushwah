// src/components/TopNavbar.tsx
import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { Menu, MenuItem } from "@mui/material";
import Logo from '../assets/Gsynergy.svg' // Import SVG logo
import "../styles/TopNavbar.css";

const TopNavbar: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <header className="top-nav">
            <div className="logo">
        <img src={Logo} alt="Logo" className="logo-image large-logo" />
      </div>
      <h1 className="app-title">Data Viewer App</h1>
      <div className="profile-menu" onClick={handleClick}>
        <FaUserCircle className="profile-icon" />
      </div>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>Settings</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Menu>
    </header>
  );
};

export default TopNavbar;
