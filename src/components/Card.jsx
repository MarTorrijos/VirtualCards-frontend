import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Card({ card, clickable = false }) {
  const navigate = useNavigate();

  const getImagePath = () => {
    const type = card.type.toLowerCase();
    const stage = card.evolutionStage;
    return new URL(`../assets/cards/${type}_evo_${stage}.png`, import.meta.url).href;
  };

  const handleClick = () => {
    if (clickable) {
      navigate(`/cards/${card.id}`);
    }
  };

  return (
    <motion.div
      className="card"
      whileHover={clickable ? { scale: 1.1 } : {}}
      transition={{ duration: 0 }}
      onClick={handleClick}
      style={{
        backgroundImage: `url(${getImagePath()})`,
        cursor: clickable ? 'pointer' : 'default',
      }}
    >
      <div className="card-header">{card.name} — {card.type}</div>
      <div className="card-footer">
        <div>HP: {card.currentHealth} / {card.maxHealth}</div>
        <div>Attack: {card.attack}</div>
        <div>XP: {card.xp}</div>
        <div>Stage: {card.evolutionStage}</div>
      </div>
    </motion.div>
  );
}
