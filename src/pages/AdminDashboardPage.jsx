import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Modal from '../components/Modal';
import './AdminDashboardPage.css';

export default function AdminDashboardPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [cards, setCards] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const [modalConfig, setModalConfig] = useState({ isOpen: false });

  const token = localStorage.getItem('token');
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    axios.get('/admin/users', authHeader).then(res => setUsers(res.data));
    axios.get('/admin/cards', authHeader).then(res => setCards(res.data));
  }, []);

  const openDeleteUserModal = id => {
    setModalConfig({
      isOpen: true,
      title: 'Delete User?',
      message: 'Are you sure you want to delete this user and all their cards?',
      onConfirm: () => confirmDeleteUser(id),
      onCancel: () => setModalConfig({ isOpen: false })
    });
  };

  const confirmDeleteUser = async id => {
    await axios.delete(`/admin/user/${id}`, authHeader);
    setUsers(u => u.filter(u => u.id !== id));
    setCards(c => c.filter(c => c.userId !== id));
    setSelectedUserId(null);
    setModalConfig({ isOpen: false });
  };

  const openDeleteCardModal = id => {
    setModalConfig({
      isOpen: true,
      title: 'Delete Card?',
      message: 'Are you sure you want to delete this card?',
      onConfirm: () => confirmDeleteCard(id),
      onCancel: () => setModalConfig({ isOpen: false })
    });
  };

  const confirmDeleteCard = async id => {
    await axios.delete(`/admin/card/${id}`, authHeader);
    setCards(c => c.filter(c => c.id !== id));
    setModalConfig({ isOpen: false });
  };

  const openAwardXpModal = (cardId) => {
    setModalConfig({
      isOpen: true,
      title: 'Award XP?',
      message: 'Enter XP amount to award:',
      showInput: true,
      onConfirm: (val) => confirmAwardXp(cardId, val),
      onCancel: () => setModalConfig({ isOpen: false })
    });
  };

  const confirmAwardXp = async (cardId, val) => {
    const xp = parseInt(val, 10);
    if (!xp) return;
    const res = await axios.put(`/admin/card/${cardId}/awardxp`, { xp }, authHeader);
    setCards(c => c.map(c => (c.id === cardId ? res.data : c)));
    setModalConfig({ isOpen: false });
  };

  const userCards = selectedUserId ? cards.filter(c => c.userId === selectedUserId) : [];
  const selectedUsername = users.find(u => u.id === selectedUserId)?.username || '';

  const toggleMenu = () => setMenuOpen(o => !o);
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <>
      <div className="bg-bottom-left" />
      <div className="bg-bottom-right" />

      <motion.div initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="dashboard-header">
          <div className="dashboard-left">
            <img src="/assets/Logo.png" alt="Logo" className="dashboard-logo" />
          </div>
          <div className="dashboard-right">
            <div className="hamburger-menu">
              <div className={`hamburger-icon ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
                <span /><span /><span />
              </div>
              {menuOpen && (
                <div className="dropdown-menu">
                  <button className="dropdown-item" onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="admin-dashboard">
        <div className="admin-content">
          <div className="admin-users">
            <h3 className="section-title">Users</h3>
            <div className="item-list">
              {users.map(u => (
                <div key={u.id} className={`admin-card ${selectedUserId === u.id ? 'selected-user' : ''}`}>
                  <span>{u.username}</span>
                  <div className="button-group">
                    <button onClick={() => setSelectedUserId(u.id)} className="btn blue">View Cards</button>
                    <button onClick={() => openDeleteUserModal(u.id)} className="btn red">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedUserId && (
            <div className="admin-cards">
              <h3 className="section-title">Cards of user: {selectedUsername}</h3>
              <div className="item-list">
                {userCards.map(c => (
                  <div key={c.id} className="admin-card">
                    <div>
                      <div className="font-semibold">{c.name}</div>
                      <div className="subtext">{`XP: ${c.xp}, Type: ${c.type}, Stage: ${c.evolutionStage}`}</div>
                    </div>
                    <div className="button-group">
                      <button onClick={() => openAwardXpModal(c.id)} className="btn green">Award XP</button>
                      <button onClick={() => openDeleteCardModal(c.id)} className="btn red">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal {...modalConfig} />
    </>
  );
}
