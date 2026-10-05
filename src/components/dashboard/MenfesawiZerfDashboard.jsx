import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/ToastAlert';
import { getMockDB, saveMockDB } from '../../lib/supabase';
import {
  BookOpen, Sparkles, Calendar, Heart, FileText, Send, UserPlus, Download, Printer, CheckCircle2, Shield, Settings
} from 'lucide-react';

export const MenfesawiZerfDashboard = ({ roleTitle = "Menfesawi Zerf Leader (MZL)" }) => {
  const { db, refreshDB } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('sermons'); // 'sermons', 'choirs', 'baptism', 'health', 'tech'

  // Sermon Scheduling Form State
  const [sermonForm, setSermonForm] = useState({
    sermon_date: '2026-08-02',
    preacher_name: 'Pastor Bekele Solomon',
    sermon_title: 'Unshakable Faith in Times of Renewal',
    biblical_text: 'Hebrews 11:1-6',
    notes: 'Sermon slides and outlines for Sunday morning service.'
  });

  const sermonSchedules = db?.sermon_schedules || [
    { id: '1', date: '2026-08-02', sermon_date: '2026-08-02', preacher: 'Pastor Bekele Solomon', preacher_name: 'Pastor Bekele Solomon', title: 'Unshakable Faith in Times of Renewal', sermon_title: 'Unshakable Faith in Times of Renewal', text: 'Hebrews 11:1-6', biblical_text: 'Hebrews 11:1-6' }
  ];

  // Choir Roster Form State
  const [choirForm, setChoirForm] = useState({
    choir_name: 'Eftah Choir',
    service_date: '2026-08-02',
    session_time: 'Morning Main Service',
    songs_list: '1. Glorious Praise, 2. Worthy is the Lamb, 3. Grace Supreme'
  });

  const choirRosters = db?.choir_rosters || [
    { id: '1', choir: 'Eftah Choir', choir_name: 'Eftah Choir', date: '2026-08-02', service_date: '2026-08-02', session: 'Morning Main Service', session_time: 'Morning Main Service', songs: '1. Glorious Praise, 2. Grace Supreme', songs_list: '1. Glorious Praise, 2. Grace Supreme' }
  ];

  // Baptism Record Form State
  const [baptismForm, setBaptismForm] = useState({
    full_name: '',
    phone_number: '',
    gender: 'Male',
    age: 22,
    medeb_zone: 'Stadium_Zuria',
    medib_number: 'Medib-1',
    year_of_baptism: 2026,
    date_of_baptism: '2026-07-20',
    certificate_number: 'SKHC-BAP-2026-042'
  });

  const baptismRecords = db?.baptism_records || [
    { id: 'b-1', name: 'Michael Tesfaye', full_name: 'Michael Tesfaye', age: 22, gender: 'Male', phone: '+251911443322', phone_number: '+251911443322', year: 2026, date: '2026-07-20', cert: 'SKHC-BAP-2026-042', certificate_number: 'SKHC-BAP-2026-042' }
  ];

  // Health Professionals Registry State
  const healthPros = db?.health_professionals_registry || [
    { id: 'h-1', name: 'Dr. Yosef Alemu', profession: 'Medical Doctor (General Physician)', phone: '+251911221100', department: 'Tena Zerf' }
  ];

  // Technology Issues Queue
  const techIssues = db?.technology_issues || [
    { id: 't-1', title: 'Fellowship Hall Sound Amplifier Overheating', urgency: 'High', status: 'In Progress', reported_by: 'Worship Leader' }
  ];

  const handleSendSermonSchedule = (e) => {
    e.preventDefault();
    const freshDb = getMockDB();
    if (!freshDb.sermon_schedules) freshDb.sermon_schedules = [];
    const newSrm = {
      id: `srm-${Date.now()}`,
      date: sermonForm.sermon_date,
      sermon_date: sermonForm.sermon_date,
      preacher: sermonForm.preacher_name,
      preacher_name: sermonForm.preacher_name,
      title: sermonForm.sermon_title,
      sermon_title: sermonForm.sermon_title,
      text: sermonForm.biblical_text,
      biblical_text: sermonForm.biblical_text,
      created_at: new Date().toISOString()
    };
    freshDb.sermon_schedules.unshift(newSrm);
    saveMockDB(freshDb);
    refreshDB();
    showToast(`Sunday Sermon schedule saved to Database and sent to Pastor & Leaders!`, "success");
  };

  const handleSendChoirRoster = (e) => {
    e.preventDefault();
    const freshDb = getMockDB();
    if (!freshDb.choir_rosters) freshDb.choir_rosters = [];
    const newChr = {
      id: `chr-${Date.now()}`,
      choir: choirForm.choir_name,
      choir_name: choirForm.choir_name,
      date: choirForm.service_date,
      service_date: choirForm.service_date,
      session: choirForm.session_time,
      session_time: choirForm.session_time,
      songs: choirForm.songs_list,
      songs_list: choirForm.songs_list,
      created_at: new Date().toISOString()
    };
    freshDb.choir_rosters.unshift(newChr);
    saveMockDB(freshDb);
    refreshDB();
    showToast(`Choir roster posted for ${choirForm.choir_name} and saved to Database!`, "success");
  };

  const handleAddBaptism = (e) => {
    e.preventDefault();
    if (!baptismForm.full_name) {
      showToast("Full Name is required", "error");
      return;
    }
    const freshDb = getMockDB();
    if (!freshDb.baptism_records) freshDb.baptism_records = [];
    const newBap = {
      id: `bap-${Date.now()}`,
      name: baptismForm.full_name,
      full_name: baptismForm.full_name,
      age: baptismForm.age,
      gender: baptismForm.gender,
      phone: baptismForm.phone_number,
      phone_number: baptismForm.phone_number,
      medeb_zone: baptismForm.medeb_zone,
      year: baptismForm.year_of_baptism,
      date: baptismForm.date_of_baptism,
      date_of_baptism: baptismForm.date_of_baptism,
      cert: baptismForm.certificate_number,
      certificate_number: baptismForm.certificate_number,
      created_at: new Date().toISOString()
    };
    freshDb.baptism_records.unshift(newBap);
    saveMockDB(freshDb);
    refreshDB();
    showToast(`Registered Baptism for ${baptismForm.full_name} in Database!`, "success");
    setBaptismForm({ full_name: '', phone_number: '', gender: 'Male', age: 22, medeb_zone: 'Stadium_Zuria', medib_number: 'Medib-1', year_of_baptism: 2026, date_of_baptism: '2026-07-20', certificate_number: `SKHC-BAP-2026-${Math.floor(100+Math.random()*900)}` });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Header & Tabs */}
      <div className="card no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--primary-blue)' }}>
            {roleTitle}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Sermon rotas, choir rosters (Eftah, Johanan, Elroe, Temer), baptism records, health pros, and ICT issue resolution.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('sermons')}
            className={`btn ${activeTab === 'sermons' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <BookOpen size={16} />
            <span>Sermon Rota</span>
          </button>

          <button
            onClick={() => setActiveTab('choirs')}
            className={`btn ${activeTab === 'choirs' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Sparkles size={16} />
            <span>Choir Rosters</span>
          </button>

          <button
            onClick={() => setActiveTab('baptism')}
            className={`btn ${activeTab === 'baptism' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <FileText size={16} />
            <span>Baptism Registry</span>
          </button>

          <button
            onClick={() => setActiveTab('health')}
            className={`btn ${activeTab === 'health' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Heart size={16} />
            <span>Health & Professional Zerfs</span>
          </button>

          <button
            onClick={() => setActiveTab('tech')}
            className={`btn ${activeTab === 'tech' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Settings size={16} />
            <span>ICT & Tech Issues Queue</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Sunday Sermon Schedule Rota */}
      {activeTab === 'sermons' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ maxWidth: '650px', margin: '0 auto', width: '100%' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem', color: 'var(--primary-blue)' }}>
              Schedule Sunday Sermon Preacher & Topic
            </h3>

            <form onSubmit={handleSendSermonSchedule}>
              <div className="form-group">
                <label className="form-label">Sermon Date *</label>
                <input
                  type="date"
                  required
                  className="form-control"
                  value={sermonForm.sermon_date}
                  onChange={e => setSermonForm({ ...sermonForm, sermon_date: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Preacher Name *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={sermonForm.preacher_name}
                  onChange={e => setSermonForm({ ...sermonForm, preacher_name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Sermon Title *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={sermonForm.sermon_title}
                  onChange={e => setSermonForm({ ...sermonForm, sermon_title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Biblical Text Reference</label>
                <input
                  type="text"
                  className="form-control"
                  value={sermonForm.biblical_text}
                  onChange={e => setSermonForm({ ...sermonForm, biblical_text: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                <Send size={16} />
                <span>Send Sermon Rota to Pastor & Leaders</span>
              </button>
            </form>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem' }}>Upcoming Sermon Schedule</h3>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Preacher Name</th>
                    <th>Sermon Title</th>
                    <th>Scripture Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {sermonSchedules.map(s => (
                    <tr key={s.id}>
                      <td><span className="badge badge-warning">{s.date}</span></td>
                      <td><strong>{s.preacher}</strong></td>
                      <td>{s.title}</td>
                      <td><code style={{ color: 'var(--primary-blue)', fontWeight: 700 }}>{s.text}</code></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Choir Roster Scheduling */}
      {activeTab === 'choirs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ maxWidth: '650px', margin: '0 auto', width: '100%' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem', color: 'var(--primary-blue)' }}>
              Schedule Sunday Choir Roster
            </h3>

            <form onSubmit={handleSendChoirRoster}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Select Choir Sub-Team</label>
                  <select
                    className="form-control"
                    value={choirForm.choir_name}
                    onChange={e => setChoirForm({ ...choirForm, choir_name: e.target.value })}
                  >
                    <option value="Eftah Choir">Eftah Choir</option>
                    <option value="Johanan Choir">Johanan Choir</option>
                    <option value="Elroe Choir">Elroe Choir</option>
                    <option value="Temer Choir">Temer Choir</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Service Date</label>
                  <input
                    type="date"
                    required
                    className="form-control"
                    value={choirForm.service_date}
                    onChange={e => setChoirForm({ ...choirForm, service_date: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Service Session</label>
                <input
                  type="text"
                  className="form-control"
                  value={choirForm.session_time}
                  onChange={e => setChoirForm({ ...choirForm, session_time: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Selected Songs & Worship List</label>
                <textarea
                  rows={2}
                  className="form-control"
                  value={choirForm.songs_list}
                  onChange={e => setChoirForm({ ...choirForm, songs_list: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                <Sparkles size={16} />
                <span>Post Choir Roster</span>
              </button>
            </form>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem' }}>Choir Service Rosters</h3>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Choir Name</th>
                    <th>Service Date</th>
                    <th>Session</th>
                    <th>Selected Songs</th>
                  </tr>
                </thead>
                <tbody>
                  {choirRosters.map(c => (
                    <tr key={c.id}>
                      <td><span className="badge badge-success">{c.choir}</span></td>
                      <td>{c.date}</td>
                      <td>{c.session}</td>
                      <td>{c.songs}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Baptism Records Registry */}
      {activeTab === 'baptism' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ maxWidth: '650px', margin: '0 auto', width: '100%' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem', color: 'var(--primary-blue)' }}>
              Register Baptism Record
            </h3>

            <form onSubmit={handleAddBaptism}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={baptismForm.full_name}
                    onChange={e => setBaptismForm({ ...baptismForm, full_name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={baptismForm.phone_number}
                    onChange={e => setBaptismForm({ ...baptismForm, phone_number: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Age</label>
                  <input
                    type="number"
                    className="form-control"
                    value={baptismForm.age}
                    onChange={e => setBaptismForm({ ...baptismForm, age: parseInt(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Certificate Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={baptismForm.certificate_number}
                    onChange={e => setBaptismForm({ ...baptismForm, certificate_number: e.target.value })}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                <CheckCircle2 size={16} />
                <span>Save Baptism Record</span>
              </button>
            </form>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem' }}>Baptized Persons Registry</h3>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Full Name</th>
                    <th>Age & Gender</th>
                    <th>Phone</th>
                    <th>Date Baptized</th>
                    <th>Certificate Number</th>
                  </tr>
                </thead>
                <tbody>
                  {baptismRecords.map(b => (
                    <tr key={b.id}>
                      <td><strong>{b.name}</strong></td>
                      <td>{b.age} yrs ({b.gender})</td>
                      <td>{b.phone}</td>
                      <td>{b.date}</td>
                      <td><code style={{ color: 'var(--primary-blue)', fontWeight: 700 }}>{b.cert}</code></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Health Professionals Registry */}
      {activeTab === 'health' && (
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--primary-blue)' }}>
            Health Professionals (Tena Zerf) Registry
          </h3>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Member Name</th>
                  <th>Profession & Specialty</th>
                  <th>Phone Number</th>
                  <th>Zerf Department</th>
                </tr>
              </thead>
              <tbody>
                {healthPros.map(hp => (
                  <tr key={hp.id}>
                    <td><strong>{hp.name}</strong></td>
                    <td>{hp.profession}</td>
                    <td>{hp.phone}</td>
                    <td><span className="badge badge-success">{hp.department}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: Technology Issues Queue */}
      {activeTab === 'tech' && (
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--primary-blue)' }}>
            ICT & Media Technology Issues Resolution Queue
          </h3>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Issue Title</th>
                  <th>Urgency</th>
                  <th>Status</th>
                  <th>Reported By</th>
                </tr>
              </thead>
              <tbody>
                {techIssues.map(t => (
                  <tr key={t.id}>
                    <td><strong>{t.title}</strong></td>
                    <td><span className={`badge ${t.urgency === 'High' ? 'badge-danger' : 'badge-warning'}`}>{t.urgency}</span></td>
                    <td><span className="badge badge-info">{t.status}</span></td>
                    <td>{t.reported_by}</td>
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
