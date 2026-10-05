import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/ToastAlert';
import { getMockDB, saveMockDB } from '../../lib/supabase';
import { FileText, UserPlus, Download, Printer, Send, CheckCircle2 } from 'lucide-react';

export const BaptismDashboard = () => {
  const { db, refreshDB } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('list');

  const baptisms = db?.baptism_records || [
    { id: 'b-1', name: 'Michael Tesfaye', full_name: 'Michael Tesfaye', age: 24, gender: 'Male', phone: '+251911443322', phone_number: '+251911443322', zone: 'Stadium_Zuria', medeb_zone: 'Stadium_Zuria', year: 2026, date: '2026-07-20', cert: 'SKHC-BAP-2026-001' }
  ];

  const [bapForm, setBapForm] = useState({
    name: '',
    age: 22,
    gender: 'Male',
    phone: '',
    address: 'Addis Ababa',
    zone: 'Stadium_Zuria',
    year: 2026,
    date: '2026-07-20',
    cert: 'SKHC-BAP-2026-003'
  });

  const handleAddBaptism = (e) => {
    e.preventDefault();
    if (!bapForm.name) return;
    const freshDb = getMockDB();
    if (!freshDb.baptism_records) freshDb.baptism_records = [];
    const newB = {
      id: `b-${Date.now()}`,
      ...bapForm,
      full_name: bapForm.name,
      phone_number: bapForm.phone,
      medeb_zone: bapForm.zone
    };
    freshDb.baptism_records.unshift(newB);
    saveMockDB(freshDb);
    refreshDB();
    showToast(`Registered Baptism for ${bapForm.name} in Database!`, "success");
    setBapForm({
      name: '',
      age: 22,
      gender: 'Male',
      phone: '',
      address: 'Addis Ababa',
      zone: 'Stadium_Zuria',
      year: 2026,
      date: new Date().toISOString().slice(0, 10),
      cert: `SKHC-BAP-2026-${Math.floor(100 + Math.random() * 900)}`
    });
    setActiveTab('list');
  };

  const handleExportCSV = () => {
    let csv = "Name,Age,Gender,Phone,Zone,Year of Baptism,Date of Baptism,Certificate Number\n";
    baptisms.forEach(b => {
      csv += `"${b.name}",${b.age},"${b.gender}","${b.phone}","${b.zone}",${b.year},"${b.date}","${b.cert}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Baptism_Registry_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    showToast("Exported Baptism registry to CSV!", "success");
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--primary-blue)' }}>
            Baptism Records Registry Dashboard
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Record baptized persons, generate certificate numbers, report to Pastor & Menfesawi Zerf, and export to CSV/PDF/Word.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={() => setActiveTab('list')} className={`btn ${activeTab === 'list' ? 'btn-primary' : 'btn-secondary'}`}>
            <FileText size={16} />
            <span>Baptism Registry</span>
          </button>

          <button onClick={() => setActiveTab('add')} className={`btn ${activeTab === 'add' ? 'btn-primary' : 'btn-secondary'}`}>
            <UserPlus size={16} />
            <span>Register New Baptism</span>
          </button>
        </div>
      </div>

      {activeTab === 'list' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Baptized Persons List ({baptisms.length})</h3>
            <div className="no-print" style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={handleExportCSV} className="btn btn-secondary btn-sm">
                <Download size={14} />
                <span>Export CSV</span>
              </button>
              <button onClick={() => window.print()} className="btn btn-primary btn-sm">
                <Printer size={14} />
                <span>Print Registry</span>
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Age & Gender</th>
                  <th>Phone Number</th>
                  <th>Medeb Sefer Zone</th>
                  <th>Date Baptized</th>
                  <th>Certificate Number</th>
                </tr>
              </thead>
              <tbody>
                {baptisms.map(b => (
                  <tr key={b.id}>
                    <td><strong>{b.full_name || b.name}</strong></td>
                    <td>{b.age} yrs ({b.gender})</td>
                    <td>{b.phone_number || b.phone || 'N/A'}</td>
                    <td><span className="badge badge-warning">{b.medeb_zone || b.zone}</span></td>
                    <td>{b.date || b.date_of_baptism}</td>
                    <td><code style={{ color: 'var(--primary-blue)', fontWeight: 700 }}>{b.certificate_number || b.cert}</code></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'add' && (
        <div className="card" style={{ maxWidth: '650px', margin: '0 auto', width: '100%' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--primary-blue)' }}>
            Register Baptized Person
          </h3>
          <form onSubmit={handleAddBaptism}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input type="text" required className="form-control" value={bapForm.name} onChange={e => setBapForm({ ...bapForm, name: e.target.value })} />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input type="text" className="form-control" value={bapForm.phone} onChange={e => setBapForm({ ...bapForm, phone: e.target.value })} />
              </div>

              <div className="form-group">
                <label className="form-label">Age</label>
                <input type="number" className="form-control" value={bapForm.age} onChange={e => setBapForm({ ...bapForm, age: parseInt(e.target.value) })} />
              </div>

              <div className="form-group">
                <label className="form-label">Gender</label>
                <select className="form-control" value={bapForm.gender} onChange={e => setBapForm({ ...bapForm, gender: e.target.value })}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Date of Baptism</label>
                <input type="date" required className="form-control" value={bapForm.date} onChange={e => setBapForm({ ...bapForm, date: e.target.value })} />
              </div>

              <div className="form-group">
                <label className="form-label">Certificate Number</label>
                <input type="text" required className="form-control" value={bapForm.cert} onChange={e => setBapForm({ ...bapForm, cert: e.target.value })} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              <UserPlus size={16} />
              <span>Save Baptism Record</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
