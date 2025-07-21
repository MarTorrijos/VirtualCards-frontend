import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import './BattlePage.css';

export default function BattlePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [playerCard, setPlayerCard] = useState(null);
  const [opponentCard, setOpponentCard] = useState(null);
  const [logLines, setLogLines] = useState([]);
  const [visibleLogs, setVisibleLogs] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8080/battle/${id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setPlayerCard(data.updatedCard);
        setOpponentCard(data.opponentCard);
        setLogLines(data.events);
      })
      .catch(err => {
        alert('Battle failed: ' + err.message);
        navigate('/dashboard');
      });
  }, [id, navigate]);

  useEffect(() => {
    if (!logLines.length) return;
    let index = 0;
    const interval = setInterval(() => {
      setVisibleLogs(logs => [...logs, logLines[index]]);
      index++;
      if (index === logLines.length) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [logLines]);

  return (
    <div className="page">
      <div className="background-darken-overlay" />
      <div className="battle-page">
        <div className="card-zone">
          {playerCard && <Card card={playerCard} size="large" />}
          {opponentCard && <Card card={opponentCard} size="large" />}
        </div>

        <div className="log-zone">
          <h2>Battle Log</h2>
          <div className="log-lines">
            {visibleLogs.map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </div>

          {visibleLogs.length === logLines.length && (
            <button className="back-button" onClick={() => navigate('/dashboard')}>
              ← Back to Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
