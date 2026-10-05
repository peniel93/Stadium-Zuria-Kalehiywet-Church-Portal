import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/ToastAlert';
import { getMockDB, saveMockDB } from '../../lib/supabase';
import {
  Cross, Users, UserPlus, BookOpen, FileText, Send, Download, Layers, ShieldCheck, CheckCircle2
} from 'lucide-react';

export const PastorDashboard = () => {
  const { db, refreshDB } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'members', 'add_member', 'materials', 'reports'

  // Church Member Creation Form State
  const [memberForm, setMemberForm] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    gender: 'Male',
    age: 35,
    medeb_zone: 'Stadium_Zuria',
    medib_number: 'Medib-1',
    family_size: 3,
    occupation: 'Government Employee'
  });

  // Teaching Material Dispatch Form State
  const [materialForm, setMaterialForm] = useState({
    title: 'Gospel Evangelism Training Manual 2026',
    target_role: 'Evang',
    file_format: 'PDF',
    description: 'Comprehensive guide for outreach, soul winning, and discipleship.'
  });

  const membersList = db?.church_members || [];

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!memberForm.full_name || !memberForm.phone_number) {
      showToast("Full Name and Phone Number are required", "error");
      return;
    }

    const freshDb = getMockDB();
    const newMb = {
      id: `mb-${Date.now()}`,
      ...memberForm,
      is_active: true,
      created_at: new Date().toISOString()
    };

    freshDb.church_members.unshift(newMb);
    saveMockDB(freshDb);
    refreshDB();

    showToast(`Added ${memberForm.full_name} to Church Members Directory!`, "success");
    setMemberForm({
      full_name: '',
      email: '',
      phone_number: '',
      gender: 'Male',
      age: 35,
      medeb_zone: 'Stadium_Zuria',
      medib_number: 'Medib-1',
      family_size: 3,
      occupation: 'Government Employee'
    });
    setActiveTab('members');
  };

  const handleDispatchMaterial = (e) => {
    e.preventDefault();
    const freshDb = getMockDB();
    if (!freshDb.teaching_materials) freshDb.teaching_materials = [];
    const newMat = {
      id: `mat-${Date.now()}`,
      title: materialForm.title,
      target: materialForm.target_role,
      target_role: materialForm.target_role,
      file_format: materialForm.file_format,
      format: materialForm.file_format,
      description: materialForm.description,
      status: 'Approved',
      file_url: 'pastoral_material.pdf',
      created_at: new Date().toISOString()
    };
    freshDb.teaching_materials.unshift(newMat);
    saveMockDB(freshDb);
    refreshDB();
    showToast(`Teaching Material "${materialForm.title}" dispatched to ${materialForm.target_role} and saved to Database!`, "success");
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Header & Navigation */}
      <div className="card no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--primary-blue)' }}>
            Church Pastor Dashboard
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Pastoral care oversight, member directory, Medeb Sefers, teaching materials & multi-departmental inbox.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('overview')}
            className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Cross size={16} />
            <span>Pastoral Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('members')}
            className={`btn ${activeTab === 'members' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Users size={16} />
            <span>Church Members Directory</span>
          </button>

          <button
            onClick={() => setActiveTab('add_member')}
            className={`btn ${activeTab === 'add_member' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <UserPlus size={16} />
            <span>Add Church Member</span>
          </button>

          <button
            onClick={() => setActiveTab('materials')}
            className={`btn ${activeTab === 'materials' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <BookOpen size={16} />
            <span>Send Teaching Materials</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Pastoral Overview & Stats */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div className="card" style={{ borderLeft: '4px solid var(--primary-blue)' }}>
              <small style={{ color: 'var(--text-muted)' }}>Registered Church Members</small>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-blue)' }}>
                {membersList.length + 1250}
              </h3>
            </div>

            <div className="card" style={{ borderLeft: '4px solid #166534' }}>
              <small style={{ color: 'var(--text-muted)' }}>Medeb Sefer Zones</small>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#166534' }}>5 Zones</h3>
              <small style={{ color: 'var(--text-muted)' }}>50 Sub-Medebs (Medib 1-10)</small>
            </div>

            <div className="card" style={{ borderLeft: '4px solid #854d0e' }}>
              <small style={{ color: 'var(--text-muted)' }}>Evangelists & Missionaries</small>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#854d0e' }}>34 Active</h3>
            </div>

            <div className="card" style={{ borderLeft: '4px solid #9333ea' }}>
              <small style={{ color: 'var(--text-muted)' }}>Weekly Attendance Rate</small>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#9333ea' }}>94.5%</h3>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Departmental Inbox & Reports Dispatch
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
              Receiving weekly reports from: Menfesawi Zerf, Evangelists, Lijoch Zerf, Mothers Leaders, Youth Leaders, Tena Zerf, Timihirt Zerf, Gibrina, ICT, Negade, NGO, Mengist, Legal, and Mehandisoch.
            </p>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-success">✓ Weekly Medeb Attendances Received</span>
              <span className="badge badge-success">✓ Evangelism Harvest Reports Received</span>
              <span className="badge badge-warning">⏳ Sunday Sermon Schedule Pending Review</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Members Directory */}
      {activeTab === 'members' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Church Members Directory</h3>
            <button onClick={() => setActiveTab('add_member')} className="btn btn-primary btn-sm">
              <UserPlus size={16} />
              <span>Add Member</span>
            </button>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Phone Number</th>
                  <th>Gender</th>
                  <th>Age</th>
                  <th>Medeb Sefer Zone & Medib</th>
                  <th>Occupation</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {membersList.map(m => (
                  <tr key={m.id}>
                    <td><strong>{m.full_name}</strong></td>
                    <td>{m.phone_number}</td>
                    <td>{m.gender}</td>
                    <td>{m.age} yrs</td>
                    <td><span className="badge badge-warning">{m.medeb_zone} - {m.medib_number}</span></td>
                    <td>{m.occupation}</td>
                    <td>
                      <span className={`badge ${m.is_active ? 'badge-success' : 'badge-danger'}`}>
                        {m.is_active ? 'Active Member' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Add Member Form */}
      {activeTab === 'add_member' && (
        <div className="card" style={{ maxWidth: '700px', margin: '0 auto', width: '100%' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem', color: 'var(--primary-blue)' }}>
            Add Church Member
          </h3>

          <form onSubmit={handleAddMember}>
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
                <label className="form-label">Occupation</label>
                <input
                  type="text"
                  className="form-control"
                  value={memberForm.occupation}
                  onChange={e => setMemberForm({ ...memberForm, occupation: e.target.value })}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              <UserPlus size={16} />
              <span>Save & Register Member</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: Dispatch Teaching Materials */}
      {activeTab === 'materials' && (
        <div className="card" style={{ maxWidth: '650px', margin: '0 auto', width: '100%' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem', color: 'var(--primary-blue)' }}>
            Dispatch Teaching Materials to Missionaries & Teachers
          </h3>

          <form onSubmit={handleDispatchMaterial}>
            <div className="form-group">
              <label className="form-label">Material Title *</label>
              <input
                type="text"
                required
                className="form-control"
                value={materialForm.title}
                onChange={e => setMaterialForm({ ...materialForm, title: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Target Recipient Role</label>
              <select
                className="form-control"
                value={materialForm.target_role}
                onChange={e => setMaterialForm({ ...materialForm, target_role: e.target.value })}
              >
                <option value="Evang">Evangelists</option>
                <option value="Missionary">Missionaries</option>
                <option value="IntMissionary">International Missionaries</option>
                <option value="CT">Children Teachers</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Upload Material File (PDF / Word)</label>
              <input type="file" className="form-control" accept=".pdf,.doc,.docx" />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
              <Send size={16} />
              <span>Dispatch Teaching Material</span>
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
