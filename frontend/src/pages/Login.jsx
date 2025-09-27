import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ParticleBackground from "../components/ParticleBackground";
import { loginUser } from "../services/authService";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await loginUser(username, password);
      if (data.token) {
        localStorage.setItem("token", data.token);
        navigate("/");
      }
    } catch (error) {
      setError(error.detail || "Login failed");
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      width: '100vw',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <ParticleBackground />
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8" style={{ width: '400px', maxWidth: '90vw', zIndex: 10, position: 'relative' }}>
          <h2 className="text-3xl font-bold mb-8 text-white text-center">Login to Chit Chat</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Username"
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Login
            </button>
            {error && <div className="text-red-400 text-sm text-center bg-red-500/20 py-2 px-4 rounded-lg border border-red-500/30">{error}</div>}
          </form>
          <div className="mt-6 text-sm text-center text-white/80">
            <span>Don't have an account? </span>
            <button 
              className="text-blue-400 hover:text-blue-300 underline transition-colors duration-200" 
              onClick={() => navigate("/register")}
            >
              Register
            </button>
          </div>
        </div>
    </div>
  );
};

export default Login;
