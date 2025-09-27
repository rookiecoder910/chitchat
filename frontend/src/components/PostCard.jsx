import React from "react";

const PostCard = ({ author, content, likes, replies, timestamp }) => {
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold text-blue-600 text-lg">@{author}</span>
        <span className="text-sm text-gray-500">{formatTimestamp(timestamp)}</span>
      </div>
      <p className="text-gray-800 mb-4 leading-relaxed">{content}</p>
      <div className="flex gap-6 text-sm text-gray-600">
        <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
          <span>❤️</span>
          <span>{likes}</span>
        </button>
        <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
          <span>💬</span>
          <span>{replies}</span>
        </button>
      </div>
    </div>
  );
};

export default PostCard;
