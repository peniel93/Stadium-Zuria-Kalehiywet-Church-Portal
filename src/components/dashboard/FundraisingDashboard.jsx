import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/ToastAlert';
import { getMockDB, saveMockDB } from '../../lib/supabase';
import { DollarSign, Users, UserPlus, Send, Calendar, CheckCircle2 } from 'lucide-react';

export const FundraisingDashboard = () => {
  const { db, refreshDB } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('projects');

  const projects = db?.fundraising_projects || [
    { id: '1', title: 'Stadium Building Expansion Fund 2026', target: 5000000, target_amount: 5000000, raised: 3200000, raised_amount: 3200000, status: 'Active' },
    { id: '2', title: 'Evangelism Vehicle Purchase Drive', target: 1200000, target_amount: 1200000, raised: 850000, raised_amount: 850000, status: 'Active' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--primary-blue)' }}>
            Fundraising Team (FTL) Dashboard
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Plan fundraising projects, dispatch fundraising schedules to members & Pastor, and track financial pledges.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={() => setActiveTab('projects')} className={`btn ${activeTab === 'projects' ? 'btn-primary' : 'btn-secondary'}`}>
            <DollarSign size={16} />
            <span>Fundraising Projects</span>
          </button>

          <button onClick={() => setActiveTab('report')} className={`btn ${activeTab === 'report' ? 'btn-primary' : 'btn-secondary'}`}>
            <Send size={16} />
            <span>Report to Pastor</span>
          </button>
        </div>
      </div>

      {activeTab === 'projects' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {projects.map(p => {
            const targetAmt = p.target_amount || p.target || 1;
            const raisedAmt = p.raised_amount || p.raised || 0;
            const pct = Math.min(100, Math.round((raisedAmt / targetAmt) * 100));
            return (
              <div key={p.id} className="card" style={{ borderLeft: '4px solid var(--primary-blue)' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '0.5rem' }}>{p.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  Target: <strong>ETB {targetAmt.toLocaleString()}</strong>
                </p>
                <p style={{ fontSize: '0.875rem', color: '#166534', fontWeight: 700, marginBottom: '0.75rem' }}>
                  Total Raised: ETB {raisedAmt.toLocaleString()} ({pct}%)
                </p>

                <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', backgroundColor: 'var(--primary-blue)' }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'report' && (
        <div className="card" style={{ maxWidth: '650px', margin: '0 auto', width: '100%' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--primary-blue)' }}>
            Submit Fundraising Project Report to Pastor
          </h3>
          <form onSubmit={(e) => {
            e.preventDefault();
            const summaryText = e.target.elements[0].value;
            const freshDb = getMockDB();
            if (!freshDb.leadership_reports_inbox) freshDb.leadership_reports_inbox = [];
            freshDb.leadership_reports_inbox.unshift({
              id: `rep-${Date.now()}`,
              title: 'Fundraising Progress Report',
              report_title: 'Fundraising Progress Report',
              role: 'FTL',
              sender_role: 'FTL',
              recipient_role: 'Pastor',
              accomplishments_summary: summaryText,
              created_at: new Date().toISOString()
            });
            saveMockDB(freshDb);
            refreshDB();
            showToast("Fundraising Progress report submitted to Pastor & saved to Database!", "success");
            e.target.reset();
          }}>
            <div className="form-group">
              <label className="form-label">Fundraising Progress Summary *</label>
              <textarea rows={4} required className="form-control" placeholder="Provide updates on pledge collections and upcoming building expansion drives..." />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <Send size={16} />
              <span>Submit Report to Pastor</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
