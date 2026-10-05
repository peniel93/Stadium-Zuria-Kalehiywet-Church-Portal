import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/ToastAlert';
import { getMockDB, saveMockDB } from '../../lib/supabase';
import { BookOpen, Send, Download, PlusCircle, CheckCircle2, UserPlus } from 'lucide-react';

export const EducationTrainingDashboard = () => {
  const { db, refreshDB } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('materials');

  const materials = db?.teaching_materials || [
    { id: '1', title: 'New Believers Foundation Course 2026', target: 'Menfesawi Zerf & Youth', format: 'PDF', status: 'Approved' },
    { id: '2', title: 'Sunday School Teacher Training Manual', target: 'Lijoch Zerf', format: 'Word', status: 'Pending Approval' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--primary-blue)' }}>
            Education & Training Team (ETTL) Dashboard
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Prepare educational materials, post for Menfesawi Zerf & Pastoral approval, and organize training workshops.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={() => setActiveTab('materials')} className={`btn ${activeTab === 'materials' ? 'btn-primary' : 'btn-secondary'}`}>
            <BookOpen size={16} />
            <span>Educational Materials</span>
          </button>

          <button onClick={() => setActiveTab('upload')} className={`btn ${activeTab === 'upload' ? 'btn-primary' : 'btn-secondary'}`}>
            <PlusCircle size={16} />
            <span>Upload New Material</span>
          </button>
        </div>
      </div>

      {activeTab === 'materials' && (
        <div className="card">
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--primary-blue)' }}>
            Prepared Curriculum Materials & Approval Status
          </h3>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Material Title</th>
                  <th>Target Audience</th>
                  <th>Format</th>
                  <th>Approval Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {materials.map(m => (
                  <tr key={m.id}>
                    <td><strong>{m.title}</strong></td>
                    <td>{m.target}</td>
                    <td><span className="badge badge-warning">{m.format}</span></td>
                    <td>
                      <span className={`badge ${m.status === 'Approved' ? 'badge-success' : 'badge-warning'}`}>
                        {m.status}
                      </span>
                    </td>
                    <td>
                      <button onClick={() => showToast(`Downloading ${m.title}...`, "info")} className="btn btn-primary btn-sm">
                        <Download size={14} />
                        <span>Download</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'upload' && (
        <div className="card" style={{ maxWidth: '650px', margin: '0 auto', width: '100%' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--primary-blue)' }}>
            Upload Material for Menfesawi Zerf Approval
          </h3>
          <form onSubmit={(e) => {
            e.preventDefault();
            const form = e.target;
            const freshDb = getMockDB();
            if (!freshDb.teaching_materials) freshDb.teaching_materials = [];
            const newMat = {
              id: `mat-${Date.now()}`,
              title: form.title.value,
              target: form.target.value,
              target_role: form.target.value,
              format: 'PDF',
              file_format: 'PDF',
              status: 'Pending Approval',
              file_url: 'educational_material.pdf',
              created_at: new Date().toISOString()
            };
            freshDb.teaching_materials.unshift(newMat);
            saveMockDB(freshDb);
            refreshDB();
            showToast(`Educational material "${form.title.value}" submitted and saved to Database!`, "success");
            setActiveTab('materials');
          }}>
            <div className="form-group">
              <label className="form-label">Material Title *</label>
              <input type="text" name="title" required className="form-control" placeholder="e.g. Leadership & Discipleship Level 1" />
            </div>

            <div className="form-group">
              <label className="form-label">Target Recipient Audience</label>
              <select name="target" className="form-control">
                <option value="Menfesawi Zerf & Youth">Menfesawi Zerf & Youth</option>
                <option value="Lijoch Zerf">Lijoch Zerf (Children Teachers)</option>
                <option value="Evangelists & Missionaries">Evangelists & Missionaries</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Upload File (PDF or Word)</label>
              <input type="file" required className="form-control" accept=".pdf,.doc,.docx" />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <Send size={16} />
              <span>Submit for Approval</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
