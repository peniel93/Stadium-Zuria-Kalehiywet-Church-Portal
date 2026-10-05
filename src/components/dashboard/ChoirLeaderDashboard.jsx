import React, { useState } from 'react';
import { useToast } from '../common/ToastAlert';
import { Sparkles, Users, UserPlus, Megaphone, Send, Calendar, CheckCircle2, Music } from 'lucide-react';

export const ChoirLeaderDashboard = ({ choirTitle = "Choir Leader & Sub-Choirs Dashboard" }) => {
  const { db, refreshDB } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('subchoirs');

  const subChoirs = db?.sub_choirs || [
    { id: 'c-1', name: 'Eftah Choir', leader: 'Deacon Yohannes Alemu', members_count: 45, service_schedule: 'Sunday Morning Main Service' },
    { id: 'c-2', name: 'Johanan Choir', leader: 'Sister Martha Bekele', members_count: 38, service_schedule: 'Sunday Evening Service' },
    { id: 'c-3', name: 'Elroe Choir', leader: 'Brother Caleb Markos', members_count: 32, service_schedule: 'Friday Night Chapel' },
    { id: 'c-4', name: 'Temer Choir', leader: 'Sister Rachel Daniel', members_count: 28, service_schedule: 'Youth Fellowship Service' }
  ];

  const members = db?.choir_members || [
    { id: 'm-1', name: 'Brother Samuel Tesfaye', choir: 'Eftah Choir', voice: 'Tenor', phone: '+251911443322' },
    { id: 'm-2', name: 'Sister Eden Desta', choir: 'Johanan Choir', voice: 'Soprano', phone: '+251911556677' }
  ];

  const announcements = db?.choir_announcements || [
    { id: 'a-1', title: 'Choir Vocal Training Workshop', date: '2026-08-01', choir: 'All Choirs', content: 'Vocal warm-up and multi-part harmony training session.' }
  ];

  const [memForm, setMemForm] = useState({ name: '', choir: 'Eftah Choir', voice: 'Soprano', phone: '' });
  const [annForm, setAnnForm] = useState({ title: '', choir: 'All Choirs', content: '' });

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!memForm.name) return;
    const freshDb = getMockDB();
    if (!freshDb.choir_members) freshDb.choir_members = [];
    const newM = {
      id: `cm-${Date.now()}`,
      name: memForm.name,
      full_name: memForm.name,
      choir: memForm.choir,
      choir_name: memForm.choir,
      voice: memForm.voice,
      vocal_part: memForm.voice,
      phone: memForm.phone || '+251 911 000 000',
      phone_number: memForm.phone || '+251 911 000 000'
    };
    freshDb.choir_members.unshift(newM);
    saveMockDB(freshDb);
    refreshDB();
    showToast(`Added ${memForm.name} to ${memForm.choir} in Database!`, "success");
    setMemForm({ name: '', choir: 'Eftah Choir', voice: 'Soprano', phone: '' });
  };

  const handlePostAnnouncement = (e) => {
    e.preventDefault();
    if (!annForm.title) return;
    const freshDb = getMockDB();
    if (!freshDb.choir_announcements) freshDb.choir_announcements = [];
    const newA = {
      id: `ca-${Date.now()}`,
      title: annForm.title,
      choir: annForm.choir,
      target_choir: annForm.choir,
      content: annForm.content,
      date: new Date().toISOString().slice(0, 10),
      date_posted: new Date().toISOString().slice(0, 10)
    };
    freshDb.choir_announcements.unshift(newA);
    saveMockDB(freshDb);
    refreshDB();
    showToast(`Service update announced to ${annForm.choir} and saved to Database!`, "success");
    setAnnForm({ title: '', choir: 'All Choirs', content: '' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--primary-blue)' }}>
            {choirTitle}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Manage sub-choirs (Eftah, Johanan, Elroe, Temer), add choir members, announce service updates, and post trainings.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={() => setActiveTab('subchoirs')} className={`btn ${activeTab === 'subchoirs' ? 'btn-primary' : 'btn-secondary'}`}>
            <Music size={16} />
            <span>Sub-Choirs Overview</span>
          </button>

          <button onClick={() => setActiveTab('members')} className={`btn ${activeTab === 'members' ? 'btn-primary' : 'btn-secondary'}`}>
            <Users size={16} />
            <span>Choir Members</span>
          </button>

          <button onClick={() => setActiveTab('announcements')} className={`btn ${activeTab === 'announcements' ? 'btn-primary' : 'btn-secondary'}`}>
            <Megaphone size={16} />
            <span>Announce Services & Trainings</span>
          </button>
        </div>
      </div>

      {activeTab === 'subchoirs' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
          {subChoirs.map(c => (
            <div key={c.id} className="card" style={{ borderLeft: '4px solid var(--primary-blue)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800 }}>{c.name}</h3>
                <span className="badge badge-success">{c.members_count} Members</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Assigned Leader: <strong>{c.leader}</strong></p>
              <p style={{ fontSize: '0.8125rem', color: 'var(--primary-blue)', marginTop: '0.5rem', fontWeight: 600 }}>
                Schedule: {c.service_schedule}
              </p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'members' && (
        <div className="card">
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--primary-blue)' }}>
            Choir Members Directory & Vocal Parts
          </h3>

          <form onSubmit={handleAddMember} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem', backgroundColor: 'var(--primary-light-blue)', padding: '1.25rem', borderRadius: '8px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Full Name *</label>
              <input type="text" required className="form-control" value={memForm.name} onChange={e => setMemForm({ ...memForm, name: e.target.value })} />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Sub-Choir</label>
              <select className="form-control" value={memForm.choir} onChange={e => setMemForm({ ...memForm, choir: e.target.value })}>
                <option value="Eftah Choir">Eftah Choir</option>
                <option value="Johanan Choir">Johanan Choir</option>
                <option value="Elroe Choir">Elroe Choir</option>
                <option value="Temer Choir">Temer Choir</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Vocal Part</label>
              <select className="form-control" value={memForm.voice} onChange={e => setMemForm({ ...memForm, voice: e.target.value })}>
                <option value="Soprano">Soprano</option>
                <option value="Alto">Alto</option>
                <option value="Tenor">Tenor</option>
                <option value="Bass">Bass</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                <UserPlus size={16} />
                <span>Add Choir Member</span>
              </button>
            </div>
          </form>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Member Name</th>
                  <th>Sub-Choir</th>
                  <th>Vocal Part</th>
                  <th>Phone Number</th>
                </tr>
              </thead>
              <tbody>
                {members.map(m => (
                  <tr key={m.id}>
                    <td><strong>{m.name}</strong></td>
                    <td><span className="badge badge-success">{m.choir}</span></td>
                    <td><span className="badge badge-warning">{m.voice}</span></td>
                    <td>{m.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'announcements' && (
        <div className="card" style={{ maxWidth: '650px', margin: '0 auto', width: '100%' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--primary-blue)' }}>
            Announce Choir Services & Post Training Sessions
          </h3>

          <form onSubmit={handlePostAnnouncement}>
            <div className="form-group">
              <label className="form-label">Announcement / Training Title *</label>
              <input type="text" required className="form-control" value={annForm.title} onChange={e => setAnnForm({ ...annForm, title: e.target.value })} />
            </div>

            <div className="form-group">
              <label className="form-label">Target Sub-Choir</label>
              <select className="form-control" value={annForm.choir} onChange={e => setAnnForm({ ...annForm, choir: e.target.value })}>
                <option value="All Choirs">All Choirs</option>
                <option value="Eftah Choir">Eftah Choir</option>
                <option value="Johanan Choir">Johanan Choir</option>
                <option value="Elroe Choir">Elroe Choir</option>
                <option value="Temer Choir">Temer Choir</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Details & Service Instructions</label>
              <textarea rows={3} required className="form-control" value={annForm.content} onChange={e => setAnnForm({ ...annForm, content: e.target.value })} />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <Megaphone size={16} />
              <span>Post Announcement</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
