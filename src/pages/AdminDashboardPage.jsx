import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import './AdminDashboardPage.css';

export default function AdminDashboardPage() {
  const [users, setUsers] = useState([]);
  const [cards, setCards] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const token = localStorage.getItem('token');
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    axios.get('/admin/users', authHeader).then(res => setUsers(res.data));
    axios.get('/admin/cards', authHeader).then(res => setCards(res.data));
  }, []);

  const handleDeleteUser = async (userId) => {
    await axios.delete(`/admin/user/${userId}`, authHeader);
    setUsers(users.filter(u => u.id !== userId));
    setCards(cards.filter(c => c.userId !== userId));
    setSelectedUserId(null);
  };

  const handleDeleteCard = async (cardId) => {
    await axios.delete(`/admin/card/${cardId}`, authHeader);
    setCards(cards.filter(c => c.id !== cardId));
  };

  const handleAwardXp = async (cardId) => {
    const xp = parseInt(prompt("Enter XP to award:"), 10);
    if (isNaN(xp)) return;
    const res = await axios.put(`/admin/card/${cardId}/awardxp`, { xp }, authHeader);
    setCards(cards.map(c => (c.id === cardId ? res.data : c)));
  };

  const userCards = selectedUserId ? cards.filter(c => c.userId === selectedUserId) : [];

  return (
    <>
      <div className="bg-bottom-left" />
      <div className="bg-bottom-right" />

      <div className="admin-dashboard">
        <h2 className="admin-title">Admin Dashboard</h2>

        <div className="admin-content">
          <div className="admin-users">
            <h3 className="section-title">Users</h3>
            <div className="item-list">
              {users.map(user => (
                <div key={user.id} className="admin-card">
                  <span>{user.username}</span>
                  <div className="button-group">
                    <button onClick={() => setSelectedUserId(user.id)} className="btn blue">View Cards</button>
                    <button onClick={() => handleDeleteUser(user.id)} className="btn red">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedUserId && (
            <div className="admin-cards">
              <h3 className="section-title">Cards (User ID: {selectedUserId})</h3>
              <div className="item-list">
                {userCards.map(card => (
                  <div key={card.id} className="admin-card">
                    <div>
                      <div className="font-semibold">{card.name}</div>
                      <div className="subtext">XP: {card.xp}, Type: {card.type}, Stage: {card.evolutionStage}</div>
                    </div>
                    <div className="button-group">
                      <button onClick={() => handleAwardXp(card.id)} className="btn green">Award XP</button>
                      <button onClick={() => handleDeleteCard(card.id)} className="btn red">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
