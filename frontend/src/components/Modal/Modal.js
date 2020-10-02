import React from 'react';
import './modal.css';

const Modal = ({
  title,
  children,
  onCancel = () => {},
  onConfirm = () => {},
  canCancel = true,
  canConfirm = true,
  cancelText = 'Cancel',
  confirmText = 'Confirm'
}) => (
  <div className="backdrop">
    <div className="modal">
      <header className="modal-header">
        <h1>{title}</h1>
      </header>
      <section className="modal-content">{children}</section>
      <section className="modal-actions">
        {canCancel && (
          <button className="btn" onClick={onCancel}>
            {cancelText}
          </button>
        )}
        {canConfirm && (
          <button className="btn" onClick={onConfirm}>
            {confirmText}
          </button>
        )}
      </section>
    </div>
  </div>
);

export default Modal;
