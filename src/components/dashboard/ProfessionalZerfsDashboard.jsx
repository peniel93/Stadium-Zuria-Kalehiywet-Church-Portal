import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/ToastAlert';
import { getMockDB, saveMockDB } from '../../lib/supabase';
import { Users, UserPlus, FileText, Download, Printer, Settings, CheckCircle2, Megaphone, Send } from 'lucide-react';

export const ProfessionalZerfsDashboard = ({ zerfTitle = "Tena Zerf (Health Professionals)" }) => {
  const { db, refreshDB } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('members');

  const professionals = db?.health_professionals_registry || [
    { id: '1', name: 'Dr. Yosef Alemu', member_name: 'Dr. Yosef Alemu', profession: 'Medical Doctor', phone: '+251911221100', phone_number: '+251911221100', specialty: 'General Practice' },
    { id: '2', name: 'Engineer Solomon Desta', member_name: 'Engineer Solomon Desta', profession: 'Civil Engineer', phone: '+251911334455', phone_number: '+251911334455', specialty: 'Structural Design' }
  ];

  const [profForm, setProfForm] = useState({
    name: '',
    profession: '',
    specialty: '',
    phone: ''
  });

  const handleAddProfessional = (e) => {
    e.preventDefault();
    if (!profForm.name || !profForm.phone) {
      showToast("Name and Phone are required", "error");
      return;
    }
    const freshDb = getMockDB();
    if (!freshDb.health_professionals_registry) freshDb.health_professionals_registry = [];
    const newP = {
      id: `hp-${Date.now()}`,
      name: profForm.name,
      member_name: profForm.name,
      profession: profForm.profession || 'Professional',
      phone: profForm.phone,
      phone_number: profForm.phone,
      specialty: profForm.specialty || 'General',
      zerf_department: zerfTitle,
      created_at: new Date().toISOString()
    };
    freshDb.health_professionals_registry.unshift(newP);
    saveMockDB(freshDb);
    refreshDB();
    showToast(`Added ${profForm.name} to ${zerfTitle} in Database!`, "success");
    setProfForm({ name: '', profession: '', specialty: '', phone: '' });
  };

  const handleExportCSV = () => {
    let csv = "Member Name,Profession,Specialty,Phone Number\n";
    professionals.forEach(p => {
      csv += `"${p.name}","${p.profession}","${p.specialty}","${p.phone}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${zerfTitle.replace(/\s+/g, '_')}_Members_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    showToast("Exported directory to CSV!", "success");
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--primary-blue)' }}>
            {zerfTitle} Dashboard
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Register professional members, post training opportunities, send reports to Pastor & Registrar, and export records.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={() => setActiveTab('members')} className={`btn ${activeTab === 'members' ? 'btn-primary' : 'btn-secondary'}`}>
            <Users size={16} />
            <span>Members Directory</span>
          </button>

          <button onClick={() => setActiveTab('report')} className={`btn ${activeTab === 'report' ? 'btn-primary' : 'btn-secondary'}`}>
            <Send size={16} />
            <span>Send Report to Leaders</span>
          </button>
        </div>
      </div>

      {activeTab === 'members' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Professional Members Directory</h3>
            <div className="no-print" style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={handleExportCSV} className="btn btn-secondary btn-sm">
                <Download size={14} />
                <span>Export CSV</span>
              </button>
              <button onClick={() => window.print()} className="btn btn-primary btn-sm">
                <Printer size={14} />
                <span>Print List</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleAddProfessional} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem', backgroundColor: 'var(--primary-light-blue)', padding: '1.25rem', borderRadius: '8px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Full Name *</label>
              <input type="text" required className="form-control" value={profForm.name} onChange={e => setProfForm({ ...profForm, name: e.target.value })} />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Profession / Role</label>
              <input type="text" className="form-control" placeholder="e.g. Doctor, Lawyer, Engineer" value={profForm.profession} onChange={e => setProfForm({ ...profForm, profession: e.target.value })} />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Phone Number *</label>
              <input type="text" required className="form-control" value={profForm.phone} onChange={e => setProfForm({ ...profForm, phone: e.target.value })} />
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                <UserPlus size={16} />
                <span>Add Member</span>
              </button>
            </div>
          </form>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Member Name</th>
                  <th>Profession</th>
                  <th>Specialty</th>
                  <th>Phone Number</th>
                </tr>
              </thead>
              <tbody>
                {professionals.map(p => (
                  <tr key={p.id}>
                    <td><strong>{p.name}</strong></td>
                    <td><span className="badge badge-success">{p.profession}</span></td>
                    <td>{p.specialty}</td>
                    <td>{p.phone}</td>
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
            Send Report to Pastor, Menfesawi Zerf & Main Registrar
          </h3>
          <form onSubmit={(e) => {
            e.preventDefault();
            showToast(`Report from ${zerfTitle} submitted to Pastor, Menfesawi Zerf & Main Registrar!`, "success");
            e.target.reset();
          }}>
            <div className="form-group">
              <label className="form-label">Report Title *</label>
              <input type="text" required className="form-control" placeholder="e.g. Q3 Professional Services & Outreach Report" />
            </div>

            <div className="form-group">
              <label className="form-label">Accomplishments & Activities Summary</label>
              <textarea rows={4} required className="form-control" placeholder="Detail trainings held, assistance provided, opportunities created..." />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <Send size={16} />
              <span>Send Report</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
