// Mock authentication service using localStorage
const USERS_KEY = 'chitchat_users';
const CURRENT_USER_KEY = 'chitchat_current_user';

// Get all users from localStorage
const getUsers = () => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

// Save users to localStorage
const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Generate a mock JWT token
const generateToken = (username) => {
  return `mock_token_${username}_${Date.now()}`;
};

// Register a new user
export const registerUser = async (username, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getUsers();
      
      // Check if user already exists
      const existingUser = users.find(user => user.username === username);
      if (existingUser) {
        reject({ detail: "Username already exists" });
        return;
      }

      // Create new user
      const newUser = {
        id: Date.now(),
        username,
        password, // In a real app, this would be hashed
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      saveUsers(users);

      // Generate token
      const token = generateToken(username);
      
      // Save current user
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({
        ...newUser,
        password: undefined // Don't store password in current user
      }));

      resolve({ 
        token, 
        user: { id: newUser.id, username: newUser.username }
      });
    }, 500); // Simulate network delay
  });
};

// Login user
export const loginUser = async (username, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getUsers();
      
      // Find user
      const user = users.find(u => u.username === username && u.password === password);
      if (!user) {
        reject({ detail: "Invalid username or password" });
        return;
      }

      // Generate token
      const token = generateToken(username);
      
      // Save current user
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({
        ...user,
        password: undefined // Don't store password in current user
      }));

      resolve({ 
        token, 
        user: { id: user.id, username: user.username }
      });
    }, 500); // Simulate network delay
  });
};

// Get current user
export const getCurrentUser = () => {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
  localStorage.removeItem('token');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};