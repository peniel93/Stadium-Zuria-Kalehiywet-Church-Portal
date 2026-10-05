import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/ToastAlert';
import { getMockDB, saveMockDB } from '../../lib/supabase';
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock, Calendar } from 'lucide-react';

export const ContactPage = () => {
  const { db, refreshDB } = useAuth();
  const { showToast } = useToast();
  const settings = db?.site_settings || {};

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const freshDb = getMockDB();
    if (!freshDb.contact_messages) freshDb.contact_messages = [];
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender_name: contactForm.name,
      sender_email: contactForm.email,
      sender_phone: contactForm.phone,
      subject: contactForm.subject,
      message: contactForm.message,
      created_at: new Date().toISOString()
    };
    freshDb.contact_messages.unshift(newMsg);
    saveMockDB(freshDb);
    refreshDB();
    showToast("Thank you! Your message has been saved to Database and sent to the Church Registrar.", "success");
    setContactForm({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '4rem' }}>
      
      <div className="card" style={{ textAlign: 'center', backgroundColor: 'var(--primary-light-blue)', padding: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-blue)', marginBottom: '0.5rem' }}>
          Contact Stadium Zuria Kalehiywet Church
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
          Reach out to our Pastoral Care, Main Registrar, or Department Leaders.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '1.5rem' }}>
        
        {/* Contact Info & Google Map Embed Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-blue)' }}>Get In Touch</h3>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: '8px', backgroundColor: 'var(--primary-light-blue)', color: 'var(--primary-blue)' }}>
              <MapPin size={22} />
            </div>
            <div>
              <h5 style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Church Location</h5>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                {settings.contact_address || 'Stadium Zuria, Kirkos Sub-City, Woreda 02, Addis Ababa, Ethiopia'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: '8px', backgroundColor: 'var(--primary-light-blue)', color: 'var(--primary-blue)' }}>
              <Phone size={22} />
            </div>
            <div>
              <h5 style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Telephone Contact</h5>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                {settings.contact_phone || '+251 11 551 2345 / +251 911 000 001'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: '8px', backgroundColor: 'var(--primary-light-blue)', color: 'var(--primary-blue)' }}>
              <Mail size={22} />
            </div>
            <div>
              <h5 style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Email Address</h5>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                {settings.contact_email || 'info@skhc.org'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: '8px', backgroundColor: 'var(--primary-light-blue)', color: 'var(--primary-blue)' }}>
              <Clock size={22} />
            </div>
            <div>
              <h5 style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Official Working Hours</h5>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                {settings.office_hours || 'Mon - Sat: 8:30 AM - 5:30 PM | Sun: 8:00 AM - 1:00 PM'}
              </p>
            </div>
          </div>

          {/* Interactive Google Maps Embed */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <h5 style={{ fontWeight: 700, fontSize: '0.9375rem', marginBottom: '0.5rem', color: 'var(--primary-blue)' }}>
              Church Google Map Location
            </h5>
            <div style={{ height: '220px', width: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
              <iframe
                title="Church Location Map"
                src={settings.google_map_embed_url || 'https://maps.google.com/maps?q=Stadium+Zuria+Kalehiywet+Church+Addis+Ababa&t=&z=15&ie=UTF8&iwloc=&output=embed'}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        {/* Contact Form Card */}
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--primary-blue)' }}>
            Send Us a Message
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                required
                className="form-control"
                value={contactForm.name}
                onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={contactForm.email}
                  onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={contactForm.phone}
                  onChange={e => setContactForm({ ...contactForm, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Subject</label>
              <input
                type="text"
                className="form-control"
                value={contactForm.subject}
                onChange={e => setContactForm({ ...contactForm, subject: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Your Message *</label>
              <textarea
                rows={4}
                required
                className="form-control"
                value={contactForm.message}
                onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <Send size={16} />
              <span>Send Message</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
