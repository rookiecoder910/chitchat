
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";

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
    fetch("/api/posts/timeline", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setPosts(data.posts || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load posts");
        setLoading(false);
      });
  }, [navigate]);

  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Chit Chat Timeline</h1>
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : posts.length === 0 ? (
        <div className="text-gray-500">No posts yet.</div>
      ) : (
        posts.map(post => (
          <PostCard key={post.id} {...post} />
        ))
      )}
    </div>
  );
};

export default Home;
