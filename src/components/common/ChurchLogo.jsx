import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Cross } from 'lucide-react';

export const ChurchLogo = ({ size = 42, iconSize = 22, style = {} }) => {
  const { db } = useAuth();
  const [imgError, setImgError] = useState(false);
  const logoUrl = db?.site_settings?.logo_url;

  useEffect(() => {
    setImgError(false);
  }, [logoUrl]);

  const isValidLogo = Boolean(
    !imgError && logoUrl && (logoUrl.startsWith('http://') || logoUrl.startsWith('https://') || logoUrl.startsWith('data:image/'))
  );

  if (isValidLogo) {
    return (
      <div style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '10px',
        overflow: 'hidden',
        backgroundColor: '#ffffff',
        border: '1px solid var(--border-color)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        ...style
      }}>
        <img
          src={logoUrl}
          alt="Church Logo"
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return (
    <div style={{
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '10px',
      backgroundColor: 'var(--primary-blue)',
      color: '#ffffff',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 800,
      flexShrink: 0,
      ...style
    }}>
      <Cross size={iconSize} />
    </div>
  );
};
