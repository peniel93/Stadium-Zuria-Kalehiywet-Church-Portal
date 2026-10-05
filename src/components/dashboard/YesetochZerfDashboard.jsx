import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/ToastAlert';
import { getMockDB, saveMockDB } from '../../lib/supabase';
import { Users, UserPlus, Send, FileText, CheckCircle2, Megaphone } from 'lucide-react';

export const YesetochZerfDashboard = () => {
  const { db, refreshDB } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('members');

  const ladies = db?.ladies_zerf_members || [
    { id: '1', name: 'Sister Tigist Alemu', full_name: 'Sister Tigist Alemu', phone: '+251911223344', phone_number: '+251911223344', medeb_zone: 'Stadium_Zuria', role: 'Ladies Program Coordinator' },
    { id: '2', name: 'Sister Martha Bekele', full_name: 'Sister Martha Bekele', phone: '+251911556677', phone_number: '+251911556677', medeb_zone: 'Kutir_1', role: 'Intercessor' }
  ];

  const [ladyForm, setLadyForm] = useState({ name: '', phone: '', medeb_zone: 'Stadium_Zuria', role: 'Participant' });

  const handleAddLady = (e) => {
    e.preventDefault();
    if (!ladyForm.name) return;
    const freshDb = getMockDB();
    if (!freshDb.ladies_zerf_members) freshDb.ladies_zerf_members = [];
    const newL = {
      id: `lz-${Date.now()}`,
      name: ladyForm.name,
      full_name: ladyForm.name,
      phone: ladyForm.phone || '+251 911 000 000',
      phone_number: ladyForm.phone || '+251 911 000 000',
      medeb_zone: ladyForm.medeb_zone,
      role: ladyForm.role,
      created_at: new Date().toISOString()
    };
    freshDb.ladies_zerf_members.unshift(newL);
    saveMockDB(freshDb);
    refreshDB();
    showToast(`Registered ${ladyForm.name} in Yesetoch Zerf and saved to Database!`, "success");
    setLadyForm({ name: '', phone: '', medeb_zone: 'Stadium_Zuria', role: 'Participant' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--primary-blue)' }}>
            Yesetoch Zerf (Ladies Department) Dashboard
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Register ladies program participants, receive & approve Ladies Medeb Sefer reports, and send annual plans to Pastor.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={() => setActiveTab('members')} className={`btn ${activeTab === 'members' ? 'btn-primary' : 'btn-secondary'}`}>
            <Users size={16} />
            <span>Ladies Directory</span>
          </button>

          <button onClick={() => setActiveTab('report')} className={`btn ${activeTab === 'report' ? 'btn-primary' : 'btn-secondary'}`}>
            <Send size={16} />
            <span>Submit Yearly Plan</span>
          </button>
        </div>
      </div>

      {activeTab === 'members' && (
        <div className="card">
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--primary-blue)' }}>
            Yesetoch Zerf Participants Directory
          </h3>

          <form onSubmit={handleAddLady} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem', backgroundColor: 'var(--primary-light-blue)', padding: '1.25rem', borderRadius: '8px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Full Name *</label>
              <input type="text" required className="form-control" value={ladyForm.name} onChange={e => setLadyForm({ ...ladyForm, name: e.target.value })} />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Phone Number</label>
              <input type="text" className="form-control" value={ladyForm.phone} onChange={e => setLadyForm({ ...ladyForm, phone: e.target.value })} />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Medeb Sefer Zone</label>
              <select className="form-control" value={ladyForm.medeb_zone} onChange={e => setLadyForm({ ...ladyForm, medeb_zone: e.target.value })}>
                <option value="Stadium_Zuria">Stadium Zuria</option>
                <option value="Kutir_1">Kutir-1</option>
                <option value="Maremiya">Maremiya</option>
                <option value="Memeheran">Memeheran</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                <UserPlus size={16} />
                <span>Register Lady</span>
              </button>
            </div>
          </form>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Role</th>
                  <th>Medeb Sefer Zone</th>
                  <th>Phone Number</th>
                </tr>
              </thead>
              <tbody>
                {ladies.map(l => (
                  <tr key={l.id}>
                    <td><strong>{l.name}</strong></td>
                    <td><span className="badge badge-success">{l.role}</span></td>
                    <td><span className="badge badge-warning">{l.medeb_zone}</span></td>
                    <td>{l.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
