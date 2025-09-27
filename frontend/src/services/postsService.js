// Mock posts service using localStorage
const POSTS_KEY = 'chitchat_posts';

// Sample posts data
const samplePosts = [
  {
    id: 1,
    content: "Welcome to Chit Chat! 🎉 This is your first post on our amazing social platform.",
    author: "chitchat_admin",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    likes: 15,
    replies: 3
  },
  {
    id: 2,
    content: "Just discovered this awesome new social media platform! The interface is so clean and modern. 💯",
    author: "demo_user",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    likes: 8,
    replies: 1
  },
  {
    id: 3,
    content: "Having a great day! The weather is perfect for coding. What are you all working on today? 🌟",
    author: "developer123",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    likes: 12,
    replies: 5
  },
  {
    id: 4,
    content: "Just finished a challenging algorithm problem! Sometimes the best solutions are the simplest ones. 🧠✨",
    author: "coder_girl",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    likes: 20,
    replies: 7
  },
  {
    id: 5,
    content: "Coffee + Code = Perfect Morning ☕👩‍💻 What's your favorite coding fuel?",
    author: "tech_enthusiast",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    likes: 25,
    replies: 9
  }
];

// Get all posts from localStorage
const getPosts = () => {
  const posts = localStorage.getItem(POSTS_KEY);
  if (!posts) {
    // Initialize with sample posts
    localStorage.setItem(POSTS_KEY, JSON.stringify(samplePosts));
    return samplePosts;
  }
  return JSON.parse(posts);
};

// Save posts to localStorage
const savePosts = (posts) => {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
};

// Get all posts (sorted by timestamp, newest first)
export const fetchPosts = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const posts = getPosts();
      const sortedPosts = posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      resolve(sortedPosts);
    }, 300); // Simulate network delay
  });
};

// Create a new post
export const createPost = async (content, author) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!content || content.trim().length === 0) {
        reject({ detail: "Post content cannot be empty" });
        return;
      }

      const posts = getPosts();
      const newPost = {
        id: Date.now(),
        content: content.trim(),
        author,
        timestamp: new Date().toISOString(),
        likes: 0,
        replies: 0
      };

      posts.unshift(newPost); // Add to beginning
      savePosts(posts);
      resolve(newPost);
    }, 300);
  });
};

// Like/unlike a post
export const togglePostLike = async (postId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const posts = getPosts();
      const postIndex = posts.findIndex(p => p.id === postId);
      
      if (postIndex !== -1) {
        // For simplicity, just increment likes (in a real app, you'd track user likes)
        posts[postIndex].likes += 1;
        savePosts(posts);
        resolve(posts[postIndex]);
      } else {
        resolve(null);
      }
    }, 200);
  });
};

// Get posts by a specific user
export const getUserPosts = async (username) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const posts = getPosts();
      const userPosts = posts.filter(p => p.author === username)
                           .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      resolve(userPosts);
    }, 300);
  });
};