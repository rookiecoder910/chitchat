// AuthRoute: redirects to login if not authenticated
function AuthRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login";
    return null;
  }
  return children;
}


import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';


import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import CreatePost from './pages/CreatePost';

function App() {
  return (
    <Router>
      {/* Show Navbar except on login/register */}
      {window.location.pathname !== "/login" && window.location.pathname !== "/register" && <Navbar />}
      <Routes>
  <Route path="/" element={<AuthRoute><Home /></AuthRoute>} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/profile/:username" element={<AuthRoute><Profile /></AuthRoute>} />
  <Route path="/create" element={<AuthRoute><CreatePost /></AuthRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
