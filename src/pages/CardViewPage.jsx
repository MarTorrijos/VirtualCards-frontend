import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import './CardViewPage.css';

export default function CardViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [card, setCard] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const logo = '/assets/Logo.png';

  useEffect(() => {
    fetch(`http://localhost:8080/card/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => {
            throw new Error(err.message || `Error ${res.status}`);
          });
        }
        return res.json();
      })
      .then(setCard)
      .catch((err) => {
        console.error('Failed to load card:', err);
        alert('Failed to load card: ' + err.message);
        navigate('/dashboard');
      });
  }, [id, navigate]);

  const toggleMenu = () => setMenuOpen(open => !open);
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const goToProfile = () => {
    navigate('/profile');
    setMenuOpen(false);
  };

  const handleDeleteCard = () => {
    if (!window.confirm('Are you sure you want to delete this card?')) return;

    fetch(`http://localhost:8080/card/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to delete card');
        navigate('/dashboard');
      })
      .catch((err) => {
        alert('Error deleting card: ' + err.message);
      });
  };

  if (!card) return <div>Loading...</div>;

  return (
    <>
      <div className="bg-bottom-left" />
      <div className="bg-bottom-right" />

      <div className="page">
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

        <div className="card-view-page">
          <div className="card-wrapper">
            <Card card={card} size="large" />
            <div className="card-actions">
              <button className="action-button">Upgrade health</button>
              <button className="action-button">Upgrade attack</button>
              <button className="action-button" onClick={() => navigate(`/battle/${id}`)}>Battle</button>
              <button className="back-button" onClick={handleDeleteCard}>Delete Card</button>
              <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
            </div>
          </div>
        </div>

        <div className="background-darken-overlay" />
      </div>
    </>
  );
}
