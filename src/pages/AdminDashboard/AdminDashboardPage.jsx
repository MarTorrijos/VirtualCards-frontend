import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';

export default function AdminDashboardPage() {
  const [users, setUsers] = useState([]);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('/admin/users', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setUsers(res.data));

    axios.get('/admin/cards', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setCards(res.data));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Admin Dashboard</h2>

      <h3 className="text-lg font-semibold mt-4">Users</h3>
      <ul className="list-disc ml-6">
        {users.map(user => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ul>

      <h3 className="text-lg font-semibold mt-4">Cards</h3>
      <ul className="list-disc ml-6">
        {cards.map(card => (
          <li key={card.id}>{card.name} (User ID: {card.userId})</li>
        ))}
      </ul>
    </div>
  );
}