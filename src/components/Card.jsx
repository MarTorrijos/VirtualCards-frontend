import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './Card.css';

export default function Card({ card, clickable = false, size = 'small', isOpponent = false }) {
  const navigate = useNavigate();

  const getImagePath = () => {
    const type = card.type.toLowerCase();
    const stage = card.evolutionStage;
    return `/assets/cards/${type}_evo_${stage}.png`;
  };

  const handleClick = () => {
    if (clickable) navigate(`/cards/${card.id}`);
  };

  return (
    <motion.div
      className={`card ${clickable ? 'clickable' : ''} ${size} ${isOpponent ? 'opponent' : ''}`}
      whileHover={clickable ? { scale: 1.1 } : {}}
      transition={{ duration: 0 }}
      onClick={handleClick}
      style={{ backgroundImage: `url(${getImagePath()})` }}
    >
      <div className="card-header">{card.name}</div>
      <div className="card-footer">
        <div>Stage {card.evolutionStage}</div>
        {card.currentHealth !== undefined && card.maxHealth !== undefined ? (
          <div>HP {card.currentHealth} / {card.maxHealth}</div>
        ) : card.health !== undefined ? (
          <div>HP {card.health} / {card.health}</div>
        ) : null}
        <div>
          ATT {card.attack}
          {card.hasAdvantage && card.advantageBonus > 0 && (
            <span className="advantage-bonus"> + {card.advantageBonus}</span>
          )}
        </div>
        {card.xp !== undefined && <div>XP {card.xp}</div>}
      </div>
    </motion.div>
  );
}
