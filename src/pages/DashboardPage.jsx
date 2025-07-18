import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../components/Card';
import logo from '../assets/Logo.png';
import './DashboardPage.css';

export default function DashboardPage() {
  const [cards, setCards] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8080/cards', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then(res => res.json())
      .then(setCards)
      .catch(err => {
        console.error(err);
        alert('Failed to load cards');
      });
  }, []);

  const toggleMenu = () => setMenuOpen(open => !open);
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const goToProfile = () => {
    navigate('/profile');
    setMenuOpen(false);
  };

  return (
    <>
      <div className="bg-bottom-left" />
      <div className="bg-bottom-right" />

      <div className="page">
        <motion.div initial={{ opacity: 0, y: -200 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="dashboard-header">
            <div className="dashboard-left">
              <img src={logo} alt="Virtual Cards Logo" className="dashboard-logo" />
            </div>

            <div className="dashboard-right">
              <button className="action-button">Create card</button>

              <div className="hamburger-menu">
                <div className={`hamburger-icon ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
                  <span />
                  <span />
                  <span />
                </div>
                {menuOpen && (
                  <div className="dropdown-menu">
                    <button className="dropdown-item" onClick={goToProfile}>Profile</button>
                    <button className="dropdown-item" onClick={handleLogout}>Logout</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="main-content">
          <div className="grid-cards">
            {cards.map((card, index) => (
              <motion.div key={card.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: index * 0.07 }}>
                <Card card={card} clickable />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
