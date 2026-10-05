import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { ChurchLogo } from '../common/ChurchLogo';
import {
  Phone, Mail, MapPin, Globe,
  Facebook, Youtube, Instagram, Send, ExternalLink, ChevronRight,
  Landmark, CreditCard, Copy, Check, Clock, Calendar
} from 'lucide-react';

export const Footer = ({ onNavigate, onOpenLogin }) => {
  const { db } = useAuth();
  const { t, language } = useLanguage();
  const settings = db?.site_settings || {};
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleFooterClick = (navId) => {
    onNavigate(navId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyAccount = (accNum, idx) => {
    if (!accNum) return;
    navigator.clipboard.writeText(accNum);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Collect active church bank accounts from site settings (Up to 8 accounts)
  const activeBankAccounts = [];
  for (let i = 1; i <= 8; i++) {
    const bName = settings[`bank_${i}_name`]?.trim();
    const bAcc = settings[`bank_${i}_account`]?.trim();
    const bPurpose = settings[`bank_${i}_purpose`]?.trim();
    if (bName || bAcc) {
      activeBankAccounts.push({
        num: i,
        name: bName || `Church Bank Account #${i}`,
        account: bAcc || 'N/A',
        purpose: bPurpose || ''
      });
    }
  }

  // Collect active weekly church programs from site settings (Up to 10 programs)
  const activeWeeklyPrograms = [];
  for (let i = 1; i <= 10; i++) {
    const progText = settings[`weekly_program_${i}`]?.trim();
    if (progText) {
      activeWeeklyPrograms.push({
        num: i,
        content: progText
      });
    }
  }

  return (
    <footer style={{
      backgroundColor: 'var(--bg-card)',
      borderTop: '1px solid var(--border-color)',
      paddingTop: '3.5rem',
      paddingBottom: '2.5rem',
      marginTop: '4rem',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div className="container">

        {/* --- Dynamic Church Bank Accounts Display Section --- */}
        {activeBankAccounts.length > 0 && (
          <div style={{
            backgroundColor: 'var(--bg-secondary, rgba(0, 51, 102, 0.03))',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.75rem',
            marginBottom: '3rem',
            boxShadow: 'var(--shadow-xs)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--primary-light-blue)',
                  color: 'var(--primary-blue)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Landmark size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-blue)', margin: 0, lineHeight: 1.2 }}>
                    Church Bank Accounts & Offerings / የቤተክርስቲያን ባንክ ሂሳቦች
                  </h4>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0, marginTop: '0.15rem' }}>
                    Official church bank account numbers for tithes, offerings, and donations
                  </p>
                </div>
              </div>
              <span className="badge badge-primary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}>
                {activeBankAccounts.length} Bank Account{activeBankAccounts.length > 1 ? 's' : ''} Listed
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 240px), 1fr))',
              gap: '1rem'
            }}>
              {activeBankAccounts.map((acc, idx) => (
                <div key={`footer-bank-${acc.num}`} style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  boxShadow: 'var(--shadow-xs)'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--primary-blue)', marginBottom: '0.35rem' }}>
                      <CreditCard size={15} />
                      <span>{acc.name}</span>
                    </div>
                    <div style={{
                      fontFamily: 'monospace',
                      fontSize: '1.05rem',
                      fontWeight: 800,
                      color: 'var(--text-main)',
                      letterSpacing: '0.5px',
                      backgroundColor: 'var(--bg-secondary)',
                      padding: '0.4rem 0.625rem',
                      borderRadius: '6px',
                      border: '1px solid var(--border-color)',
                      wordBreak: 'break-all'
                    }}>
                      {acc.account}
                    </div>
                    {acc.purpose && (
                      <div style={{
                        fontSize: '0.78125rem',
                        color: 'var(--primary-blue)',
                        fontWeight: 600,
                        marginTop: '0.4rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        backgroundColor: 'var(--primary-light-blue)',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px'
                      }}>
                        <span>🎯 Purpose: {acc.purpose}</span>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopyAccount(acc.account, idx)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: '0.4rem 0.625rem',
                      borderRadius: '6px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: copiedIndex === idx ? 'var(--primary-light-blue)' : 'var(--bg-secondary)',
                      color: copiedIndex === idx ? 'var(--primary-blue)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check size={14} style={{ color: 'var(--primary-blue)' }} />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Copy Account Number</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- Dynamic Weekly Church Programs Schedule Display Section --- */}
        {activeWeeklyPrograms.length > 0 && (
          <div style={{
            backgroundColor: 'var(--bg-secondary, rgba(0, 51, 102, 0.03))',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.75rem',
            marginBottom: '3rem',
            boxShadow: 'var(--shadow-xs)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--primary-light-blue)',
                  color: 'var(--primary-blue)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Calendar size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-blue)', margin: 0, lineHeight: 1.2 }}>
                    Weekly Church Services & Program Schedule / የሳምንቱ ፕሮግራሞች
                  </h4>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0, marginTop: '0.15rem' }}>
                    Official weekly fellowship meetings, worship services, and prayer gatherings
                  </p>
                </div>
              </div>
              <span className="badge badge-primary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}>
                {activeWeeklyPrograms.length} Weekly Program{activeWeeklyPrograms.length > 1 ? 's' : ''} Listed
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 240px), 1fr))',
              gap: '0.875rem'
            }}>
              {activeWeeklyPrograms.map((prog) => (
                <div key={`footer-program-${prog.num}`} style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.875rem 1rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.625rem',
                  boxShadow: 'var(--shadow-xs)'
                }}>
                  <Clock size={16} style={{ color: 'var(--primary-blue)', flexShrink: 0, marginTop: '0.2rem' }} />
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: 1.4 }}>
                    {prog.content}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          
          {/* Column 1: Church Brand & Mission */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => handleFooterClick('home')}>
              <ChurchLogo size={42} iconSize={22} />
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--primary-blue)', lineHeight: 1.2 }}>
                  {settings.site_title || 'SKHC PORTAL'}
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Stadium Zuria Kalehiywet Church
                </p>
              </div>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              {settings.about_description || 'Serving our congregation with faith, integrity, discipleship, and modern administration across 44 specialized portal dashboards.'}
            </p>
          </div>

          {/* Column 2: Quick Navigation Links */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--primary-blue)' }}>
              Quick Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              <li>
                <button onClick={() => handleFooterClick('home')} className="footer-nav-link" aria-label="Navigate to Home">
                  <ChevronRight size={15} style={{ flexShrink: 0 }} />
                  <span>{t('home')}</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleFooterClick('about')} className="footer-nav-link" aria-label="Navigate to About Us">
                  <ChevronRight size={15} style={{ flexShrink: 0 }} />
                  <span>About SKHC Church</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleFooterClick('announcements')} className="footer-nav-link" aria-label="Navigate to Announcements">
                  <ChevronRight size={15} style={{ flexShrink: 0 }} />
                  <span>Announcements & Notices</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleFooterClick('gallery')} className="footer-nav-link" aria-label="Navigate to Gallery">
                  <ChevronRight size={15} style={{ flexShrink: 0 }} />
                  <span>Gallery & Church Moments</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleFooterClick('vacancies')} className="footer-nav-link" aria-label="Navigate to Vacancies">
                  <ChevronRight size={15} style={{ flexShrink: 0 }} />
                  <span>{t('job_vacancies')}</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleFooterClick('exam-results')} className="footer-nav-link" aria-label="Navigate to Exam Results">
                  <ChevronRight size={15} style={{ flexShrink: 0 }} />
                  <span>Exam & Interview Results</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleFooterClick('contact')} className="footer-nav-link" aria-label="Navigate to Contact Us">
                  <ChevronRight size={15} style={{ flexShrink: 0 }} />
                  <span>Contact Us</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info & Map Link */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--primary-blue)' }}>
              Church Contact Info
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem' }}>
                <MapPin size={18} style={{ color: 'var(--primary-blue)', flexShrink: 0, marginTop: '0.15rem' }} />
                <span>{settings.contact_address || 'Stadium Zuria, Kirkos Sub-City, Woreda 02, Addis Ababa, Ethiopia'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <Phone size={18} style={{ color: 'var(--primary-blue)', flexShrink: 0 }} />
                <span>{settings.contact_phone || '+251 11 551 2345 / +251 911 000 001'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <Mail size={18} style={{ color: 'var(--primary-blue)', flexShrink: 0 }} />
                <span>{settings.contact_email || 'info@skhc.org'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <Clock size={18} style={{ color: 'var(--primary-blue)', flexShrink: 0 }} />
                <span><strong>Working Hours:</strong> {settings.office_hours || 'Mon - Sat: 8:30 AM - 5:30 PM | Sun: 8:00 AM - 1:00 PM'}</span>
              </div>

              {/* Google Maps Quick Link */}
              <div style={{ marginTop: '0.25rem' }}>
                <a
                  href={settings.google_map_embed_url || 'https://maps.google.com/?q=Stadium+Zuria+Kalehiywet+Church+Addis+Ababa'}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--primary-blue)',
                    textDecoration: 'none'
                  }}
                >
                  <span>📍 Open Church on Google Maps</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>

          {/* Column 4: Official Social Media Icons */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--primary-blue)' }}>
              Connect With Us
            </h4>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Follow our official church social channels for live streaming, sermons, and moments.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {/* Facebook */}
              <a
                href={settings.facebook_url || "https://facebook.com"}
                target="_blank"
                rel="noreferrer"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#1877f2',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 5px rgba(24,119,242,0.3)',
                  transition: 'transform 0.2s'
                }}
                title="SKHC Official Facebook"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              {/* YouTube */}
              <a
                href={settings.youtube_url || "https://youtube.com"}
                target="_blank"
                rel="noreferrer"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#ff0000',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 5px rgba(255,0,0,0.3)'
                }}
                title="SKHC Live YouTube Channel"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>

              {/* Instagram */}
              <a
                href={settings.instagram_url || "https://instagram.com"}
                target="_blank"
                rel="noreferrer"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%,#d6249f 60%,#285AEB 90%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 5px rgba(214,36,159,0.3)'
                }}
                title="SKHC Instagram Feed"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href={settings.whatsapp_url || "https://whatsapp.com"}
                target="_blank"
                rel="noreferrer"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#25d366',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 5px rgba(37,211,102,0.3)'
                }}
                title="SKHC Official WhatsApp Group"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
              </a>

              {/* TikTok */}
              <a
                href={settings.tiktok_url || "https://tiktok.com"}
                target="_blank"
                rel="noreferrer"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.4)'
                }}
                title="SKHC TikTok Channel"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-2.84V7.63a6.34 6.34 0 0 0-5.18 6.18A6.34 6.34 0 0 0 10.64 20a6.34 6.34 0 0 0 6.34-6.34V9a8.16 8.16 0 0 0 4.61 1.44V7a4.84 4.84 0 0 1-2-.31z"/>
                </svg>
              </a>

              {/* X / Twitter */}
              <a
                href={settings.twitter_url || "https://twitter.com"}
                target="_blank"
                rel="noreferrer"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 5px rgba(15,23,42,0.3)'
                }}
                title="SKHC X (Twitter)"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>

              {/* Telegram */}
              <a
                href={settings.telegram_url || "https://t.me"}
                target="_blank"
                rel="noreferrer"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#0088cc',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 5px rgba(0,136,204,0.3)'
                }}
                title="SKHC Telegram Channel"
              >
                <Send size={17} />
              </a>
            </div>

            <button
              onClick={onOpenLogin}
              className="btn btn-secondary btn-sm"
              style={{ marginTop: '1.25rem', width: '100%' }}
            >
              <span>{t('login')}</span>
              <ExternalLink size={14} />
            </button>
          </div>

        </div>

        <div style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '1.5rem',
          textAlign: 'center',
          fontSize: '0.8125rem',
          color: 'var(--text-muted)'
        }}>
          <p>© {settings.copyright_year || 2026} {settings.copyright_description || 'Stadium Zuria Kalehiywet Church. All rights reserved.'}</p>
        </div>
      </div>
    </footer>
  );
};
