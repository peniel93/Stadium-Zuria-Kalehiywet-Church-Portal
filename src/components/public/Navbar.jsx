import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { ChurchLogo } from '../common/ChurchLogo';
import { Moon, Sun, Globe, Menu, X, LogIn, LogOut, LayoutDashboard, User } from 'lucide-react';

export const Navbar = ({ onOpenLogin, onOpenProfile, onNavigate, currentTab }) => {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const { currentUser, logout, db } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);

  const navItems = [
    { id: 'home', label: t('home') },
    { id: 'about', label: language === 'am' ? 'ስለ እኛ (About)' : 'About Us' },
    { id: 'announcements', label: language === 'am' ? 'ማስታወቂያዎች (Notices)' : 'Announcements' },
    { id: 'gallery', label: language === 'am' ? 'ጋለሪ እና ክስተቶች (Gallery)' : 'Gallery & Events' },
    { id: 'vacancies', label: t('vacancies') },
    { id: 'exam-results', label: t('exam_results') },
    { id: 'contact', label: language === 'am' ? 'ግንኙነት (Contact)' : 'Contact Us' }
  ];

  return (
    <header style={{
      backgroundColor: 'var(--bg-card)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '4rem',
        gap: '0.5rem'
      }}>
        {/* Church Brand & Logo */}
        <div className="header-brand-block" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', flex: 1, minWidth: 0 }} onClick={() => onNavigate('home')}>
          <ChurchLogo size={30} iconSize={15} />
          <div className="brand-text-container" style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
            <h1 className="brand-title" style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--primary-blue)', lineHeight: 1.15, margin: 0 }}>
              {db?.site_settings?.site_title || 'SKHC PORTAL'}
            </h1>
            <p className="brand-subtitle" style={{ fontSize: '0.625rem', color: 'var(--text-muted)', margin: 0, fontWeight: 600, lineHeight: 1.15, display: 'block', visibility: 'visible' }}>
              Stadium Zuria Kalehiywet Church
            </p>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }} className="desktop-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                background: 'none',
                border: 'none',
                fontWeight: currentTab === item.id ? 700 : 500,
                color: currentTab === item.id ? 'var(--primary-blue)' : 'var(--text-main)',
                cursor: 'pointer',
                fontSize: '0.8125rem',
                padding: '0.2rem 0.4rem',
                whiteSpace: 'nowrap'
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Header Right Actions: Always Visible Hamburger Menu */}
        <div className="header-right-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flexShrink: 0 }}>
          {/* Amharic / English Translator Button */}
          <button
            onClick={toggleLanguage}
            className="btn btn-secondary btn-sm desktop-only-action"
            style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem' }}
            title="Translate Language (Amharic <-> English)"
          >
            <Globe size={15} />
            <span>{language === 'en' ? 'አማርኛ' : 'English'}</span>
          </button>

          {/* Dark / Light Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="btn btn-secondary btn-sm desktop-only-action"
            style={{ padding: '0.3rem 0.5rem' }}
            title="Toggle Light / Dark Mode"
          >
            {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
          </button>

          {/* Unified Hamburger Menu Toggle Button */}
          <button
            onClick={toggleMobileMenu}
            className="btn btn-primary btn-sm mobile-hamburger-btn"
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, gap: '0.25rem', padding: '0.35rem 0.65rem', cursor: 'pointer' }}
            aria-label="Toggle Portal Menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Menu</span>
          </button>
        </div>
      </div>

      {/* Mobile Quick Navigation Ribbon (Always Visible & Horizontally Scrollable on Phone Screens) */}
      <nav
        className="mobile-nav-ribbon"
        style={{
          display: 'none',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          padding: '0.35rem 0.625rem',
          backgroundColor: 'var(--bg-card)',
          borderTop: '1px solid var(--border-color)',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <div style={{ display: 'inline-flex', gap: '0.375rem', alignItems: 'center' }}>
          <button
            onClick={toggleLanguage}
            style={{
              background: 'var(--primary-light-blue)',
              color: 'var(--primary-blue)',
              border: '1px solid var(--border-color)',
              borderRadius: '20px',
              fontWeight: 700,
              fontSize: '0.75rem',
              padding: '0.28rem 0.65rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            <Globe size={13} />
            <span>{language === 'en' ? 'አማርኛ' : 'English'}</span>
          </button>

          <button
            onClick={toggleTheme}
            style={{
              background: 'var(--primary-light-blue)',
              color: 'var(--primary-blue)',
              border: '1px solid var(--border-color)',
              borderRadius: '20px',
              fontWeight: 700,
              fontSize: '0.75rem',
              padding: '0.28rem 0.65rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            {theme === 'light' ? <Moon size={13} /> : <Sun size={13} />}
            <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
          </button>

          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{
                background: currentTab === item.id ? 'var(--primary-blue)' : 'var(--primary-light-blue)',
                color: currentTab === item.id ? '#ffffff' : 'var(--primary-blue)',
                border: 'none',
                borderRadius: '20px',
                fontWeight: currentTab === item.id ? 700 : 600,
                fontSize: '0.75rem',
                padding: '0.28rem 0.75rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                transition: 'all 0.2s ease',
                boxShadow: currentTab === item.id ? '0 2px 5px rgba(0, 102, 204, 0.25)' : 'none'
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Slide-Over Drawer Navigation & Dashboard / Auth Controls */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          display: 'flex'
        }}>
          {/* Backdrop Overlay */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(4px)'
            }}
          />

          {/* Drawer Slide-In Panel */}
          <div style={{
            position: 'relative',
            marginLeft: 'auto',
            width: '88%',
            maxWidth: '340px',
            height: '100%',
            backgroundColor: 'var(--bg-card)',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1001,
            padding: '1.5rem 1.25rem'
          }}>
            {/* Drawer Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '1rem',
              borderBottom: '1px solid var(--border-color)',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ChurchLogo size={32} iconSize={18} />
                <span style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--primary-blue)' }}>
                  SKHC PORTAL MENU
                </span>
              </div>

              <button
                onClick={() => setMobileMenuOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={22} />
              </button>
            </div>

            {/* User Profile Card (If Authenticated) */}
            {currentUser && (
              <div style={{
                backgroundColor: 'var(--primary-light-blue)',
                padding: '0.875rem',
                borderRadius: '10px',
                marginBottom: '1rem',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    backgroundColor: '#fff',
                    border: '2px solid var(--primary-blue)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {currentUser.profile_picture_url || currentUser.avatar_url ? (
                      <img src={currentUser.profile_picture_url || currentUser.avatar_url} alt="User Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <User size={22} style={{ color: 'var(--primary-blue)' }} />
                    )}
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 800, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {currentUser.full_name}
                    </h4>
                    <span className="badge badge-success" style={{ fontSize: '0.6875rem' }}>
                      {currentUser.role}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onOpenProfile) onOpenProfile();
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1, fontSize: '0.75rem' }}
                  >
                    <User size={14} />
                    <span>My Profile</span>
                  </button>
                </div>
              </div>
            )}

            {/* Portal Action Buttons (Dashboard, Login, Signout) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
              {currentUser ? (
                <>
                  <button
                    onClick={() => {
                      onNavigate('dashboard');
                      setMobileMenuOpen(false);
                    }}
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                  >
                    <LayoutDashboard size={16} />
                    <span>{t('dashboard')}</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      logout();
                      onNavigate('home');
                      setMobileMenuOpen(false);
                    }}
                    className="btn btn-danger"
                    style={{ width: '100%' }}
                  >
                    <LogOut size={16} />
                    <span>{t('logout')}</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenLogin();
                  }}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  <LogIn size={16} />
                  <span>{t('login')}</span>
                </button>
              )}
            </div>

            {/* Navigation Links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', flex: 1, overflowY: 'auto' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Main Pages
              </span>
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '0.625rem 0.875rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: currentTab === item.id ? 'var(--primary-light-blue)' : 'transparent',
                    color: currentTab === item.id ? 'var(--primary-blue)' : 'var(--text-main)',
                    fontWeight: currentTab === item.id ? 700 : 500,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

          </div>
        </div>
      )}
    </header>
  );
};
