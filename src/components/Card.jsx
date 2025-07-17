import React from 'react';
import { motion } from 'framer-motion';

export default function Card({ card }) {
  const getImagePath = () => {
    const type = card.type.toLowerCase();
    const stage = card.evolutionStage;
    return new URL(`../assets/cards/${type}_evo_${stage}.png`, import.meta.url).href;
  };

  return (
    <motion.div
      className="card"
      whileHover={{ scale: 1.1 }}
      transition={{ duration: 0 }}
      style={{ backgroundImage: `url(${getImagePath()})` }}
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
