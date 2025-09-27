
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";
import { fetchPosts } from "../services/postsService";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    
    const loadPosts = async () => {
      try {
        const postsData = await fetchPosts();
        setPosts(postsData);
        setLoading(false);
      } catch (err) {
        setError("Failed to load posts");
        setLoading(false);
      }
    };

    loadPosts();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-gray-800">
          <div className="px-4 py-4">
            <h1 className="text-xl font-bold text-white">Home</h1>
          </div>
        </div>
        
        {/* Content */}
        <div className="">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-400">Loading...</div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-red-400">{error}</div>
            </div>
          ) : posts.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-400">No posts yet.</div>
            </div>
          ) : (
            posts.map(post => (
              <PostCard key={post.id} {...post} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
