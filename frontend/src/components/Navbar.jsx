import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <nav className="bg-black border-b border-gray-800 px-4 py-2 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md">
      <div className="flex items-center gap-6">
        <span className="text-2xl font-bold text-white">Chit Chat</span>
        <Link to="/" className="text-gray-300 hover:text-white font-medium transition-colors px-3 py-2 rounded-full hover:bg-gray-900">
          Home
        </Link>
        <Link to="/profile/me" className="text-gray-300 hover:text-white font-medium transition-colors px-3 py-2 rounded-full hover:bg-gray-900">
          Profile
        </Link>
        <Link to="/create" className="text-gray-300 hover:text-white font-medium transition-colors px-3 py-2 rounded-full hover:bg-gray-900">
          Create
        </Link>
      </div>
      <button 
        onClick={handleLogout} 
        className="bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200 font-medium transition-colors"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
