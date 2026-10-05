import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Megaphone, Calendar, UserCheck, ShieldCheck } from 'lucide-react';

export const AnnouncementsPage = () => {
  const { db } = useAuth();
  const announcements = db?.portal_announcements || [
    {
      id: '1',
      title: 'Sunday Morning Special Worship & Communion Service',
      content: 'All church members, leaders, and cell groups are warmly invited for this Sunday morning service with Senior Pastor Bekele Solomon.',
      posted_by_role: 'Pastor',
      created_at: '2026-07-26',
      expiry_date: '2026-08-05'
    },
    {
      id: '2',
      title: 'Children Teachers & Yelijoch Zerf Training Workshop',
      content: 'Education & Training Team (ETTL) will hold a mandatory curriculum orientation for all age group teachers this Saturday at 10:00 AM.',
      posted_by_role: 'ETTL',
      created_at: '2026-07-24',
      expiry_date: '2026-08-10'
    },
    {
      id: '3',
      title: 'Store Inventory & Asset Audit Notice',
      content: 'Church Store Managers (CSM) request all department heads to submit updated equipment listings for annual inventory audit.',
      posted_by_role: 'CSM',
      created_at: '2026-07-20',
      expiry_date: '2026-08-15'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '4rem' }}>
      
      <div className="card" style={{ textAlign: 'center', backgroundColor: 'var(--primary-light-blue)', padding: '2.5rem' }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary-blue)',
          color: '#ffffff',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '0.75rem'
        }}>
          <Megaphone size={28} />
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-blue)', marginBottom: '0.5rem' }}>
          Church Announcements & Notices
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
          Official updates posted by Main Registrar, Pastor, Fathers Leaders, and Zerf Departments.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {announcements.map(ann => (
          <div key={ann.id} className="card" style={{ borderLeft: '4px solid var(--primary-blue)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span className="badge badge-warning">Posted by: {ann.posted_by_role}</span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Posted Date: {ann.created_at} | Expires: {ann.expiry_date}
              </span>
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>{ann.title}</h3>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-main)', lineHeight: 1.6, marginBottom: ann.media_url ? '1rem' : 0 }}>
              {ann.content}
            </p>

            {/* Render Media Attachment (Image or Video) */}
            {ann.media_url && (
              <div style={{ marginTop: '0.75rem', borderRadius: '8px', overflow: 'hidden', maxHeight: '400px' }}>
                {ann.media_type === 'video' ? (
                  <video src={ann.media_url} controls style={{ width: '100%', maxHeight: '400px', borderRadius: '8px' }} />
                ) : (
                  <img src={ann.media_url} alt={ann.title} style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px' }} />
                )}
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};
