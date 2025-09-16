
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content })
      });
      if (res.ok) {
        setSuccess(true);
        setContent("");
      } else {
        const data = await res.json();
        setError(data.detail || "Failed to create post");
      }
    } catch {
      setError("Network error");
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">Create a Post</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea
          className="border px-3 py-2 rounded resize-none"
          rows={4}
          placeholder="What's happening?"
          value={content}
          onChange={e => setContent(e.target.value)}
          required
        />
        <button type="submit" className="bg-blue-500 text-white py-2 rounded font-medium hover:bg-blue-600">Post</button>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-500 text-sm">Posted!</div>}
      </form>
    </div>
  );
};

export default CreatePost;
