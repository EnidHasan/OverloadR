import React, { createContext, useContext, useState, useCallback } from 'react';
import '../styles/Toast.css';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState(null);

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    
    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
      }, duration);
    }
    
    return id;
  }, []);

  const showConfirm = useCallback((message, onConfirm, onCancel) => {
    console.log('📢 showConfirm CALLED with message:', message)
    setConfirmDialog({
      message,
      onConfirm: () => {
        console.log('✅ User clicked OK on confirmation')
        onConfirm?.();
        setConfirmDialog(null);
      },
      onCancel: () => {
        console.log('❌ User clicked Cancel on confirmation')
        onCancel?.();
        setConfirmDialog(null);
      }
    });
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, showConfirm, removeToast }}>
      {children}
      
      {/* Confirm Dialog Modal */}
      {confirmDialog && (
        <div className="confirm-overlay">
          <div className="confirm-modal">
            <div className="confirm-message">{confirmDialog.message}</div>
            <div className="confirm-buttons">
              <button onClick={confirmDialog.onConfirm} className="confirm-btn confirm-btn-ok">
                OK
              </button>
              <button onClick={confirmDialog.onCancel} className="confirm-btn confirm-btn-cancel">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const Toast = ({ id, message, type, onClose, onConfirm, onCancel }) => {
  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-icon">
        {type === 'success' && '✓'}
        {type === 'error' && '✕'}
        {type === 'warning' && '⚠'}
        {type === 'info' && 'ℹ'}
      </div>
      <div className="toast-message">{message}</div>
      <button onClick={onClose} className="toast-close">×</button>
    </div>
  );
};
