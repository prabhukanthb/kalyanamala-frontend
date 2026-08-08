import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>🎉 Welcome to Kalyanamala</h1>
      <p style={{ fontSize: '18px' }}>Find your perfect match!</p>

      {isAuthenticated ? (
        <div>
          <h2>Welcome, {user?.firstName}! 👋</h2>
          <div style={{ marginTop: '20px' }}>
            <button 
              onClick={() => navigate('/browse')}
              style={{
                padding: '10px 20px',
                marginRight: '10px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '5px',
                fontSize: '16px'
              }}
            >
              Browse Profiles
            </button>
            <button 
              onClick={() => navigate('/profile')}
              style={{
                padding: '10px 20px',
                backgroundColor: '#2196F3',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '5px',
                fontSize: '16px'
              }}
            >
              My Profile
            </button>
          </div>
        </div>
      ) : (
        <div style={{ marginTop: '20px' }}>
          <button 
            onClick={() => navigate('/login')}
            style={{
              padding: '10px 20px',
              marginRight: '10px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '5px',
              fontSize: '16px'
            }}
          >
            Login
          </button>
          <button 
            onClick={() => navigate('/register')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '5px',
              fontSize: '16px'
            }}
          >
            Register
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
