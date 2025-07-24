import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import './LoginPage.css';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstVisit, setFirstVisit] = useState(false);
  const [modalConfig, setModalConfig] = useState({ isOpen: false });
  const { login } = useAuth();
  const navigate = useNavigate();
  const logo = '/assets/Logo.png';

  useEffect(() => {
    const visited = localStorage.getItem('hasVisited');
    if (!visited) {
      setFirstVisit(true);
      localStorage.setItem('hasVisited', 'true');
    }
  }, []);

  const showModal = (title, message) => {
    setModalConfig({
      isOpen: true,
      title,
      message,
      onConfirm: () => setModalConfig({ isOpen: false }),
      onCancel: () => setModalConfig({ isOpen: false }),
      showCancel: false
    });
  };

  const handleLogin = async () => {
    if (!username || !password) {
      showModal("Missing Fields", !username && !password
        ? "Username and password are required"
        : !username
        ? "Please enter your username"
        : "Please enter your password");
      return;
    }

    try {
      await login(username, password);
      const role = localStorage.getItem('role');
      if (role === 'ADMIN') {
        navigate('/admin-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      showModal("Login Failed", "Invalid username or password. Please try again.");
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
              initial={firstVisit ? { opacity: 0, scale: 0.9 } : false}
              animate={firstVisit ? { opacity: 1, scale: 1 } : false}
              transition={firstVisit ? { duration: 0.2 } : {}}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            />

            <motion.div
              className="login-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
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
              <button onClick={handleLogin} className="button">
                Sign In
              </button>
              <p className="text">
                Don’t have an account? <br />
                <span className="link" onClick={() => navigate('/register')}>
                  Register instead
                </span>
              </p>
            </motion.div>
          </div>
        </div>
      </div>
      <Modal {...modalConfig} />
    </>
  );
}
