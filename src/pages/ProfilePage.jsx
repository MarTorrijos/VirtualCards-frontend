import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import './ProfilePage.css';
import './DashboardPage.css';

export default function ProfilePage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [modalConfig, setModalConfig] = useState({ isOpen: false });

  const token = localStorage.getItem('token');
  const authHeader = { Authorization: `Bearer ${token}` };
  const logo = '/assets/Logo.png';

  useEffect(() => {
    // Debug: log the token in console
    console.log('Profile fetch with token:', token);

    fetch('http://localhost:8080/user', { headers: authHeader })
      .then(res => {
        console.log('Profile fetch status:', res.status);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        setUsername(data.username);
        setNewUsername(data.username);
      })
      .catch(err => {
        console.error('Profile fetch failed:', err);
        setUsername(''); // clear properly
        openModal('Error', 'Failed to fetch profile — are you logged in?');
      });
  }, [token]);

  const toggleMenu = () => setMenuOpen(o => !o);
  const goToDashboard = () => navigate('/dashboard');
  const handleLogout = () => { logout(); navigate('/login'); };

  const openModal = (title, message, onConfirm = null, showCancel = false) => {
    setModalConfig({
      isOpen: true,
      title,
      message,
      showCancel,
      onConfirm: () => {
        setModalConfig({ isOpen: false });
        if (onConfirm) onConfirm();
      },
      onCancel: () => setModalConfig({ isOpen: false }),
    });
  };

  const handleUsernameChange = async () => {
    if (!newUsername.trim()) {
      return openModal('Invalid Input', 'Username cannot be empty.');
    }
    if (newUsername === username) {
      return openModal('No Change', 'Please enter a different username to update.');
    }
    const res = await fetch('http://localhost:8080/user/username', {
      method: 'PUT',
      headers: { ...authHeader, 'Content-Type': 'application/json' },
      body: JSON.stringify({ newUsername })
    });
    if (res.ok) {
      setUsername(newUsername);
      openModal('Success', 'Username updated!');
    } else {
      const err = await res.json().catch(() => ({}));
      openModal('Error', err.message || 'Failed to update username.');
    }
  };

  const handlePasswordChange = async () => {
    if (!newPassword.trim()) {
      return openModal('Invalid Input', 'Password cannot be empty.');
    }
    const res = await fetch('http://localhost:8080/user/password', {
      method: 'PUT',
      headers: { ...authHeader, 'Content-Type': 'application/json' },
      body: JSON.stringify({ newPassword })
    });
    if (res.ok) {
      setNewPassword('');
      openModal('Success', 'Password updated!');
    } else {
      openModal('Error', 'Failed to update password.');
    }
  };

  const confirmDelete = () => {
    openModal('Delete Account?', 'This will permanently delete your account.', async () => {
      await fetch('http://localhost:8080/user', { method: 'DELETE', headers: authHeader });
      logout();
      navigate('/login');
    }, true);
  };

  return (
    <>
      <div className="page">
        <div className="dashboard-header">
          <div className="dashboard-left">
            <img src={logo} alt="Logo" className="dashboard-logo" />
          </div>
          <div className="dashboard-right">
            <button className="action-button" onClick={goToDashboard}>Back to Dashboard</button>
            <div className="hamburger-menu">
              <div className={`hamburger-icon ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
                <span/><span/><span/>
              </div>
              {menuOpen && (
                <div className="dropdown-menu">
                  <button className="dropdown-item" onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="profile-container">
          <h2 className="profile-title">Your Profile</h2>

          <div className="profile-section">
            <p className="profile-label">Current username:</p>
            <p className="profile-username">{username || '—'}</p>
          </div>

          <div className="profile-section">
            <input
              className="profile-input"
              value={newUsername}
              onChange={e => setNewUsername(e.target.value)}
              placeholder="New username"
            />
            <button className="action-button profile-action-button"
                    onClick={handleUsernameChange}>
              Update Username
            </button>
          </div>

          <div className="profile-section">
            <input
              className="profile-input"
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="New password"
            />
            <button className="action-button profile-action-button"
                    onClick={handlePasswordChange}>
              Update Password
            </button>
          </div>

          <button className="delete-button" onClick={confirmDelete}>
            Delete Account
          </button>
        </div>
      </div>

      <Modal {...modalConfig} />
    </>
  );
}
