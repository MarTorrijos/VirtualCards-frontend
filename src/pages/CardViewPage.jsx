import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Modal from '../components/Modal';
import './CardViewPage.css';

export default function CardViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [card, setCard] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ isOpen: false });
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
        openModal('Error', 'Failed to load card: ' + err.message, () => navigate('/dashboard'), false);
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

  const openModal = (title, message, onConfirm = null, showCancel = true) => {
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

  const handleDeleteCard = () => {
    openModal('Delete Card?', 'Are you sure you want to delete this card?', () => {
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
          openModal('Error', 'Error deleting card: ' + err.message, null, false);
        });
    });
  };

  const upgradeCard = (type) => {
    fetch(`http://localhost:8080/card/upgrade/${type}/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || 'Upgrade failed');
        }
        return res.json();
      })
      .then(setCard)
      .catch((err) => openModal('Upgrade Failed', err.message, null, false));
  };

  const evolveCard = () => {
    fetch(`http://localhost:8080/card/evolve/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || 'Evolution failed');
        }
        return res.json();
      })
      .then(setCard)
      .catch((err) => openModal('Evolution Failed', err.message, null, false));
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
                <span /><span /><span />
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
              <button className="action-button" onClick={() => upgradeCard('health')}>Upgrade health</button>
              <button className="action-button" onClick={() => upgradeCard('attack')}>Upgrade attack</button>
              <button className="action-button" onClick={evolveCard}>Evolve</button>
              <button className="action-button" onClick={() => navigate(`/battle/${id}`)}>Battle</button>
              <button className="back-button" onClick={handleDeleteCard}>Delete Card</button>
              <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
            </div>
          </div>
        </div>

        <div className="background-darken-overlay" />
        <Modal {...modalConfig} />
      </div>
    </>
  );
}