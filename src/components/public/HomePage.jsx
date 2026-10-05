import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { BookOpen, Briefcase, Award, Users, FileText, ArrowRight, ShieldCheck, Heart, Calendar } from 'lucide-react';

export const HomePage = ({ onNavigate, onOpenLogin }) => {
  const { db } = useAuth();
  const { t, language } = useLanguage();

  const settings = db?.site_settings || {};
  const activeVerse = db?.daily_bible_verses?.[0] || {
    verse_text: 'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.',
    scripture_reference: 'Jeremiah 29:11'
  };
  const vacancies = db?.vacancies || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', paddingBottom: '4rem' }}>
      
      {/* Dynamic Hero Section */}
      <section style={{
        position: 'relative',
        minHeight: '340px',
        borderRadius: 'var(--radius-lg)',
        backgroundImage: `linear-gradient(rgba(0, 51, 102, 0.82), rgba(0, 102, 204, 0.75)), url(${settings.hero_background_url || 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1600&auto=format&fit=crop&q=80'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        textAlign: 'center',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{ maxWidth: '800px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(8px)',
            padding: '0.375rem 1rem',
            borderRadius: '9999px',
            fontSize: '0.875rem',
            fontWeight: 600,
            marginBottom: '1.25rem'
          }}>
            <ShieldCheck size={18} />
            <span>Official Portal System</span>
          </div>

          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            lineHeight: 1.2,
            marginBottom: '1rem'
          }}>
            {settings.site_title || 'Stadium Zuria Kalehiywet Church Portal System'}
          </h1>

          <p style={{
            fontSize: '1.125rem',
            opacity: 0.9,
            marginBottom: '2rem',
            lineHeight: 1.6
          }}>
            {settings.about_description || 'Serving our congregation with faith, integrity, discipleship, and modern administration. Explore vacancies, exam announcements, member directories, and multi-departmental dashboards.'}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => onNavigate('vacancies')}
              className="btn btn-primary"
              style={{ backgroundColor: '#ffffff', color: 'var(--primary-dark-blue)' }}
            >
              <Briefcase size={18} />
              <span>{t('job_vacancies')}</span>
            </button>

            <button
              onClick={() => onNavigate('exam-results')}
              className="btn btn-secondary"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.25)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.4)' }}
            >
              <Award size={18} />
              <span>{t('exam_results')}</span>
            </button>

            <button
              onClick={onOpenLogin}
              className="btn btn-secondary"
              style={{ backgroundColor: 'transparent', color: '#ffffff', border: '1px solid #ffffff' }}
            >
              <span>{t('login')}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Daily Bible Verse Banner */}
      <section className="card" style={{
        backgroundColor: 'var(--primary-light-blue)',
        borderColor: 'var(--accent-blue)',
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        padding: '1.75rem'
      }}>
        <div style={{
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary-blue)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <BookOpen size={28} />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-blue)', marginBottom: '0.25rem' }}>
            {language === 'am' ? 'የዕለቱ የመጽሐፍ ቅዱስ ቃል' : 'Daily Bible Scripture'}
          </h3>
          <p style={{ fontSize: '1.0625rem', fontStyle: 'italic', fontWeight: 500, color: 'var(--text-main)' }}>
            "{activeVerse.verse_text}"
          </p>
          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary-dark-blue)', marginTop: '0.25rem', display: 'block' }}>
            — {activeVerse.scripture_reference}
          </span>
        </div>
      </section>

      {/* Portal Highlights & Features */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '1.5rem' }}>
        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{
            width: '50px',
            height: '50px',
            margin: '0 auto 1rem auto',
            borderRadius: '12px',
            backgroundColor: 'var(--primary-light-blue)',
            color: 'var(--primary-blue)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Users size={26} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>44 Role Dashboards</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
            Integrated administration for Main Registrar, Pastors, Leaders, Medeb Sefers, Evangelists, Store Managers, Accountants, Teachers, and Zerf teams.
          </p>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{
            width: '50px',
            height: '50px',
            margin: '0 auto 1rem auto',
            borderRadius: '12px',
            backgroundColor: 'var(--primary-light-blue)',
            color: 'var(--primary-blue)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Briefcase size={26} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Vacancy & Recruitment</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
            Apply online with CV & credentials, track written exam announcements, and look up exam & interview scores.
          </p>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{
            width: '50px',
            height: '50px',
            margin: '0 auto 1rem auto',
            borderRadius: '12px',
            backgroundColor: 'var(--primary-light-blue)',
            color: 'var(--primary-blue)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FileText size={26} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Grades, Store & Financials</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
            Auto-calculate student grade ranks, manage church asset inventories, record expense ledgers, and export to CSV, PDF & Print.
          </p>
        </div>
      </section>

      {/* Active Job Vacancies Showcase */}
      <section className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.375rem', fontWeight: 700 }}>{t('job_vacancies')}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Open positions at Stadium Zuria Kalehiywet Church</p>
          </div>
          <button onClick={() => onNavigate('vacancies')} className="btn btn-secondary btn-sm">
            <span>View All Vacancies</span>
            <ArrowRight size={16} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '1rem' }}>
          {vacancies.map(vac => (
            <div key={vac.id} style={{
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1rem'
            }}>
              <div>
                <span className="badge badge-warning" style={{ marginBottom: '0.5rem' }}>{vac.job_type}</span>
                <h4 style={{ fontSize: '1.0625rem', fontWeight: 700, marginBottom: '0.25rem' }}>{vac.title}</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {vac.description}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                <span>Expires: {vac.expiry_date}</span>
                <button onClick={() => onNavigate('vacancies')} className="btn btn-primary btn-sm">
                  {t('apply_now')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
