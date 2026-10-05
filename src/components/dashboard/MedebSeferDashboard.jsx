import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/ToastAlert';
import { getMockDB, saveMockDB } from '../../lib/supabase';
import {
  Layers, Users, UserPlus, FileText, DollarSign, Send, BookOpen, CheckCircle2, Home, Calendar
} from 'lucide-react';

export const MedebSeferDashboard = ({ roleTitle = "Fathers' Medeb Sefer Leader (FMSL)" }) => {
  const { db, refreshDB } = useAuth();
  const { showToast } = useToast();

  const [selectedZone, setSelectedZone] = useState('Stadium_Zuria');
  const [selectedMedib, setSelectedMedib] = useState('Medib-1');
  const [activeTab, setActiveTab] = useState('attendance'); // 'attendance', 'night_chapel', 'course_request', 'members'

  // Weekly Attendance Report State
  const [attendanceForm, setAttendanceForm] = useState({
    total_attendees: 35,
    next_program_host_name: 'Brother Tesfaye Worku',
    next_program_house_address: 'House #402 Near Stadium Gate 2',
    weekly_lesson_topic: 'Walking in Holiness and Christian Fellowship',
    notes: 'Great fellowship and active participation.'
  });

  // Night Chapel Money Report State
  const [nightChapelForm, setNightChapelForm] = useState({
    amount_collected: 4500.00,
    collected_date: '2026-07-25',
    notes: 'Friday Night Chapel Gathering Collection'
  });

  // Weekly Course Request Form State
  const [courseForm, setCourseForm] = useState({
    course_name: 'Discipleship & Foundations of Faith Level 2',
    requested_date: '2026-07-27',
    notes: 'Requested materials for 15 new cell believers'
  });

  // Member Creation Form State
  const [memberForm, setMemberForm] = useState({
    full_name: '',
    phone_number: '',
    gender: 'Male',
    age: 30,
    occupation: 'Self Employed'
  });

  const membersList = db?.church_members || [
    { id: '1', full_name: 'Abebe Kebede', phone: '+251911112233', phone_number: '+251911112233', gender: 'Male', age: 42, zone: selectedZone, medeb_zone: selectedZone, medib: selectedMedib, medib_number: selectedMedib },
    { id: '2', full_name: 'Tigist Alemu', phone: '+251911445566', phone_number: '+251911445566', gender: 'Female', age: 38, zone: selectedZone, medeb_zone: selectedZone, medib: selectedMedib, medib_number: selectedMedib }
  ];

  const handleSendAttendance = (e) => {
    e.preventDefault();
    const freshDb = getMockDB();
    if (!freshDb.medeb_attendance_reports) freshDb.medeb_attendance_reports = [];
    freshDb.medeb_attendance_reports.unshift({
      id: `att-${Date.now()}`,
      zone_name: selectedZone,
      medib_number: selectedMedib,
      total_attendees: parseInt(attendanceForm.total_attendees) || 0,
      next_program_host_name: attendanceForm.next_program_host_name,
      next_program_house_address: attendanceForm.next_program_house_address,
      weekly_lesson_topic: attendanceForm.weekly_lesson_topic,
      notes: attendanceForm.notes,
      report_date: new Date().toISOString().slice(0, 10),
      created_at: new Date().toISOString()
    });
    saveMockDB(freshDb);
    refreshDB();
    showToast(`Weekly Attendance report for ${selectedZone} (${selectedMedib}) saved to Database!`, "success");
  };

  const handleSendNightChapel = (e) => {
    e.preventDefault();
    const freshDb = getMockDB();
    if (!freshDb.financial_records) freshDb.financial_records = [];
    freshDb.financial_records.unshift({
      id: `fin-${Date.now()}`,
      record_type: 'Income',
      type: 'Income',
      amount: parseFloat(nightChapelForm.amount_collected) || 0,
      category: 'Night Chapel Collection',
      transaction_date_time: nightChapelForm.collected_date || new Date().toISOString(),
      date: nightChapelForm.collected_date || new Date().toISOString().slice(0, 10),
      reason_description: `Friday Night Chapel Gathering Collection (${selectedZone} - ${selectedMedib})`,
      reason: `Friday Night Chapel Gathering Collection (${selectedZone} - ${selectedMedib})`,
      spent_by_or_received_from: 'Genzeb Yazh Committee',
      created_at: new Date().toISOString()
    });
    saveMockDB(freshDb);
    refreshDB();
    showToast(`Night Chapel Collection of ${nightChapelForm.amount_collected} ETB saved to Database!`, "success");
  };

  const handleSendCourseRequest = (e) => {
    e.preventDefault();
    const freshDb = getMockDB();
    if (!freshDb.medeb_course_requests) freshDb.medeb_course_requests = [];
    freshDb.medeb_course_requests.unshift({
      id: `cr-${Date.now()}`,
      zone_name: selectedZone,
      medib_number: selectedMedib,
      course_name: courseForm.course_name,
      requested_date: courseForm.requested_date || new Date().toISOString().slice(0, 10),
      notes: courseForm.notes,
      status: 'Pending',
      created_at: new Date().toISOString()
    });
    saveMockDB(freshDb);
    refreshDB();
    showToast(`Course request "${courseForm.course_name}" saved to Database!`, "success");
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!memberForm.full_name || !memberForm.phone_number) {
      showToast("Name and Phone Number are required", "error");
      return;
    }

    const freshDb = getMockDB();
    if (!freshDb.church_members) freshDb.church_members = [];

    const newMb = {
      id: `mb-${Date.now()}`,
      full_name: memberForm.full_name,
      phone: memberForm.phone_number,
      phone_number: memberForm.phone_number,
      gender: memberForm.gender,
      age: memberForm.age,
      zone: selectedZone,
      medeb_zone: selectedZone,
      medib: selectedMedib,
      medib_number: selectedMedib,
      is_active: true,
      created_at: new Date().toISOString().slice(0, 10)
    };

    freshDb.church_members.unshift(newMb);
    saveMockDB(freshDb);
    refreshDB();

    showToast(`Added ${memberForm.full_name} to ${selectedZone} - ${selectedMedib} in Database!`, "success");
    setMemberForm({ full_name: '', phone_number: '', gender: 'Male', age: 30, occupation: 'Self Employed' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Zone & Medib 1-10 Selector Panel */}
      <div className="card" style={{ backgroundColor: 'var(--primary-light-blue)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-blue)' }}>
              {roleTitle} — Medeb Sefer Administration
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Select Zone & Medib Sub-Division (Medib 1 to 10)
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{ fontWeight: 700, fontSize: '0.875rem' }}>Zone:</label>
              <select
                className="form-control"
                value={selectedZone}
                onChange={e => setSelectedZone(e.target.value)}
                style={{ width: 'auto' }}
              >
                <option value="Maremiya">1. Maremiya Zone</option>
                <option value="Kutir_1">2. Kutir-1 Zone</option>
                <option value="Memeheran">3. Memeheran Zone</option>
                <option value="Muya_and_Technique">4. Muya & Technique Zone</option>
                <option value="Stadium_Zuria">5. Stadium Zuria Zone</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{ fontWeight: 700, fontSize: '0.875rem' }}>Medib:</label>
              <select
                className="form-control"
                value={selectedMedib}
                onChange={e => setSelectedMedib(e.target.value)}
                style={{ width: 'auto' }}
              >
                <option value="Medib-1">Medib-1</option>
                <option value="Medib-2">Medib-2</option>
                <option value="Medib-3">Medib-3</option>
                <option value="Medib-4">Medib-4</option>
                <option value="Medib-5">Medib-5</option>
                <option value="Medib-6">Medib-6</option>
                <option value="Medib-7">Medib-7</option>
                <option value="Medib-8">Medib-8</option>
                <option value="Medib-9">Medib-9</option>
                <option value="Medib-10">Medib-10</option>
              </select>
            </div>
          </div>
        </div>

        {/* Feature Action Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`btn ${activeTab === 'attendance' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Calendar size={16} />
            <span>Weekly Attendance & Next House</span>
          </button>

          <button
            onClick={() => setActiveTab('night_chapel')}
            className={`btn ${activeTab === 'night_chapel' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <DollarSign size={16} />
            <span>Night Chapel Collection</span>
          </button>

          <button
            onClick={() => setActiveTab('course_request')}
            className={`btn ${activeTab === 'course_request' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <BookOpen size={16} />
            <span>Request Courses</span>
          </button>

          <button
            onClick={() => setActiveTab('members')}
            className={`btn ${activeTab === 'members' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <UserPlus size={16} />
            <span>Add Medeb Members</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Weekly Attendance & Next Program House */}
      {activeTab === 'attendance' && (
        <div className="card" style={{ maxWidth: '700px', margin: '0 auto', width: '100%' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem', color: 'var(--primary-blue)' }}>
            Weekly Attendance & Program House Host Report
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Report sent to Menfesawi Zerf and Pastoral Care.
          </p>

          <form onSubmit={handleSendAttendance}>
            <div className="form-group">
              <label className="form-label">Total Attendance Count</label>
              <input
                type="number"
                required
                className="form-control"
                value={attendanceForm.total_attendees}
                onChange={e => setAttendanceForm({ ...attendanceForm, total_attendees: parseInt(e.target.value) })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Next Program Host Name</label>
              <input
                type="text"
                required
                className="form-control"
                value={attendanceForm.next_program_host_name}
                onChange={e => setAttendanceForm({ ...attendanceForm, next_program_host_name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Next Program House Address</label>
              <input
                type="text"
                required
                className="form-control"
                value={attendanceForm.next_program_house_address}
                onChange={e => setAttendanceForm({ ...attendanceForm, next_program_house_address: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Weekly Lesson Topic</label>
              <input
                type="text"
                className="form-control"
                value={attendanceForm.weekly_lesson_topic}
                onChange={e => setAttendanceForm({ ...attendanceForm, weekly_lesson_topic: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
              <Send size={16} />
              <span>Submit Attendance & Program House Report</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: Night Chapel Collection */}
      {activeTab === 'night_chapel' && (
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem', color: 'var(--primary-blue)' }}>
            Night Chapel Money Collection Report
          </h3>

          <form onSubmit={handleSendNightChapel}>
            <div className="form-group">
              <label className="form-label">Amount Collected (ETB) *</label>
              <input
                type="number"
                required
                className="form-control"
                value={nightChapelForm.amount_collected}
                onChange={e => setNightChapelForm({ ...nightChapelForm, amount_collected: parseFloat(e.target.value) })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Collection Date</label>
              <input
                type="date"
                className="form-control"
                value={nightChapelForm.collected_date}
                onChange={e => setNightChapelForm({ ...nightChapelForm, collected_date: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Notes & Details</label>
              <textarea
                rows={2}
                className="form-control"
                value={nightChapelForm.notes}
                onChange={e => setNightChapelForm({ ...nightChapelForm, notes: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
              <DollarSign size={16} />
              <span>Submit Night Chapel Collection</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: Request Courses from Menfesawi Zerf */}
      {activeTab === 'course_request' && (
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem', color: 'var(--primary-blue)' }}>
            Request Weekly Learning Courses
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Requests sent to Menfesawi Zerf (which receives materials from Education & Training Team).
          </p>

          <form onSubmit={handleSendCourseRequest}>
            <div className="form-group">
              <label className="form-label">Course / Material Name *</label>
              <input
                type="text"
                required
                className="form-control"
                value={courseForm.course_name}
                onChange={e => setCourseForm({ ...courseForm, course_name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Additional Instructions</label>
              <textarea
                rows={3}
                className="form-control"
                value={courseForm.notes}
                onChange={e => setCourseForm({ ...courseForm, notes: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
              <BookOpen size={16} />
              <span>Send Course Request</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: Add Members */}
      {activeTab === 'members' && (
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--primary-blue)' }}>
            Members in {selectedZone} ({selectedMedib})
          </h3>

          <form onSubmit={handleAddMember} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem', backgroundColor: 'var(--primary-light-blue)', padding: '1.25rem', borderRadius: '8px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="e.g. Solomon Alemu"
                value={memberForm.full_name}
                onChange={e => setMemberForm({ ...memberForm, full_name: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Phone Number *</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="+251 911 000 000"
                value={memberForm.phone_number}
                onChange={e => setMemberForm({ ...memberForm, phone_number: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
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

            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                <UserPlus size={16} />
                <span>Add Member</span>
              </button>
            </div>
          </form>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Phone Number</th>
                  <th>Gender</th>
                  <th>Zone & Medib</th>
                </tr>
              </thead>
              <tbody>
                {membersList.map(m => (
                  <tr key={m.id}>
                    <td><strong>{m.full_name}</strong></td>
                    <td>{m.phone}</td>
                    <td>{m.gender}</td>
                    <td><span className="badge badge-success">{selectedZone} - {selectedMedib}</span></td>
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
