
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";
import FollowButton from "../components/FollowButton";

const Profile = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    Promise.all([
      fetch(`/api/users/${username}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => res.json()),
      fetch(`/api/posts/user/${username}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => res.json()),
      fetch(`/api/users/${username}/is_following`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => res.json())
    ])
      .then(([userData, postsData, followData]) => {
        setUser(userData);
        setPosts(postsData.posts || []);
        setIsFollowing(followData.is_following);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load profile");
        setLoading(false);
      });
  }, [username, navigate]);

  const handleFollow = async () => {
    const token = localStorage.getItem("token");
    await fetch(`/api/users/${username}/follow`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    });
    setIsFollowing(true);
  };
  const handleUnfollow = async () => {
    const token = localStorage.getItem("token");
    await fetch(`/api/users/${username}/unfollow`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    });
    setIsFollowing(false);
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : user ? (
        <>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-blue-600">@{user.username}</h1>
              <div className="text-gray-600 text-sm">{user.bio}</div>
              <div className="flex gap-4 mt-2 text-sm">
                <span>Followers: {user.followers_count}</span>
                <span>Following: {user.following_count}</span>
              </div>
            </div>
            {username !== "me" && (
              <FollowButton isFollowing={isFollowing} onFollow={handleFollow} onUnfollow={handleUnfollow} />
            )}
          </div>
          <h2 className="text-lg font-semibold mb-2">Posts</h2>
          {posts.length === 0 ? (
            <div className="text-gray-500">No posts yet.</div>
          ) : (
            posts.map(post => <PostCard key={post.id} {...post} />)
          )}
        </>
      ) : null}
    </div>
  );
};

export default Profile;
