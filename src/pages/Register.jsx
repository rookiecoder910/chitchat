import React from "react";


import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        navigate("/");
      } else {
        setError(data.detail || "Registration failed");
      }
    } catch {
      setError("Network error");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-blue-600">Register for Chit Chat</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            className="border px-3 py-2 rounded"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="border px-3 py-2 rounded"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="bg-blue-500 text-white py-2 rounded font-medium hover:bg-blue-600">Register</button>
          {error && <div className="text-red-500 text-sm">{error}</div>}
        </form>
        <div className="mt-4 text-sm text-center">
          <span>Already have an account? </span>
          <button className="text-blue-600 underline" onClick={() => navigate("/login")}>Login</button>
        </div>
      </div>
    </div>
  );
};

export default Register;
