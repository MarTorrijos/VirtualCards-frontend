import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import './DashboardPage.css';

export default function DashboardPage() {
  const [cards, setCards] = useState([]);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    // Replace this with your actual backend fetch
    fetch('http://localhost:8080/cards', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then(setCards)
      .catch((err) => {
        console.error(err);
        alert('Failed to load cards');
      });
  }, []);

  return (
    <div className="page">
      <div className="dashboard-header">
        <h1>Your Cards</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>

      <div className="grid-cards">
        {cards.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}
