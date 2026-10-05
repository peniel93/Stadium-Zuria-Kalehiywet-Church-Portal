import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/ToastAlert';
import { getMockDB, saveMockDB } from '../../lib/supabase';
import { Users, UserPlus, Search, Download, Printer, Filter, CheckCircle2, Trash2, Edit3, KeyRound, Copy, Check, X, Shield } from 'lucide-react';

export const ChurchMembersDashboard = () => {
  const { db, refreshDB, createUser, resetUserPIN } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('list'); // 'list', 'add'

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOccupationFilter, setSelectedOccupationFilter] = useState('ALL');
  const [selectedZoneFilter, setSelectedZoneFilter] = useState('ALL');

  // Modal state for newly registered member credentials alert
  const [createdUserModal, setCreatedUserModal] = useState(null);

  // New Church Member Registration Form State (Full doc spec)
  const [memberForm, setMemberForm] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    age: 35,
    gender: 'Male',
    medeb_zone: 'Stadium_Zuria',
    medib_number: 'Medib-1',
    region: 'Addis Ababa',
    zone: 'Kirkos',
    kebele: '02',
    family_size: 4,
    number_of_sons: 2,
    number_of_daughters: 1,
    wife_name: 'Tigist Alemu',
    sons_names: 'Dawit Abebe, Michael Abebe',
    daughters_names: 'Bethlehem Abebe',
    occupation: 'Government Employee'
  });

  const [sonsDetails, setSonsDetails] = useState([
    { name: 'Dawit Abebe', education: 'University Degree', marital: 'Single', occupation: 'Engineer' },
    { name: 'Michael Abebe', education: 'High School', marital: 'Single', occupation: 'Student' }
  ]);

  const [daughtersDetails, setDaughtersDetails] = useState([
    { name: 'Bethlehem Abebe', education: 'Elementary', marital: 'Single', occupation: 'Student' }
  ]);

  const handleSonsCountChange = (countVal) => {
    const num = Math.max(0, parseInt(countVal) || 0);
    setMemberForm(prev => ({ ...prev, number_of_sons: num }));
    setSonsDetails(prev => {
      const copy = [...prev];
      if (num > copy.length) {
        for (let i = copy.length; i < num; i++) {
          copy.push({ name: '', education: 'Elementary', marital: 'Single', occupation: 'Student' });
        }
      } else {
        copy.splice(num);
      }
      return copy;
    });
  };

  const handleDaughtersCountChange = (countVal) => {
    const num = Math.max(0, parseInt(countVal) || 0);
    setMemberForm(prev => ({ ...prev, number_of_daughters: num }));
    setDaughtersDetails(prev => {
      const copy = [...prev];
      if (num > copy.length) {
        for (let i = copy.length; i < num; i++) {
          copy.push({ name: '', education: 'Elementary', marital: 'Single', occupation: 'Student' });
        }
      } else {
        copy.splice(num);
      }
      return copy;
    });
  };

  const occupationsList = [
    'Government Employee',
    'Self Employed',
    'Businessman/Women',
    'Merchant',
    'Carpenter',
    'Lawyer',
    'Engineer',
    'Doctor',
    'Nurse',
    'Anesthetist',
    'Evangelist',
    'House Wife',
    'Unemployed',
    'Other'
  ];

  const members = db?.church_members || [
    {
      id: 'mb-1',
      username_id: 'SKHC/Member/0001/2026',
      default_pin: '4892',
      full_name: 'Abebe Kebede',
      email: 'abebe@example.com',
      phone_number: '+251911112233',
      gender: 'Male',
      age: 42,
      medeb_zone: 'Stadium_Zuria',
      medib_number: 'Medib-1',
      region: 'Addis Ababa',
      zone: 'Kirkos',
      kebele: '02',
      family_size: 4,
      number_of_sons: 2,
      number_of_daughters: 1,
      wife_name: 'Tigist Alemu',
      sons_names: 'Dawit Abebe, Michael Abebe',
      daughters_names: 'Bethlehem Abebe',
      occupation: 'Government Employee',
      is_active: true,
      created_at: '2026-02-01'
    },
    {
      id: 'mb-2',
      username_id: 'SKHC/Member/0002/2026',
      default_pin: '8312',
      full_name: 'Dr. Yosef Alemu',
      email: 'yosef@example.com',
      phone_number: '+251911221100',
      gender: 'Male',
      age: 45,
      medeb_zone: 'Kutir_1',
      medib_number: 'Medib-3',
      region: 'Addis Ababa',
      zone: 'Kirkos',
      kebele: '04',
      family_size: 3,
      number_of_sons: 1,
      number_of_daughters: 1,
      wife_name: 'Sara Tesfaye',
      sons_names: 'Daniel Yosef',
      daughters_names: 'Hannah Yosef',
      occupation: 'Doctor',
      is_active: true,
      created_at: '2026-03-12'
    }
  ];

  const handleCreateMember = (e) => {
    e.preventDefault();
    if (!memberForm.full_name || !memberForm.phone_number) {
      showToast("Full Name and Phone Number are required", "error");
      return;
    }

    const freshDb = getMockDB();
    
    // Automatically provision unique login credentials for the member
    const newPortalUser = createUser({
      full_name: memberForm.full_name,
      email: memberForm.email,
      phone_number: memberForm.phone_number,
      role: 'Member',
      joined_year: new Date().getFullYear(),
      medeb_zone: memberForm.medeb_zone,
      medib_number: memberForm.medib_number
    });

    const newMb = {
      id: newPortalUser.id,
      username_id: newPortalUser.username_id,
      default_pin: newPortalUser.default_pin,
      ...memberForm,
      sons_names: sonsDetails.map(s => s.name).filter(Boolean).join(', '),
      daughters_names: daughtersDetails.map(d => d.name).filter(Boolean).join(', '),
      sons_details: sonsDetails,
      daughters_details: daughtersDetails,
      is_active: true,
      created_at: new Date().toISOString().slice(0, 10)
    };

    if (!freshDb.church_members) freshDb.church_members = [];
    freshDb.church_members.unshift(newMb);
    saveMockDB(freshDb);
    refreshDB();

    showToast(`Church Member Registered! ID: ${newPortalUser.username_id}`, "success");
    setCreatedUserModal(newPortalUser);
    setActiveTab('list');
  };

  // Filter & Search Logic
  const filteredMembers = members.filter(m => {
    const matchesSearch =
      m.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.phone_number.includes(searchQuery) ||
      (m.email && m.email.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesOcc = selectedOccupationFilter === 'ALL' || m.occupation === selectedOccupationFilter;
    const matchesZone = selectedZoneFilter === 'ALL' || m.medeb_zone === selectedZoneFilter;

    return matchesSearch && matchesOcc && matchesZone;
  });

  const handleExportCSV = () => {
    let csv = "Full Name,Email,Phone,Gender,Age,Medeb Zone,Medib,Family Size,Sons,Daughters,Wife Name,Occupation,Date Registered\n";
    filteredMembers.forEach(m => {
      csv += `"${m.full_name}","${m.email || ''}","${m.phone_number}","${m.gender}",${m.age},"${m.medeb_zone}","${m.medib_number}",${m.family_size},${m.number_of_sons},${m.number_of_daughters},"${m.wife_name || ''}","${m.occupation}","${m.created_at}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Church_Members_Directory_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    showToast("Church Members Directory exported to CSV!", "success");
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Overview Cards & Category Counts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className="card" style={{ borderLeft: '4px solid var(--primary-blue)' }}>
          <small style={{ color: 'var(--text-muted)' }}>Total Church Members</small>
          <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-blue)' }}>{members.length}</h3>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #166534' }}>
          <small style={{ color: 'var(--text-muted)' }}>Male Members</small>
          <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#166534' }}>
            {members.filter(m => m.gender === 'Male').length}
          </h3>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #854d0e' }}>
          <small style={{ color: 'var(--text-muted)' }}>Female Members</small>
          <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#854d0e' }}>
            {members.filter(m => m.gender === 'Female').length}
          </h3>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #9333ea' }}>
          <small style={{ color: 'var(--text-muted)' }}>Filtered Results</small>
          <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#9333ea' }}>{filteredMembers.length}</h3>
        </div>
      </div>

      {/* Top Controls & Navigation */}
      <div className="card no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--primary-blue)' }}>
            Church Members Directory Dashboard
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Filter by occupation, Medeb Sefer zone, family details, export to CSV/PDF/Word, and manage member profiles.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('list')}
            className={`btn ${activeTab === 'list' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Users size={16} />
            <span>Members List</span>
          </button>

          <button
            onClick={() => setActiveTab('add')}
            className={`btn ${activeTab === 'add' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <UserPlus size={16} />
            <span>Add Church Member</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Filterable Members Directory */}
      {activeTab === 'list' && (
        <div className="card">
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: '220px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search by name, phone, or email..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <div>
              <select
                className="form-control"
                value={selectedOccupationFilter}
                onChange={e => setSelectedOccupationFilter(e.target.value)}
              >
                <option value="ALL">Filter by Occupation: All</option>
                {occupationsList.map(occ => (
                  <option key={occ} value={occ}>{occ}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                className="form-control"
                value={selectedZoneFilter}
                onChange={e => setSelectedZoneFilter(e.target.value)}
              >
                <option value="ALL">Filter by Zone: All</option>
                <option value="Maremiya">Maremiya Zone</option>
                <option value="Kutir_1">Kutir-1 Zone</option>
                <option value="Memeheran">Memeheran Zone</option>
                <option value="Muya_and_Technique">Muya & Technique Zone</option>
                <option value="Stadium_Zuria">Stadium Zuria Zone</option>
              </select>
            </div>

            <div className="no-print" style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={handleExportCSV} className="btn btn-secondary btn-sm">
                <Download size={14} />
                <span>Export CSV</span>
              </button>

              <button onClick={() => window.print()} className="btn btn-primary btn-sm">
                <Printer size={14} />
                <span>Print Directory</span>
              </button>
            </div>
          </div>

          {/* Success Credentials Modal Alert */}
          {createdUserModal && (
            <div style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.7)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '1rem'
            }}>
              <div className="card" style={{ maxWidth: '520px', width: '100%', borderTop: '4px solid var(--primary-blue)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={24} style={{ color: '#166534' }} />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-blue)' }}>
                      Member Registered Successfully!
                    </h3>
                  </div>
                  <button onClick={() => setCreatedUserModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <X size={20} />
                  </button>
                </div>

                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  Unique credentials have been generated for <strong>{createdUserModal.full_name}</strong>. Share these with the member so they can log in.
                </p>

                <div style={{ backgroundColor: 'var(--primary-light-blue)', padding: '1rem', borderRadius: '8px', marginBottom: '1.25rem' }}>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <small style={{ color: 'var(--text-muted)' }}>Member Username ID (ID Number)</small>
                    <h4 style={{ color: 'var(--primary-blue)', fontWeight: 800, fontSize: '1.125rem' }}>{createdUserModal.username_id}</h4>
                  </div>

                  <div>
                    <small style={{ color: 'var(--text-muted)' }}>Auto-Generated Default Password (4-Digit PIN)</small>
                    <h4 style={{ color: 'var(--primary-blue)', fontWeight: 800, fontSize: '1.25rem' }}>{createdUserModal.default_pin}</h4>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={() => {
                      const text = `SKHC Church Member Login Credentials:\nName: ${createdUserModal.full_name}\nUsername ID: ${createdUserModal.username_id}\nPassword PIN: ${createdUserModal.default_pin}`;
                      navigator.clipboard.writeText(text);
                      showToast("Member credentials copied to clipboard!", "success");
                    }}
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                  >
                    <Copy size={16} />
                    <span>Copy Credentials</span>
                  </button>

                  <button onClick={() => setCreatedUserModal(null)} className="btn btn-secondary">
                    <span>Close</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Member Username ID</th>
                  <th>Full Name</th>
                  <th>Phone Number</th>
                  <th>Default PIN Password</th>
                  <th>Medeb Zone & Medib</th>
                  <th>Occupation</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map(m => {
                  const userRecord = (db?.users || []).find(u => u.username_id === m.username_id || u.full_name === m.full_name);
                  const displayPin = m.default_pin || userRecord?.default_pin || '4892';
                  const displayId = m.username_id || userRecord?.username_id || 'SKHC/Member/0001/2026';

                  return (
                    <tr key={m.id}>
                      <td>
                        <code style={{ fontWeight: 800, color: 'var(--primary-blue)', fontSize: '0.875rem' }}>
                          {displayId}
                        </code>
                      </td>
                      <td>
                        <strong>{m.full_name}</strong>
                        <br />
                        <small style={{ color: 'var(--text-muted)' }}>{m.email || 'No email'}</small>
                      </td>
                      <td>{m.phone_number}</td>
                      <td>
                        <code style={{ backgroundColor: 'var(--primary-light-blue)', padding: '0.2rem 0.6rem', borderRadius: '4px', color: 'var(--primary-blue)', fontWeight: 800, fontSize: '0.9375rem' }}>
                          {displayPin}
                        </code>
                      </td>
                      <td>
                        <span className="badge badge-warning">{m.medeb_zone} - {m.medib_number}</span>
                      </td>
                      <td><span className="badge badge-success">{m.occupation}</span></td>
                      <td>
                        <button
                          onClick={() => {
                            const newPin = resetUserPIN(userRecord?.id || m.id);
                            showToast(`Reset 4-digit PIN for ${m.full_name} to: ${newPin}`, "success");
                          }}
                          className="btn btn-secondary btn-sm"
                          title="Reset Member 4-Digit Password PIN"
                        >
                          <KeyRound size={14} />
                          <span>Reset PIN</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Add Church Member Form */}
      {activeTab === 'add' && (
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem', color: 'var(--primary-blue)' }}>
            Register New Church Member
          </h3>

          <form onSubmit={handleCreateMember}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={memberForm.full_name}
                  onChange={e => setMemberForm({ ...memberForm, full_name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={memberForm.phone_number}
                  onChange={e => setMemberForm({ ...memberForm, phone_number: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  value={memberForm.email}
                  onChange={e => setMemberForm({ ...memberForm, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Age</label>
                <input
                  type="number"
                  className="form-control"
                  value={memberForm.age}
                  onChange={e => setMemberForm({ ...memberForm, age: parseInt(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Gender</label>
                <select
                  className="form-control"
                  value={memberForm.gender}
                  onChange={e => setMemberForm({ ...memberForm, gender: e.target.value })}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Occupation</label>
                <select
                  className="form-control"
                  value={memberForm.occupation}
                  onChange={e => setMemberForm({ ...memberForm, occupation: e.target.value })}
                >
                  {occupationsList.map(occ => (
                    <option key={occ} value={occ}>{occ}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Medeb Sefer Zone</label>
                <select
                  className="form-control"
                  value={memberForm.medeb_zone}
                  onChange={e => setMemberForm({ ...memberForm, medeb_zone: e.target.value })}
                >
                  <option value="Maremiya">Maremiya Zone</option>
                  <option value="Kutir_1">Kutir-1 Zone</option>
                  <option value="Memeheran">Memeheran Zone</option>
                  <option value="Muya_and_Technique">Muya & Technique Zone</option>
                  <option value="Stadium_Zuria">Stadium Zuria Zone</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Medib Sub-Division</label>
                <select
                  className="form-control"
                  value={memberForm.medib_number}
                  onChange={e => setMemberForm({ ...memberForm, medib_number: e.target.value })}
                >
                  {Array.from({ length: 10 }).map((_, i) => (
                    <option key={i} value={`Medib-${i + 1}`}>Medib-{i + 1}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Family Size</label>
                <input
                  type="number"
                  className="form-control"
                  value={memberForm.family_size}
                  onChange={e => setMemberForm({ ...memberForm, family_size: parseInt(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Number of Sons</label>
                <input
                  type="number"
                  min={0}
                  className="form-control"
                  value={memberForm.number_of_sons}
                  onChange={e => handleSonsCountChange(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Number of Daughters</label>
                <input
                  type="number"
                  min={0}
                  className="form-control"
                  value={memberForm.number_of_daughters}
                  onChange={e => handleDaughtersCountChange(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Name of Wife / Spouse (if married)</label>
                <input
                  type="text"
                  className="form-control"
                  value={memberForm.wife_name}
                  onChange={e => setMemberForm({ ...memberForm, wife_name: e.target.value })}
                />
              </div>
            </div>

            {/* Dynamic Sons Fields */}
            {sonsDetails.length > 0 && (
              <div style={{ marginTop: '1.25rem', backgroundColor: 'rgba(0, 102, 204, 0.03)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <h5 style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--primary-blue)', marginBottom: '0.75rem' }}>
                  👦 Sons' Detailed Demographics ({sonsDetails.length} Son{sonsDetails.length > 1 ? 's' : ''})
                </h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {sonsDetails.map((son, idx) => (
                    <div key={idx} style={{ backgroundColor: 'var(--bg-card)', padding: '0.875rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-blue)' }}>Son #{idx + 1}</span>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginTop: '0.5rem' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label" style={{ fontSize: '0.75rem' }}>Son Full Name</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder={`e.g. Son Name ${idx + 1}`}
                            value={son.name}
                            onChange={e => {
                              const val = e.target.value;
                              setSonsDetails(prev => prev.map((item, i) => i === idx ? { ...item, name: val } : item));
                            }}
                          />
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label" style={{ fontSize: '0.75rem' }}>Educational Status</label>
                          <select
                            className="form-control"
                            value={son.education}
                            onChange={e => {
                              const val = e.target.value;
                              setSonsDetails(prev => prev.map((item, i) => i === idx ? { ...item, education: val } : item));
                            }}
                          >
                            <option value="Elementary">Elementary School</option>
                            <option value="High School">High School</option>
                            <option value="TVET / Diploma">TVET / Diploma</option>
                            <option value="University Degree">University Degree</option>
                            <option value="Masters / PhD">Masters / PhD</option>
                            <option value="Not Enrolled">Not Enrolled</option>
                          </select>
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label" style={{ fontSize: '0.75rem' }}>Marital Status</label>
                          <select
                            className="form-control"
                            value={son.marital}
                            onChange={e => {
                              const val = e.target.value;
                              setSonsDetails(prev => prev.map((item, i) => i === idx ? { ...item, marital: val } : item));
                            }}
                          >
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                            <option value="Engaged">Engaged</option>
                          </select>
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label" style={{ fontSize: '0.75rem' }}>Occupation Status</label>
                          <select
                            className="form-control"
                            value={son.occupation}
                            onChange={e => {
                              const val = e.target.value;
                              setSonsDetails(prev => prev.map((item, i) => i === idx ? { ...item, occupation: val } : item));
                            }}
                          >
                            <option value="Student">Student</option>
                            <option value="Employed">Employed (Public/Private)</option>
                            <option value="Self-Employed">Self-Employed / Business</option>
                            <option value="Unemployed">Unemployed</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Dynamic Daughters Fields */}
            {daughtersDetails.length > 0 && (
              <div style={{ marginTop: '1.25rem', backgroundColor: 'rgba(236, 72, 153, 0.03)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <h5 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#db2777', marginBottom: '0.75rem' }}>
                  👧 Daughters' Detailed Demographics ({daughtersDetails.length} Daughter{daughtersDetails.length > 1 ? 's' : ''})
                </h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {daughtersDetails.map((dau, idx) => (
                    <div key={idx} style={{ backgroundColor: 'var(--bg-card)', padding: '0.875rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#db2777' }}>Daughter #{idx + 1}</span>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginTop: '0.5rem' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label" style={{ fontSize: '0.75rem' }}>Daughter Full Name</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder={`e.g. Daughter Name ${idx + 1}`}
                            value={dau.name}
                            onChange={e => {
                              const val = e.target.value;
                              setDaughtersDetails(prev => prev.map((item, i) => i === idx ? { ...item, name: val } : item));
                            }}
                          />
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label" style={{ fontSize: '0.75rem' }}>Educational Status</label>
                          <select
                            className="form-control"
                            value={dau.education}
                            onChange={e => {
                              const val = e.target.value;
                              setDaughtersDetails(prev => prev.map((item, i) => i === idx ? { ...item, education: val } : item));
                            }}
                          >
                            <option value="Elementary">Elementary School</option>
                            <option value="High School">High School</option>
                            <option value="TVET / Diploma">TVET / Diploma</option>
                            <option value="University Degree">University Degree</option>
                            <option value="Masters / PhD">Masters / PhD</option>
                            <option value="Not Enrolled">Not Enrolled</option>
                          </select>
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label" style={{ fontSize: '0.75rem' }}>Marital Status</label>
                          <select
                            className="form-control"
                            value={dau.marital}
                            onChange={e => {
                              const val = e.target.value;
                              setDaughtersDetails(prev => prev.map((item, i) => i === idx ? { ...item, marital: val } : item));
                            }}
                          >
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                            <option value="Engaged">Engaged</option>
                          </select>
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label" style={{ fontSize: '0.75rem' }}>Occupation Status</label>
                          <select
                            className="form-control"
                            value={dau.occupation}
                            onChange={e => {
                              const val = e.target.value;
                              setDaughtersDetails(prev => prev.map((item, i) => i === idx ? { ...item, occupation: val } : item));
                            }}
                          >
                            <option value="Student">Student</option>
                            <option value="Employed">Employed (Public/Private)</option>
                            <option value="Self-Employed">Self-Employed / Business</option>
                            <option value="Unemployed">Unemployed</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ marginTop: '1.5rem', width: '100%' }}>
              <UserPlus size={16} />
              <span>Save & Register Member</span>
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
