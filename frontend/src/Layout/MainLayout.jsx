import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

import './Sidebar.css';
import { Button } from "react-bootstrap";
import Header from "./Header";
import Sidebar from "./Sidebar";



const MainLayout = () => {
    const [screenSize, setScreenSize] = useState(getScreenCategory());
    const [sidebarVisible, setSidebarVisible] = useState(screenSize === 'desktop');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    function getScreenCategory() {
        const width = window.innerWidth;
        if (width < 768) return 'mobile';
        if (width >= 768 && width < 992) return 'tablet';
        return 'desktop';
    }

    const handleToggleSidebar = () => {
        if (screenSize === 'mobile' || screenSize === 'tablet') {
            setSidebarOpen(prev => !prev);
            const offcanvasEl = document.getElementById("mobileSidebar");
            const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
            if (bsOffcanvas) {
                bsOffcanvas.toggle();
            } else {
                new bootstrap.Offcanvas(offcanvasEl).show();
            }
        } else {
            setSidebarVisible(prev => !prev);
        }
    };

    const handleCloseSidebar = () => {
        if (screenSize === 'mobile' || screenSize === 'tablet') {
            setSidebarOpen(false);
            const offcanvasEl = document.getElementById("mobileSidebar");
            const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
            if (bsOffcanvas) bsOffcanvas.hide();
        }
    };

    useEffect(() => {
        const handleResize = () => {
            const currentScreen = getScreenCategory();
            setScreenSize(currentScreen);
            if (currentScreen === 'desktop') {
                setSidebarVisible(true);
                setSidebarOpen(false);
            } else {
                setSidebarVisible(false);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="container-fluid">
            {/* Header */}
            <div className="row fixed-top bg-white">
                <div className="col-12">
                    <Header onToggleSidebar={handleToggleSidebar} />
                </div>
            </div>

            {/* Content Row */}
            <div className="row" style={{ paddingTop: "65px" }}>
                {/* Sidebar for Desktop */}
                {screenSize === 'desktop' && sidebarVisible && (
                    <div className="col-lg-2 p-0 d-none d-lg-block">
                        <Sidebar isMobile={false} onClose={handleCloseSidebar} />
                    </div>
                )}

                {/* Main Content */}
                <div
                    className={`${screenSize === 'desktop' && sidebarVisible ? "col-md-9 col-lg-10" : "col-12"
                        } bg-light`}
                >
                    <div className="p-4">
                        <Outlet />
                    </div>
                </div>
            </div>

            {/* Offcanvas Sidebar for Mobile/Tablet */}
            {(screenSize === 'mobile' || screenSize === 'tablet') && (
                <div
                    className="offcanvas offcanvas-start"
                    tabIndex="-1"
                    id="mobileSidebar"
                    aria-labelledby="mobileSidebarLabel"
                    data-bs-scroll="true"
                    data-bs-backdrop="false"
                    style={{ width: '80px' }} // Set width here
                >
                    <div className="offcanvas-body p-0">
                        <Sidebar
                            isMobile={true}
                            onLinkClick={() => handleCloseSidebar()}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default MainLayout;
