
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../services/postsService";
import { getCurrentUser } from "../services/authService";

const CreatePost = () => {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);
    
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }

    try {
      await createPost(content, currentUser.username);
      setSuccess(true);
      setContent("");
      // Redirect to home after a short delay
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      setError(error.detail || "Failed to create post");
    } finally {
      setLoading(false);
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
        <button 
          type="submit" 
          disabled={loading}
          className={`py-2 rounded font-medium transition-colors ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
        >
          {loading ? "Posting..." : "Post"}
        </button>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-500 text-sm">Posted!</div>}
      </form>
    </div>
  );
};

export default CreatePost;
