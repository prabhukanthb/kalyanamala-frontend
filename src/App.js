import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

const NavBar = () => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav
      style={{
        backgroundColor: '#333',
        color: 'white',
        padding: '15px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <Link
        to="/"
        style={{ color: 'white', textDecoration: 'none', fontSize: '20px', fontWeight: 'bold' }}
      >
        💍 Kalyanamala
      </Link>

      <div>
        {isAuthenticated ? (
          <>
            <span style={{ marginRight: '20px' }}>
              Hi, {user?.firstName}
              {user?.surname ? ` ${user.surname}` : ''}!
            </span>

            <Link
              to="/profile"
              style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}
            >
              Profile
            </Link>

            <button
              onClick={handleLogout}
              style={{
                padding: '8px 15px',
                backgroundColor: '#ff6b6b',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '5px'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}
            >
              Login
            </Link>
            <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

function AppContent() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
