import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CardViewPage.css';

export default function CardViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [card, setCard] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8080/cards/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then((res) => res.json())
      .then(setCard)
      .catch((err) => {
        console.error(err);
        alert('Failed to load card');
      });
  }, [id]);

  const getImagePath = () => {
    const type = card?.type?.toLowerCase();
    const stage = card?.evolutionStage;
    return `/assets/cards/${type}_evo_${stage}.png`;
  };

  if (!card) return <div>Loading...</div>;

  return (
    <>
      <div className="bg-bottom-left" />
      <div className="bg-bottom-right" />
      <div className="card-view-page">
        <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
        <div className="card-large" style={{ backgroundImage: `url(${getImagePath()})` }}>
          <div className="card-header">{card.name}</div>
          <div className="card-footer">
            {card.type} | ATK: {card.attack} | HP: {card.currentHealth}/{card.maxHealth}
          </div>
        </div>
      </div>
    </>
  );
}
