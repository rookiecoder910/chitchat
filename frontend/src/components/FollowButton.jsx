import React, { useState } from "react";

const FollowButton = ({ isFollowing, onFollow, onUnfollow }) => {
  const [loading, setLoading] = useState(false);
  const handleClick = async () => {
    setLoading(true);
    if (isFollowing) {
      await onUnfollow();
    } else {
      await onFollow();
    }
    setLoading(false);
  };
  return (
    <button
      className={`px-4 py-1 rounded font-medium transition-colors duration-150 ${isFollowing ? "bg-gray-200 text-gray-700 hover:bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-600"}`}
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? "..." : isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
};

export default FollowButton;
