import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/Logo.png';
import loginBackgroundLeft from '../assets/backgrounds/trees_left.png';
import loginBackgroundRight from '../assets/backgrounds/trees_right.png';
import './LoginPage.css';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (error) {
      alert('Login failed. Please try again.');
    }
  };

  return (
    <>
      {/* Background image outside the centered div */}
      <img
        src={loginBackgroundLeft}
        alt="Login Page Decoration"
        className="login-bg-bottom-left"
      />

            <img
        src={loginBackgroundRight}
        alt="Login Page Decoration"
        className="login-bg-bottom-right"
      />

      <div className="centered">
        {/* Wrapper for the logo and login card */}
        <div className="login-wrapper">
          {/* Logo animation */}
          <motion.img
            src={logo}
            alt="Virtual Cards Logo"
            className="login-logo-outside"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          />

          {/* Login form */}
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

            {/* Register link */}
            <p className="text">
              Don’t have an account? <br />
              <span className="link" onClick={() => navigate('/register')}>
                Register instead
              </span>
            </p>

          </motion.div>
        </div>
      </div>
    </>
  );
}
