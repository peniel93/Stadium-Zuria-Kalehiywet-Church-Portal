import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/ToastAlert';
import { getMockDB, saveMockDB } from '../../lib/supabase';
import {
  Users, UserPlus, KeyRound, Settings, Briefcase, FileText,
  Upload, Download, Printer, Shield, RefreshCw, Layers, CheckCircle2, Trash2, Megaphone,
  Landmark, CreditCard, Share2, Calendar, Clock
} from 'lucide-react';

export const MainRegistrarDashboard = () => {
  const { db, refreshDB, createUser, resetUserPIN, toggleUserStatus, updateSiteSettings } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('users'); // 'users', 'create_user', 'settings', 'vacancies', 'grades', 'zones', 'materials'

  // Media Attachment State for Announcements & Gallery Moments
  const [annMedia, setAnnMedia] = useState(null); // { url, type, name }
  const [galleryCategory, setGalleryCategory] = useState('conference');

  const handleMediaSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const isVideo = file.type.startsWith('video/');
    const reader = new FileReader();
    reader.onload = (event) => {
      setAnnMedia({
        url: event.target.result,
        type: isVideo ? 'video' : 'image',
        name: file.name
      });
    };
    reader.readAsDataURL(file);
  };

  // New User Form State
  const [newUserForm, setNewUserForm] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    role: 'None',
    custom_role: '',
    leadership_role: 'None',
    medeb_zone: 'Stadium_Zuria',
    medib_number: 'Medib-1',
    round_of_leadership: 'Term 2026'
  });

  // Site Settings Form State
  const [siteSettingsForm, setSiteSettingsForm] = useState(() => db?.site_settings || {});

  // Vacancy Posting Form State
  const [vacancyForm, setVacancyForm] = useState({
    title: '',
    job_type: 'Full-Time',
    description: '',
    place_of_application: 'SKHC Main Office',
    application_start_date: '2026-07-27',
    expiry_date: '2026-08-30'
  });

  // Exam & Interview Schedule Form State
  const [examScheduleForm, setExamScheduleForm] = useState({
    vacancy_id: '',
    notice_type: 'Written_Exam', // 'Written_Exam', 'Interview', 'Combined'
    title: '',
    written_exam_date: '2026-09-02T09:00',
    written_exam_venue: 'SKHC Main Fellowship Hall',
    interview_date: '2026-09-04T14:00',
    interview_venue: 'Pastoral Conference Room 3',
    instructions: 'Please bring original Fayda ID card, Bible Degree certificate, and exam invitation ticket.'
  });

  const handleCreateExamSchedule = (e) => {
    e.preventDefault();
    if (!examScheduleForm.vacancy_id) {
      showToast("Please select a job vacancy to schedule notices for.", "error");
      return;
    }
    const freshDb = getMockDB();
    if (!freshDb.exam_announcements) freshDb.exam_announcements = [];
    const newSchedule = {
      id: `exam-${Date.now()}`,
      ...examScheduleForm
    };
    freshDb.exam_announcements.unshift(newSchedule);
    saveMockDB(freshDb);
    refreshDB();
    const typeLabel = examScheduleForm.notice_type === 'Written_Exam' ? 'Call for Written Exam' : examScheduleForm.notice_type === 'Interview' ? 'Call for Interview' : 'Written & Interview Notice';
    showToast(`${typeLabel} published to portal!`, "success");
    setExamScheduleForm({
      vacancy_id: '',
      notice_type: 'Written_Exam',
      title: '',
      written_exam_date: '',
      written_exam_venue: '',
      interview_date: '',
      interview_venue: '',
      instructions: 'Please bring original Fayda ID card, degree certificates, and exam ticket.'
    });
  };

  // Children Grade Exporter State
  const [childrenGrades, setChildrenGrades] = useState(() => {
    const rawGrades = [
      { id: '1', name: 'Hannah Solomon', age: 8, section: 'A', test: 45, exam: 48, total: 93, average: 93, rank: 1 },
      { id: '2', name: 'Daniel Yonas', age: 9, section: 'A', test: 40, exam: 45, total: 85, average: 85, rank: 2 },
      { id: '3', name: 'Bethelhem Markos', age: 8, section: 'B', test: 38, exam: 42, total: 80, average: 80, rank: 3 }
    ];
    return rawGrades;
  });

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUserForm.full_name) {
      showToast("Full Name is required", "error");
      return;
    }

    let finalRole = newUserForm.role;
    if (newUserForm.role === 'Other') {
      if (!newUserForm.custom_role || !newUserForm.custom_role.trim()) {
        showToast("Please enter a custom role name for 'Other'", "error");
        return;
      }
      finalRole = newUserForm.custom_role.trim();
    } else if (newUserForm.role === 'None' || !newUserForm.role) {
      finalRole = 'Admin';
    }

    const isNoLeadership = !newUserForm.leadership_role || newUserForm.leadership_role === 'None';
    const created = createUser({
      ...newUserForm,
      role: finalRole,
      leadership_role: newUserForm.leadership_role || 'None',
      round_of_leadership: isNoLeadership ? '-' : (newUserForm.round_of_leadership || 'Term 2026')
    });

    showToast(`User created successfully! ID: ${created.username_id} | Default PIN: ${created.default_pin}`, "success");
    setActiveTab('users');
    setNewUserForm({
      full_name: '',
      email: '',
      phone_number: '',
      role: 'None',
      custom_role: '',
      leadership_role: 'None',
      medeb_zone: 'Stadium_Zuria',
      medib_number: 'Medib-1',
      round_of_leadership: 'Term 2026'
    });
  };

  const handleLogoFilePick = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setSiteSettingsForm(prev => ({
        ...prev,
        logo_url: event.target.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleHeroBgFilePick = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setSiteSettingsForm(prev => ({
        ...prev,
        hero_background_url: event.target.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      if (updateSiteSettings) {
        await updateSiteSettings(siteSettingsForm);
      } else {
        const freshDb = getMockDB();
        freshDb.site_settings = { ...freshDb.site_settings, ...siteSettingsForm };
        saveMockDB(freshDb);
        refreshDB();
      }
      showToast("Site settings & logo/background image changes saved to database across all devices!", "success");
    } catch (err) {
      console.error("Error saving site settings:", err);
      showToast("Failed to save site settings to database.", "error");
    }
  };

  const handleCreateVacancy = (e) => {
    e.preventDefault();
    const freshDb = getMockDB();
    const newVac = {
      id: `vac-${Date.now()}`,
      ...vacancyForm,
      is_active: true
    };
    freshDb.vacancies.unshift(newVac);
    saveMockDB(freshDb);
    refreshDB();
    showToast("Job Vacancy posted to public portal!", "success");
    setVacancyForm({
      title: '',
      job_type: 'Full-Time',
      description: '',
      place_of_application: 'SKHC Main Office',
      application_start_date: '2026-07-27',
      expiry_date: '2026-08-30'
    });
  };

  // Export to CSV helper
  const handleExportCSV = () => {
    let csv = "Rank,Student Name,Age,Section,Test Score,Exam Score,Average,Total Score\n";
    childrenGrades.forEach(g => {
      csv += `${g.rank},"${g.name}",${g.age},"${g.section}",${g.test},${g.exam},${g.average},${g.total}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Children_Grades_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    showToast("Children grades exported to CSV file!", "success");
  };

  const handlePrintReport = () => {
    window.print();
  };

  const [showMoreTabs, setShowMoreTabs] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className="card" style={{ borderLeft: '4px solid var(--primary-blue)' }}>
          <small style={{ color: 'var(--text-muted)' }}>Registered Portal Users</small>
          <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-blue)' }}>{db?.users?.length || 0}</h3>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #166534' }}>
          <small style={{ color: 'var(--text-muted)' }}>Active Job Vacancies</small>
          <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#166534' }}>{db?.job_vacancies?.length || 0}</h3>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #854d0e' }}>
          <small style={{ color: 'var(--text-muted)' }}>Job Applicants</small>
          <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#854d0e' }}>{db?.job_applications?.length || 0}</h3>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #9333ea' }}>
          <small style={{ color: 'var(--text-muted)' }}>Announcements Posted</small>
          <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#9333ea' }}>{db?.portal_announcements?.length || 0}</h3>
        </div>
      </div>

      {/* Quick Action Navigation Bar with Show More / Show Less */}
      <div className="card no-print" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary-blue)' }}>
            Main Registrar Control Tabs
          </span>

          <button
            onClick={() => setShowMoreTabs(!showMoreTabs)}
            className="btn btn-secondary btn-sm"
          >
            <span>{showMoreTabs ? 'Show Less Tabs ▲' : 'Show More Tabs ▼'}</span>
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* Primary Quick Access Tabs */}
          <button
            onClick={() => setActiveTab('users')}
            className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Users size={16} />
            <span>User Management</span>
          </button>

          <button
            onClick={() => setActiveTab('create_user')}
            className={`btn ${activeTab === 'create_user' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <UserPlus size={16} />
            <span>Add New Portal User</span>
          </button>

          <button
            onClick={() => setActiveTab('announcements_events')}
            className={`btn ${activeTab === 'announcements_events' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Megaphone size={16} />
            <span>Post Announcements & Gallery</span>
          </button>

          {/* Secondary Extended Tabs (Shown when Expanded or selected) */}
          {(showMoreTabs || activeTab === 'settings' || activeTab === 'vacancies' || activeTab === 'grades') && (
            <>
              <button
                onClick={() => setActiveTab('settings')}
                className={`btn ${activeTab === 'settings' ? 'btn-primary' : 'btn-secondary'}`}
              >
                <Settings size={16} />
                <span>Site Settings & Logo</span>
              </button>

              <button
                onClick={() => setActiveTab('vacancies')}
                className={`btn ${activeTab === 'vacancies' ? 'btn-primary' : 'btn-secondary'}`}
              >
                <Briefcase size={16} />
                <span>Vacancies & Exams</span>
              </button>

              <button
                onClick={() => setActiveTab('grades')}
                className={`btn ${activeTab === 'grades' ? 'btn-primary' : 'btn-secondary'}`}
              >
                <FileText size={16} />
                <span>Children Grades & Export</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* TAB 6: Post Announcements & Gallery Events */}
      {activeTab === 'announcements_events' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ maxWidth: '750px', margin: '0 auto', width: '100%' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem', color: 'var(--primary-blue)' }}>
              Publish Announcement & Gallery Moment (Images & Videos)
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              Upload image or video files to publish directly to the public website, gallery moments, and member portals.
            </p>

            <form onSubmit={(e) => {
              e.preventDefault();
              const form = e.target;
              const title = form.ann_title.value;
              const content = form.ann_content.value;
              const expiry = form.ann_expiry.value;

              const freshDb = getMockDB();
              if (!freshDb.portal_announcements) freshDb.portal_announcements = [];
              if (!freshDb.gallery_events) freshDb.gallery_events = [];

              const newAnnouncement = {
                id: `ann-${Date.now()}`,
                title,
                content,
                posted_by_role: 'MainRegistrar',
                media_url: annMedia?.url || null,
                media_type: annMedia?.type || null,
                created_at: new Date().toISOString().slice(0, 10),
                expiry_date: expiry || '2026-12-31'
              };

              freshDb.portal_announcements.unshift(newAnnouncement);

              if (annMedia) {
                freshDb.gallery_events.unshift({
                  id: `gal-${Date.now()}`,
                  title,
                  description: content,
                  date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                  category: galleryCategory,
                  venue: 'SKHC Main Sanctuary',
                  image: annMedia.url,
                  media_type: annMedia.type,
                  posted_by_role: 'MainRegistrar'
                });
              }

              saveMockDB(freshDb);
              refreshDB();
              showToast("Announcement & Gallery Moment published successfully!", "success");
              form.reset();
              setAnnMedia(null);
            }}>
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input type="text" name="ann_title" required className="form-control" placeholder="e.g. Annual Youth Worship Night 2026" />
              </div>

              <div className="form-group">
                <label className="form-label">Content Description *</label>
                <textarea name="ann_content" rows={3} required className="form-control" placeholder="Detail the event, moment, or announcement..." />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-control"
                    value={galleryCategory}
                    onChange={e => setGalleryCategory(e.target.value)}
                  >
                    <option value="conference">Conferences</option>
                    <option value="choir">Choir & Worship</option>
                    <option value="outreach">Outreach & Health</option>
                    <option value="training">Trainings</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Expiry Date</label>
                  <input type="date" name="ann_expiry" className="form-control" />
                </div>
              </div>

              {/* File Input for Media Attachments */}
              <div className="form-group" style={{ backgroundColor: 'var(--primary-light-blue)', padding: '1rem', borderRadius: '8px' }}>
                <label className="form-label" style={{ fontWeight: 700 }}>Attach Image or Video File (Gallery Moment / Banner)</label>
                <input
                  type="file"
                  accept="image/*,video/*"
                  className="form-control"
                  onChange={handleMediaSelect}
                />
                
                {annMedia && (
                  <div style={{ marginTop: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span className="badge badge-success">
                        Attached {annMedia.type.toUpperCase()}: {annMedia.name}
                      </span>
                      <button type="button" onClick={() => setAnnMedia(null)} className="btn btn-secondary btn-sm">
                        Remove File
                      </button>
                    </div>

                    <div style={{ borderRadius: '6px', overflow: 'hidden', maxHeight: '200px' }}>
                      {annMedia.type === 'video' ? (
                        <video src={annMedia.url} controls style={{ width: '100%', maxHeight: '200px' }} />
                      ) : (
                        <img src={annMedia.url} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} />
                      )}
                    </div>
                  </div>
                )}
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                <Megaphone size={16} />
                <span>Publish Announcement & Media Moment</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 1: User Management & Auto ID List */}
      {activeTab === 'users' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Portal Users Registry ({db?.users?.length || 0})</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Auto-generated Username IDs in format: <code>SKHC/Role_name/4-digit-id/year_of_creation</code>
              </p>
            </div>

            <button onClick={() => setActiveTab('create_user')} className="btn btn-primary btn-sm">
              <UserPlus size={16} />
              <span>Create New User</span>
            </button>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Username ID</th>
                  <th>Full Name</th>
                  <th>Role</th>
                  <th>Default Password PIN</th>
                  <th>Leadership Round</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(db?.users || []).map(u => (
                  <tr key={u.id}>
                    <td>
                      <code style={{ fontWeight: 700, color: 'var(--primary-blue)' }}>{u.username_id}</code>
                    </td>
                    <td>{u.full_name}</td>
                    <td>
                      <span className="badge badge-warning">{u.role}</span>
                    </td>
                    <td>
                      <code style={{ backgroundColor: 'var(--primary-light-blue)', padding: '0.2rem 0.6rem', borderRadius: '4px', color: 'var(--primary-blue)', fontWeight: 800, fontSize: '0.9375rem' }}>
                        {u.default_pin || u.password_pin || '1234'}
                      </code>
                    </td>
                    <td>
                      {!u.leadership_role || u.leadership_role === 'None' || u.leadership_role === 'Member' || u.round_of_leadership === '-'
                        ? '-'
                        : (u.round_of_leadership || '-')}
                    </td>
                    <td>
                      <span className={`badge ${u.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => { resetUserPIN(u.id); showToast(`Reset PIN to default '1234' for ${u.full_name}`, "info"); }}
                        className="btn btn-secondary btn-sm"
                        title="Reset 4-Digit Password PIN to 1234"
                      >
                        <KeyRound size={14} />
                        <span>Reset PIN</span>
                      </button>

                      <button
                        onClick={() => { toggleUserStatus(u.id); showToast(`Updated status for ${u.full_name}`, "info"); }}
                        className="btn btn-secondary btn-sm"
                      >
                        <RefreshCw size={14} />
                        <span>Toggle Status</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Create User with Auto Generated ID & 4-Digit PIN */}
      {activeTab === 'create_user' && (
        <div className="card" style={{ maxWidth: '700px', margin: '0 auto', width: '100%' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem', color: 'var(--primary-blue)' }}>
            Create & Assign New Church Role
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Username ID will be automatically generated upon creation. Assigning a church role is optional (user will be created as Admin only if no church role is selected).
          </p>

          <form onSubmit={handleCreateUser}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. Deacon Michael Wolde"
                  value={newUserForm.full_name}
                  onChange={e => setNewUserForm({ ...newUserForm, full_name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Assign Church Role <span style={{ fontWeight: 400, fontSize: '0.75rem', color: 'var(--text-muted)' }}>(Optional / Admin Only)</span>
                </label>
                <select
                  className="form-control"
                  value={newUserForm.role}
                  onChange={e => setNewUserForm({ ...newUserForm, role: e.target.value })}
                >
                  <option value="None">-- No Church Role (Admin Only) --</option>
                  <option value="Other">-- Other (Specify Custom Role) --</option>
                  <optgroup label="Standard 44 Church Roles">
                    <option value="FCL">1. Fathers Church Leader (FCL)</option>
                    <option value="MCL">2. Mothers Church Leader (MCL)</option>
                    <option value="YL">3. Youth Leader (YL)</option>
                    <option value="FMSL">4. Fathers Mideb Sefer Leader (FMSL)</option>
                    <option value="MMSL">5. Mothers Mideb Sefer Leader (MMSL)</option>
                    <option value="YMSL">6. Youth Mideb Sefer Leader (YMSL)</option>
                    <option value="Evang">7. Evangelist (Evang)</option>
                    <option value="Missionary">8. Missionary</option>
                    <option value="IntMissionary">9. International Missionary (IntMissionary)</option>
                    <option value="Pastor">10. Church Pastor (Pastor)</option>
                    <option value="CT">11. Childrens Teacher (CT)</option>
                    <option value="Guardian">12. Guardian</option>
                    <option value="Accountant">13. Accountant</option>
                    <option value="MZL">14. Menfesawi Zerf Leader (MZL)</option>
                    <option value="CL">15. Choir Leader (CL)</option>
                    <option value="TCL">16. Temer Choir Leader (TCL)</option>
                    <option value="SL">17. Salem Leader (SL)</option>
                    <option value="ZPTL">18. Zetseat Prayers Team Leader (ZPTL)</option>
                    <option value="PPTL">19. Peniel Prayers Team Leader (PPTL)</option>
                    <option value="Astedader">20. Astedader Administrator</option>
                    <option value="CSM">21. Church Store Manager (CSM)</option>
                    <option value="Janitor">22. Janitor</option>
                    <option value="NTL">23. Natanim Team Leader (NTL)</option>
                    <option value="CTL">24. Counselling Team Leader (CTL)</option>
                    <option value="FTL">25. Fundraising Team Leader (FTL)</option>
                    <option value="ORTL">26. Outreach & Evangelism Team Leader (ORTL)</option>
                    <option value="ETTL">27. Education & Training Team Leader (ETTL)</option>
                    <option value="YelijochZerf">28. Yelijoch Zerf Leader</option>
                    <option value="YesetochZerf">29. Yesetoch Zerf Leader</option>
                    <option value="Tena">30. Tena Zerf (Health Professionals)</option>
                    <option value="Timihirt">31. Timihirt Zerf Leader</option>
                    <option value="Gibrina">32. Gibrina Zerf Leader</option>
                    <option value="ICT">33. ICT Zerf Leader</option>
                    <option value="Negade">34. Negade Zerf Leader</option>
                    <option value="NGO">35. NGO Serategnoh Zerf Leader</option>
                    <option value="MengistSerategna">36. Mengist Serategnoch Leader</option>
                    <option value="Hig">37. Yehig Zerf (Legal Leader)</option>
                    <option value="Mehandis">38. Mehandisoch (Engineers Leader)</option>
                    <option value="Member">39. Church Member Directory Admin</option>
                    <option value="Finance">40. Finance Zerf Leader</option>
                    <option value="WorshipLeader">41. Worship Team Leader</option>
                    <option value="CharityLeader">42. Charity Team Leader</option>
                    <option value="SubChoirLeader">43. Sub-Choir Leader (Eftah/Johanan/Elroe)</option>
                    <option value="MainRegistrar">44. Main Registrar Admin</option>
                  </optgroup>
                </select>
              </div>

              {newUserForm.role === 'Other' && (
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Specify Custom Role Name *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Media Specialist, IT Officer, Youth Director..."
                    value={newUserForm.custom_role || ''}
                    onChange={e => setNewUserForm({ ...newUserForm, custom_role: e.target.value })}
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Leadership Position (Optional)</label>
                <select
                  className="form-control"
                  value={newUserForm.leadership_role}
                  onChange={e => setNewUserForm({ ...newUserForm, leadership_role: e.target.value })}
                >
                  <option value="None">None (No Leadership Position)</option>
                  <option value="Sebsabi">Sebsabi (Chairman)</option>
                  <option value="Hisab_Shum">Hisab Shum (Auditor)</option>
                  <option value="Mikitel_Sebsabi">Mikitel Sebsabi (Vice Chairman)</option>
                  <option value="Genzeb_Yazh">Genzeb Yazh (Treasurer)</option>
                  <option value="Gabicha_Asfetsami">Gabicha Asfetsami</option>
                  <option value="Tsehafi">Tsehafi (Secretary)</option>
                </select>
              </div>

              {newUserForm.leadership_role && newUserForm.leadership_role !== 'None' && (
                <div className="form-group">
                  <label className="form-label">Round of Leadership</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Term 2026"
                    value={newUserForm.round_of_leadership || ''}
                    onChange={e => setNewUserForm({ ...newUserForm, round_of_leadership: e.target.value })}
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="+251 911 000 000"
                  value={newUserForm.phone_number}
                  onChange={e => setNewUserForm({ ...newUserForm, phone_number: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setActiveTab('users')} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <UserPlus size={16} />
                <span>Create User & Generate ID</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: Site Settings & Branding Customizer */}
      {activeTab === 'settings' && (
        <div className="card" style={{ maxWidth: '700px', margin: '0 auto', width: '100%' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem', color: 'var(--primary-blue)' }}>
            System Settings & Branding
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Customize logo URL, hero image, about descriptions, and copyright information.
          </p>

          <form onSubmit={handleSaveSettings}>
            <div className="form-group">
              <label className="form-label">Portal Title</label>
              <input
                type="text"
                className="form-control"
                value={siteSettingsForm.site_title || ''}
                onChange={e => setSiteSettingsForm({ ...siteSettingsForm, site_title: e.target.value })}
              />
            </div>

            {/* Church Logo Image File Picker */}
            <div className="form-group" style={{ backgroundColor: 'var(--primary-light-blue)', padding: '1rem', borderRadius: '8px', marginBottom: '1.25rem' }}>
              <label className="form-label" style={{ fontWeight: 700 }}>Church Logo Image (Upload File or Enter URL)</label>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                style={{ marginBottom: '0.75rem' }}
                onChange={handleLogoFilePick}
              />
              <input
                type="text"
                className="form-control"
                placeholder="Or paste Logo Image URL..."
                value={siteSettingsForm.logo_url || ''}
                onChange={e => setSiteSettingsForm({ ...siteSettingsForm, logo_url: e.target.value })}
              />

              {siteSettingsForm.logo_url && (
                <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '8px', border: '1px solid var(--border-color)', overflow: 'hidden', backgroundColor: '#fff' }}>
                    <img src={siteSettingsForm.logo_url} alt="Logo Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                  <div>
                    <span className="badge badge-success">Logo Image Selected</span>
                    <button type="button" onClick={() => setSiteSettingsForm({ ...siteSettingsForm, logo_url: '' })} className="btn btn-secondary btn-sm" style={{ marginTop: '0.25rem', display: 'block' }}>
                      Clear Logo
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Home Hero Background Image File Picker */}
            <div className="form-group" style={{ backgroundColor: 'var(--primary-light-blue)', padding: '1rem', borderRadius: '8px', marginBottom: '1.25rem' }}>
              <label className="form-label" style={{ fontWeight: 700 }}>Home Hero Background Image (Upload File or Enter URL)</label>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                style={{ marginBottom: '0.75rem' }}
                onChange={handleHeroBgFilePick}
              />
              <input
                type="text"
                className="form-control"
                placeholder="Or paste Hero Background Image URL..."
                value={siteSettingsForm.hero_background_url || ''}
                onChange={e => setSiteSettingsForm({ ...siteSettingsForm, hero_background_url: e.target.value })}
              />

              {siteSettingsForm.hero_background_url && (
                <div style={{ marginTop: '0.75rem' }}>
                  <div style={{ height: '120px', borderRadius: '8px', border: '1px solid var(--border-color)', overflow: 'hidden', marginBottom: '0.5rem' }}>
                    <img src={siteSettingsForm.hero_background_url} alt="Hero Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="badge badge-success">Background Image Selected</span>
                    <button type="button" onClick={() => setSiteSettingsForm({ ...siteSettingsForm, hero_background_url: '' })} className="btn btn-secondary btn-sm">
                      Clear Background
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Church Location / Physical Address</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Stadium Zuria, Kirkos Sub-City, Woreda 02, Addis Ababa"
                  value={siteSettingsForm.contact_address || ''}
                  onChange={e => setSiteSettingsForm({ ...siteSettingsForm, contact_address: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Church Contact Phone Number(s)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="+251 11 551 2345 / +251 911 000 001"
                  value={siteSettingsForm.contact_phone || ''}
                  onChange={e => setSiteSettingsForm({ ...siteSettingsForm, contact_phone: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Church Contact Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="info@skhc.org"
                  value={siteSettingsForm.contact_email || ''}
                  onChange={e => setSiteSettingsForm({ ...siteSettingsForm, contact_email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Office Working Hours</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Mon - Sat: 8:30 AM - 5:30 PM | Sun: 8:00 AM - 1:00 PM"
                  value={siteSettingsForm.office_hours || ''}
                  onChange={e => setSiteSettingsForm({ ...siteSettingsForm, office_hours: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Google Maps Embed iframe URL</label>
              <input
                type="text"
                className="form-control"
                placeholder="https://maps.google.com/maps?q=...&output=embed"
                value={siteSettingsForm.google_map_embed_url || ''}
                onChange={e => setSiteSettingsForm({ ...siteSettingsForm, google_map_embed_url: e.target.value })}
              />
              <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                Paste direct Google Maps iframe URL to dynamically display church map on Contact Us and Footer.
              </small>
            </div>

            <div className="form-group">
              <label className="form-label">About Us Description</label>
              <textarea
                rows={3}
                className="form-control"
                value={siteSettingsForm.about_description || ''}
                onChange={e => setSiteSettingsForm({ ...siteSettingsForm, about_description: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Copyright Description & Year</label>
              <input
                type="text"
                className="form-control"
                value={siteSettingsForm.copyright_description || ''}
                onChange={e => setSiteSettingsForm({ ...siteSettingsForm, copyright_description: e.target.value })}
              />
            </div>

            {/* --- Church Bank Accounts Section (8 Fields for Names & 8 Fields for Account Numbers) --- */}
            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Landmark size={20} style={{ color: 'var(--primary-blue)' }} />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Church Bank Accounts (Up to 8 Accounts)</h4>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                Add church bank names and corresponding account numbers. Active bank accounts will automatically display in the public portal footer and home page.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <div key={`bank-${num}`} style={{
                    backgroundColor: 'var(--bg-secondary, rgba(0,0,0,0.02))',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem'
                  }}>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.75rem', color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <CreditCard size={15} />
                      <span>Bank Account #{num}</span>
                    </div>
                    <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                      <label className="form-label" style={{ fontSize: '0.8125rem' }}>Bank Name #{num}</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={num === 1 ? 'e.g. Commercial Bank of Ethiopia (CBE)' : num === 2 ? 'e.g. Dashen Bank' : 'Bank Name'}
                        value={siteSettingsForm[`bank_${num}_name`] || ''}
                        onChange={e => setSiteSettingsForm({ ...siteSettingsForm, [`bank_${num}_name`]: e.target.value })}
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                      <label className="form-label" style={{ fontSize: '0.8125rem' }}>Account Number #{num}</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={num === 1 ? 'e.g. 1000123456789' : 'Account Number'}
                        value={siteSettingsForm[`bank_${num}_account`] || ''}
                        onChange={e => setSiteSettingsForm({ ...siteSettingsForm, [`bank_${num}_account`]: e.target.value })}
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.8125rem' }}>Account Purpose / Description #{num}</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={num === 1 ? 'e.g. Tithes & General Offerings / ለአስራት እና አጠቃላይ መባ' : 'Account Purpose'}
                        value={siteSettingsForm[`bank_${num}_purpose`] || ''}
                        onChange={e => setSiteSettingsForm({ ...siteSettingsForm, [`bank_${num}_purpose`]: e.target.value })}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* --- Social Media Links Section --- */}
            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Share2 size={20} style={{ color: 'var(--primary-blue)' }} />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Official Social Media Links</h4>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                Provide target URLs for each social media channel icon in the footer.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Facebook Profile / Page URL</label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://facebook.com/skhc"
                    value={siteSettingsForm.facebook_url || ''}
                    onChange={e => setSiteSettingsForm({ ...siteSettingsForm, facebook_url: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">YouTube Channel URL</label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://youtube.com/@skhc"
                    value={siteSettingsForm.youtube_url || ''}
                    onChange={e => setSiteSettingsForm({ ...siteSettingsForm, youtube_url: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Instagram Profile URL</label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://instagram.com/skhc"
                    value={siteSettingsForm.instagram_url || ''}
                    onChange={e => setSiteSettingsForm({ ...siteSettingsForm, instagram_url: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">WhatsApp Group / Direct Link</label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://chat.whatsapp.com/..."
                    value={siteSettingsForm.whatsapp_url || ''}
                    onChange={e => setSiteSettingsForm({ ...siteSettingsForm, whatsapp_url: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">TikTok Profile URL</label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://tiktok.com/@skhc"
                    value={siteSettingsForm.tiktok_url || ''}
                    onChange={e => setSiteSettingsForm({ ...siteSettingsForm, tiktok_url: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">X (Twitter) Profile URL</label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://twitter.com/skhc"
                    value={siteSettingsForm.twitter_url || ''}
                    onChange={e => setSiteSettingsForm({ ...siteSettingsForm, twitter_url: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Telegram Channel Link</label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://t.me/skhc_church"
                    value={siteSettingsForm.telegram_url || ''}
                    onChange={e => setSiteSettingsForm({ ...siteSettingsForm, telegram_url: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* --- Weekly Church Programs Section (10 Fields) --- */}
            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Calendar size={20} style={{ color: 'var(--primary-blue)' }} />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Weekly Church Programs & Services (10 Fields)</h4>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                Configure up to 10 weekly church program schedules. Only fields where a program is set will be displayed on the public website and footer.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <div key={`program-${num}`} className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Clock size={13} style={{ color: 'var(--primary-blue)' }} />
                      <span>Weekly Program Slot #{num}</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={
                        num === 1 ? 'e.g. Sunday Main Worship & Gospel Service | 8:30 AM - 12:00 PM' :
                        num === 2 ? 'e.g. Sunday Youth & Choir Fellowship | 2:00 PM - 5:00 PM' :
                        num === 3 ? 'e.g. Tuesday Mothers Prayer Fellowship | 4:30 PM - 6:30 PM' :
                        `Weekly Program #${num} (Leave blank if empty)`
                      }
                      value={siteSettingsForm[`weekly_program_${num}`] || ''}
                      onChange={e => setSiteSettingsForm({ ...siteSettingsForm, [`weekly_program_${num}`]: e.target.value })}
                    />
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '2rem' }}>
              <CheckCircle2 size={16} />
              <span>Save Site Settings</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: Children Grades Calculator & Exporter */}
      {activeTab === 'grades' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Children Student Grades & Ranking Calculator</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Auto-calculate average scores, ranks, and export reports to CSV, PDF, Word & Print.
              </p>
            </div>

            <div className="no-print" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button onClick={() => {
                const freshDb = getMockDB();
                if (freshDb.submitted_student_grades) {
                  freshDb.submitted_student_grades = freshDb.submitted_student_grades.map(g => ({ ...g, status: 'Approved' }));
                  saveMockDB(freshDb);
                  refreshDB();
                }
                showToast("All student grade sheets approved & published for student profile lookup!", "success");
              }} className="btn btn-primary btn-sm">
                <CheckCircle2 size={14} />
                <span>Approve All Submitted Grades</span>
              </button>

              <button onClick={handleExportCSV} className="btn btn-secondary btn-sm">
                <Download size={14} />
                <span>Export CSV</span>
              </button>
              <button onClick={handlePrintReport} className="btn btn-secondary btn-sm">
                <Printer size={14} />
                <span>Print Report</span>
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Student Name</th>
                  <th>Age</th>
                  <th>Section</th>
                  <th>Test Score (50%)</th>
                  <th>Exam Score (50%)</th>
                  <th>Average (%)</th>
                  <th>Total Score</th>
                </tr>
              </thead>
              <tbody>
                {childrenGrades.map(g => (
                  <tr key={g.id}>
                    <td>
                      <span className="badge badge-success">Rank #{g.rank}</span>
                    </td>
                    <td><strong>{g.name}</strong></td>
                    <td>{g.age} yrs</td>
                    <td>{g.section}</td>
                    <td>{g.test}%</td>
                    <td>{g.exam}%</td>
                    <td><strong style={{ color: 'var(--primary-blue)' }}>{g.average}%</strong></td>
                    <td>{g.total}/100</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: Vacancy & Exam Announcements */}
      {activeTab === 'vacancies' && (
        <div className="card" style={{ maxWidth: '700px', margin: '0 auto', width: '100%' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem', color: 'var(--primary-blue)' }}>
            Post New Job Vacancy
          </h3>

          <form onSubmit={handleCreateVacancy}>
            <div className="form-group">
              <label className="form-label">Job Vacancy Title *</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="e.g. Media Technician"
                value={vacancyForm.title}
                onChange={e => setVacancyForm({ ...vacancyForm, title: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Job Type</label>
              <select
                className="form-control"
                value={vacancyForm.job_type}
                onChange={e => setVacancyForm({ ...vacancyForm, job_type: e.target.value })}
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Job Description</label>
              <textarea
                rows={3}
                required
                className="form-control"
                value={vacancyForm.description}
                onChange={e => setVacancyForm({ ...vacancyForm, description: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Application Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={vacancyForm.application_start_date}
                  onChange={e => setVacancyForm({ ...vacancyForm, application_start_date: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Application Deadline</label>
                <input
                  type="date"
                  className="form-control"
                  value={vacancyForm.expiry_date}
                  onChange={e => setVacancyForm({ ...vacancyForm, expiry_date: e.target.value })}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              <Briefcase size={16} />
              <span>Post Vacancy to Website</span>
            </button>
          </form>

          {/* Form 2: Publish Written Exam Call / Interview Call Notices */}
          <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '2px dashed var(--border-color)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem', color: 'var(--primary-blue)' }}>
              Publish Call for Written Exam & Call for Interview Notices
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              Select a vacancy, pick Call Type (Written Exam or Oral Interview), choose date & time with the datetime picker, and specify the venue.
            </p>

            <form onSubmit={handleCreateExamSchedule}>
              <div className="form-group">
                <label className="form-label">Select Job Vacancy *</label>
                <select
                  required
                  className="form-control"
                  value={examScheduleForm.vacancy_id}
                  onChange={e => setExamScheduleForm({ ...examScheduleForm, vacancy_id: e.target.value })}
                >
                  <option value="">-- Choose Job Vacancy --</option>
                  {(db?.vacancies || []).map(v => (
                    <option key={v.id} value={v.id}>{v.title} ({v.job_type})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Select Call Category / Logic *</label>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setExamScheduleForm({ ...examScheduleForm, notice_type: 'Written_Exam' })}
                    className={`btn btn-sm ${examScheduleForm.notice_type === 'Written_Exam' ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    <span>📝 Call for Written Exam</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setExamScheduleForm({ ...examScheduleForm, notice_type: 'Interview' })}
                    className={`btn btn-sm ${examScheduleForm.notice_type === 'Interview' ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    <span>🗣️ Call for Oral Interview</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setExamScheduleForm({ ...examScheduleForm, notice_type: 'Combined' })}
                    className={`btn btn-sm ${examScheduleForm.notice_type === 'Combined' ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    <span>📋 Combined Exam & Interview Call</span>
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Call Notice Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder={
                    examScheduleForm.notice_type === 'Written_Exam'
                      ? 'e.g. Call for Written Examination'
                      : examScheduleForm.notice_type === 'Interview'
                      ? 'e.g. Call for Oral & Technical Interview'
                      : 'e.g. Call for Written Exam & Interview Schedule'
                  }
                  value={examScheduleForm.title}
                  onChange={e => setExamScheduleForm({ ...examScheduleForm, title: e.target.value })}
                />
              </div>

              {(examScheduleForm.notice_type === 'Written_Exam' || examScheduleForm.notice_type === 'Combined') && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', backgroundColor: 'var(--primary-light-blue)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Written Exam Date & Time Picker *</label>
                    <input
                      type="datetime-local"
                      required={examScheduleForm.notice_type === 'Written_Exam' || examScheduleForm.notice_type === 'Combined'}
                      className="form-control"
                      value={examScheduleForm.written_exam_date}
                      onChange={e => setExamScheduleForm({ ...examScheduleForm, written_exam_date: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Written Exam Venue / Location *</label>
                    <input
                      type="text"
                      required={examScheduleForm.notice_type === 'Written_Exam' || examScheduleForm.notice_type === 'Combined'}
                      className="form-control"
                      placeholder="SKHC Main Fellowship Hall"
                      value={examScheduleForm.written_exam_venue}
                      onChange={e => setExamScheduleForm({ ...examScheduleForm, written_exam_venue: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {(examScheduleForm.notice_type === 'Interview' || examScheduleForm.notice_type === 'Combined') && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', backgroundColor: '#f0fdf4', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Interview Date & Time Picker *</label>
                    <input
                      type="datetime-local"
                      required={examScheduleForm.notice_type === 'Interview'}
                      className="form-control"
                      value={examScheduleForm.interview_date}
                      onChange={e => setExamScheduleForm({ ...examScheduleForm, interview_date: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Interview Venue / Place *</label>
                    <input
                      type="text"
                      required={examScheduleForm.notice_type === 'Interview'}
                      className="form-control"
                      placeholder="Pastoral Conference Room 3"
                      value={examScheduleForm.interview_venue}
                      onChange={e => setExamScheduleForm({ ...examScheduleForm, interview_venue: e.target.value })}
                    />
                  </div>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Call Instructions & Document Requirements</label>
                <textarea
                  rows={2}
                  className="form-control"
                  placeholder="e.g. Please bring original Fayda ID card, degree certificates, and exam ticket."
                  value={examScheduleForm.instructions}
                  onChange={e => setExamScheduleForm({ ...examScheduleForm, instructions: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '0.75rem' }}>
                <FileText size={16} />
                <span>
                  {examScheduleForm.notice_type === 'Written_Exam'
                    ? 'Publish Written Exam Call'
                    : examScheduleForm.notice_type === 'Interview'
                    ? 'Publish Oral Interview Call'
                    : 'Publish Combined Schedule Notice'}
                </span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
