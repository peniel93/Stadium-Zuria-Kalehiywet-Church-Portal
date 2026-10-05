import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/ToastAlert';
import { getMockDB, saveMockDB } from '../../lib/supabase';
import { BookOpen, UserPlus, FileText, Download, Printer, Award, CheckCircle2, Settings, Plus, Send, ShieldCheck } from 'lucide-react';

export const ChildrenTeacherDashboard = () => {
  const { db, refreshDB } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('grades'); // 'grades', 'schema', 'materials', 'student_lookup'

  // Custom Grade Scheme State
  const gradeScheme = db?.grade_assessment_schemes || [
    { id: 'sc-1', name: 'Midterm Test', category_name: 'Midterm Test', max_score: 30 },
    { id: 'sc-2', name: 'Final Exam', category_name: 'Final Exam', max_score: 50 },
    { id: 'sc-3', name: 'Bible Memory Verses & Homework', category_name: 'Bible Memory Verses & Homework', max_score: 20 }
  ];

  const [newSchemeItem, setNewSchemeItem] = useState({ name: '', max_score: 10 });

  const students = db?.submitted_student_grades || [
    { id: '1', student_id: 'SKHC-STU-001', name: 'Hannah Solomon', age: 8, class: 'Age 7-9 Class 2', section: 'A', midterm: 28, final_exam: 46, bible_recitation: 19, total: 93, avg: 93, rank: 1, status: 'Approved' },
    { id: '2', student_id: 'SKHC-STU-002', name: 'Daniel Yonas', age: 9, class: 'Age 7-9 Class 2', section: 'A', midterm: 25, final_exam: 42, bible_recitation: 18, total: 85, avg: 85, rank: 2, status: 'Approved' }
  ];

  const [gradeInput, setGradeInput] = useState({
    student_id: '1',
    midterm: 28,
    final_exam: 46,
    bible_recitation: 19
  });

  const [lookupId, setLookupId] = useState('');
  const [lookupResult, setLookupResult] = useState(null);

  const handleAddSchemeItem = (e) => {
    e.preventDefault();
    if (!newSchemeItem.name) return;
    const freshDb = getMockDB();
    if (!freshDb.grade_assessment_schemes) freshDb.grade_assessment_schemes = [];
    const newItem = {
      id: `sc-${Date.now()}`,
      name: newSchemeItem.name,
      category_name: newSchemeItem.name,
      max_score: parseFloat(newSchemeItem.max_score) || 10
    };
    freshDb.grade_assessment_schemes.push(newItem);
    saveMockDB(freshDb);
    refreshDB();
    showToast(`Added assessment category "${newSchemeItem.name}" (${newSchemeItem.max_score} marks) to Database!`, "success");
    setNewSchemeItem({ name: '', max_score: 10 });
  };

  const handleSaveGrade = (e) => {
    e.preventDefault();
    const freshDb = getMockDB();
    if (!freshDb.submitted_student_grades) freshDb.submitted_student_grades = [];
    const idx = freshDb.submitted_student_grades.findIndex(s => s.id === gradeInput.student_id || s.student_id === gradeInput.student_id);
    const midterm = parseFloat(gradeInput.midterm) || 0;
    const final_exam = parseFloat(gradeInput.final_exam) || 0;
    const bible_recitation = parseFloat(gradeInput.bible_recitation) || 0;
    const total = midterm + final_exam + bible_recitation;
    
    if (idx !== -1) {
      freshDb.submitted_student_grades[idx] = {
        ...freshDb.submitted_student_grades[idx],
        midterm,
        final_exam,
        bible_recitation,
        total,
        avg: total
      };
    } else {
      freshDb.submitted_student_grades.unshift({
        id: `st-${Date.now()}`,
        student_id: `SKHC-STU-00${freshDb.submitted_student_grades.length + 1}`,
        name: 'Student Record',
        midterm,
        final_exam,
        bible_recitation,
        total,
        avg: total,
        status: 'Saved'
      });
    }
    saveMockDB(freshDb);
    refreshDB();
    showToast("Student grades updated in Database according to custom scheme!", "success");
  };

  const handleSubmitGradesToRegistrar = () => {
    const freshDb = getMockDB();
    if (!freshDb.submitted_student_grades) freshDb.submitted_student_grades = [];

    students.forEach(s => {
      const existing = freshDb.submitted_student_grades.find(g => g.student_id === s.student_id);
      if (!existing) {
        freshDb.submitted_student_grades.push({
          ...s,
          submitted_at: new Date().toISOString().slice(0, 10),
          status: 'Pending Registrar Approval'
        });
      }
    });

    saveMockDB(freshDb);
    refreshDB();
    showToast("Student grades submitted to Main Registrar for review & approval!", "success");
  };

  const handleStudentLookup = (e) => {
    e.preventDefault();
    const freshDb = getMockDB();
    const allGrades = freshDb.submitted_student_grades || students;
    const found = allGrades.find(s => s.student_id.toLowerCase() === lookupId.trim().toLowerCase() || s.name.toLowerCase().includes(lookupId.trim().toLowerCase()));

    if (!found) {
      showToast("No student grade record found. Please verify Student ID.", "error");
      setLookupResult(null);
      return;
    }

    setLookupResult(found);
  };

  const handleExportCSV = () => {
    let csv = "Rank,Student ID,Student Name,Age,Class,Midterm (30%),Final Exam (50%),Bible Verses (20%),Total,Approval Status\n";
    students.forEach(s => {
      csv += `${s.rank},"${s.student_id}","${s.name}",${s.age},"${s.class}",${s.midterm},${s.final_exam},${s.bible_recitation},${s.total},"${s.status}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Children_Student_Grades_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    showToast("Exported student grades to CSV!", "success");
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Header & Tabs */}
      <div className="card no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--primary-blue)' }}>
            Children's Teacher (CT) & Yelijoch Zerf Dashboard
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Configure custom grade schemes, calculate student averages & ranks, submit to Registrar for approval, and student result lookup.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('classes_roster')}
            className={`btn ${activeTab === 'classes_roster' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <UserPlus size={16} />
            <span>Class Roster & Credentials</span>
          </button>

          <button
            onClick={() => setActiveTab('grades')}
            className={`btn ${activeTab === 'grades' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Award size={16} />
            <span>Grade Sheet & Ranking</span>
          </button>

          <button
            onClick={() => setActiveTab('schema')}
            className={`btn ${activeTab === 'schema' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Settings size={16} />
            <span>Custom Grade Scheme</span>
          </button>

          <button
            onClick={() => setActiveTab('student_lookup')}
            className={`btn ${activeTab === 'student_lookup' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <ShieldCheck size={16} />
            <span>Student Grade Lookup</span>
          </button>

          <button
            onClick={() => setActiveTab('materials')}
            className={`btn ${activeTab === 'materials' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <BookOpen size={16} />
            <span>Teaching Materials</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Student Grade Entry & Submission */}
      {activeTab === 'grades' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ maxWidth: '700px', margin: '0 auto', width: '100%' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--primary-blue)' }}>
              Record Scores According to Active Custom Scheme
            </h3>

            <form onSubmit={handleSaveGrade}>
              <div className="form-group">
                <label className="form-label">Select Student</label>
                <select
                  className="form-control"
                  value={gradeInput.student_id}
                  onChange={e => setGradeInput({ ...gradeInput, student_id: e.target.value })}
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.student_id} - {s.class})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Midterm Test (Max: 30)</label>
                  <input
                    type="number"
                    max={30}
                    required
                    className="form-control"
                    value={gradeInput.midterm}
                    onChange={e => setGradeInput({ ...gradeInput, midterm: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Final Exam (Max: 50)</label>
                  <input
                    type="number"
                    max={50}
                    required
                    className="form-control"
                    value={gradeInput.final_exam}
                    onChange={e => setGradeInput({ ...gradeInput, final_exam: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Bible Verses (Max: 20)</label>
                  <input
                    type="number"
                    max={20}
                    required
                    className="form-control"
                    value={gradeInput.bible_recitation}
                    onChange={e => setGradeInput({ ...gradeInput, bible_recitation: e.target.value })}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                <CheckCircle2 size={16} />
                <span>Calculate & Save Scores</span>
              </button>
            </form>
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Class Rank Summary & Grade Sheet</h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  Submit compiled grades to Main Registrar for final approval before student publication.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button onClick={handleSubmitGradesToRegistrar} className="btn btn-primary btn-sm">
                  <Send size={14} />
                  <span>Submit to Registrar</span>
                </button>

                <button onClick={handleExportCSV} className="btn btn-secondary btn-sm">
                  <Download size={14} />
                  <span>Export CSV</span>
                </button>

                <button onClick={() => window.print()} className="btn btn-secondary btn-sm">
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
                    <th>Student ID</th>
                    <th>Student Name</th>
                    <th>Class</th>
                    <th>Midterm (30%)</th>
                    <th>Final Exam (50%)</th>
                    <th>Bible Verses (20%)</th>
                    <th>Total Score</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(s => (
                    <tr key={s.id}>
                      <td><span className="badge badge-success">Rank #{s.rank}</span></td>
                      <td><code>{s.student_id}</code></td>
                      <td><strong>{s.name}</strong></td>
                      <td>{s.class}</td>
                      <td>{s.midterm}/30</td>
                      <td>{s.final_exam}/50</td>
                      <td>{s.bible_recitation}/20</td>
                      <td><strong style={{ color: 'var(--primary-blue)' }}>{s.total}%</strong></td>
                      <td>
                        <span className={`badge ${s.status === 'Approved' ? 'badge-success' : 'badge-warning'}`}>
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Custom Grade Scheme Builder */}
      {activeTab === 'schema' && (
        <div className="card" style={{ maxWidth: '700px', margin: '0 auto', width: '100%' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--primary-blue)' }}>
            Teacher Custom Grade Scheme Builder
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Set assessment types and their maximum weight scores (e.g. Midterm 30%, Final 50%, Homework 20%).
          </p>

          <form onSubmit={handleAddSchemeItem} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem', backgroundColor: 'var(--primary-light-blue)', padding: '1.25rem', borderRadius: '8px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Assessment Type Name *</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="e.g. Class Attendance / Choir"
                value={newSchemeItem.name}
                onChange={e => setNewSchemeItem({ ...newSchemeItem, name: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Maximum Grade Weight *</label>
              <input
                type="number"
                required
                className="form-control"
                value={newSchemeItem.max_score}
                onChange={e => setNewSchemeItem({ ...newSchemeItem, max_score: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                <Plus size={16} />
                <span>Add Category</span>
              </button>
            </div>
          </form>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Assessment Category</th>
                  <th>Maximum Grade Points</th>
                </tr>
              </thead>
              <tbody>
                {gradeScheme.map(sc => (
                  <tr key={sc.id}>
                    <td><strong>{sc.name}</strong></td>
                    <td><span className="badge badge-success">{sc.max_score} Marks</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Student / Parent Grade Lookup Portal */}
      {activeTab === 'student_lookup' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--primary-blue)' }}>
              Student Grade Lookup Portal
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Enter Student ID (e.g. <code>SKHC-STU-001</code>) to check approved results.
            </p>

            <form onSubmit={handleStudentLookup} style={{ display: 'flex', gap: '0.75rem' }}>
              <input
                type="text"
                required
                className="form-control"
                placeholder="Enter Student ID (e.g. SKHC-STU-001)..."
                value={lookupId}
                onChange={e => setLookupId(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">
                <ShieldCheck size={16} />
                <span>Lookup</span>
              </button>
            </form>
          </div>

          {lookupResult && (
            <div className="card" style={{ maxWidth: '650px', margin: '0 auto', width: '100%', borderLeft: '4px solid #166534' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <span className="badge badge-success">Approved & Certified by Main Registrar</span>
                  <h3 style={{ fontSize: '1.375rem', fontWeight: 800, marginTop: '0.25rem' }}>{lookupResult.name}</h3>
                  <small style={{ color: 'var(--text-muted)' }}>Student ID: <code>{lookupResult.student_id}</code> | Class: {lookupResult.class}</small>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <small style={{ color: 'var(--text-muted)' }}>Class Rank</small>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-blue)' }}>Rank #{lookupResult.rank}</h3>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', backgroundColor: 'var(--primary-light-blue)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                <div>
                  <small style={{ color: 'var(--text-muted)' }}>Midterm Test</small>
                  <p style={{ fontWeight: 700 }}>{lookupResult.midterm} / 30</p>
                </div>
                <div>
                  <small style={{ color: 'var(--text-muted)' }}>Final Exam</small>
                  <p style={{ fontWeight: 700 }}>{lookupResult.final_exam} / 50</p>
                </div>
                <div>
                  <small style={{ color: 'var(--text-muted)' }}>Bible Recitation</small>
                  <p style={{ fontWeight: 700 }}>{lookupResult.bible_recitation} / 20</p>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#166534' }}>Total Average: {lookupResult.total}%</span>
                <button onClick={() => window.print()} className="btn btn-secondary btn-sm">
                  <Printer size={14} />
                  <span>Print Grade Certificate</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Download Teaching Materials */}
      {activeTab === 'materials' && (
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--primary-blue)' }}>
            Teaching Materials Download Library
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem' }}>
              <span className="badge badge-warning" style={{ marginBottom: '0.5rem' }}>PDF Format</span>
              <h4 style={{ fontSize: '1.0625rem', fontWeight: 700 }}>Sunday School Curriculum Level 1</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '0.5rem 0' }}>
                Discipleship lessons for age groups 4 to 6.
              </p>
              <button onClick={() => showToast("Downloading Sunday School Curriculum Level 1 PDF...", "info")} className="btn btn-primary btn-sm">
                <Download size={14} />
                <span>Download Material</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Class Roster & Credentials Management */}
      {activeTab === 'classes_roster' && (
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--primary-blue)' }}>
            Class Roster & Student Credentials Manager
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
            View children assigned to your Sunday school classes & sections, inspect student login usernames, and reset PIN passwords.
          </p>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Class Level</th>
                  <th>Section</th>
                  <th>Assigned Teacher</th>
                  <th>Student Username ID</th>
                  <th>Default PIN Password</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(db?.children_records || [
                  { id: 'child-1', name: 'Hannah Solomon', age: 8, class_level: 'Level 2 - Primary', section_name: 'Section A', teacher: 'Brother Dawit Alemu', username_id: 'hannah/4829/2026', default_pin: '4892' },
                  { id: 'child-2', name: 'Daniel Yonas', age: 9, class_level: 'Level 2 - Primary', section_name: 'Section A', teacher: 'Brother Dawit Alemu', username_id: 'daniel/7382/2026', default_pin: '1234' }
                ]).map(c => (
                  <tr key={c.id}>
                    <td><strong>{c.name || c.child_full_name}</strong></td>
                    <td><span className="badge badge-success">{c.class_level || 'Level 2'}</span></td>
                    <td><span className="badge badge-warning">{c.section_name || 'Section A'}</span></td>
                    <td>{c.teacher || 'Brother Dawit Alemu'}</td>
                    <td>
                      <code style={{ fontWeight: 700, color: 'var(--primary-blue)' }}>
                        {c.username_id || `student/${Math.floor(1000 + Math.random() * 9000)}/2026`}
                      </code>
                    </td>
                    <td>
                      <code style={{ backgroundColor: 'var(--primary-light-blue)', padding: '0.2rem 0.5rem', borderRadius: '4px', color: '#166534', fontWeight: 800 }}>
                        {c.default_pin || '1234'}
                      </code>
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          const currentDb = getMockDB();
                          const idx = (currentDb.children_records || []).findIndex(x => x.id === c.id);
                          if (idx !== -1) {
                            currentDb.children_records[idx].default_pin = '1234';
                          }
                          const userIdx = (currentDb.users || []).findIndex(u => u.username_id === c.username_id);
                          if (userIdx !== -1) {
                            currentDb.users[userIdx].default_pin = '1234';
                            currentDb.users[userIdx].password_pin = '1234';
                            currentDb.users[userIdx].pin_changed = false;
                          }
                          saveMockDB(currentDb);
                          refreshDB();
                          showToast(`Reset 4-digit PIN password to default '1234' for ${c.name || c.child_full_name}`, "info");
                        }}
                        className="btn btn-secondary btn-sm"
                      >
                        <span>Reset PIN</span>
                      </button>
                    </td>
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
