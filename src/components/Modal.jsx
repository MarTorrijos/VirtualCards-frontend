import React, { useState, useEffect } from 'react';
import './Modal.css';

export default function Modal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  showInput = false
}) {
  const [localValue, setLocalValue] = useState('');

  useEffect(() => {
    if (isOpen) setLocalValue('');
  }, [isOpen]);

  const handleChange = (e) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      setLocalValue(val);
    }
  };

  const handleConfirm = () => {
    onConfirm(localValue);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2 className="modal-title">{title}</h2>
        <p className="modal-message">{message}</p>

        {showInput && (
          <input
            type="text"
            placeholder="Enter XP"
            value={localValue}
            onChange={handleChange}
            className="modal-input"
          />
        )}

        <div className="modal-buttons">
          <button className="btn red" onClick={handleConfirm}>Confirm</button>
          <button className="btn blue" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
