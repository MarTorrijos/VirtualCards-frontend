import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../components/Card';
import './DashboardPage.css';

export default function DashboardPage() {
  const [cards, setCards] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('ROCK');
  const { logout } = useAuth();
  const navigate = useNavigate();
  const logo = '/assets/Logo.png';

  // Load cards initially
  useEffect(() => {
    fetch('http://localhost:8080/cards', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then(res => res.json())
      .then(setCards)
      .catch(err => alert('Failed to load cards'));
  }, []);

  // Create a new card
  const handleCreateCard = () => {
    fetch('http://localhost:8080/card', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ type: selectedType }),
    })
      .then(res => {
        if (!res.ok) return res.json().then(e => { throw new Error(e.message || 'Creation failed'); });
        return res.json();
      })
      .then(newCard => setCards(prev => [...prev, newCard]))
      .catch(err => alert('Failed to create card: ' + err.message));
  };

  const toggleMenu = () => setMenuOpen(open => !open);
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const goToProfile = () => {
    setMenuOpen(false);
    navigate('/profile');
  };

  return (
    <>
      <div className="bg-bottom-left" />
      <div className="bg-bottom-right" />

      <div className="page">
        <motion.div
          initial={sessionStorage.getItem('dashboardVisited') ? false : { opacity: 0, y: -200 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onAnimationComplete={() => sessionStorage.setItem('dashboardVisited', 'true')}
        >
          <div className="dashboard-header">
            <div className="dashboard-left">
              <img src={logo} alt="Virtual Cards Logo" className="dashboard-logo" />
            </div>

            <div className="dashboard-right">
              <div className="create-card-section">
                <select
                  className="type-select"
                  value={selectedType}
                  onChange={e => setSelectedType(e.target.value)}
                >
                  <option value="ROCK">Rock</option>
                  <option value="PAPER">Paper</option>
                  <option value="SCISSORS">Scissors</option>
                </select>
                <button className="action-button" onClick={handleCreateCard}>
                  Create card
                </button>
              </div>

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
            {cards.map((card, idx) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: idx * 0.07 }}
              >
                <Card card={card} clickable size="small" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
