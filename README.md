
# Chit Chat

A Twitter-like social media application with separate frontend and backend. The frontend is built with React, Vite, and TailwindCSS, and the backend is built with Node.js, Express, and MongoDB.

## Project Structure
```
├── frontend/          # React + Vite + TailwindCSS frontend
│   ├── src/
│   ├── public/
│   ├── index.html
│   └── package.json
├── backend/           # Node.js + Express + MongoDB backend
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   ├── middleware/    # Authentication middleware
│   ├── server.js      # Main server file
│   └── package.json
└── README.md
```

## Features
- **Authentication:** JWT-based login and registration with secure password hashing
- **User Profiles:** Complete profile management with bio, avatar, follower/following system
- **Social Features:** Create posts, like, repost, follow/unfollow users
- **Timeline:** Personalized timeline with posts from followed users
- **Search:** Search for posts and users
- **Real-time:** Ready for real-time features
- **Security:** Rate limiting, CORS, input validation, secure headers

## Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast development build tool
- **TailwindCSS** - Utility-first CSS framework
- **React Router** - Client-side routing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Backend Setup
1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables:**
   ```bash
   # Update .env file with your MongoDB URI and JWT secret
   MONGODB_URI=mongodb://localhost:27017/chitchat
   JWT_SECRET=your_super_secret_jwt_key
   ```
4. **Start the backend server:**
   ```bash
   npm run dev
   ```
   Server will run on http://localhost:5000

### Frontend Setup
1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the development server:**
   ```bash
   npm run dev
   ```
4. **Open your browser:**
   Visit http://localhost:5173

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PATCH /api/auth/me` - Update user profile

### Posts
- `POST /api/posts/create` - Create new post
- `GET /api/posts/timeline` - Get timeline posts
- `GET /api/posts/public` - Get public posts
- `POST /api/posts/:id/like` - Like/unlike post
- `POST /api/posts/:id/repost` - Repost/unrepost
- `DELETE /api/posts/:id` - Delete post

### Users
- `GET /api/users/:username` - Get user profile
- `GET /api/users/:username/posts` - Get user posts
- `POST /api/users/:username/follow` - Follow/unfollow user
- `GET /api/users/:username/followers` - Get followers
- `GET /api/users/:username/following` - Get following

## Development

### Project Structure Details

**Frontend (`/frontend/`):**
- `src/pages/` - React page components (Login, Register, Home, Profile, CreatePost)
- `src/components/` - Reusable UI components (Navbar, PostCard, etc.)
- `src/services/` - API service layers and mock data
- `src/contexts/` - React context for state management

**Backend (`/backend/`):**
- `models/` - MongoDB/Mongoose data models (User, Post)
- `routes/` - Express route handlers (auth, users, posts)
- `middleware/` - Custom middleware (authentication, validation)
- `server.js` - Main server configuration and startup



### Database Setup
1. **Install MongoDB locally** or use **MongoDB Atlas** (cloud)
2. **Update MONGODB_URI** in backend/.env
3. **Database will be created automatically** when you start the backend

## Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy dist/ folder
```

### Backend (Railway/Heroku/DigitalOcean)
```bash
cd backend
# Set production environment variables
# Deploy with your preferred platform
```

## Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
## Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License
MIT
