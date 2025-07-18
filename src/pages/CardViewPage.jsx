import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

  const getImagePath = () => {
    if (!card?.type || card.evolutionStage == null) {
      console.warn('Card data incomplete:', card);
      return '';
    }
    const type = card.type.toLowerCase();
    const path = `/assets/cards/${type}_evo_${card.evolutionStage}.png`;
    console.log('Card image path:', path);
    return path;
  };

  if (!card) return <div>Loading...</div>;

  const imagePath = getImagePath();
  const imageAvailable = !!imagePath;

  return (
    <>
      <div className="background-darken-overlay" />
      <div className="bg-bottom-left" />
      <div className="bg-bottom-right" />
      <div className="card-view-page">
        <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
        <div
          className="card-large"
          style={{ backgroundImage: imageAvailable ? `url(${imagePath})` : 'none' }}
        >
          {!imageAvailable && (
            <div style={{ color: 'red', textAlign: 'center', marginTop: '2rem' }}>
              Image not available
            </div>
          )}
          <div className="card-header">{card.name}</div>
          <div className="card-footer">
            {card.type} | ATK: {card.attack} | HP: {card.currentHealth}/{card.maxHealth}
          </div>
        </div>
      </div>
    </>
  );
}
