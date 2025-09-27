
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
    <div className="min-h-screen bg-black">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-gray-800">
          <div className="px-4 py-4">
            <h1 className="text-xl font-bold text-white">Create Post</h1>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex space-x-3">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  You
                </div>
              </div>
              
              {/* Text Area */}
              <div className="flex-1">
                <textarea
                  className="w-full bg-transparent text-white text-xl placeholder-gray-500 border-none outline-none resize-none"
                  rows={4}
                  placeholder="What's happening?"
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  required
                />
                
                {/* Character count and submit */}
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-800">
                  <div className="text-sm text-gray-500">
                    {content.length}/280 characters
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={loading || content.trim().length === 0}
                    className={`px-6 py-2 rounded-full font-medium transition-colors ${
                      loading || content.trim().length === 0
                        ? 'bg-blue-900 text-gray-500 cursor-not-allowed' 
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    {loading ? "Posting..." : "Post"}
                  </button>
                </div>
              </div>
            </div>
            
            {error && (
              <div className="mt-4 p-3 bg-red-900/20 border border-red-800 rounded-lg">
                <div className="text-red-400 text-sm">{error}</div>
              </div>
            )}
            {success && (
              <div className="mt-4 p-3 bg-green-900/20 border border-green-800 rounded-lg">
                <div className="text-green-400 text-sm">Posted successfully! Redirecting...</div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
