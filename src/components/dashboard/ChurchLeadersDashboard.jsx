import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/ToastAlert';
import { getMockDB, saveMockDB } from '../../lib/supabase';
import {
  Users, UserPlus, FileText, Send, Download, Printer, Upload, MessageSquare, Briefcase, Calendar, CheckCircle2, Shield
} from 'lucide-react';

export const ChurchLeadersDashboard = ({ roleTitle = "Fathers' Church Leader (FCL)" }) => {
  const { db, refreshDB } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('reports'); // 'reports', 'leaders', 'evangelist_reports', 'announcements'

  // Leader Creation Form
  const [leaderForm, setLeaderForm] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    date_of_birth: '',
    mideb_sefer: 'Stadium_Zuria',
    address: '',
    region: 'Addis Ababa',
    kebele: '02',
    leadership_role: 'Sebsabi',
    round_of_leadership: 'Term 2026'
  });

  // Report Submission Form
  const [reportForm, setReportForm] = useState({
    report_title: '',
    accomplishments_summary: '',
    next_year_plans: '',
    budget_allocated: 50000,
    budget_spent: 32000,
    file_attachment: 'accomplishment_report.pdf'
  });

  // Submitted Reports state
  const reportsList = db?.leadership_reports_inbox || [
    {
      id: 'rep-1',
      title: 'Annual Discipleship & Evangelism Report 2025/2026',
      report_title: 'Annual Discipleship & Evangelism Report 2025/2026',
      role: roleTitle,
      accomplishments: 'Organized 12 youth conferences, reached 450 individuals, established 3 new Medeb Sefers.',
      accomplishments_summary: 'Organized 12 youth conferences, reached 450 individuals, established 3 new Medeb Sefers.',
      plans: 'Expand night chapel prayer groups and train 20 new cell leaders.',
      next_year_plans: 'Expand night chapel prayer groups and train 20 new cell leaders.',
      budget_allocated: 50000,
      budget_spent: 32000,
      attachment: 'annual_report_2026.pdf',
      date: '2026-07-20'
    }
  ];

  // Evangelist Reports Inbox
  const evangelistReports = db?.evangelism_reports || [
    {
      id: 'ev-rep-1',
      evangelist_name: 'Lead Evangelist Solomon',
      target_area: 'Mercato Outreach Zone',
      reached: 120,
      accepted_jesus: 28,
      healed: 5,
      date: '2026-07-24',
      comments: 'Praise God! Great harvest.'
    }
  ];
  const [commentText, setCommentText] = useState('');
  const [selectedEvReportId, setSelectedEvReportId] = useState(null);

  const handleAddLeader = (e) => {
    e.preventDefault();
    const freshDb = getMockDB();
    if (!freshDb.users) freshDb.users = [];
    const newL = {
      id: `usr-${Date.now()}`,
      username_id: `SKHC/${leaderForm.leadership_role}/${Math.floor(1000 + Math.random() * 9000)}/2026`,
      full_name: leaderForm.full_name,
      email: leaderForm.email,
      phone_number: leaderForm.phone_number,
      role: 'Member',
      leadership_role: leaderForm.leadership_role,
      default_pin: '1234',
      status: 'Active',
      created_at: new Date().toISOString()
    };
    freshDb.users.unshift(newL);
    saveMockDB(freshDb);
    refreshDB();
    showToast(`Church Leader ${leaderForm.full_name} registered successfully in Database!`, "success");
    setLeaderForm({
      full_name: '',
      email: '',
      phone_number: '',
      date_of_birth: '',
      mideb_sefer: 'Stadium_Zuria',
      address: '',
      region: 'Addis Ababa',
      kebele: '02',
      leadership_role: 'Sebsabi',
      round_of_leadership: 'Term 2026'
    });
  };

  const handleSendReport = (e) => {
    e.preventDefault();
    if (!reportForm.report_title) {
      showToast("Report Title is required", "error");
      return;
    }

    const freshDb = getMockDB();
    if (!freshDb.leadership_reports_inbox) freshDb.leadership_reports_inbox = [];
    const newRep = {
      id: `rep-${Date.now()}`,
      title: reportForm.report_title,
      report_title: reportForm.report_title,
      role: roleTitle,
      sender_role: roleTitle,
      recipient_role: 'MainRegistrar',
      accomplishments: reportForm.accomplishments_summary,
      accomplishments_summary: reportForm.accomplishments_summary,
      plans: reportForm.next_year_plans,
      next_year_plans: reportForm.next_year_plans,
      budget_allocated: reportForm.budget_allocated,
      budget_spent: reportForm.budget_spent,
      attachment: reportForm.file_attachment,
      date: new Date().toISOString().slice(0, 10),
      created_at: new Date().toISOString()
    };

    freshDb.leadership_reports_inbox.unshift(newRep);
    saveMockDB(freshDb);
    refreshDB();
    showToast("Accomplishment & Budget Report submitted to Main Registrar & Pastor in Database!", "success");
    setReportForm({
      report_title: '',
      accomplishments_summary: '',
      next_year_plans: '',
      budget_allocated: 50000,
      budget_spent: 32000,
      attachment: 'accomplishment_report.pdf'
    });
  };

  const handleAddComment = (reportId) => {
    if (!commentText) return;
    const freshDb = getMockDB();
    if (!freshDb.evangelism_reports) freshDb.evangelism_reports = [];
    const idx = freshDb.evangelism_reports.findIndex(r => r.id === reportId);
    if (idx !== -1) {
      freshDb.evangelism_reports[idx].comments = commentText;
      saveMockDB(freshDb);
      refreshDB();
      showToast("Comment sent back to Evangelist & saved to Database!", "success");
    }
    setCommentText('');
    setSelectedEvReportId(null);
  };

  const handleExportCSV = () => {
    let csv = "Report Title,Accomplishments,Next Year Plans,Budget Allocated,Budget Spent,Date\n";
    reportsList.forEach(r => {
      csv += `"${r.title}","${r.accomplishments}","${r.plans}",${r.budget_allocated},${r.budget_spent},"${r.date}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Leadership_Reports_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    showToast("Exported reports to CSV!", "success");
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Header & Tabs */}
      <div className="card no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--primary-blue)' }}>
            {roleTitle} Dashboard
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Submit accomplishment reports, manage leaders, review evangelist reports, and post announcements.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('reports')}
            className={`btn ${activeTab === 'reports' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <FileText size={16} />
            <span>Submit Accomplishments</span>
          </button>

          <button
            onClick={() => setActiveTab('leaders')}
            className={`btn ${activeTab === 'leaders' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <UserPlus size={16} />
            <span>Add Church Leader</span>
          </button>

          <button
            onClick={() => setActiveTab('evangelist_reports')}
            className={`btn ${activeTab === 'evangelist_reports' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <MessageSquare size={16} />
            <span>Evangelist Reports</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Reports Submission & PDF/Word/PPT attachment */}
      {activeTab === 'reports' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ maxWidth: '750px', margin: '0 auto', width: '100%' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--primary-blue)' }}>
              Submit Leadership & Financial Accomplishment Report
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Upload files in PDF, Word, or PowerPoint presentations.
            </p>

            <form onSubmit={handleSendReport}>
              <div className="form-group">
                <label className="form-label">Report Title *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. Q3 Ministry & Evangelism Accomplishments"
                  value={reportForm.report_title}
                  onChange={e => setReportForm({ ...reportForm, report_title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Annual Accomplishments Summary</label>
                <textarea
                  rows={3}
                  className="form-control"
                  placeholder="Summarize key milestones achieved..."
                  value={reportForm.accomplishments_summary}
                  onChange={e => setReportForm({ ...reportForm, accomplishments_summary: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Next Year Ministry Plans</label>
                <textarea
                  rows={2}
                  className="form-control"
                  placeholder="Outline future objectives and outreach plans..."
                  value={reportForm.next_year_plans}
                  onChange={e => setReportForm({ ...reportForm, next_year_plans: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Budget Allocated (ETB)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={reportForm.budget_allocated}
                    onChange={e => setReportForm({ ...reportForm, budget_allocated: parseFloat(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Budget Spent (ETB)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={reportForm.budget_spent}
                    onChange={e => setReportForm({ ...reportForm, budget_spent: parseFloat(e.target.value) })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Upload Report File (PDF / Word / PPT)</label>
                <input type="file" className="form-control" accept=".pdf,.doc,.docx,.ppt,.pptx" />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                <Send size={16} />
                <span>Submit Report to Main Registrar & Pastor</span>
              </button>
            </form>
          </div>

          {/* Submitted Reports History */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Submitted Leadership Reports History</h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={handleExportCSV} className="btn btn-secondary btn-sm">
                  <Download size={14} />
                  <span>Export CSV</span>
                </button>
                <button onClick={() => window.print()} className="btn btn-primary btn-sm">
                  <Printer size={14} />
                  <span>Print Report</span>
                </button>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Report Title</th>
                    <th>Date</th>
                    <th>Budget Allocated</th>
                    <th>Budget Spent</th>
                    <th>Attachment</th>
                  </tr>
                </thead>
                <tbody>
                  {reportsList.map(r => (
                    <tr key={r.id}>
                      <td><strong>{r.title}</strong></td>
                      <td>{r.date}</td>
                      <td>{r.budget_allocated?.toLocaleString()} ETB</td>
                      <td style={{ color: 'var(--primary-blue)', fontWeight: 700 }}>
                        {r.budget_spent?.toLocaleString()} ETB
                      </td>
                      <td>
                        <span className="badge badge-success">{r.attachment}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Add Church Leader */}
      {activeTab === 'leaders' && (
        <div className="card" style={{ maxWidth: '750px', margin: '0 auto', width: '100%' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem', color: 'var(--primary-blue)' }}>
            Add Church Leader
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Enter leader information and assign leadership role.
          </p>

          <form onSubmit={handleAddLeader}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. Deacon Solomon Alemu"
                  value={leaderForm.full_name}
                  onChange={e => setLeaderForm({ ...leaderForm, full_name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email (Optional)</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="leader@skhc.org"
                  value={leaderForm.email}
                  onChange={e => setLeaderForm({ ...leaderForm, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="+251 911 000 000"
                  value={leaderForm.phone_number}
                  onChange={e => setLeaderForm({ ...leaderForm, phone_number: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Date of Birth (Optional)</label>
                <input
                  type="date"
                  className="form-control"
                  value={leaderForm.date_of_birth}
                  onChange={e => setLeaderForm({ ...leaderForm, date_of_birth: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Role in Leadership</label>
                <select
                  className="form-control"
                  value={leaderForm.leadership_role}
                  onChange={e => setLeaderForm({ ...leaderForm, leadership_role: e.target.value })}
                >
                  <option value="Sebsabi">Sebsabi (Chairman)</option>
                  <option value="Hisab_Shum">Hisab Shum (Auditor)</option>
                  <option value="Mikitel_Sebsabi">Mikitel Sebsabi (Vice Chairman)</option>
                  <option value="Genzeb_Yazh">Genzeb Yazh (Treasurer)</option>
                  <option value="Gabicha_Asfetsami">Gabicha Asfetsami</option>
                  <option value="Tsehafi">Tsehafi (Secretary)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Round of Leadership</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Round 2026 - 2028"
                  value={leaderForm.round_of_leadership}
                  onChange={e => setLeaderForm({ ...leaderForm, round_of_leadership: e.target.value })}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              <UserPlus size={16} />
              <span>Save & Register Leader</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: Evangelist Reports Review & Commenting */}
      {activeTab === 'evangelist_reports' && (
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--primary-blue)' }}>
            Evangelism Accomplishments Inbox & Feedback
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {evangelistReports.map(er => (
              <div key={er.id} style={{
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                backgroundColor: 'var(--bg-card)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h4 style={{ fontSize: '1.0625rem', fontWeight: 700 }}>{er.evangelist_name} — {er.target_area}</h4>
                  <span className="badge badge-success">{er.date}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', textAlign: 'center', margin: '0.75rem 0', backgroundColor: 'var(--primary-light-blue)', padding: '0.75rem', borderRadius: '6px' }}>
                  <div>
                    <small>Reached</small>
                    <div style={{ fontWeight: 800, fontSize: '1.125rem' }}>{er.reached}</div>
                  </div>
                  <div>
                    <small>Accepted Jesus</small>
                    <div style={{ fontWeight: 800, fontSize: '1.125rem', color: 'var(--primary-blue)' }}>{er.accepted_jesus}</div>
                  </div>
                  <div>
                    <small>Healed</small>
                    <div style={{ fontWeight: 800, fontSize: '1.125rem' }}>{er.healed}</div>
                  </div>
                </div>

                {er.comments && (
                  <p style={{ fontSize: '0.875rem', color: 'var(--primary-dark-blue)', backgroundColor: '#f0f9ff', padding: '0.625rem', borderRadius: '6px', marginTop: '0.5rem' }}>
                    <strong>Leader Feedback Sent:</strong> "{er.comments}"
                  </p>
                )}

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Write review comment to send back to Evangelist..."
                    value={selectedEvReportId === er.id ? commentText : ''}
                    onFocus={() => setSelectedEvReportId(er.id)}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <button
                    onClick={() => handleAddComment(er.id)}
                    className="btn btn-primary btn-sm"
                    style={{ flexShrink: 0 }}
                  >
                    <Send size={14} />
                    <span>Send Comment</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
