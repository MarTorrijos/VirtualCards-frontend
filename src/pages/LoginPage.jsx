import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/Logo.png';
import loginBackground from '../assets/backgrounds/login_bg.png';
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
    <div className="centered">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="login-wrapper"
      >
        <img src={logo} alt="Virtual Cards Logo" className="login-logo-outside" />
        <div className="login-card">
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

          {/* NEEDS FIXING*/}
          <p className="text">
          Don’t have an account? <span className="link" onClick={() => navigate('/register')}>Register instead</span>
          </p>
        </div>
      </motion.div>

      {/* Background image below the login box */}
      <img src={loginBackground} alt="Login Page Decoration" className="login-bg-bottom" />
    </div>
  );
}