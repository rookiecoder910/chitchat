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
    <article className="border-b border-gray-800 hover:bg-gray-950/50 transition-colors cursor-pointer">
      <div className="flex p-4 space-x-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {author.charAt(0).toUpperCase()}
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* User info and timestamp */}
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-bold text-white hover:underline cursor-pointer">@{author}</span>
            <span className="text-gray-500">·</span>
            <span className="text-gray-500 text-sm">{formatTimestamp(timestamp)}</span>
          </div>
          
          {/* Post content */}
          <div className="text-white text-[15px] leading-5 mb-3">
            {content}
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center justify-between max-w-md text-gray-500">
            <button className="group flex items-center space-x-2 hover:bg-blue-900/20 rounded-full p-2 -m-2 transition-colors">
              <div className="group-hover:bg-blue-900/20 rounded-full p-1">
                <svg className="w-4 h-4 group-hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <span className="text-xs group-hover:text-blue-400">{replies}</span>
            </button>
            
            <button className="group flex items-center space-x-2 hover:bg-green-900/20 rounded-full p-2 -m-2 transition-colors">
              <div className="group-hover:bg-green-900/20 rounded-full p-1">
                <svg className="w-4 h-4 group-hover:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </div>
            </button>
            
            <button className="group flex items-center space-x-2 hover:bg-red-900/20 rounded-full p-2 -m-2 transition-colors">
              <div className="group-hover:bg-red-900/20 rounded-full p-1">
                <svg className="w-4 h-4 group-hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span className="text-xs group-hover:text-red-400">{likes}</span>
            </button>
            
            <button className="group flex items-center space-x-2 hover:bg-blue-900/20 rounded-full p-2 -m-2 transition-colors">
              <div className="group-hover:bg-blue-900/20 rounded-full p-1">
                <svg className="w-4 h-4 group-hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
