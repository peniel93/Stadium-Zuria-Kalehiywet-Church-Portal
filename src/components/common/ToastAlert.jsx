import React, { createContext, useContext, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={{
        position: 'fixed',
        top: '1.25rem',
        right: '1.25rem',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        maxWidth: '420px',
        width: 'calc(100% - 2.5rem)'
      }}>
        {toasts.map((toast) => {
          let bg = '#dcfce7';
          let border = '#86efac';
          let text = '#166534';
          let Icon = CheckCircle2;

          if (toast.type === 'error' || toast.type === 'danger') {
            bg = '#fee2e2';
            border = '#fca5a5';
            text = '#991b1b';
            Icon = XCircle;
          } else if (toast.type === 'warning') {
            bg = '#fef9c3';
            border = '#fde047';
            text = '#854d0e';
            Icon = AlertCircle;
          } else if (toast.type === 'info') {
            bg = '#e0f2fe';
            border = '#7dd3fc';
            text = '#075985';
            Icon = Info;
          }

          return (
            <div key={toast.id} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
              backgroundColor: bg,
              border: `1px solid ${border}`,
              color: text,
              padding: '0.875rem 1rem',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              fontWeight: 500,
              fontSize: '0.9375rem',
              animation: 'slideIn 0.3s ease-out'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <Icon size={20} />
                <span>{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: text,
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

// Standalone Inline Bootstrap-style Alert Banner Component
export const AlertBanner = ({ type = 'info', title, message, onClose }) => {
  let bg = '#e0f2fe';
  let border = '#7dd3fc';
  let text = '#075985';
  let Icon = Info;

  if (type === 'success') {
    bg = '#dcfce7';
    border = '#86efac';
    text = '#166534';
    Icon = CheckCircle2;
  } else if (type === 'danger' || type === 'error') {
    bg = '#fee2e2';
    border = '#fca5a5';
    text = '#991b1b';
    Icon = XCircle;
  } else if (type === 'warning') {
    bg = '#fef9c3';
    border = '#fde047';
    text = '#854d0e';
    Icon = AlertCircle;
  }

  return (
    <div style={{
      backgroundColor: bg,
      border: `1px solid ${border}`,
      color: text,
      padding: '1rem',
      borderRadius: '8px',
      marginBottom: '1.25rem',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: '1rem'
    }}>
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <Icon size={22} style={{ marginTop: '2px', flexShrink: 0 }} />
        <div>
          {title && <h5 style={{ fontWeight: 700, marginBottom: '0.25rem', fontSize: '0.9375rem' }}>{title}</h5>}
          <div style={{ fontSize: '0.875rem' }}>{message}</div>
        </div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: text, cursor: 'pointer' }}
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};
