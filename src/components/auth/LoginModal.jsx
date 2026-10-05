import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/ToastAlert';
import { ChurchLogo } from '../common/ChurchLogo';
import { X, LogIn, Lock, Shield, KeyRound, CheckCircle2 } from 'lucide-react';

export const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const { login, updatePIN } = useAuth();
  const { showToast } = useToast();

  const [usernameId, setUsernameId] = useState('');
  const [pin, setPin] = useState('');
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  const [pendingUser, setPendingUser] = useState(null);

  if (!isOpen) return null;

  const handleSubmitLogin = (e) => {
    e.preventDefault();
    if (!usernameId || !pin) {
      showToast("Please enter both your Username ID and 4-Digit PIN.", "error");
      return;
    }

    const res = login(usernameId, pin);
    if (!res.success) {
      showToast(res.message, "error");
      return;
    }

    setPendingUser(res.user);
    showToast(`Welcome back, ${res.user.full_name}!`, "success");
    if (!res.pinChanged) {
      setIsChangingPin(true);
    } else {
      onClose();
      if (onLoginSuccess) onLoginSuccess(res.user);
    }
  };

  const handleSaveNewPIN = (e) => {
    e.preventDefault();
    if (newPin.length !== 4 || isNaN(newPin)) {
      showToast("PIN must be exactly a 4-digit number (e.g. 4892).", "error");
      return;
    }
    if (newPin !== confirmPin) {
      showToast("PIN confirmation does not match.", "error");
      return;
    }

    updatePIN(newPin);
    showToast("4-Digit PIN password updated successfully!", "success");
    setIsChangingPin(false);
    onClose();
    if (onLoginSuccess) onLoginSuccess(pendingUser);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.7)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div className="card" style={{
        maxWidth: '460px',
        width: '100%',
        boxShadow: 'var(--shadow-md)',
        position: 'relative'
      }}>
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        {!isChangingPin ? (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ marginBottom: '0.75rem' }}>
                <ChurchLogo size={48} iconSize={24} />
              </div>
              <h3 style={{ fontSize: '1.375rem', fontWeight: 800 }}>Portal Admin Login</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Format: <code>SKHC/Role_name/4-digit-id/year_of_creation</code>
              </p>
            </div>

            <form onSubmit={handleSubmitLogin}>
              <div className="form-group">
                <label className="form-label">Username ID (Role ID)</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. SKHC/Pastor/0002/2026"
                  value={usernameId}
                  onChange={(e) => setUsernameId(e.target.value)}
                />
                <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  Demo Admins: <code>SKHC/MainRegistrar/0001/2026</code> or <code>SKHC/Pastor/0002/2026</code>
                </small>
              </div>

              <div className="form-group">
                <label className="form-label">4-Digit Password / PIN</label>
                <input
                  type="password"
                  required
                  maxLength={4}
                  className="form-control"
                  placeholder="Default PIN: 1234"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                />
              </div>

              <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
                <button
                  type="button"
                  onClick={() => showToast("Forgot Password PIN? Please contact the Main Registrar to reset your account PIN.", "info")}
                  style={{ background: 'none', border: 'none', color: 'var(--primary-blue)', fontSize: '0.8125rem', cursor: 'pointer', fontWeight: 600 }}
                >
                  Forgot PIN / Password?
                </button>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                <LogIn size={18} />
                <span>Sign In To Dashboard</span>
              </button>
            </form>
          </div>
        ) : (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#fef9c3',
                color: '#854d0e',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.75rem'
              }}>
                <KeyRound size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Update 4-Digit Password PIN</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                You are currently using the default PIN. Please set a new 4-digit PIN for your account.
              </p>
            </div>

            <form onSubmit={handleSaveNewPIN}>
              <div className="form-group">
                <label className="form-label">New 4-Digit PIN</label>
                <input
                  type="password"
                  required
                  maxLength={4}
                  className="form-control"
                  placeholder="e.g. 4892"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New 4-Digit PIN</label>
                <input
                  type="password"
                  required
                  maxLength={4}
                  className="form-control"
                  placeholder="e.g. 4892"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                <CheckCircle2 size={18} />
                <span>Save New PIN & Continue</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
