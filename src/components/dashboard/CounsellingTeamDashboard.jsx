import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/ToastAlert';
import { getMockDB, saveMockDB } from '../../lib/supabase';
import { Heart, FileText, Send, Download, PlusCircle, CheckCircle2 } from 'lucide-react';

export const CounsellingTeamDashboard = () => {
  const { db, refreshDB } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('materials');

  const materials = db?.counselling_materials || [
    { id: '1', title: 'Pre-Marital Counselling & Covenant Guide', format: 'PDF', date: '2026-07-20' },
    { id: '2', title: 'Family & Marriage Conflict Resolution', format: 'Word', date: '2026-07-22' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--primary-blue)' }}>
            Counselling Team (CTL) Dashboard
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Post downloadable counselling materials, report accomplishments to Pastor, and manage counseling team members.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={() => setActiveTab('materials')} className={`btn ${activeTab === 'materials' ? 'btn-primary' : 'btn-secondary'}`}>
            <FileText size={16} />
            <span>Counselling Materials</span>
          </button>

          <button onClick={() => setActiveTab('report')} className={`btn ${activeTab === 'report' ? 'btn-primary' : 'btn-secondary'}`}>
            <Send size={16} />
            <span>Report to Pastor</span>
          </button>
        </div>
      </div>

      {activeTab === 'materials' && (
        <div className="card">
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--primary-blue)' }}>
            Downloadable Counselling Resources Library
          </h3>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Material Title</th>
                  <th>File Format</th>
                  <th>Date Uploaded</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {materials.map(m => (
                  <tr key={m.id}>
                    <td><strong>{m.title}</strong></td>
                    <td><span className="badge badge-warning">{m.format}</span></td>
                    <td>{m.date}</td>
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

      {activeTab === 'report' && (
        <div className="card" style={{ maxWidth: '650px', margin: '0 auto', width: '100%' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--primary-blue)' }}>
            Report Counselling Accomplishments to Pastor
          </h3>
          <form onSubmit={(e) => {
            e.preventDefault();
            const summaryText = e.target.elements[0].value;
            const freshDb = getMockDB();
            if (!freshDb.leadership_reports_inbox) freshDb.leadership_reports_inbox = [];
            freshDb.leadership_reports_inbox.unshift({
              id: `rep-${Date.now()}`,
              title: 'Counselling Team Accomplishment Report',
              report_title: 'Counselling Team Accomplishment Report',
              role: 'CTL',
              sender_role: 'CTL',
              recipient_role: 'Pastor',
              accomplishments_summary: summaryText,
              created_at: new Date().toISOString()
            });
            saveMockDB(freshDb);
            refreshDB();
            showToast("Counselling Accomplishment report submitted to Pastor & saved to Database!", "success");
            e.target.reset();
          }}>
            <div className="form-group">
              <label className="form-label">Report Summary</label>
              <textarea rows={4} required className="form-control" placeholder="Summarize counseling sessions, marriage guidance..." />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <Send size={16} />
              <span>Submit Report</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
