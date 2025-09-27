# Chit Chat Backend API

A complete Node.js backend API for the Chit Chat social media application built with Express.js, MongoDB, and JWT authentication.

## 🚀 Features

- **User Authentication**: JWT-based registration, login, and secure routes
- **User Management**: Profiles, following/followers, private accounts
- **Posts**: Create, read, like, repost, and delete posts
- **Social Features**: Follow users, timeline, search functionality
- **Security**: Rate limiting, CORS, input validation, password hashing
- **Real-time**: Ready for real-time features with WebSocket support

## 🛠 Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **helmet** - Security middleware
- **cors** - Cross-origin resource sharing

## 📦 Installation

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Setup Steps

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   - Copy `.env.example` to `.env` (if needed)
   - Update the following variables in `.env`:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/chitchat
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRE=7d
   CORS_ORIGIN=http://localhost:5173
   ```

4. **Start MongoDB**:
   - Make sure MongoDB is running on your system
   - Or use MongoDB Atlas (cloud) and update the MONGODB_URI

5. **Run the server**:
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

## 🔗 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register a new user
- `POST /login` - Login user
- `GET /me` - Get current user profile
- `PATCH /me` - Update user profile
- `POST /logout` - Logout user
- `POST /refresh` - Refresh JWT token

### Posts (`/api/posts`)
- `POST /create` - Create a new post
- `GET /timeline` - Get timeline posts (authenticated)
- `GET /public` - Get public posts
- `GET /:postId` - Get specific post
- `POST /:postId/like` - Like/unlike a post
- `POST /:postId/repost` - Repost/unrepost
- `DELETE /:postId` - Delete a post
- `GET /search/:query` - Search posts

### Users (`/api/users`)
- `GET /:username` - Get user profile
- `GET /:username/posts` - Get user's posts
- `POST /:username/follow` - Follow/unfollow user
- `GET /:username/followers` - Get user's followers
- `GET /:username/following` - Get user's following
- `GET /search/:query` - Search users

### General
- `GET /` - API welcome message
- `GET /api/health` - Health check endpoint

## 📝 Request/Response Examples

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepass123",
  "displayName": "John Doe"
}
```

### Create Post
```bash
POST /api/posts/create
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "content": "Hello, world! This is my first post 🎉",
  "visibility": "public"
}
```

### Follow User
```bash
POST /api/users/johndoe/follow
Authorization: Bearer <your-jwt-token>
```

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication. After login/registration, include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 🛡 Security Features

- **Rate Limiting**: Prevents spam and brute force attacks
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers
- **Input Validation**: Server-side validation for all inputs
- **Password Hashing**: bcrypt with salt rounds
- **JWT Security**: Secure token generation and validation

## 📊 Database Schema

### User Model
- Username, email, password
- Profile information (display name, bio, avatar, etc.)
- Followers/following arrays
- Account settings (private/public)
- Statistics (posts, followers, following counts)

### Post Model
- Content (max 280 characters)
- Author reference
- Likes and reposts arrays
- Replies support
- Hashtags extraction
- Visibility settings
- Timestamps and edit history

## 🔄 Development

### Available Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (to be implemented)

### Project Structure
```
backend/
├── models/           # Database models
├── routes/           # API route handlers
├── middleware/       # Custom middleware
├── .env             # Environment variables
├── server.js        # Main server file
└── package.json     # Dependencies and scripts
```

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_very_secure_jwt_secret
CORS_ORIGIN=your_frontend_domain
```

### Deployment Platforms
- **Heroku**: Easy deployment with MongoDB Atlas
- **Railway**: Simple Node.js deployment
- **DigitalOcean**: App platform or droplet
- **AWS**: EC2 with RDS or DocumentDB

## 🤝 Integration with Frontend

Update your frontend API calls to use the backend server:

```javascript
// Instead of localStorage mock service, use real API
const API_BASE_URL = 'http://localhost:5000/api';

// Login example
const loginUser = async (identifier, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password })
  });
  return response.json();
};
```

## 📚 Next Steps

1. **Run the backend server**: `npm run dev`
2. **Test API endpoints**: Use Postman or curl
3. **Update frontend**: Switch from mock services to real API calls
4. **Add real-time features**: Implement WebSocket for live updates
5. **File uploads**: Add image upload for avatars and posts
6. **Email verification**: Add email confirmation for registration
7. **Admin features**: Add admin panel and moderation tools

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**:
   - Ensure MongoDB is running
   - Check MONGODB_URI in .env file
   - For MongoDB Atlas, check network access settings

2. **CORS Issues**:
   - Update CORS_ORIGIN in .env to match your frontend URL
   - Ensure frontend is making requests to correct backend URL

3. **JWT Token Issues**:
   - Check JWT_SECRET is set in .env
   - Verify token format in Authorization header

---

**Happy Coding! 🎉**