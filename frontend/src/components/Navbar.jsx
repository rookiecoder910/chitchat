import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <span className="text-2xl font-bold text-blue-600">Chit Chat</span>
        <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</Link>
        <Link to="/profile/me" className="text-gray-700 hover:text-blue-600 font-medium">Profile</Link>
      </div>
      <button onClick={handleLogout} className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 font-medium">Logout</button>
    </nav>
  );
};

export default Navbar;
