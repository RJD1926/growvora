import React from 'react';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

const ConfirmModal = ({
  isOpen,
  title = 'Confirm Deletion',
  message = 'Are you sure you want to delete this record? This action cannot be undone.',
  confirmText = 'Delete Record',
  cancelText = 'Cancel',
  isDanger = true,
  onConfirm,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="admin-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className="admin-modal-container admin-confirm-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="admin-modal-header">
          <div className="confirm-icon-badge">
            <FiAlertTriangle />
          </div>
          <div className="confirm-header-text">
            <h3>{title}</h3>
            <p className="confirm-sub">{message}</p>
          </div>
          <button 
            type="button" 
            className="modal-close-btn" 
            onClick={onClose}
            aria-label="Close dialog"
          >
            <FiX />
          </button>
        </div>

        <div className="admin-modal-actions">
          <button 
            type="button" 
            className="admin-btn admin-btn-secondary" 
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button 
            type="button" 
            className={`admin-btn ${isDanger ? 'admin-btn-danger' : 'admin-btn-primary'}`}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

