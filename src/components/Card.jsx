import React from 'react';
import { motion } from 'framer-motion';
import rockImage from '../assets/cards/rock_evo_1.png';

export default function Card({ card }) {
  return (
    <motion.div
      className="card"
      style={{ backgroundImage: `url(${rockImage})` }} // TODO: make this dynamic if needed
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
