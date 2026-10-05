import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/ToastAlert';
import { getMockDB, saveMockDB } from '../../lib/supabase';
import {
  Heart, Globe, Users, UserPlus, FileText, Send, DollarSign, Award, CheckCircle2, Shield
} from 'lucide-react';

export const EvangelistsDashboard = ({ roleTitle = "Evangelists & Missionaries Dashboard" }) => {
  const { db, refreshDB } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('summary'); // 'summary', 'report', 'add_evangelist', 'funding'

  // Evangelist Registration Form
  const [evangelistForm, setEvangelistForm] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    education_level: 'Bachelor Degree',
    church_role: 'Evangelist',
    medeb_zone: 'Stadium_Zuria',
    medib_number: 'Medib-1',
    region: 'Addis Ababa',
    zone_or_woreda: 'Kirkos',
    kebele: '02',
    marital_status: 'Married',
    family_size: 4,
    number_of_sons: 2,
    number_of_daughters: 0,
    name_of_wife: 'Tigist Alemu'
  });

  // Detailed Outreach Report Form State
  const [outreachReport, setOutreachReport] = useState({
    target_area: 'Stadium Zuria Commercial Area',
    male_count: 45,
    female_count: 55,
    repented_and_back_count: 12,
    believed_accepted_jesus_count: 24,
    heard_about_jesus_count: 100,
    healed_count: 6,
    gave_future_hope_count: 30,
    summary_story: 'Powerful outdoor evangelism session with testifiers sharing miraculous healings.',
    target_recipient: 'Pastor'
  });

  // Funding Request Form
  const [fundingForm, setFundingForm] = useState({
    mission_title: 'Cross-Border Regional Evangelism Outreach',
    location: 'Southern Region Mission Field',
    requested_amount: 75000.00,
    next_year_plan: 'Establish 2 permanent mission centers and distribute 500 Bibles.'
  });

  const handleCreateEvangelist = (e) => {
    e.preventDefault();
    if (!evangelistForm.full_name || !evangelistForm.phone_number) {
      showToast("Full Name and Phone Number are required", "error");
      return;
    }
    const freshDb = getMockDB();
    if (!freshDb.users) freshDb.users = [];
    const newEv = {
      id: `usr-${Date.now()}`,
      username_id: `SKHC/Evang/${Math.floor(1000 + Math.random() * 9000)}/2026`,
      full_name: evangelistForm.full_name,
      email: evangelistForm.email,
      phone_number: evangelistForm.phone_number,
      role: 'Evang',
      default_pin: '1234',
      status: 'Active',
      created_at: new Date().toISOString()
    };
    freshDb.users.unshift(newEv);
    saveMockDB(freshDb);
    refreshDB();

    showToast(`Registered Evangelist ${evangelistForm.full_name} in Database! ID: ${newEv.username_id}`, "success");
    setEvangelistForm({
      full_name: '',
      email: '',
      phone_number: '',
      education_level: 'Bachelor Degree',
      church_role: 'Evangelist',
      medeb_zone: 'Stadium_Zuria',
      medib_number: 'Medib-1',
      region: 'Addis Ababa',
      zone_or_woreda: 'Kirkos',
      kebele: '02',
      marital_status: 'Married',
      family_size: 4,
      number_of_sons: 2,
      number_of_daughters: 0,
      name_of_wife: 'Tigist Alemu'
    });
  };

  const handleSendOutreachReport = (e) => {
    e.preventDefault();
    const freshDb = getMockDB();
    if (!freshDb.evangelism_reports) freshDb.evangelism_reports = [];
    const newRep = {
      id: `ev-${Date.now()}`,
      evangelist_name: 'Lead Evangelist',
      target_area: outreachReport.target_area,
      male_count: parseInt(outreachReport.male_count) || 0,
      female_count: parseInt(outreachReport.female_count) || 0,
      repented_and_back_count: parseInt(outreachReport.repented_and_back_count) || 0,
      believed_accepted_jesus_count: parseInt(outreachReport.believed_accepted_jesus_count) || 0,
      heard_about_jesus_count: parseInt(outreachReport.heard_about_jesus_count) || 0,
      healed_count: parseInt(outreachReport.healed_count) || 0,
      gave_future_hope_count: parseInt(outreachReport.gave_future_hope_count) || 0,
      summary_report: outreachReport.summary_story,
      target_recipient_role: outreachReport.target_recipient,
      date: new Date().toISOString().slice(0, 10),
      created_at: new Date().toISOString()
    };
    freshDb.evangelism_reports.unshift(newRep);
    saveMockDB(freshDb);
    refreshDB();
    showToast(`Outreach outcome report sent to ${outreachReport.target_recipient} and saved to Database!`, "success");
  };

  const handleSendFundingRequest = (e) => {
    e.preventDefault();
    const freshDb = getMockDB();
    if (!freshDb.missionary_plans_and_requests) freshDb.missionary_plans_and_requests = [];
    const newReq = {
      id: `m-${Date.now()}`,
      mission_title: fundingForm.mission_title,
      location: fundingForm.location,
      requested_funding_amount: parseFloat(fundingForm.requested_amount) || 0,
      next_year_plan: fundingForm.next_year_plan,
      funding_status: 'Pending',
      created_at: new Date().toISOString()
    };
    freshDb.missionary_plans_and_requests.unshift(newReq);
    saveMockDB(freshDb);
    refreshDB();
    showToast(`Mission plan & funding request of ${fundingForm.requested_amount} ETB saved to Database!`, "success");
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
            Evangelism statistics, outreach outcome reports, mission plans & funding requests.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('summary')}
            className={`btn ${activeTab === 'summary' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Users size={16} />
            <span>Evangelists Directory & Stats</span>
          </button>

          <button
            onClick={() => setActiveTab('report')}
            className={`btn ${activeTab === 'report' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Send size={16} />
            <span>Send Evangelism Report</span>
          </button>

          <button
            onClick={() => setActiveTab('add_evangelist')}
            className={`btn ${activeTab === 'add_evangelist' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <UserPlus size={16} />
            <span>Add New Evangelist</span>
          </button>

          <button
            onClick={() => setActiveTab('funding')}
            className={`btn ${activeTab === 'funding' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <DollarSign size={16} />
            <span>Mission Funding Request</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Summary Statistics & Demographics */}
      {activeTab === 'summary' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div className="card" style={{ borderLeft: '4px solid var(--primary-blue)' }}>
              <small style={{ color: 'var(--text-muted)' }}>Total Evangelists</small>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-blue)' }}>28</h3>
            </div>
            <div className="card" style={{ borderLeft: '4px solid #166534' }}>
              <small style={{ color: 'var(--text-muted)' }}>Male Evangelists</small>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#166534' }}>18</h3>
            </div>
            <div className="card" style={{ borderLeft: '4px solid #854d0e' }}>
              <small style={{ color: 'var(--text-muted)' }}>Female Evangelists</small>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#854d0e' }}>10</h3>
            </div>
            <div className="card" style={{ borderLeft: '4px solid #9333ea' }}>
              <small style={{ color: 'var(--text-muted)' }}>International Missionaries</small>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#9333ea' }}>6</h3>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem' }}>Evangelist Roles & Specializations</h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-success">Menfesawi Zerf Evangelists</span>
              <span className="badge badge-warning">Pastoral Outreach</span>
              <span className="badge badge-danger">Prayers Zerf Team</span>
              <span className="badge badge-success">Youth Zerf Evangelists</span>
              <span className="badge badge-warning">Marriage & Relationship Counselors</span>
              <span className="badge badge-danger">Lijoch Zerf Teachers</span>
              <span className="badge badge-success">Mission & International Evangelism</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Detailed Evangelism Outcome Report */}
      {activeTab === 'report' && (
        <div className="card" style={{ maxWidth: '750px', margin: '0 auto', width: '100%' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem', color: 'var(--primary-blue)' }}>
            Send Evangelism Outcome Report
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Reported to Fathers' Leaders, Menfesawi Zerf, and Church Pastor.
          </p>

          <form onSubmit={handleSendOutreachReport}>
            <div className="form-group">
              <label className="form-label">Target Outreach Area / Zone *</label>
              <input
                type="text"
                required
                className="form-control"
                value={outreachReport.target_area}
                onChange={e => setOutreachReport({ ...outreachReport, target_area: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Male Count Reached</label>
                <input
                  type="number"
                  className="form-control"
                  value={outreachReport.male_count}
                  onChange={e => setOutreachReport({ ...outreachReport, male_count: parseInt(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Female Count Reached</label>
                <input
                  type="number"
                  className="form-control"
                  value={outreachReport.female_count}
                  onChange={e => setOutreachReport({ ...outreachReport, female_count: parseInt(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Accepted Jesus Count</label>
                <input
                  type="number"
                  className="form-control"
                  value={outreachReport.believed_accepted_jesus_count}
                  onChange={e => setOutreachReport({ ...outreachReport, believed_accepted_jesus_count: parseInt(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Repented & Returned</label>
                <input
                  type="number"
                  className="form-control"
                  value={outreachReport.repented_and_back_count}
                  onChange={e => setOutreachReport({ ...outreachReport, repented_and_back_count: parseInt(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Healed Count</label>
                <input
                  type="number"
                  className="form-control"
                  value={outreachReport.healed_count}
                  onChange={e => setOutreachReport({ ...outreachReport, healed_count: parseInt(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Heard Gospel Count</label>
                <input
                  type="number"
                  className="form-control"
                  value={outreachReport.heard_about_jesus_count}
                  onChange={e => setOutreachReport({ ...outreachReport, heard_about_jesus_count: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Outreach Summary & Testimonies</label>
              <textarea
                rows={3}
                className="form-control"
                value={outreachReport.summary_story}
                onChange={e => setOutreachReport({ ...outreachReport, summary_story: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
              <Send size={16} />
              <span>Submit Report to Pastor & Leaders</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: Add New Evangelist Form with complete demographic details */}
      {activeTab === 'add_evangelist' && (
        <div className="card" style={{ maxWidth: '750px', margin: '0 auto', width: '100%' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem', color: 'var(--primary-blue)' }}>
            Register New Evangelist / Missionary
          </h3>

          <form onSubmit={handleCreateEvangelist}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={evangelistForm.full_name}
                  onChange={e => setEvangelistForm({ ...evangelistForm, full_name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={evangelistForm.phone_number}
                  onChange={e => setEvangelistForm({ ...evangelistForm, phone_number: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Education Level</label>
                <input
                  type="text"
                  className="form-control"
                  value={evangelistForm.education_level}
                  onChange={e => setEvangelistForm({ ...evangelistForm, education_level: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Church Role</label>
                <select
                  className="form-control"
                  value={evangelistForm.church_role}
                  onChange={e => setEvangelistForm({ ...evangelistForm, church_role: e.target.value })}
                >
                  <option value="Evangelist">Evangelist</option>
                  <option value="Missionary">Missionary</option>
                  <option value="IntMissionary">International Missionary</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Name of Wife (if married)</label>
                <input
                  type="text"
                  className="form-control"
                  value={evangelistForm.name_of_wife}
                  onChange={e => setEvangelistForm({ ...evangelistForm, name_of_wife: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Number of Sons</label>
                <input
                  type="number"
                  className="form-control"
                  value={evangelistForm.number_of_sons}
                  onChange={e => setEvangelistForm({ ...evangelistForm, number_of_sons: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              <UserPlus size={16} />
              <span>Register Evangelist</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: Mission Funding Request */}
      {activeTab === 'funding' && (
        <div className="card" style={{ maxWidth: '650px', margin: '0 auto', width: '100%' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem', color: 'var(--primary-blue)' }}>
            Submit Mission Plan & Funding Request
          </h3>

          <form onSubmit={handleSendFundingRequest}>
            <div className="form-group">
              <label className="form-label">Mission / Project Title *</label>
              <input
                type="text"
                required
                className="form-control"
                value={fundingForm.mission_title}
                onChange={e => setFundingForm({ ...fundingForm, mission_title: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Target Field Location</label>
              <input
                type="text"
                required
                className="form-control"
                value={fundingForm.location}
                onChange={e => setFundingForm({ ...fundingForm, location: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Requested Budget Amount (ETB) *</label>
              <input
                type="number"
                required
                className="form-control"
                value={fundingForm.requested_amount}
                onChange={e => setFundingForm({ ...fundingForm, requested_amount: parseFloat(e.target.value) })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mission Objectives & Next Year Plan</label>
              <textarea
                rows={3}
                className="form-control"
                value={fundingForm.next_year_plan}
                onChange={e => setFundingForm({ ...fundingForm, next_year_plan: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
              <DollarSign size={16} />
              <span>Submit Funding Request</span>
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
