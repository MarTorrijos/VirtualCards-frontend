import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';

export default function ProfilePage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [username, setUsername] = useState('');
  const logo = '/assets/Logo.png';

  useEffect(() => {
    fetch('http://localhost:8080/user', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch profile');
        return res.json();
      })
      .then(data => setUsername(data.username))
      .catch(() => setUsername('Unknown'));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => setMenuOpen(open => !open);
  const goToDashboard = () => navigate('/dashboard');

  return (
    <>
      <div className="page">
        <div className="dashboard-header">
          <div className="dashboard-left">
            <img src={logo} alt="Virtual Cards Logo" className="dashboard-logo" />
          </div>

          <div className="dashboard-right">
            <button className="action-button" onClick={goToDashboard}>
              Back to Dashboard
            </button>

            <div className="hamburger-menu">
              <div className={`hamburger-icon ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
                <span />
                <span />
                <span />
              </div>
              {menuOpen && (
                <div className="dropdown-menu">
                  <button className="dropdown-item" onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="main-content">
          <h1 style={{ fontSize: '2.5rem', color: '#20a9e9', fontWeight: '900' }}>Your Profile</h1>
          <p style={{ fontSize: '1.4rem', marginTop: '1rem' }}>
            Username: {username}
          </p>
        </div>
      </div>
    </>
  );
}
