import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import about1 from "../assets/Images/about1.png";
const MainLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();

        // Static credentials
        const credentials = {
            admin: { email: "admin@example.com", password: "123" },
           
        };

        if (email === credentials.admin.email && password === credentials.admin.password) {
            const userInfo = { role: "admin", email: email };
            localStorage.setItem("login_details", JSON.stringify(userInfo));
            localStorage.setItem("user_id", "17");
            toast.success("Admin login successful! 🎉");

            setTimeout(() => {
                navigate("/admin/dashboard");
            }, 1500);

        } else {
            toast.error("Invalid credentials. Please try again.");
        }
    };

    return (
        <div className="login-container">
            {/* Left Panel */}
            {/* <div className="login-left-panel">
                <div className="login-left-content">
                    
                    <img src="https://png.pngtree.com/png-clipart/20211009/original/pngtree-online-trading-stock-market-in-flat-png-image_6847830.png" alt="about hero" width={500} className="img-fluid hero-img" />
                </div>
            </div> */}

            {/* Right Panel */}
            <div className="login-right-panel">
                <div className="login-form-box">
                    <h2 className="login-form-title">Login</h2>

                    <form className="login-form mt-4" onSubmit={handleLogin}>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                className="form-input"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                className="form-input"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="login-button">
                            Login Now
                        </button>
                    </form>
                </div>
            </div>

            {/* Toast Container */}
            <ToastContainer position="top-center" autoClose={2000} />
        </div>
    );
};

export default MainLogin;
