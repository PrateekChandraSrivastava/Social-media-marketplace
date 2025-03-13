// frontend/src/App.js
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Blog from './pages/Blog';
import Profile from './pages/Profile';  // Import the Profile page
import TransactionHistory from './pages/TransactionHistory'; // Import the new page

const LazyComponent = lazy(() => import('./LazyComponent'));

function App() {
  return (
    <Router>
      <div>
        <nav>
          <Link to="/">Home</Link> |{' '}
          <Link to="/blog">Blog</Link> |{' '}
          <Link to="/profile">Profile</Link> |{' '}
          <Link to="/history">Transaction History</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/history" element={<TransactionHistory />} />
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
