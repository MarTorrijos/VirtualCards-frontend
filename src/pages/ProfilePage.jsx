import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';

export default function ProfilePage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const logo = '/assets/Logo.png';

  const token = localStorage.getItem('token');
  const authHeader = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetch('http://localhost:8080/user', { headers: authHeader })
      .then(res => res.json())
      .then(data => {
        setUsername(data.username);
        setNewUsername(data.username);
      })
      .catch(() => setUsername('Unknown'));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => setMenuOpen(open => !open);
  const goToDashboard = () => navigate('/dashboard');

  const handleUsernameChange = async () => {
    await fetch('http://localhost:8080/user/username', {
      method: 'PUT',
      headers: {
        ...authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newUsername: newUsername }), // ✅ corrected here
    });
    setUsername(newUsername);
    alert('Username updated!');
  };

  const handlePasswordChange = async () => {
    await fetch('http://localhost:8080/user/password', {
      method: 'PUT',
      headers: {
        ...authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newPassword }),
    });
    alert('Password updated!');
    setNewPassword('');
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account?')) return;
    await fetch('http://localhost:8080/user', {
      method: 'DELETE',
      headers: authHeader,
    });
    logout();
    navigate('/login');
  };

  return (
    <>
      <div className="page">
        <div className="dashboard-header">
          <div className="dashboard-left">
            <img src={logo} alt="Virtual Cards Logo" className="dashboard-logo" />
          </div>

          <div className="dashboard-right">
            <button className="action-button" onClick={goToDashboard}>Back to Dashboard</button>
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

          <div style={{ margin: '2rem 0' }}>
            <p style={{ fontSize: '1.4rem' }}>Current Username: {username}</p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label>New Username: </label>
            <input value={newUsername} onChange={e => setNewUsername(e.target.value)} />
            <button className="action-button" onClick={handleUsernameChange}>Update Username</button>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label>New Password: </label>
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            <button className="action-button" onClick={handlePasswordChange}>Update Password</button>
          </div>

          <button className="action-button" style={{ backgroundColor: '#ee7d14' }} onClick={handleDeleteAccount}>
            Delete Account
          </button>
        </div>
      </div>
    </>
  );
}
