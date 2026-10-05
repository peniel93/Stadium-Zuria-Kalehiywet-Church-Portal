import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/ToastAlert';
import { getMockDB, saveMockDB } from '../../lib/supabase';
import { Globe, Users, UserPlus, Send, CheckCircle2, Heart, Award } from 'lucide-react';

export const OutreachDashboard = () => {
  const { db, refreshDB } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('harvest_report');

  const [harvestForm, setHarvestForm] = useState({
    person_name: '',
    phone: '',
    address: 'Addis Ababa',
    gender: 'Male',
    outcome_category: 'Believed & Received Jesus'
  });

  const harvestRecords = db?.evangelism_reports || [
    { id: '1', person_name: 'Solomon Kebede', name: 'Solomon Kebede', gender: 'Male', phone: '+251911887766', outcome: 'Believed & Received Jesus', date: '2026-07-25' },
    { id: '2', person_name: 'Martha Desta', name: 'Martha Desta', gender: 'Female', phone: '+251911990011', outcome: 'Repented & Returned', date: '2026-07-26' }
  ];

  const handleRecordHarvest = (e) => {
    e.preventDefault();
    if (!harvestForm.person_name) return;
    const freshDb = getMockDB();
    if (!freshDb.evangelism_reports) freshDb.evangelism_reports = [];
    const newH = {
      id: `ev-${Date.now()}`,
      person_name: harvestForm.person_name,
      name: harvestForm.person_name,
      gender: harvestForm.gender,
      phone: harvestForm.phone || '+251 911 000 000',
      outcome: harvestForm.outcome_category,
      date: new Date().toISOString().slice(0, 10),
      created_at: new Date().toISOString()
    };
    freshDb.evangelism_reports.unshift(newH);
    saveMockDB(freshDb);
    refreshDB();
    showToast(`Recorded evangelism outcome for ${harvestForm.person_name} in Database!`, "success");
    setHarvestForm({ person_name: '', phone: '', address: 'Addis Ababa', gender: 'Male', outcome_category: 'Believed & Received Jesus' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Outcome Category Counters */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        <div className="card" style={{ borderLeft: '4px solid #166534' }}>
          <small style={{ color: 'var(--text-muted)' }}>Believed & Received Jesus</small>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#166534' }}>
            {harvestRecords.filter(r => r.outcome.includes('Believed')).length}
          </h3>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--primary-blue)' }}>
          <small style={{ color: 'var(--text-muted)' }}>Repented & Returned</small>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-blue)' }}>
            {harvestRecords.filter(r => r.outcome.includes('Repented')).length}
          </h3>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #9333ea' }}>
          <small style={{ color: 'var(--text-muted)' }}>Healed & Future Hope</small>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#9333ea' }}>
            {harvestRecords.filter(r => r.outcome.includes('Healed') || r.outcome.includes('Hope')).length}
          </h3>
        </div>
      </div>

      <div className="card no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--primary-blue)' }}>
            Outreach & Evangelism Team (ORTL) Dashboard
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Record evangelism outcomes (repented, accepted Jesus, heard, healed), send harvest reports to Pastor & MZL.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={() => setActiveTab('harvest_report')} className={`btn ${activeTab === 'harvest_report' ? 'btn-primary' : 'btn-secondary'}`}>
            <Globe size={16} />
            <span>Evangelism Harvest Log</span>
          </button>

          <button onClick={() => setActiveTab('submit_plan')} className={`btn ${activeTab === 'submit_plan' ? 'btn-primary' : 'btn-secondary'}`}>
            <Send size={16} />
            <span>Send Plan to Pastor & MZL</span>
          </button>
        </div>
      </div>

      {activeTab === 'harvest_report' && (
        <div className="card">
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--primary-blue)' }}>
            Record Evangelism Soul Harvest & Follow-Up
          </h3>

          <form onSubmit={handleRecordHarvest} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem', backgroundColor: 'var(--primary-light-blue)', padding: '1.25rem', borderRadius: '8px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Full Name *</label>
              <input type="text" required className="form-control" value={harvestForm.person_name} onChange={e => setHarvestForm({ ...harvestForm, person_name: e.target.value })} />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Phone Number</label>
              <input type="text" className="form-control" value={harvestForm.phone} onChange={e => setHarvestForm({ ...harvestForm, phone: e.target.value })} />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Evangelism Outcome</label>
              <select className="form-control" value={harvestForm.outcome_category} onChange={e => setHarvestForm({ ...harvestForm, outcome_category: e.target.value })}>
                <option value="Believed & Received Jesus">Believed & Received Jesus</option>
                <option value="Repented & Returned">Repented & Returned</option>
                <option value="Heard gospel message">Heard gospel message</option>
                <option value="Healed & Received Prayer">Healed & Received Prayer</option>
                <option value="Gave future hope">Gave future hope</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                <UserPlus size={16} />
                <span>Save Harvest Log</span>
              </button>
            </div>
          </form>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Person Name</th>
                  <th>Gender</th>
                  <th>Evangelism Outcome</th>
                  <th>Phone Number</th>
                  <th>Date Logged</th>
                </tr>
              </thead>
              <tbody>
                {harvestRecords.map(r => (
                  <tr key={r.id}>
                    <td><strong>{r.name}</strong></td>
                    <td>{r.gender}</td>
                    <td><span className="badge badge-success">{r.outcome}</span></td>
                    <td>{r.phone}</td>
                    <td>{r.date}</td>
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
