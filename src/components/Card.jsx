import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './Card.css';

export default function Card({ card, clickable = false, size = 'small' }) {
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
      className={`card ${clickable ? 'clickable' : ''} ${size}`}
      whileHover={clickable ? { scale: 1.1 } : {}}
      transition={{ duration: 0 }}
      onClick={handleClick}
      style={{ backgroundImage: `url(${getImagePath()})` }}
    >
      <div className="card-header">{card.name}</div>
      <div className="card-footer">
        Stage {card.evolutionStage}<br />
        {card.currentHealth !== undefined && card.maxHealth !== undefined ? (
          <>HP {card.currentHealth} / {card.maxHealth}<br /></>
        ) : card.health !== undefined ? (
          <>HP {card.health} / {card.health}<br /></>
        ) : null}
        ATK {card.attack}<br />
        {card.xp !== undefined && <>XP {card.xp}<br /></>}
      </div>
    </motion.div>
  );
}
