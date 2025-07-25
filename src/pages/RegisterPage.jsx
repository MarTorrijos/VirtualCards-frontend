import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import './LoginPage.css';   // Reuse login styles

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const logo = '/assets/Logo.png';

  const handleRegister = async () => {
    if (!username || !password) {
      setModalOpen(true);
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {

        await login(username, password);

        navigate('/dashboard');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
    } catch (error) {
      setStatusMessage(error.message);
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  return (
    <>
      <div className="bg-bottom-left" />
      <div className="bg-bottom-right" />
      <div className="page">
        <div className="centered">
          <div className="login-wrapper">
            <motion.img
              src={logo}
              alt="Virtual Cards Logo"
              className="login-logo-outside"
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            />

            <motion.div
              className="login-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {statusMessage && (
                <div
                  className="status-message"
                  dangerouslySetInnerHTML={{ __html: statusMessage }}
                />
              )}

              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
              />
              <button onClick={handleRegister} className="button">
                Register
              </button>
              <p className="text">
                Already have an account? <br />
                <span className="link" onClick={() => navigate('/login')}>
                  Go back to Login
                </span>
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ✅ Modal for validation */}
      <Modal
        isOpen={modalOpen}
        title="Missing Information"
        message="Both username and password are required to register."
        onConfirm={() => setModalOpen(false)}
        showCancel={false}
        showInput={false}
      />
    </>
  );
}
