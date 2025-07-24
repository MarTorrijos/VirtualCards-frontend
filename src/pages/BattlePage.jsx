import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import './BattlePage.css';

export default function BattlePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [playerCard, setPlayerCard] = useState(null);
  const [opponentCard, setOpponentCard] = useState(null);
  const [initialLines, setInitialLines] = useState([]);
  const [logLines, setLogLines] = useState([]);
  const [visibleLogs, setVisibleLogs] = useState([]);
  const [attacker, setAttacker] = useState(null);
  const [showIntroPopup, setShowIntroPopup] = useState(false);

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

        const [first, second, ...rest] = data.events;

        const match = first.match(/^Opponent card generated: (.+)$/);
        const cardInfo = match ? match[1] : '';
        setInitialLines([
          'Opponent card generated:',
          cardInfo,
          'Battle starts!',
          second.replace('Battle starts!', '').trim(),
        ]);
        setLogLines(rest);
        setShowIntroPopup(true);
      })
      .catch(err => {
        alert('Battle failed: ' + err.message);
        navigate('/dashboard');
      });
  }, [id, navigate]);

  useEffect(() => {
    if (!logLines.length || showIntroPopup) return;
    let index = 0;
    const interval = setInterval(() => {
      const line = logLines[index];
      setVisibleLogs(logs => [...logs, line]);

      if (line.includes('attacks')) {
        const isPlayer = line.startsWith(playerCard?.name);
        setAttacker(isPlayer ? 'player' : 'opponent');
        setTimeout(() => setAttacker(null), 300);
      }

      index++;
      if (index === logLines.length) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [logLines, playerCard, showIntroPopup]);

  const handlePopupConfirm = () => {
    setShowIntroPopup(false);
  };

  return (
    <>
      <div className={`bg-bottom-left ${showIntroPopup ? 'blurred' : ''}`} />
      <div className={`bg-bottom-right ${showIntroPopup ? 'blurred' : ''}`} />

      <div className={`page ${showIntroPopup ? 'blurred' : ''}`}>
        <div className="background-darken-overlay" />
        <div className="battle-page">
          <div className="card-zone">
            <div className={`card-container ${attacker === 'player' ? 'attack' : ''} ${attacker === 'opponent' ? 'hit' : ''}`} style={{ position: 'relative' }}>
              {playerCard && <Card card={playerCard} size="large" />}
            </div>
            <div className={`card-container ${attacker === 'opponent' ? 'attack' : ''} ${attacker === 'player' ? 'hit' : ''}`} style={{ position: 'relative' }}>
              {opponentCard && <Card card={opponentCard} size="large" isOpponent />}
            </div>
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

      {showIntroPopup && (
        <div className="intro-popup-overlay">
          <div className="intro-popup">
            {initialLines.map((line, idx) =>
              idx === 2 ? (
                <p key={idx}><strong>{line}</strong></p>
              ) : (
                <p key={idx}>{line}</p>
              )
            )}
            <button className="start-button" onClick={handlePopupConfirm}>Start Battle</button>
          </div>
        </div>
      )}
    </>
  );
}
