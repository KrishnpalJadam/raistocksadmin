// src/components/shared/Topbar.jsx

import React from 'react';
import { Bell, UserCircle, Settings, LogOut } from 'lucide-react';
import { Dropdown } from 'react-bootstrap';
import logo from "../assets/image/logo.png";
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <div className="topbar fixed-top d-flex align-items-center justify-content-between px-4 py-2 bg-white">
            {/* Left - Logo */}
            <div className="d-flex align-items-center">
                <img src={logo} alt="Logo" style={{ height: "60px", objectFit: "contain" }} />
            </div>

            {/* Right - Icons and Profile */}
            <div className="d-flex align-items-center">
                {/* Notifications */}
                {/* <button className="btn btn-light me-4 position-relative rounded-circle p-2">
                    <Bell className="lucide-icon" />
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        3 <span className="visually-hidden">unread messages</span>
                    </span>
                </button> */}
              

                    <Dropdown.Item className="text-danger">
                        <Link to="/" className="text-danger">  <LogOut className="lucide-icon me-2" /> Logout </Link>
                    </Dropdown.Item> 
                {/* Profile Dropdown */}

            </div>
        </div>
    );
};

export default Header;
