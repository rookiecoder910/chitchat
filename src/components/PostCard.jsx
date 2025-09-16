import React from "react";

const PostCard = ({ username, content, likes, comments, timestamp }) => {
  return (
    <div className="bg-white rounded shadow p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-blue-600">@{username}</span>
        <span className="text-xs text-gray-400">{timestamp}</span>
      </div>
      <p className="text-gray-800 mb-3">{content}</p>
      <div className="flex gap-4 text-sm text-gray-500">
        <span>👍 {likes}</span>
        <span>💬 {comments}</span>
      </div>
    </div>
  );
};

export default PostCard;
