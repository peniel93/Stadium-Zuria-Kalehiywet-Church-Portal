import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/ToastAlert';
import { getMockDB, saveMockDB } from '../../lib/supabase';
import { Shield, Clock, Calendar, UserPlus, CheckCircle2, Megaphone } from 'lucide-react';

export const GuardianDashboard = () => {
  const { db, refreshDB } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('roster'); // 'roster', 'assign_shift', 'create_guardian'

  const shifts = db?.guardian_shifts || [
    { id: '1', name: 'Deacon Berhanu Tadesse', guardian_name: 'Deacon Berhanu Tadesse', phone: '+251911889900', days: 'Monday, Wednesday, Friday', shift_days: 'Monday, Wednesday, Friday', hours: '07:00 AM - 03:00 PM', shift_hours: '07:00 AM - 03:00 PM', location: 'Gate 1 Main Entrance' },
    { id: '2', name: 'Brother Yonas Kifle', guardian_name: 'Brother Yonas Kifle', phone: '+251911776655', days: 'Tuesday, Thursday, Saturday', shift_days: 'Tuesday, Thursday, Saturday', hours: '03:00 PM - 11:00 PM', shift_hours: '03:00 PM - 11:00 PM', location: 'Gate 2 Parking Area' }
  ];

  const [shiftForm, setShiftForm] = useState({
    guardian_name: 'Deacon Berhanu Tadesse',
    days: 'Monday, Wednesday, Friday',
    start_time: '07:00',
    end_time: '15:00',
    location: 'Main Church Gate 1'
  });

  const handleAssignShift = (e) => {
    e.preventDefault();
    const freshDb = getMockDB();
    if (!freshDb.guardian_shifts) freshDb.guardian_shifts = [];
    const newShf = {
      id: `shf-${Date.now()}`,
      name: shiftForm.guardian_name,
      guardian_name: shiftForm.guardian_name,
      phone: '+251911000000',
      days: shiftForm.days,
      shift_days: shiftForm.days,
      hours: `${shiftForm.start_time} - ${shiftForm.end_time}`,
      shift_hours: `${shiftForm.start_time} - ${shiftForm.end_time}`,
      location: shiftForm.location,
      created_at: new Date().toISOString()
    };
    freshDb.guardian_shifts.unshift(newShf);
    saveMockDB(freshDb);
    refreshDB();
    showToast(`Guardian duty shift assigned to ${shiftForm.guardian_name} and saved to Database!`, "success");
    setActiveTab('roster');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Header & Tabs */}
      <div className="card no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--primary-blue)' }}>
            Guardian & Security Duty Dashboard
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Schedule guardian shifts, multi-day hour pickers, duty rosters, and security announcements.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('roster')}
            className={`btn ${activeTab === 'roster' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Clock size={16} />
            <span>Shift Duty Roster</span>
          </button>

          <button
            onClick={() => setActiveTab('assign_shift')}
            className={`btn ${activeTab === 'assign_shift' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Calendar size={16} />
            <span>Assign New Shift</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Roster List */}
      {activeTab === 'roster' && (
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--primary-blue)' }}>
            Scheduled Guardian Shifts
          </h3>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Guardian Name</th>
                  <th>Phone Number</th>
                  <th>Assigned Shift Days</th>
                  <th>Shift Operating Hours</th>
                  <th>Duty Location</th>
                </tr>
              </thead>
              <tbody>
                {shifts.map(s => (
                  <tr key={s.id}>
                    <td><strong>{s.name}</strong></td>
                    <td>{s.phone}</td>
                    <td><span className="badge badge-warning">{s.days}</span></td>
                    <td><strong style={{ color: 'var(--primary-blue)' }}>{s.hours}</strong></td>
                    <td>{s.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Assign Shift Form */}
      {activeTab === 'assign_shift' && (
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem', color: 'var(--primary-blue)' }}>
            Assign Shift Time & Days
          </h3>

          <form onSubmit={handleAssignShift}>
            <div className="form-group">
              <label className="form-label">Guardian Name *</label>
              <input
                type="text"
                required
                className="form-control"
                value={shiftForm.guardian_name}
                onChange={e => setShiftForm({ ...shiftForm, guardian_name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Selected Shift Days</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="e.g. Monday, Wednesday, Friday"
                value={shiftForm.days}
                onChange={e => setShiftForm({ ...shiftForm, days: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Start Time</label>
                <input
                  type="time"
                  required
                  className="form-control"
                  value={shiftForm.start_time}
                  onChange={e => setShiftForm({ ...shiftForm, start_time: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">End Time</label>
                <input
                  type="time"
                  required
                  className="form-control"
                  value={shiftForm.end_time}
                  onChange={e => setShiftForm({ ...shiftForm, end_time: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Duty Location / Gate</label>
              <input
                type="text"
                className="form-control"
                value={shiftForm.location}
                onChange={e => setShiftForm({ ...shiftForm, location: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
              <CheckCircle2 size={16} />
              <span>Post Guardian Shift</span>
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
