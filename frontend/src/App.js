// frontend/src/App.js
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import Home from './pages/Home';
import Blog from './pages/Blog';
import Profile from './pages/Profile';  // Import the Profile page
import Login from "./pages/Login";  // Import the Login component
import LogoutButton from "./components/LogoutButton";  // Optional, for logout
import TransactionHistory from './pages/TransactionHistory'; // Import the new page
import ProtectedRoute from "./components/ProtectedRoute";
import Register from './pages/Register';
import VerifyCode from './pages/VerifyCode';
import ChatWidget from './components/ChatWidget'; // Import ChatWidget
import Chat from './pages/Chat';
import AdminDashboard from './pages/AdminDashboard';
import Payment from './pages/Payment';
import PaymentHistory from './pages/PaymentHistory';
import HomePage from './pages/HomePage';
import WriteBlog from './pages/WriteBlog';  // New page for writing/editing blogs
import SellListing from './pages/SellListing';
import ListingDetails from './pages/ListingDetails';

const LazyComponent = lazy(() => import('./LazyComponent'));

function App() {
  return (
    <Router>
      {/* Chat widget appears on every page */}
      <ChatWidget />
      <div>
        <nav>
          <Link to="/">Home</Link> |{' '}
          <Link to="/blog">Blog</Link> |{' '}
          <Link to="/profile">Profile</Link> |{' '}
          <Link to="/login">Login</Link> |{" "}
          <Link to="/history">Transaction History</Link> |{" "}
          <Link to="/register">Sign up</Link> |{' '}
          <Link to="/verify-code">Verify Email</Link> |{' '}
          <Link to="/admin">Admin Dashboard</Link> |{' '}
          <Link to="/payment">Payment</Link> |{' '}
          <Link to="/payment-history">Payment History</Link> |{' '}
          <LogoutButton />
        </nav>
        <Routes>

          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/history" element={<TransactionHistory />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-code" element={<VerifyCode />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/write-blog" element={<WriteBlog />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment-history" element={<PaymentHistory />} />
          <Route path="/sell" element={<SellListing />} />
          <Route path="/listings/:id" element={<ListingDetails />} />

          {/* Example of using a lazy loaded component */}
          <Route
            path="/lazy"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <LazyComponent />
              </Suspense>
            }
          />
          {/* ...existing routes... */}
          <Route path="/chat" element={<Chat />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
