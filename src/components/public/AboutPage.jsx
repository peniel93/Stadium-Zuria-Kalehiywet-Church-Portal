import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Cross, Heart, Users, BookOpen, ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';

export const AboutPage = () => {
  const { db } = useAuth();
  const { t, language } = useLanguage();
  const settings = db?.site_settings || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', paddingBottom: '4rem' }}>
      
      {/* About Banner */}
      <section className="card" style={{
        backgroundColor: 'var(--primary-light-blue)',
        borderColor: 'var(--accent-blue)',
        padding: '2rem 1rem',
        textAlign: 'center'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary-blue)',
          color: '#ffffff',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem'
        }}>
          <Cross size={32} />
        </div>

        <h1 style={{ fontSize: 'clamp(1.25rem, 5vw, 2.25rem)', fontWeight: 800, color: 'var(--primary-dark-blue)', marginBottom: '1rem' }}>
          {language === 'am' ? 'ስለ ስታዲየም ዙሪያ ቃለ ሕይወት ቤተ ክርስቲያን' : 'About Stadium Zuria Kalehiywet Church'}
        </h1>

        <p style={{ fontSize: '1.0625rem', maxWidth: '800px', margin: '0 auto', lineHeight: 1.7, color: 'var(--text-main)' }}>
          {settings.about_description || 'Stadium Zuria Kalehiywet Church is a vibrant Christian community dedicated to spreading the Gospel, discipling believers, serving families, and empowering youth, mothers, and fathers through structured leadership and community outreach.'}
        </p>
      </section>

      {/* Core Mission & Pillars */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '1.5rem' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: 'var(--primary-blue)' }}>
            <BookOpen size={24} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Biblical Teaching</h3>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
            Rooted in scripture, our education teams (Timihirt & Menfesawi Zerf) provide structured discipleship for adults, youth, and children across all Medeb Sefer zones.
          </p>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: '#166534' }}>
            <Heart size={24} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Evangelism & Outreach</h3>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
            Our Evangelists and Missionaries actively share the Gospel locally and internationally, offering hope, healing, counseling, and material support to those in need.
          </p>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: '#854d0e' }}>
            <Users size={24} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Medeb Sefer Fellowship</h3>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
            Over 50 Medeb Sefer cell groups across 5 main zones (Maremiya, Kutir-1, Memeheran, Muya & Technique, Stadium Zuria) foster close fellowship and mutual care.
          </p>
        </div>
      </section>

      {/* Church Administration Structure */}
      <section className="card">
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--primary-blue)' }}>
          Portal Administration & Structure
        </h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          The portal system coordinates 44 specialized leadership roles, including the Main Registrar, Senior Church Pastor, Fathers' Leaders (FCL), Mothers' Leaders (MCL), Youth Leaders (YL), Store Managers, Accountants, Teachers, Guardians, and professional zerf departments.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 130px), 1fr))', gap: '1rem', textAlign: 'center' }}>
          <div style={{ backgroundColor: 'var(--primary-light-blue)', padding: '1.25rem', borderRadius: '8px' }}>
            <h4 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-blue)' }}>44</h4>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Portal Dashboards</span>
          </div>

          <div style={{ backgroundColor: 'var(--primary-light-blue)', padding: '1.25rem', borderRadius: '8px' }}>
            <h4 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-blue)' }}>5</h4>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Medeb Sefer Zones</span>
          </div>

          <div style={{ backgroundColor: 'var(--primary-light-blue)', padding: '1.25rem', borderRadius: '8px' }}>
            <h4 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-blue)' }}>50</h4>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Sub-Medeb Cell Groups</span>
          </div>

          <div style={{ backgroundColor: 'var(--primary-light-blue)', padding: '1.25rem', borderRadius: '8px' }}>
            <h4 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-blue)' }}>100%</h4>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Digital Record Management</span>
          </div>
        </div>
      </section>

    </div>
  );
};
