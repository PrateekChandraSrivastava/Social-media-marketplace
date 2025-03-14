// frontend/src/components/LogoutButton.js
import React from "react";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Remove token and user data from localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // Redirect to the login page
        navigate("/login");
    };

    return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
