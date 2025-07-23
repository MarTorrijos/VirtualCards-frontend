import React from 'react';
import './Modal.css';

export default function Modal({ isOpen, title, message, onConfirm, onCancel, confirmText = "OK", cancelText = "Cancel" }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        {title && <h3 className="modal-title">{title}</h3>}
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          {onCancel && <button className="modal-button cancel" onClick={onCancel}>{cancelText}</button>}
          {onConfirm && <button className="modal-button confirm" onClick={onConfirm}>{confirmText}</button>}
        </div>
      </div>
    </div>
  );
}
