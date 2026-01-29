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
    const id = Date.now();
    setToasts(prev => [...prev, { 
      id, 
      message, 
      type: 'confirm',
      onConfirm: () => {
        onConfirm?.();
        setToasts(prev => prev.filter(toast => toast.id !== id));
      },
      onCancel: () => {
        onCancel?.();
        setToasts(prev => prev.filter(toast => toast.id !== id));
      }
    }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, showConfirm, removeToast }}>
      {children}
      <div className="toast-container">
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const Toast = ({ id, message, type, onClose, onConfirm, onCancel }) => {
  if (type === 'confirm') {
    return (
      <div className={`toast toast-confirm`}>
        <div className="toast-message">{message}</div>
        <div className="toast-buttons">
          <button onClick={onConfirm} className="toast-btn toast-btn-ok">OK</button>
          <button onClick={onCancel} className="toast-btn toast-btn-cancel">Cancel</button>
        </div>
      </div>
    );
  }

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
