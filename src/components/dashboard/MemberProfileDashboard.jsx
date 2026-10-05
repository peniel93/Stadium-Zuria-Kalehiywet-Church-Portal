import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/ToastAlert';
import { getMockDB, saveMockDB } from '../../lib/supabase';
import {
  User, KeyRound, Megaphone, FileText, Download, Send, Heart, CheckCircle2, ShieldCheck, Copy
} from 'lucide-react';

export const MemberProfileDashboard = () => {
  const { currentUser, db, updatePIN, updateUserProfile, refreshDB } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);

  const [newPin, setNewPin] = useState('');
  const [testimonyContent, setTestimonyContent] = useState('');

  const [profileForm, setProfileForm] = useState(() => ({
    full_name: currentUser?.full_name || '',
    email: currentUser?.email || '',
    phone_number: currentUser?.phone_number || '',
    occupation: currentUser?.occupation || 'Government Employee',
    region: currentUser?.region || 'Addis Ababa',
    kebele: currentUser?.kebele || '02',
    medeb_zone: currentUser?.medeb_zone || 'Stadium_Zuria',
    medib_number: currentUser?.medib_number || 'Medib-1'
  }));

  const handleCopyCredentials = () => {
    const text = `SKHC Member Credentials:\nUsername ID: ${currentUser?.username_id}\nPIN Password: ${currentUser?.default_pin}`;
    navigator.clipboard.writeText(text);
    showToast("Member login credentials copied to clipboard!", "success");
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateUserProfile(currentUser.id, profileForm);
    showToast("Your member profile details have been updated successfully!", "success");
    setIsEditing(false);
  };

  const handleChangePin = (e) => {
    e.preventDefault();
    if (newPin.length !== 4 || isNaN(newPin)) {
      showToast("PIN password must be exactly 4 numeric digits.", "error");
      return;
    }
    updatePIN(newPin);
    showToast("Your 4-digit PIN password has been updated successfully!", "success");
    setNewPin('');
  };

  const handlePostTestimony = (e) => {
    e.preventDefault();
    if (!testimonyContent) return;
    const freshDb = getMockDB();
    if (!freshDb.member_testimonies_and_prayers) freshDb.member_testimonies_and_prayers = [];
    freshDb.member_testimonies_and_prayers.unshift({
      id: `tst-${Date.now()}`,
      member_id: currentUser?.id,
      member_name: currentUser?.full_name || 'Church Member',
      content: testimonyContent,
      status: 'Submitted',
      created_at: new Date().toISOString()
    });
    saveMockDB(freshDb);
    refreshDB();
    showToast("Your testimony / prayer request has been saved to Database and sent to Pastoral Care Team!", "success");
    setTestimonyContent('');
  };

  const announcements = db?.portal_announcements || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header Banner */}
      <div className="card" style={{ backgroundColor: 'var(--primary-light-blue)', borderLeft: '4px solid var(--primary-blue)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="badge badge-success" style={{ marginBottom: '0.25rem' }}>Church Member Profile Portal</span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-blue)' }}>
              Welcome, {currentUser?.full_name || 'Church Member'}!
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Username ID: <code style={{ fontWeight: 700, color: 'var(--primary-blue)' }}>{currentUser?.username_id || 'SKHC/Member/0039/2026'}</code> | Zone: {currentUser?.medeb_zone || 'Stadium Zuria'}
            </p>
          </div>

          <button onClick={handleCopyCredentials} className="btn btn-primary btn-sm">
            <Copy size={16} />
            <span>Copy My Login Credentials</span>
          </button>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="card no-print" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button onClick={() => setActiveTab('profile')} className={`btn ${activeTab === 'profile' ? 'btn-primary' : 'btn-secondary'}`}>
          <User size={16} />
          <span>My Profile & Credentials</span>
        </button>

        <button onClick={() => setActiveTab('announcements')} className={`btn ${activeTab === 'announcements' ? 'btn-primary' : 'btn-secondary'}`}>
          <Megaphone size={16} />
          <span>Church Notices & Moments Feed</span>
        </button>

        <button onClick={() => setActiveTab('resources')} className={`btn ${activeTab === 'resources' ? 'btn-primary' : 'btn-secondary'}`}>
          <Download size={16} />
          <span>Download Resources</span>
        </button>

        <button onClick={() => setActiveTab('testimony')} className={`btn ${activeTab === 'testimony' ? 'btn-primary' : 'btn-secondary'}`}>
          <Heart size={16} />
          <span>Post Prayer / Testimony</span>
        </button>
      </div>

      {/* TAB 1: Member Profile & Security Credentials */}
      {activeTab === 'profile' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-blue)' }}>
                Member Demographic Profile
              </h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="btn btn-secondary btn-sm"
              >
                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
              </button>
            </div>

            {/* Profile Avatar View & Upload Picker */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                overflow: 'hidden',
                backgroundColor: 'var(--primary-light-blue)',
                border: '2px solid var(--primary-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {currentUser?.profile_picture_url || currentUser?.avatar_url ? (
                  <img src={currentUser.profile_picture_url || currentUser.avatar_url} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <User size={32} style={{ color: 'var(--primary-blue)' }} />
                )}
              </div>

              <div>
                <span className="badge badge-success" style={{ marginBottom: '0.25rem' }}>{currentUser?.role || 'Member'}</span>
                <label className="btn btn-secondary btn-sm" style={{ display: 'block', cursor: 'pointer', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  Upload Profile Picture
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        updateUserProfile(currentUser.id, { profile_picture_url: event.target.result });
                        showToast("Profile picture updated and saved to database!", "success");
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                </label>
              </div>
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveProfile}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={profileForm.full_name}
                    onChange={e => setProfileForm({ ...profileForm, full_name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={profileForm.phone_number}
                    onChange={e => setProfileForm({ ...profileForm, phone_number: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    value={profileForm.email}
                    onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Occupation</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profileForm.occupation}
                    onChange={e => setProfileForm({ ...profileForm, occupation: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Medeb Zone & Sub-Division</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profileForm.medeb_zone}
                    onChange={e => setProfileForm({ ...profileForm, medeb_zone: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                  <CheckCircle2 size={16} />
                  <span>Save Profile Updates</span>
                </button>
              </form>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', fontSize: '0.9375rem' }}>
                <div>
                  <small style={{ color: 'var(--text-muted)' }}>Full Name</small>
                  <p style={{ fontWeight: 700 }}>{currentUser?.full_name}</p>
                </div>

                <div>
                  <small style={{ color: 'var(--text-muted)' }}>Email Address</small>
                  <p>{currentUser?.email || 'N/A'}</p>
                </div>

                <div>
                  <small style={{ color: 'var(--text-muted)' }}>Phone Number</small>
                  <p>{currentUser?.phone_number || '+251 911 000 000'}</p>
                </div>

                <div>
                  <small style={{ color: 'var(--text-muted)' }}>Occupation</small>
                  <p><span className="badge badge-success">{currentUser?.occupation || 'Government Employee'}</span></p>
                </div>

                <div>
                  <small style={{ color: 'var(--text-muted)' }}>Medeb Sefer Zone & Sub-Division</small>
                  <p><span className="badge badge-warning">{currentUser?.medeb_zone || 'Stadium_Zuria'} - {currentUser?.medib_number || 'Medib-1'}</span></p>
                </div>
              </div>
            )}
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--primary-blue)' }}>
              Login Credentials & PIN Change
            </h3>

            <div style={{ backgroundColor: 'var(--primary-light-blue)', padding: '1rem', borderRadius: '8px', marginBottom: '1.25rem' }}>
              <small style={{ color: 'var(--text-muted)' }}>Your Username ID</small>
              <h4 style={{ color: 'var(--primary-blue)', fontWeight: 800, marginBottom: '0.5rem' }}>{currentUser?.username_id}</h4>

              <small style={{ color: 'var(--text-muted)' }}>Your Current 4-Digit Password PIN</small>
              <h4 style={{ color: 'var(--primary-blue)', fontWeight: 800 }}>{currentUser?.default_pin || '1234'}</h4>
            </div>

            <form onSubmit={handleChangePin}>
              <div className="form-group">
                <label className="form-label">New 4-Digit PIN Password</label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  className="form-control"
                  placeholder="Enter new 4-digit PIN..."
                  value={newPin}
                  onChange={e => setNewPin(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                <KeyRound size={16} />
                <span>Update Password PIN</span>
              </button>
            </form>
          </div>

        </div>
      )}

      {/* TAB 2: Church Announcements Feed */}
      {activeTab === 'announcements' && (
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--primary-blue)' }}>
            Official Church Notices & Moments Feed
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {announcements.map(ann => (
              <div key={ann.id} style={{ borderLeft: '4px solid var(--primary-blue)', padding: '1.25rem', backgroundColor: 'var(--bg-main)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span className="badge badge-warning">Posted by: {ann.posted_by_role}</span>
                  <small style={{ color: 'var(--text-muted)' }}>Date: {ann.created_at}</small>
                </div>
                <h4 style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: '0.5rem' }}>{ann.title}</h4>
                <p style={{ fontSize: '0.9375rem', color: 'var(--text-main)', lineHeight: 1.6, marginBottom: ann.media_url ? '1rem' : 0 }}>
                  {ann.content}
                </p>

                {/* Render Media Attachment (Image or Video) */}
                {ann.media_url && (
                  <div style={{ marginTop: '0.75rem', borderRadius: '8px', overflow: 'hidden', maxHeight: '350px' }}>
                    {ann.media_type === 'video' ? (
                      <video src={ann.media_url} controls style={{ width: '100%', maxHeight: '350px', borderRadius: '8px' }} />
                    ) : (
                      <img src={ann.media_url} alt={ann.title} style={{ width: '100%', maxHeight: '350px', objectFit: 'cover', borderRadius: '8px' }} />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Downloadable Resources */}
      {activeTab === 'resources' && (
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--primary-blue)' }}>
            Downloadable Member Resources & Teaching Guides
          </h3>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Resource Title</th>
                  <th>Category</th>
                  <th>Format</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Pre-Marital Counselling & Covenant Guide</strong></td>
                  <td>Counselling Team</td>
                  <td><span className="badge badge-warning">PDF</span></td>
                  <td>
                    <button onClick={() => showToast("Downloading Pre-Marital Counselling Guide...", "info")} className="btn btn-primary btn-sm">
                      <Download size={14} />
                      <span>Download PDF</span>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td><strong>New Believers Foundation Course 2026</strong></td>
                  <td>Education & Training (ETTL)</td>
                  <td><span className="badge badge-warning">Word</span></td>
                  <td>
                    <button onClick={() => showToast("Downloading New Believers Course...", "info")} className="btn btn-primary btn-sm">
                      <Download size={14} />
                      <span>Download DOCX</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Post Testimony / Prayer Request */}
      {activeTab === 'testimony' && (
        <div className="card" style={{ maxWidth: '650px', margin: '0 auto', width: '100%' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--primary-blue)' }}>
            Submit Testimony or Prayer Request
          </h3>

          <form onSubmit={handlePostTestimony}>
            <div className="form-group">
              <label className="form-label">Your Testimony / Prayer Request Details</label>
              <textarea
                rows={5}
                required
                className="form-control"
                placeholder="Share your spiritual testimony, prayer request, or reflection with church leaders..."
                value={testimonyContent}
                onChange={e => setTestimonyContent(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <Send size={16} />
              <span>Submit to Pastoral Team</span>
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
