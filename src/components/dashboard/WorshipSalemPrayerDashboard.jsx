import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/ToastAlert';
import { getMockDB, saveMockDB } from '../../lib/supabase';
import { Sparkles, Heart, Send, Calendar, PlusCircle, CheckCircle2, UserPlus } from 'lucide-react';

export const WorshipSalemPrayerDashboard = ({ teamTitle = "Worship Team Dashboard" }) => {
  const { db, refreshDB } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('roster');

  const members = db?.worship_team_members || [
    { id: '1', name: 'Brother Dawit Alemu', full_name: 'Brother Dawit Alemu', role: 'Lead Vocalist / Guitarist', phone: '+251911443322', phone_number: '+251911443322' },
    { id: '2', name: 'Sister Bethlehem Markos', full_name: 'Sister Bethlehem Markos', role: 'Prayer Leader', phone: '+251911556677', phone_number: '+251911556677' }
  ];

  const [memForm, setMemForm] = useState({ name: '', role: '', phone: '' });

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!memForm.name) {
      showToast("Member Name is required", "error");
      return;
    }
    const freshDb = getMockDB();
    if (!freshDb.worship_team_members) freshDb.worship_team_members = [];
    const newM = {
      id: `wm-${Date.now()}`,
      name: memForm.name,
      full_name: memForm.name,
      role: memForm.role || 'Member',
      phone: memForm.phone || '+251 911 000 000',
      phone_number: memForm.phone || '+251 911 000 000',
      created_at: new Date().toISOString()
    };
    freshDb.worship_team_members.unshift(newM);
    saveMockDB(freshDb);
    refreshDB();
    showToast(`Added ${memForm.name} to ${teamTitle} in Database!`, "success");
    setMemForm({ name: '', role: '', phone: '' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--primary-blue)' }}>
            {teamTitle}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Manage team members, schedule service rotas, post moments & video/image galleries, and report to Menfesawi Zerf & Pastor.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={() => setActiveTab('roster')} className={`btn ${activeTab === 'roster' ? 'btn-primary' : 'btn-secondary'}`}>
            <Sparkles size={16} />
            <span>Team Members & Roster</span>
          </button>

          <button onClick={() => setActiveTab('report')} className={`btn ${activeTab === 'report' ? 'btn-primary' : 'btn-secondary'}`}>
            <Send size={16} />
            <span>Report to Pastor & Zerf</span>
          </button>
        </div>
      </div>

      {activeTab === 'roster' && (
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--primary-blue)' }}>
            Team Roster & Members
          </h3>

          <form onSubmit={handleAddMember} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem', backgroundColor: 'var(--primary-light-blue)', padding: '1.25rem', borderRadius: '8px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Full Name *</label>
              <input type="text" required className="form-control" value={memForm.name} onChange={e => setMemForm({ ...memForm, name: e.target.value })} />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Role in Team</label>
              <input type="text" className="form-control" placeholder="e.g. Vocalist, Intercessor, Servant" value={memForm.role} onChange={e => setMemForm({ ...memForm, role: e.target.value })} />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Phone Number</label>
              <input type="text" className="form-control" value={memForm.phone} onChange={e => setMemForm({ ...memForm, phone: e.target.value })} />
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                <UserPlus size={16} />
                <span>Add Team Member</span>
              </button>
            </div>
          </form>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Member Name</th>
                  <th>Role</th>
                  <th>Phone Number</th>
                </tr>
              </thead>
              <tbody>
                {members.map(m => (
                  <tr key={m.id}>
                    <td><strong>{m.name}</strong></td>
                    <td><span className="badge badge-success">{m.role}</span></td>
                    <td>{m.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'report' && (
        <div className="card" style={{ maxWidth: '650px', margin: '0 auto', width: '100%' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--primary-blue)' }}>
            Submit Accomplishment & Plan Report
          </h3>
          <form onSubmit={(e) => {
            e.preventDefault();
            const titleVal = e.target.elements[0].value;
            const summaryVal = e.target.elements[1].value;
            const freshDb = getMockDB();
            if (!freshDb.leadership_reports_inbox) freshDb.leadership_reports_inbox = [];
            freshDb.leadership_reports_inbox.unshift({
              id: `rep-${Date.now()}`,
              title: titleVal,
              report_title: titleVal,
              role: teamTitle,
              sender_role: 'WorshipLeader',
              recipient_role: 'Pastor',
              accomplishments_summary: summaryVal,
              created_at: new Date().toISOString()
            });
            saveMockDB(freshDb);
            refreshDB();
            showToast(`Report from ${teamTitle} submitted to Pastor & saved to Database!`, "success");
            e.target.reset();
          }}>
            <div className="form-group">
              <label className="form-label">Report Title *</label>
              <input type="text" required className="form-control" placeholder="e.g. Monthly Accomplishments & Prayer Plans" />
            </div>

            <div className="form-group">
              <label className="form-label">Accomplishments & Next Plans</label>
              <textarea rows={4} required className="form-control" placeholder="Detail service accomplishments, attendance, and future plans..." />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <Send size={16} />
              <span>Submit Report to Pastor & Zerf</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
