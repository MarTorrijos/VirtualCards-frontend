import React from 'react';
import { motion } from 'framer-motion';

export default function Card({ card }) {
  const getImagePath = () => {
    const type = card.type.toLowerCase(); // rock, paper, scissors
    const stage = card.evolutionStage;
    return new URL(`../assets/cards/${type}_evo_${stage}.png`, import.meta.url).href;
  };

  return (
    <motion.div
      className="card"
      style={{ backgroundImage: `url(${getImagePath()})` }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="card-header">
        {card.name} — {card.type}
      </div>
      <div className="card-footer">
        <div>HP: {card.currentHealth} / {card.maxHealth}</div>
        <div>Attack: {card.attack}</div>
        <div>XP: {card.xp}</div>
        <div>Stage: {card.evolutionStage}</div>
      </div>
    </motion.div>
  );
}
