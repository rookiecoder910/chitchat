
# Chit Chat

A Twitter-like social media frontend built with React, Vite, and TailwindCSS. This app consumes a FastAPI backend and provides a clean, minimal, responsive user experience.

## Features
- **Login & Register:** Secure authentication with JWT, forms for user login and registration.
- **Home Timeline:** View posts from followed users.
- **User Profile:** See user info, posts, followers/following counts, and follow/unfollow users.
- **Create Post:** Share text posts easily.
- **Navbar:** Quick navigation with Home, Profile, and Logout.
- **Responsive Design:** Mobile-first, light theme with blue accent.
- **Route Protection:** Only authenticated users can access main features.

## Tech Stack
- **React** (with Vite for fast development)
- **TailwindCSS** (utility-first styling)
- **React Router** (navigation)
- **FastAPI** (backend, not included here)

## Getting Started

1. **Install dependencies:**
	```sh
	npm install
	```
2. **Start the development server:**
	```sh
	npm run dev
	```
3. **Open your browser:**
	Visit [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal).

## Backend API
- The frontend expects a FastAPI backend with endpoints like:
  - `/api/auth/login` (POST)
  - `/api/auth/register` (POST)
  - `/api/posts/timeline` (GET)
  - `/api/posts/create` (POST)
  - `/api/posts/user/{username}` (GET)
  - `/api/users/{username}` (GET)
  - `/api/users/{username}/follow` (POST)
  - `/api/users/{username}/unfollow` (POST)
  - `/api/users/{username}/is_following` (GET)

## ESLint & Plugins
- Uses [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react) for Fast Refresh.
- For production, consider using TypeScript and type-aware lint rules. See the [Vite TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for details.

## Customization
- Update Tailwind config in `tailwind.config.js`.
- Add new pages/components in `src/pages/` and `src/components/`.
- Connect to your FastAPI backend by updating API URLs if needed.

## License
MIT
