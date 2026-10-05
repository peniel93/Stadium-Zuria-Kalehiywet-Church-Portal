import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/ToastAlert';
import { getMockDB, saveMockDB } from '../../lib/supabase';
import { BookOpen, User, KeyRound, Award, CheckCircle2, Download, Shield, Calendar, MapPin, UserCheck, AlertTriangle } from 'lucide-react';

export const ChildrenStudentDashboard = () => {
  const { currentUser, updatePIN, refreshDB } = useAuth();
  const { showToast } = useToast();

  const freshDb = getMockDB();
  const [activeTab, setActiveTab] = useState('class_info'); // 'class_info', 'grades', 'materials', 'security'

  // Find child record & grade sheet for current logged-in student
  const studentGradeRecord = (freshDb.submitted_student_grades || []).find(
    s => (s.username_id && currentUser?.username_id && s.username_id.toLowerCase() === currentUser.username_id.toLowerCase()) ||
         (s.name && currentUser?.full_name && s.name.toLowerCase() === currentUser.full_name.toLowerCase())
  ) || {
    student_id: 'SKHC-STU-001',
    name: currentUser?.full_name || 'Hannah Solomon',
    age: 8,
    class: currentUser?.class_level || 'Level 2 - Primary',
    section: currentUser?.section_name || 'Section A',
    teacher: currentUser?.teacher || 'Brother Dawit Alemu',
    midterm: 28,
    final_exam: 46,
    bible_recitation: 19,
    total: 93,
    avg: 93,
    rank: 1,
    promotion_status: 'Promoted to Level 3 - Junior',
    status: 'Approved'
  };

  const childRecord = (freshDb.children_records || []).find(
    c => (c.username_id && currentUser?.username_id && c.username_id.toLowerCase() === currentUser.username_id.toLowerCase()) ||
         (c.name && currentUser?.full_name && c.name.toLowerCase() === currentUser.full_name.toLowerCase())
  ) || {
    name: currentUser?.full_name || 'Hannah Solomon',
    age: 8,
    gender: 'Female',
    medeb_zone: 'Stadium_Zuria',
    class_level: studentGradeRecord.class || 'Level 2 - Primary',
    section_name: studentGradeRecord.section || 'Section A',
    teacher: studentGradeRecord.teacher || 'Brother Dawit Alemu',
    username_id: currentUser?.username_id || 'hannah/4829/2026',
    default_pin: currentUser?.default_pin || '4892'
  };

  // Matched Class details
  const matchedClass = (freshDb.children_classes || []).find(
    c => c.class_name.toLowerCase().includes((childRecord.class_level || '').toLowerCase()) ||
         c.teacher_name.toLowerCase() === (childRecord.teacher || '').toLowerCase()
  ) || {
    class_name: childRecord.class_level || 'Level 2 - Primary',
    section: childRecord.section_name || 'Section A',
    age_range: '7-9 yrs',
    teacher_name: childRecord.teacher || 'Brother Dawit Alemu',
    room: 'Children Hall 2'
  };

  // Course & Teaching materials list
  const materials = freshDb.teaching_materials || [
    { id: 'm-1', title: 'Sunday School Lesson 1: The Life of David & Faith', file_name: 'lesson_1_david.pdf', date: '2026-07-28', age_group: 'Level 2 (7-9 yrs)' },
    { id: 'm-2', title: 'Scripture Memory Verses Sheet (Quarter 3)', file_name: 'memory_verses_q3.pdf', date: '2026-08-01', age_group: 'All Age Levels' },
    { id: 'm-3', title: 'Bible Coloring & Activity Pages', file_name: 'coloring_activities.pdf', date: '2026-08-02', age_group: 'Level 1 & Level 2' }
  ];

  // PIN Update State
  const [pinForm, setPinForm] = useState({ old_pin: '', new_pin: '', confirm_pin: '' });

  const handleChangePIN = (e) => {
    e.preventDefault();
    if (pinForm.new_pin.length !== 4 || isNaN(pinForm.new_pin)) {
      showToast("New PIN password must be exactly a 4-digit number.", "error");
      return;
    }
    if (pinForm.new_pin !== pinForm.confirm_pin) {
      showToast("New PIN and Confirmation PIN do not match.", "error");
      return;
    }

    const success = updatePIN(pinForm.new_pin);
    if (success) {
      showToast("Your 4-Digit Password PIN has been updated successfully!", "success");
      setPinForm({ old_pin: '', new_pin: '', confirm_pin: '' });
      refreshDB();
    } else {
      showToast("Failed to update PIN password.", "error");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Banner & Student Credentials */}
      <div className="card" style={{ background: 'linear-gradient(135deg, var(--primary-blue) 0%, #1e3a8a 100%)', color: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', marginBottom: '0.5rem' }}>
              Student Learning Portal
            </span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Welcome, {currentUser?.full_name || childRecord.name}!</h2>
            <p style={{ opacity: 0.9, fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Username ID: <code style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.2rem 0.6rem', borderRadius: '4px', color: '#fde047', fontWeight: 800 }}>{currentUser?.username_id || childRecord.username_id}</code>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', backgroundColor: 'rgba(255,255,255,0.1)', padding: '0.75rem 1.25rem', borderRadius: '8px' }}>
            <div>
              <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Assigned Class</div>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>{childRecord.class_level} ({childRecord.section_name || 'Section A'})</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Selector */}
      <div className="card no-print" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('class_info')}
          className={`btn ${activeTab === 'class_info' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <UserCheck size={16} />
          <span>My Class & Teacher</span>
        </button>

        <button
          onClick={() => setActiveTab('grades')}
          className={`btn ${activeTab === 'grades' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Award size={16} />
          <span>My Grades & Class Promotion</span>
        </button>

        <button
          onClick={() => setActiveTab('materials')}
          className={`btn ${activeTab === 'materials' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <BookOpen size={16} />
          <span>Course & Lesson Materials</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`btn ${activeTab === 'security' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <KeyRound size={16} />
          <span>Security & Password PIN</span>
        </button>
      </div>

      {/* TAB 1: My Class & Teacher Info */}
      {activeTab === 'class_info' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <div className="card">
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UserCheck size={20} />
              <span>Assigned Class & Section Details</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Class Name</span>
                <strong>{matchedClass.class_name}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Assigned Section</span>
                <span className="badge badge-warning">{matchedClass.section || childRecord.section_name || 'Section A'}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Target Age Range</span>
                <strong>{matchedClass.age_range || '7-9 yrs'}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Classroom / Venue</span>
                <span style={{ color: 'var(--primary-blue)', fontWeight: 700 }}>{matchedClass.room || 'Children Hall 2'}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Weekly Schedule</span>
                <strong>Every Sunday 08:30 AM - 11:30 AM</strong>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={20} />
              <span>Assigned Children Teacher</span>
            </h3>

            <div style={{ backgroundColor: 'var(--primary-light-blue)', padding: '1.25rem', borderRadius: '8px', marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--primary-blue)' }}>
                {childRecord.teacher || matchedClass.teacher_name}
              </h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Sunday School Teacher & Yelijoch Zerf Instructor
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <div>
                <strong>Role:</strong> Lead Class Teacher & Scripture Instructor
              </div>
              <div>
                <strong>Church Fellowship:</strong> Stadium Zuria Sunday School Ministry
              </div>
              <div className="alert alert-info" style={{ marginTop: '0.5rem', fontSize: '0.8125rem' }}>
                If you have questions about lesson schedules or attendance, please ask your teacher during class or through your parents.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Grades, Ranking & Promotion */}
      {activeTab === 'grades' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--primary-blue)' }}>
                Academic Grade Report & Ranking
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Official grade assessment results approved by Yelijoch Zerf & Registrar.
              </p>
            </div>

            <span className="badge badge-success" style={{ fontSize: '0.9375rem', padding: '0.4rem 0.8rem' }}>
              {studentGradeRecord.promotion_status || 'Promoted to Next Level'}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ backgroundColor: 'var(--primary-light-blue)', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Midterm Test (30%)</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-blue)' }}>{studentGradeRecord.midterm} / 30</div>
            </div>

            <div style={{ backgroundColor: 'var(--primary-light-blue)', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Final Exam (50%)</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-blue)' }}>{studentGradeRecord.final_exam} / 50</div>
            </div>

            <div style={{ backgroundColor: 'var(--primary-light-blue)', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Bible Recitation (20%)</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-blue)' }}>{studentGradeRecord.bible_recitation} / 20</div>
            </div>

            <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8125rem', color: '#166534' }}>Total Score & Rank</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#166534' }}>{studentGradeRecord.total}% (Rank #{studentGradeRecord.rank})</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Course & Lesson Materials */}
      {activeTab === 'materials' && (
        <div className="card">
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--primary-blue)' }}>
            Sunday School Lesson & Teaching Materials
          </h3>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Lesson Title</th>
                  <th>Target Age Level</th>
                  <th>Upload Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {materials.map(m => (
                  <tr key={m.id}>
                    <td><strong>{m.title}</strong></td>
                    <td><span className="badge badge-warning">{m.age_group}</span></td>
                    <td>{m.date}</td>
                    <td>
                      <button
                        onClick={() => showToast(`Downloading ${m.file_name}...`, "success")}
                        className="btn btn-secondary btn-sm"
                      >
                        <Download size={14} />
                        <span>Download PDF</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Security & PIN Update */}
      {activeTab === 'security' && (
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--primary-blue)' }}>
            Security & 4-Digit Password PIN
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Update your 4-digit PIN password. If you forget your password PIN, contact your teacher or Sunday School leader to reset it.
          </p>

          <form onSubmit={handleChangePIN}>
            <div className="form-group">
              <label className="form-label">New 4-Digit PIN Password *</label>
              <input
                type="password"
                maxLength={4}
                required
                className="form-control"
                placeholder="e.g. 4892"
                value={pinForm.new_pin}
                onChange={e => setPinForm({ ...pinForm, new_pin: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New 4-Digit PIN *</label>
              <input
                type="password"
                maxLength={4}
                required
                className="form-control"
                placeholder="e.g. 4892"
                value={pinForm.confirm_pin}
                onChange={e => setPinForm({ ...pinForm, confirm_pin: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              <KeyRound size={16} />
              <span>Update Password PIN</span>
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
