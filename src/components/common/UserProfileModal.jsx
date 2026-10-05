import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from './ToastAlert';
import { X, User, Camera, ShieldCheck, Mail, Phone, MapPin, Lock, Save, KeyRound, Briefcase, Users } from 'lucide-react';

export const UserProfileModal = ({ isOpen, onClose }) => {
  const { currentUser, updateUserProfile, updatePIN } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('demographics'); // 'demographics' | 'pin'
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    occupation: '',
    gender: 'Male',
    age: '',
    region: '',
    zone: '',
    kebele: '',
    medeb_zone: 'Stadium_Zuria',
    medib_number: 'Medib-1',
    family_size: '',
    wife_name: '',
    number_of_sons: 0,
    number_of_daughters: 0,
    sons_names: '',
    daughters_names: '',
    profile_picture_url: ''
  });

  const [sonsDetails, setSonsDetails] = useState([]);
  const [daughtersDetails, setDaughtersDetails] = useState([]);

  const [pinForm, setPinForm] = useState({
    new_pin: '',
    confirm_pin: ''
  });

  useEffect(() => {
    if (currentUser) {
      const initialSonsCount = currentUser.number_of_sons || 0;
      const initialDaughtersCount = currentUser.number_of_daughters || 0;

      const defaultSons = currentUser.sons_details || Array.from({ length: initialSonsCount }).map((_, i) => ({
        name: (currentUser.sons_names || '').split(',')[i]?.trim() || `Son ${i + 1}`,
        education: 'University Degree',
        marital: 'Single',
        occupation: 'Student'
      }));

      const defaultDaughters = currentUser.daughters_details || Array.from({ length: initialDaughtersCount }).map((_, i) => ({
        name: (currentUser.daughters_names || '').split(',')[i]?.trim() || `Daughter ${i + 1}`,
        education: 'Elementary',
        marital: 'Single',
        occupation: 'Student'
      }));

      setProfileForm({
        full_name: currentUser.full_name || '',
        email: currentUser.email || '',
        phone_number: currentUser.phone_number || '',
        occupation: currentUser.occupation || '',
        gender: currentUser.gender || 'Male',
        age: currentUser.age || '',
        region: currentUser.region || 'Addis Ababa',
        zone: currentUser.zone || 'Kirkos',
        kebele: currentUser.kebele || '02',
        medeb_zone: currentUser.medeb_zone || 'Stadium_Zuria',
        medib_number: currentUser.medib_number || 'Medib-1',
        family_size: currentUser.family_size || '',
        wife_name: currentUser.wife_name || '',
        number_of_sons: initialSonsCount,
        number_of_daughters: initialDaughtersCount,
        sons_names: currentUser.sons_names || '',
        daughters_names: currentUser.daughters_names || '',
        profile_picture_url: currentUser.profile_picture_url || currentUser.avatar_url || ''
      });

      setSonsDetails(defaultSons);
      setDaughtersDetails(defaultDaughters);
    }
  }, [currentUser, isOpen]);

  const handleSonsCountChange = (countVal) => {
    const num = Math.max(0, parseInt(countVal) || 0);
    setProfileForm(prev => ({ ...prev, number_of_sons: num }));
    setSonsDetails(prev => {
      const copy = [...prev];
      if (num > copy.length) {
        for (let i = copy.length; i < num; i++) {
          copy.push({ name: '', education: 'Elementary', marital: 'Single', occupation: 'Student' });
        }
      } else {
        copy.splice(num);
      }
      return copy;
    });
  };

  const handleDaughtersCountChange = (countVal) => {
    const num = Math.max(0, parseInt(countVal) || 0);
    setProfileForm(prev => ({ ...prev, number_of_daughters: num }));
    setDaughtersDetails(prev => {
      const copy = [...prev];
      if (num > copy.length) {
        for (let i = copy.length; i < num; i++) {
          copy.push({ name: '', education: 'Elementary', marital: 'Single', occupation: 'Student' });
        }
      } else {
        copy.splice(num);
      }
      return copy;
    });
  };

  if (!isOpen || !currentUser) return null;

  const handleProfilePictureUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setProfileForm(prev => ({ ...prev, profile_picture_url: dataUrl }));
      showToast("Profile picture selected. Click 'Save Profile Changes' to update in database.", "info");
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!profileForm.full_name) {
      showToast("Full Name is required.", "error");
      return;
    }

    const payload = {
      ...profileForm,
      sons_names: sonsDetails.map(s => s.name).filter(Boolean).join(', '),
      daughters_names: daughtersDetails.map(d => d.name).filter(Boolean).join(', '),
      sons_details: sonsDetails,
      daughters_details: daughtersDetails
    };

    updateUserProfile(currentUser.id, payload);
    showToast("Profile and demographic information saved to database!", "success");
    onClose();
  };

  const handleSavePIN = (e) => {
    e.preventDefault();
    if (pinForm.new_pin.length !== 4 || isNaN(pinForm.new_pin)) {
      showToast("PIN must be a 4-digit number.", "error");
      return;
    }
    if (pinForm.new_pin !== pinForm.confirm_pin) {
      showToast("PIN confirmation does not match.", "error");
      return;
    }

    updatePIN(pinForm.new_pin);
    showToast("4-digit PIN password updated successfully!", "success");
    setPinForm({ new_pin: '', confirm_pin: '' });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1100,
      padding: '1rem'
    }}>
      <div className="card" style={{
        maxWidth: '720px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        padding: '2rem'
      }}>
        {/* Close Modal Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={22} />
        </button>

        {/* Profile Modal Header Banner */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          paddingBottom: '1.25rem',
          borderBottom: '1px solid var(--border-color)',
          marginBottom: '1.5rem',
          flexWrap: 'wrap'
        }}>
          {/* Avatar / Profile Picture Picker */}
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              overflow: 'hidden',
              backgroundColor: 'var(--primary-light-blue)',
              border: '3px solid var(--primary-blue)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {profileForm.profile_picture_url ? (
                <img src={profileForm.profile_picture_url} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <User size={44} style={{ color: 'var(--primary-blue)' }} />
              )}
            </div>

            <label
              htmlFor="profile-pic-input"
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: 'var(--primary-blue)',
                color: '#fff',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)'
              }}
              title="Upload / Change Profile Picture"
            >
              <Camera size={15} />
            </label>
            <input
              id="profile-pic-input"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleProfilePictureUpload}
            />
          </div>

          {/* User Meta Information */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
              <h2 style={{ fontSize: '1.375rem', fontWeight: 800 }}>{currentUser.full_name}</h2>
              <span className="badge badge-success">{currentUser.role}</span>
              {currentUser.leadership_role && (
                <span className="badge badge-warning">{currentUser.leadership_role}</span>
              )}
            </div>

            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Username ID: <strong style={{ color: 'var(--primary-blue)' }}>{currentUser.username_id}</strong>
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.125rem' }}>
              Status: <span style={{ color: '#166534', fontWeight: 700 }}>{currentUser.status || 'Active'}</span> | Joined SKHC Portal System
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
          <button
            onClick={() => setActiveTab('demographics')}
            className={`btn btn-sm ${activeTab === 'demographics' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <User size={14} />
            <span>Profile & Demographics</span>
          </button>
          <button
            onClick={() => setActiveTab('pin')}
            className={`btn btn-sm ${activeTab === 'pin' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <KeyRound size={14} />
            <span>Change 4-Digit PIN</span>
          </button>
        </div>

        {/* TAB 1: Profile & Demographics Form */}
        {activeTab === 'demographics' && (
          <form onSubmit={handleSaveProfile}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={profileForm.full_name}
                  onChange={e => setProfileForm({ ...profileForm, full_name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="user@skhc.org"
                  value={profileForm.email}
                  onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="+251 911 000 000"
                  value={profileForm.phone_number}
                  onChange={e => setProfileForm({ ...profileForm, phone_number: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Occupation / Profession</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Civil Engineer / Accountant"
                  value={profileForm.occupation}
                  onChange={e => setProfileForm({ ...profileForm, occupation: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Gender</label>
                <select
                  className="form-control"
                  value={profileForm.gender}
                  onChange={e => setProfileForm({ ...profileForm, gender: e.target.value })}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Age</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="e.g. 35"
                  value={profileForm.age}
                  onChange={e => setProfileForm({ ...profileForm, age: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Medeb Zone</label>
                <select
                  className="form-control"
                  value={profileForm.medeb_zone}
                  onChange={e => setProfileForm({ ...profileForm, medeb_zone: e.target.value })}
                >
                  <option value="Stadium_Zuria">Stadium Zuria Zone</option>
                  <option value="Kazanchis">Kazanchis Zone</option>
                  <option value="Bole">Bole Zone</option>
                  <option value="Gotera">Gotera Zone</option>
                  <option value="Mexico">Mexico Zone</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Medib Number / Sub-division</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Medib-1"
                  value={profileForm.medib_number}
                  onChange={e => setProfileForm({ ...profileForm, medib_number: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Region / Sub-city</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Addis Ababa / Kirkos"
                  value={profileForm.region}
                  onChange={e => setProfileForm({ ...profileForm, region: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Kebele</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Kebele 02"
                  value={profileForm.kebele}
                  onChange={e => setProfileForm({ ...profileForm, kebele: e.target.value })}
                />
              </div>

            </div>

            {/* Family Information Subsection */}
            <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px dashed var(--border-color)' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary-blue)', marginBottom: '1rem' }}>
                Family & Children Demographic Details
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Spouse Name (if married)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Tigist Alemu"
                    value={profileForm.wife_name}
                    onChange={e => setProfileForm({ ...profileForm, wife_name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Number of Sons</label>
                  <input
                    type="number"
                    min={0}
                    className="form-control"
                    value={profileForm.number_of_sons}
                    onChange={e => handleSonsCountChange(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Number of Daughters</label>
                  <input
                    type="number"
                    min={0}
                    className="form-control"
                    value={profileForm.number_of_daughters}
                    onChange={e => handleDaughtersCountChange(e.target.value)}
                  />
                </div>
              </div>

              {/* Dynamic Sons Fields */}
              {sonsDetails.length > 0 && (
                <div style={{ marginBottom: '1.5rem', backgroundColor: 'rgba(0, 102, 204, 0.03)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <h5 style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--primary-blue)', marginBottom: '0.75rem' }}>
                    👦 Sons' Detailed Demographics ({sonsDetails.length} Son{sonsDetails.length > 1 ? 's' : ''})
                  </h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {sonsDetails.map((son, idx) => (
                      <div key={idx} style={{ backgroundColor: 'var(--bg-card)', padding: '0.875rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-blue)' }}>Son #{idx + 1}</span>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginTop: '0.5rem' }}>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label" style={{ fontSize: '0.75rem' }}>Son Full Name</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder={`e.g. Son Name ${idx + 1}`}
                              value={son.name}
                              onChange={e => {
                                const val = e.target.value;
                                setSonsDetails(prev => prev.map((item, i) => i === idx ? { ...item, name: val } : item));
                              }}
                            />
                          </div>

                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label" style={{ fontSize: '0.75rem' }}>Educational Status</label>
                            <select
                              className="form-control"
                              value={son.education}
                              onChange={e => {
                                const val = e.target.value;
                                setSonsDetails(prev => prev.map((item, i) => i === idx ? { ...item, education: val } : item));
                              }}
                            >
                              <option value="Elementary">Elementary School</option>
                              <option value="High School">High School</option>
                              <option value="TVET / Diploma">TVET / Diploma</option>
                              <option value="University Degree">University Degree</option>
                              <option value="Masters / PhD">Masters / PhD</option>
                              <option value="Not Enrolled">Not Enrolled</option>
                            </select>
                          </div>

                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label" style={{ fontSize: '0.75rem' }}>Marital Status</label>
                            <select
                              className="form-control"
                              value={son.marital}
                              onChange={e => {
                                const val = e.target.value;
                                setSonsDetails(prev => prev.map((item, i) => i === idx ? { ...item, marital: val } : item));
                              }}
                            >
                              <option value="Single">Single</option>
                              <option value="Married">Married</option>
                              <option value="Engaged">Engaged</option>
                            </select>
                          </div>

                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label" style={{ fontSize: '0.75rem' }}>Occupation Status</label>
                            <select
                              className="form-control"
                              value={son.occupation}
                              onChange={e => {
                                const val = e.target.value;
                                setSonsDetails(prev => prev.map((item, i) => i === idx ? { ...item, occupation: val } : item));
                              }}
                            >
                              <option value="Student">Student</option>
                              <option value="Employed">Employed (Public/Private)</option>
                              <option value="Self-Employed">Self-Employed / Business</option>
                              <option value="Unemployed">Unemployed</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dynamic Daughters Fields */}
              {daughtersDetails.length > 0 && (
                <div style={{ marginBottom: '1.5rem', backgroundColor: 'rgba(236, 72, 153, 0.03)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <h5 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#db2777', marginBottom: '0.75rem' }}>
                    👧 Daughters' Detailed Demographics ({daughtersDetails.length} Daughter{daughtersDetails.length > 1 ? 's' : ''})
                  </h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {daughtersDetails.map((dau, idx) => (
                      <div key={idx} style={{ backgroundColor: 'var(--bg-card)', padding: '0.875rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#db2777' }}>Daughter #{idx + 1}</span>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginTop: '0.5rem' }}>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label" style={{ fontSize: '0.75rem' }}>Daughter Full Name</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder={`e.g. Daughter Name ${idx + 1}`}
                              value={dau.name}
                              onChange={e => {
                                const val = e.target.value;
                                setDaughtersDetails(prev => prev.map((item, i) => i === idx ? { ...item, name: val } : item));
                              }}
                            />
                          </div>

                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label" style={{ fontSize: '0.75rem' }}>Educational Status</label>
                            <select
                              className="form-control"
                              value={dau.education}
                              onChange={e => {
                                const val = e.target.value;
                                setDaughtersDetails(prev => prev.map((item, i) => i === idx ? { ...item, education: val } : item));
                              }}
                            >
                              <option value="Elementary">Elementary School</option>
                              <option value="High School">High School</option>
                              <option value="TVET / Diploma">TVET / Diploma</option>
                              <option value="University Degree">University Degree</option>
                              <option value="Masters / PhD">Masters / PhD</option>
                              <option value="Not Enrolled">Not Enrolled</option>
                            </select>
                          </div>

                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label" style={{ fontSize: '0.75rem' }}>Marital Status</label>
                            <select
                              className="form-control"
                              value={dau.marital}
                              onChange={e => {
                                const val = e.target.value;
                                setDaughtersDetails(prev => prev.map((item, i) => i === idx ? { ...item, marital: val } : item));
                              }}
                            >
                              <option value="Single">Single</option>
                              <option value="Married">Married</option>
                              <option value="Engaged">Engaged</option>
                            </select>
                          </div>

                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label" style={{ fontSize: '0.75rem' }}>Occupation Status</label>
                            <select
                              className="form-control"
                              value={dau.occupation}
                              onChange={e => {
                                const val = e.target.value;
                                setDaughtersDetails(prev => prev.map((item, i) => i === idx ? { ...item, occupation: val } : item));
                              }}
                            >
                              <option value="Student">Student</option>
                              <option value="Employed">Employed (Public/Private)</option>
                              <option value="Self-Employed">Self-Employed / Business</option>
                              <option value="Unemployed">Unemployed</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button type="button" onClick={onClose} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <Save size={16} />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: Change 4-Digit PIN */}
        {activeTab === 'pin' && (
          <form onSubmit={handleSavePIN} style={{ maxWidth: '400px', margin: '0 auto' }}>
            <div className="form-group">
              <label className="form-label">New 4-Digit PIN Password</label>
              <input
                type="password"
                required
                maxLength={4}
                className="form-control"
                placeholder="e.g. 4892"
                value={pinForm.new_pin}
                onChange={e => setPinForm({ ...pinForm, new_pin: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New 4-Digit PIN</label>
              <input
                type="password"
                required
                maxLength={4}
                className="form-control"
                placeholder="e.g. 4892"
                value={pinForm.confirm_pin}
                onChange={e => setPinForm({ ...pinForm, confirm_pin: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button type="button" onClick={onClose} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <KeyRound size={16} />
                <span>Update 4-Digit PIN</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
