import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import './CardViewPage.css';

export default function CardViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [card, setCard] = useState(null);

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

  if (!card) return <div>Loading...</div>;

  return (
    <>
      <div className="background-darken-overlay" />
      <div className="bg-bottom-left" />
      <div className="bg-bottom-right" />
      <div className="card-view-page">
        <button className="back-button" onClick={() => navigate(-1)}>← Back</button>

        <div className="card-wrapper">
          <Card card={card} size="large" />
          <div className="card-actions">
            <button className="action-button">Upgrade health</button>
            <button className="action-button">Upgrade attack</button>
            <button className="action-button">Battle</button>
          </div>
        </div>
      </div>
    </>
  );
}
