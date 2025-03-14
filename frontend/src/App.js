// frontend/src/App.js
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Blog from './pages/Blog';
import Profile from './pages/Profile';  // Import the Profile page
import Login from "./pages/Login";  // Import the Login component
import LogoutButton from "./components/LogoutButton";  // Optional, for logout
import TransactionHistory from './pages/TransactionHistory'; // Import the new page
import ProtectedRoute from "./components/ProtectedRoute";
import Register from './pages/Register';

const LazyComponent = lazy(() => import('./LazyComponent'));

function App() {
  return (
    <Router>
      <div>
        <nav>
          <Link to="/">Home</Link> |{' '}
          <Link to="/blog">Blog</Link> |{' '}
          <Link to="/profile">Profile</Link> |{' '}
          <Link to="/login">Login</Link> |{" "}
          <LogoutButton />
          <Link to="/history">Transaction History</Link> |{" "}
          <Link to="/register">Sign up</Link>
        </nav>
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/history" element={<TransactionHistory />} />
          <Route path="/register" element={<Register />} />
          {/* Example of using a lazy loaded component */}
          <Route
            path="/lazy"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <LazyComponent />
              </Suspense>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
