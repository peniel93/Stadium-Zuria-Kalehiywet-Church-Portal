import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/ToastAlert';
import { getMockDB, saveMockDB } from '../../lib/supabase';
import {
  BookOpen, Users, UserPlus, Send, Download, CheckCircle2, Award,
  Layers, Settings, Edit3, Trash2, KeyRound, AlertCircle, Sparkles, UserCheck, Shield, Plus
} from 'lucide-react';

export const YelijochZerfDashboard = () => {
  const { db, refreshDB, createUser } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('children'); // 'children', 'age_categories', 'classes', 'assign_teacher'

  const freshDb = getMockDB();
  const children = freshDb.children_records || [
    { id: 'child-1', name: 'Hannah Solomon', child_full_name: 'Hannah Solomon', age: 8, gender: 'Female', class_level: 'Level 2 - Primary', section_name: 'Section A', medeb_zone: 'Stadium_Zuria', teacher: 'Brother Dawit Alemu', username_id: 'hannah/4829/2026', default_pin: '4892' },
    { id: 'child-2', name: 'Daniel Yonas', child_full_name: 'Daniel Yonas', age: 9, gender: 'Male', class_level: 'Level 2 - Primary', section_name: 'Section A', medeb_zone: 'Kutir_1', teacher: 'Brother Dawit Alemu', username_id: 'daniel/7382/2026', default_pin: '1234' }
  ];

  const ageCategories = freshDb.children_age_categories || [
    { id: 'ac-1', name: 'Beginners Level 1', min_age: 4, max_age: 6, level_code: 'Level 1', description: 'Early childhood Bible stories, coloring & prayer basics' },
    { id: 'ac-2', name: 'Primary Level 2', min_age: 7, max_age: 9, level_code: 'Level 2', description: 'Elementary scripture memorization & Christian character' },
    { id: 'ac-3', name: 'Junior Level 3', min_age: 10, max_age: 12, level_code: 'Level 3', description: 'Intermediate Bible doctrine & fellowship leadership' },
    { id: 'ac-4', name: 'Teens Level 4', min_age: 13, max_age: 15, level_code: 'Level 4', description: 'Youth discipleship, ministry service & Bible study' }
  ];

  const classesList = freshDb.children_classes || [
    { id: 'cls-1', class_name: 'Level 1 - Beginners', section: 'Section A', age_category_id: 'ac-1', age_range: '4-6 yrs', teacher_name: 'Sister Bethlehem Markos', room: 'Children Hall 1' },
    { id: 'cls-2', class_name: 'Level 2 - Primary', section: 'Section A', age_category_id: 'ac-2', age_range: '7-9 yrs', teacher_name: 'Brother Dawit Alemu', room: 'Children Hall 2' },
    { id: 'cls-3', class_name: 'Level 2 - Primary', section: 'Section B', age_category_id: 'ac-2', age_range: '7-9 yrs', teacher_name: 'Sister Tigist Alemu', room: 'Children Hall 3' },
    { id: 'cls-4', class_name: 'Level 3 - Junior', section: 'Section A', age_category_id: 'ac-3', age_range: '10-12 yrs', teacher_name: 'Deacon Solomon Wolde', room: 'Upper Room 1' }
  ];

  // Helper to extract unique class names for menu selection
  const uniqueClassNames = Array.from(new Set([
    ...classesList.map(c => c.class_name),
    ...ageCategories.map(a => a.name)
  ])).filter(Boolean);

  // Helper to extract unique section names for menu selection
  const uniqueSections = Array.from(new Set([
    'Section A', 'Section B', 'Section C',
    ...classesList.map(c => c.section).filter(Boolean),
    ...children.map(c => c.section_name).filter(Boolean)
  ]));

  const teacherOptions = [
    'Sister Bethlehem Markos',
    'Brother Dawit Alemu',
    'Sister Tigist Alemu',
    'Deacon Solomon Wolde',
    'Sister Martha Bekele',
    'Brother Caleb Markos'
  ];

  // Alert State for Auto-generated credentials
  const [createdCredentialAlert, setCreatedCredentialAlert] = useState(null);
  const [editingChild, setEditingChild] = useState(null);

  // Form 1: Child Registration Form State
  const [childForm, setChildForm] = useState({
    name: '',
    age: 6,
    gender: 'Female',
    medeb_zone: 'Stadium_Zuria',
    medib_number: 'Medib-1',
    guardian_name: '',
    guardian_phone: '',
    class_level: uniqueClassNames[0] || 'Level 1 - Beginners',
    custom_class_level: '',
    section_name: 'Section A',
    custom_section_name: '',
    teacher: 'Sister Bethlehem Markos'
  });

  // Form 2: Custom Age Category Form State
  const [ageCatForm, setAgeCatForm] = useState({
    name: '',
    min_age: 4,
    max_age: 6,
    level_code: 'Level 1',
    description: ''
  });

  // Form 3: Class & Section Form State
  const [classForm, setClassForm] = useState({
    class_name: uniqueClassNames[0] || 'Level 1 - Beginners',
    custom_class_name: '',
    section: 'Section A',
    custom_section: '',
    age_range: '4-6 yrs',
    teacher_name: 'Sister Bethlehem Markos',
    room: 'Children Hall 1'
  });

  // Form 4: Assign Teacher & Class Form State
  const [assignForm, setAssignForm] = useState({
    child_id: '',
    class_id: '',
    custom_class_name: '',
    custom_section_name: '',
    teacher_name: 'Brother Dawit Alemu'
  });

  // Username generator: firstname/4-digit-ID/year
  const generateStudentUsername = (childFullName) => {
    const firstName = (childFullName || 'student').trim().split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    const randomId = Math.floor(1000 + Math.random() * 9000).toString();
    const year = new Date().getFullYear();
    return `${firstName}/${randomId}/${year}`;
  };

  const generate4DigitPIN = () => Math.floor(1000 + Math.random() * 9000).toString();

  // Helper to persist custom class into DB if it doesn't exist yet
  const ensureClassExistsInDB = (currentDb, className, sectionName, teacherName = 'Sister Bethlehem Markos') => {
    if (!className) return;
    if (!currentDb.children_classes) currentDb.children_classes = [...classesList];
    const exists = currentDb.children_classes.some(
      c => c.class_name.toLowerCase() === className.toLowerCase() && c.section.toLowerCase() === (sectionName || 'Section A').toLowerCase()
    );

    if (!exists) {
      const newCls = {
        id: `cls-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        class_name: className,
        section: sectionName || 'Section A',
        age_range: 'Custom Age Range',
        teacher_name: teacherName,
        room: 'Children Hall Main'
      };
      currentDb.children_classes.push(newCls);
    }

    if (!currentDb.children_age_categories) currentDb.children_age_categories = [...ageCategories];
    const catExists = currentDb.children_age_categories.some(a => a.name.toLowerCase() === className.toLowerCase());
    if (!catExists) {
      currentDb.children_age_categories.push({
        id: `ac-${Date.now()}`,
        name: className,
        min_age: 4,
        max_age: 15,
        level_code: className,
        description: 'Custom Created Class Level'
      });
    }
  };

  // Handle Child Registration with support for Custom Class/Section
  const handleAddChild = (e) => {
    e.preventDefault();
    if (!childForm.name) {
      showToast("Child Full Name is required", "error");
      return;
    }

    const currentDb = getMockDB();
    if (!currentDb.children_records) currentDb.children_records = [];
    if (!currentDb.users) currentDb.users = [];

    const finalClassName = childForm.class_level === '__custom__' ? childForm.custom_class_level.trim() : childForm.class_level;
    const finalSection = childForm.section_name === '__custom__' ? childForm.custom_section_name.trim() : childForm.section_name;

    if (!finalClassName || !finalSection) {
      showToast("Please specify the Class Name and Section", "error");
      return;
    }

    // Ensure custom class & section are saved to DB menu options
    ensureClassExistsInDB(currentDb, finalClassName, finalSection, childForm.teacher);

    const usernameId = generateStudentUsername(childForm.name);
    const defaultPin = generate4DigitPIN();

    const newChild = {
      id: `child-${Date.now()}`,
      name: childForm.name,
      child_full_name: childForm.name,
      age: parseInt(childForm.age) || 6,
      gender: childForm.gender,
      class_level: finalClassName,
      section_name: finalSection,
      medeb_zone: childForm.medeb_zone,
      medib_number: childForm.medib_number,
      guardian_name: childForm.guardian_name,
      guardian_phone: childForm.guardian_phone,
      teacher: childForm.teacher,
      username_id: usernameId,
      default_pin: defaultPin,
      created_at: new Date().toISOString()
    };

    const newStudentUser = {
      id: `usr-stu-${Date.now()}`,
      username_id: usernameId,
      full_name: childForm.name,
      role: 'Student',
      leadership_role: 'None',
      default_pin: defaultPin,
      password_pin: defaultPin,
      pin_changed: false,
      status: 'Active',
      class_level: finalClassName,
      section_name: finalSection,
      teacher: childForm.teacher,
      medeb_zone: childForm.medeb_zone
    };

    currentDb.children_records.unshift(newChild);
    currentDb.users.unshift(newStudentUser);
    saveMockDB(currentDb);
    refreshDB();

    setCreatedCredentialAlert({
      name: childForm.name,
      username_id: usernameId,
      default_pin: defaultPin,
      class_level: finalClassName,
      section_name: finalSection,
      teacher: childForm.teacher
    });

    showToast(`Child registered! Class "${finalClassName}" (${finalSection}) created & added to selection menus.`, "success");

    setChildForm({
      name: '',
      age: 6,
      gender: 'Female',
      medeb_zone: 'Stadium_Zuria',
      medib_number: 'Medib-1',
      guardian_name: '',
      guardian_phone: '',
      class_level: uniqueClassNames[0] || 'Level 1 - Beginners',
      custom_class_level: '',
      section_name: 'Section A',
      custom_section_name: '',
      teacher: 'Sister Bethlehem Markos'
    });
  };

  // Handle Custom Age Category Creation
  const handleAddAgeCategory = (e) => {
    e.preventDefault();
    if (!ageCatForm.name) {
      showToast("Category Name is required", "error");
      return;
    }

    const currentDb = getMockDB();
    if (!currentDb.children_age_categories) currentDb.children_age_categories = ageCategories;

    const newCat = {
      id: `ac-${Date.now()}`,
      name: ageCatForm.name.trim(),
      min_age: parseInt(ageCatForm.min_age),
      max_age: parseInt(ageCatForm.max_age),
      level_code: ageCatForm.level_code || `Level ${currentDb.children_age_categories.length + 1}`,
      description: ageCatForm.description || ''
    };

    currentDb.children_age_categories.push(newCat);
    saveMockDB(currentDb);
    refreshDB();
    showToast(`Created Custom Age Group "${ageCatForm.name}"! Available in all class selection menus.`, "success");

    setAgeCatForm({ name: '', min_age: 4, max_age: 6, level_code: 'Level 1', description: '' });
  };

  // Handle Class & Section Creation (Custom or Menu Select)
  const handleAddClass = (e) => {
    e.preventDefault();
    const finalClassName = classForm.class_name === '__custom__' ? classForm.custom_class_name.trim() : classForm.class_name;
    const finalSection = classForm.section === '__custom__' ? classForm.custom_section.trim() : classForm.section;

    if (!finalClassName || !finalSection) {
      showToast("Class Name and Section are required", "error");
      return;
    }

    const currentDb = getMockDB();
    ensureClassExistsInDB(currentDb, finalClassName, finalSection, classForm.teacher_name);
    saveMockDB(currentDb);
    refreshDB();

    showToast(`Created Class "${finalClassName}" (${finalSection})! Added to selection menu.`, "success");

    setClassForm({
      class_name: uniqueClassNames[0] || 'Level 1 - Beginners',
      custom_class_name: '',
      section: 'Section A',
      custom_section: '',
      age_range: '4-6 yrs',
      teacher_name: 'Sister Bethlehem Markos',
      room: 'Children Hall 1'
    });
  };

  // Handle Assign Teacher & Class (Support Existing & Custom Class/Section)
  const handleAssignTeacherAndClass = (e) => {
    e.preventDefault();
    if (!assignForm.child_id) {
      showToast("Please select a child to assign", "error");
      return;
    }

    const currentDb = getMockDB();
    if (!currentDb.children_records) currentDb.children_records = children;
    if (!currentDb.users) currentDb.users = [];

    const targetChildIdx = currentDb.children_records.findIndex(c => c.id === assignForm.child_id);
    if (targetChildIdx === -1) {
      showToast("Selected child not found", "error");
      return;
    }

    let finalClassName = '';
    let finalSection = '';

    if (assignForm.class_id === '__custom__') {
      finalClassName = assignForm.custom_class_name.trim();
      finalSection = assignForm.custom_section_name.trim() || 'Section A';
      if (!finalClassName) {
        showToast("Please enter a custom class name", "error");
        return;
      }
      ensureClassExistsInDB(currentDb, finalClassName, finalSection, assignForm.teacher_name);
    } else {
      const matchedCls = (currentDb.children_classes || classesList).find(c => c.id === assignForm.class_id) || {};
      finalClassName = matchedCls.class_name || 'Level 1 - Beginners';
      finalSection = matchedCls.section || 'Section A';
    }

    const assignedTeacher = assignForm.teacher_name || 'Brother Dawit Alemu';
    const childObj = currentDb.children_records[targetChildIdx];

    let usernameId = childObj.username_id;
    let defaultPin = childObj.default_pin;
    if (!usernameId) {
      usernameId = generateStudentUsername(childObj.name || childObj.child_full_name);
      defaultPin = generate4DigitPIN();
    }

    currentDb.children_records[targetChildIdx] = {
      ...childObj,
      class_level: finalClassName,
      section_name: finalSection,
      teacher: assignedTeacher,
      username_id: usernameId,
      default_pin: defaultPin
    };

    const userIdx = currentDb.users.findIndex(u => u.username_id === usernameId);
    if (userIdx !== -1) {
      currentDb.users[userIdx] = {
        ...currentDb.users[userIdx],
        class_level: finalClassName,
        section_name: finalSection,
        teacher: assignedTeacher
      };
    } else {
      currentDb.users.unshift({
        id: `usr-stu-${Date.now()}`,
        username_id: usernameId,
        full_name: childObj.name || childObj.child_full_name,
        role: 'Student',
        default_pin: defaultPin,
        password_pin: defaultPin,
        pin_changed: false,
        status: 'Active',
        class_level: finalClassName,
        section_name: finalSection,
        teacher: assignedTeacher
      });
    }

    saveMockDB(currentDb);
    refreshDB();

    setCreatedCredentialAlert({
      name: childObj.name || childObj.child_full_name,
      username_id: usernameId,
      default_pin: defaultPin,
      class_level: finalClassName,
      section_name: finalSection,
      teacher: assignedTeacher
    });

    showToast(`Assigned ${childObj.name} to ${finalClassName} (${finalSection}) & Teacher ${assignedTeacher}!`, "success");
    setAssignForm({ child_id: '', class_id: '', custom_class_name: '', custom_section_name: '', teacher_name: 'Brother Dawit Alemu' });
  };

  // Handle Edit Child Record
  const handleUpdateChildRecord = (e) => {
    e.preventDefault();
    if (!editingChild) return;

    const currentDb = getMockDB();
    const idx = currentDb.children_records.findIndex(c => c.id === editingChild.id);
    if (idx !== -1) {
      ensureClassExistsInDB(currentDb, editingChild.class_level, editingChild.section_name, editingChild.teacher);
      currentDb.children_records[idx] = { ...editingChild };
      saveMockDB(currentDb);
      refreshDB();
      showToast(`Updated profile & class assignment for ${editingChild.name}!`, "success");
    }
    setEditingChild(null);
  };

  // Reset Student PIN
  const handleResetStudentPIN = (childObj) => {
    const currentDb = getMockDB();
    const newPin = '1234';
    const idx = currentDb.children_records.findIndex(c => c.id === childObj.id);
    if (idx !== -1) {
      currentDb.children_records[idx].default_pin = newPin;
    }
    const userIdx = (currentDb.users || []).findIndex(u => u.username_id === childObj.username_id);
    if (userIdx !== -1) {
      currentDb.users[userIdx].default_pin = newPin;
      currentDb.users[userIdx].password_pin = newPin;
      currentDb.users[userIdx].pin_changed = false;
    }
    saveMockDB(currentDb);
    refreshDB();
    showToast(`Reset 4-digit PIN password to '1234' for ${childObj.name || childObj.child_full_name}`, "info");
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Counters Header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className="card" style={{ borderLeft: '4px solid var(--primary-blue)' }}>
          <small style={{ color: 'var(--text-muted)' }}>Total Children Registered</small>
          <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-blue)' }}>{children.length}</h3>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #166534' }}>
          <small style={{ color: 'var(--text-muted)' }}>Age Groups & Education Levels</small>
          <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#166534' }}>{ageCategories.length}</h3>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #854d0e' }}>
          <small style={{ color: 'var(--text-muted)' }}>Active Classes & Sections</small>
          <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#854d0e' }}>{classesList.length}</h3>
        </div>
      </div>

      {/* Main Header & Tab Controls */}
      <div className="card no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--primary-blue)' }}>
            Yelijoch Zerf (Children's Ministry) Dashboard
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Create custom classes & sections, manage age groups, assign teachers, and provision student credentials.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={() => setActiveTab('children')} className={`btn ${activeTab === 'children' ? 'btn-primary' : 'btn-secondary'}`}>
            <Users size={16} />
            <span>Children Roster</span>
          </button>

          <button onClick={() => setActiveTab('age_categories')} className={`btn ${activeTab === 'age_categories' ? 'btn-primary' : 'btn-secondary'}`}>
            <Layers size={16} />
            <span>Age Groups & Levels</span>
          </button>

          <button onClick={() => setActiveTab('classes')} className={`btn ${activeTab === 'classes' ? 'btn-primary' : 'btn-secondary'}`}>
            <BookOpen size={16} />
            <span>Create Custom Class & Section</span>
          </button>

          <button onClick={() => setActiveTab('assign_teacher')} className={`btn ${activeTab === 'assign_teacher' ? 'btn-primary' : 'btn-secondary'}`}>
            <UserPlus size={16} />
            <span>Assign Teacher & Class</span>
          </button>
        </div>
      </div>

      {/* CREDENTIAL ALERT MODAL */}
      {createdCredentialAlert && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '1rem'
        }}>
          <div className="card" style={{ maxWidth: '520px', width: '100%', borderTop: '6px solid #166534', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: '#166534' }}>
              <CheckCircle2 size={32} />
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Student Account Provisioned!</h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Class, Section & Teacher Assigned</p>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--primary-light-blue)', padding: '1.25rem', borderRadius: '8px', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Student Name</span>
                <strong style={{ fontSize: '1.125rem' }}>{createdCredentialAlert.name}</strong>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Username ID</span>
                  <code style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary-blue)', backgroundColor: '#fff', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    {createdCredentialAlert.username_id}
                  </code>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Default PIN Password</span>
                  <code style={{ fontSize: '1rem', fontWeight: 800, color: '#166534', backgroundColor: '#fff', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    {createdCredentialAlert.default_pin}
                  </code>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', fontSize: '0.875rem' }}>
                <strong>Class & Section:</strong> {createdCredentialAlert.class_level} ({createdCredentialAlert.section_name})<br />
                <strong>Assigned Teacher:</strong> {createdCredentialAlert.teacher}
              </div>
            </div>

            <button onClick={() => setCreatedCredentialAlert(null)} className="btn btn-primary" style={{ width: '100%' }}>
              <span>Done & Close Notice</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 1: Children Roster & Registration with Custom Class/Section Option */}
      {activeTab === 'children' && (
        <div className="card">
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--primary-blue)' }}>
            Children Directory & Student Login Provisioning
          </h3>

          <form onSubmit={handleAddChild} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem', backgroundColor: 'var(--primary-light-blue)', padding: '1.25rem', borderRadius: '8px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Child Full Name *</label>
              <input type="text" required className="form-control" placeholder="e.g. Samuel Alemu" value={childForm.name} onChange={e => setChildForm({ ...childForm, name: e.target.value })} />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Age</label>
              <input type="number" className="form-control" value={childForm.age} onChange={e => setChildForm({ ...childForm, age: parseInt(e.target.value) })} />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Gender</label>
              <select className="form-control" value={childForm.gender} onChange={e => setChildForm({ ...childForm, gender: e.target.value })}>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </div>

            {/* Class Level Select or Custom Input */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Assign Class Level</label>
              <select
                className="form-control"
                value={childForm.class_level}
                onChange={e => setChildForm({ ...childForm, class_level: e.target.value })}
              >
                {uniqueClassNames.map((name, idx) => (
                  <option key={idx} value={name}>{name}</option>
                ))}
                <option value="__custom__">+ Create New Custom Class...</option>
              </select>

              {childForm.class_level === '__custom__' && (
                <input
                  type="text"
                  required
                  style={{ marginTop: '0.5rem' }}
                  className="form-control"
                  placeholder="Enter custom class name..."
                  value={childForm.custom_class_level}
                  onChange={e => setChildForm({ ...childForm, custom_class_level: e.target.value })}
                />
              )}
            </div>

            {/* Section Name Select or Custom Input */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Assign Section</label>
              <select
                className="form-control"
                value={childForm.section_name}
                onChange={e => setChildForm({ ...childForm, section_name: e.target.value })}
              >
                {uniqueSections.map((sec, idx) => (
                  <option key={idx} value={sec}>{sec}</option>
                ))}
                <option value="__custom__">+ Create New Custom Section...</option>
              </select>

              {childForm.section_name === '__custom__' && (
                <input
                  type="text"
                  required
                  style={{ marginTop: '0.5rem' }}
                  className="form-control"
                  placeholder="Enter custom section name..."
                  value={childForm.custom_section_name}
                  onChange={e => setChildForm({ ...childForm, custom_section_name: e.target.value })}
                />
              )}
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Assigned Teacher</label>
              <select className="form-control" value={childForm.teacher} onChange={e => setChildForm({ ...childForm, teacher: e.target.value })}>
                {teacherOptions.map((t, idx) => (
                  <option key={idx} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', gridColumn: '1 / -1' }}>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                <UserPlus size={16} />
                <span>Register & Generate Student Credentials</span>
              </button>
            </div>
          </form>

          {/* Children Table */}
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Child Name</th>
                  <th>Age & Gender</th>
                  <th>Class & Section</th>
                  <th>Assigned Teacher</th>
                  <th>Student Username ID</th>
                  <th>Default PIN</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {children.map(c => (
                  <tr key={c.id}>
                    <td><strong>{c.name || c.child_full_name}</strong></td>
                    <td>{c.age} yrs ({c.gender})</td>
                    <td>
                      <span className="badge badge-success">{c.class_level || 'Level 1'}</span>{' '}
                      <span className="badge badge-warning">{c.section_name || 'Section A'}</span>
                    </td>
                    <td>{c.teacher || 'Brother Dawit Alemu'}</td>
                    <td>
                      <code style={{ fontWeight: 700, color: 'var(--primary-blue)' }}>
                        {c.username_id || generateStudentUsername(c.name || c.child_full_name)}
                      </code>
                    </td>
                    <td>
                      <code style={{ backgroundColor: 'var(--primary-light-blue)', padding: '0.2rem 0.5rem', borderRadius: '4px', color: '#166534', fontWeight: 800 }}>
                        {c.default_pin || '1234'}
                      </code>
                    </td>
                    <td style={{ display: 'flex', gap: '0.35rem' }}>
                      <button onClick={() => setEditingChild(c)} className="btn btn-secondary btn-sm" title="Edit Child Assignment">
                        <Edit3 size={14} />
                      </button>
                      <button onClick={() => handleResetStudentPIN(c)} className="btn btn-secondary btn-sm" title="Reset 4-Digit PIN to 1234">
                        <KeyRound size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Custom Age Categories & Education Levels */}
      {activeTab === 'age_categories' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ maxWidth: '650px', margin: '0 auto', width: '100%' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--primary-blue)' }}>
              Create Custom Age Group & Education Level
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              Group children into customized age ranges and progressive Sunday school education levels.
            </p>

            <form onSubmit={handleAddAgeCategory}>
              <div className="form-group">
                <label className="form-label">Category / Level Title *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. Beginners Level 1, Intermediate Level 3, Kingdom Kids..."
                  value={ageCatForm.name}
                  onChange={e => setAgeCatForm({ ...ageCatForm, name: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Min Age *</label>
                  <input
                    type="number"
                    required
                    className="form-control"
                    value={ageCatForm.min_age}
                    onChange={e => setAgeCatForm({ ...ageCatForm, min_age: parseInt(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Max Age *</label>
                  <input
                    type="number"
                    required
                    className="form-control"
                    value={ageCatForm.max_age}
                    onChange={e => setAgeCatForm({ ...ageCatForm, max_age: parseInt(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Level Code</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Level 1"
                    value={ageCatForm.level_code}
                    onChange={e => setAgeCatForm({ ...ageCatForm, level_code: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description / Curriculum Focus</label>
                <textarea
                  rows={2}
                  className="form-control"
                  placeholder="Describe key Bible study & activity focus for this age group..."
                  value={ageCatForm.description}
                  onChange={e => setAgeCatForm({ ...ageCatForm, description: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                <Layers size={16} />
                <span>Save Age Category & Level to Selection Menu</span>
              </button>
            </form>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--primary-blue)' }}>
              Active Age Group & Level Roster
            </h3>

            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Level Code</th>
                    <th>Category Title</th>
                    <th>Age Range</th>
                    <th>Matching Children Count</th>
                    <th>Curriculum Focus</th>
                  </tr>
                </thead>
                <tbody>
                  {ageCategories.map(ac => {
                    const matchCount = children.filter(c => c.age >= ac.min_age && c.age <= ac.max_age).length;
                    return (
                      <tr key={ac.id}>
                        <td><span className="badge badge-success">{ac.level_code || 'Level'}</span></td>
                        <td><strong>{ac.name}</strong></td>
                        <td>{ac.min_age} - {ac.max_age} years</td>
                        <td>
                          <span className="badge badge-warning">{matchCount} Children</span>
                        </td>
                        <td>{ac.description || 'Standard Sunday school Bible curriculum'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Create Custom Class & Section */}
      {activeTab === 'classes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ maxWidth: '650px', margin: '0 auto', width: '100%' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--primary-blue)' }}>
              Create Custom Class & Section
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              Select an existing class or type a new custom class name and section. Created classes will immediately appear in all dropdown selection menus!
            </p>

            <form onSubmit={handleAddClass}>
              {/* Class Name Option */}
              <div className="form-group">
                <label className="form-label">Class Name *</label>
                <select
                  className="form-control"
                  value={classForm.class_name}
                  onChange={e => setClassForm({ ...classForm, class_name: e.target.value })}
                >
                  {uniqueClassNames.map((name, idx) => (
                    <option key={idx} value={name}>{name}</option>
                  ))}
                  <option value="__custom__">+ Create New Custom Class Name...</option>
                </select>

                {classForm.class_name === '__custom__' && (
                  <input
                    type="text"
                    required
                    style={{ marginTop: '0.5rem' }}
                    className="form-control"
                    placeholder="Enter custom class name (e.g. Kingdom Kids Level 1)..."
                    value={classForm.custom_class_name}
                    onChange={e => setClassForm({ ...classForm, custom_class_name: e.target.value })}
                  />
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {/* Section Option */}
                <div className="form-group">
                  <label className="form-label">Section Name *</label>
                  <select
                    className="form-control"
                    value={classForm.section}
                    onChange={e => setClassForm({ ...classForm, section: e.target.value })}
                  >
                    {uniqueSections.map((sec, idx) => (
                      <option key={idx} value={sec}>{sec}</option>
                    ))}
                    <option value="__custom__">+ Create Custom Section...</option>
                  </select>

                  {classForm.section === '__custom__' && (
                    <input
                      type="text"
                      required
                      style={{ marginTop: '0.5rem' }}
                      className="form-control"
                      placeholder="e.g. Section D, Green Room..."
                      value={classForm.custom_section}
                      onChange={e => setClassForm({ ...classForm, custom_section: e.target.value })}
                    />
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Classroom / Venue</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Hall 1, Hall 2"
                    value={classForm.room}
                    onChange={e => setClassForm({ ...classForm, room: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Assigned Lead Teacher *</label>
                <select
                  className="form-control"
                  value={classForm.teacher_name}
                  onChange={e => setClassForm({ ...classForm, teacher_name: e.target.value })}
                >
                  {teacherOptions.map((t, idx) => (
                    <option key={idx} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                <Plus size={16} />
                <span>Create & Publish Class to Selection Menu</span>
              </button>
            </form>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--primary-blue)' }}>
              Classes & Section Roster Overview
            </h3>

            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Class Name</th>
                    <th>Section</th>
                    <th>Target Age Range</th>
                    <th>Assigned Teacher</th>
                    <th>Venue / Room</th>
                    <th>Enrolled Students</th>
                  </tr>
                </thead>
                <tbody>
                  {classesList.map(cls => {
                    const enrolledCount = children.filter(c => (c.class_level || '').toLowerCase().includes(cls.class_name.toLowerCase())).length;
                    return (
                      <tr key={cls.id}>
                        <td><strong>{cls.class_name}</strong></td>
                        <td><span className="badge badge-warning">{cls.section}</span></td>
                        <td>{cls.age_range}</td>
                        <td>{cls.teacher_name}</td>
                        <td>{cls.room}</td>
                        <td><span className="badge badge-success">{enrolledCount} Children</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ASSIGN TEACHER & CLASS FORM WITH CUSTOM CLASS CREATION */}
      {activeTab === 'assign_teacher' && (
        <div className="card" style={{ maxWidth: '650px', margin: '0 auto', width: '100%' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem', color: 'var(--primary-blue)' }}>
            Assign Child to Class, Section & Teacher
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Select a child from the directory, select from existing classes or create a new custom class & section on the fly.
          </p>

          <form onSubmit={handleAssignTeacherAndClass}>
            <div className="form-group">
              <label className="form-label">Select Child / Student *</label>
              <select
                required
                className="form-control"
                value={assignForm.child_id}
                onChange={e => setAssignForm({ ...assignForm, child_id: e.target.value })}
              >
                <option value="">-- Select Child from Directory --</option>
                {children.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name || c.child_full_name} ({c.age} yrs - Current Class: {c.class_level || 'None'})
                  </option>
                ))}
              </select>
            </div>

            {/* Target Class Select or Custom Option */}
            <div className="form-group">
              <label className="form-label">Select Target Class & Section *</label>
              <select
                className="form-control"
                value={assignForm.class_id}
                onChange={e => setAssignForm({ ...assignForm, class_id: e.target.value })}
              >
                <option value="">-- Select Class & Section --</option>
                {classesList.map(cls => (
                  <option key={cls.id} value={cls.id}>
                    {cls.class_name} ({cls.section}) - Teacher: {cls.teacher_name}
                  </option>
                ))}
                <option value="__custom__">+ Create & Assign New Custom Class & Section...</option>
              </select>

              {assignForm.class_id === '__custom__' && (
                <div style={{ marginTop: '0.75rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', backgroundColor: 'var(--primary-light-blue)', padding: '1rem', borderRadius: '6px' }}>
                  <div>
                    <label className="form-label">Custom Class Name *</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      placeholder="e.g. Disciples Class Level 4"
                      value={assignForm.custom_class_name}
                      onChange={e => setAssignForm({ ...assignForm, custom_class_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label">Custom Section Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Section D"
                      value={assignForm.custom_section_name}
                      onChange={e => setAssignForm({ ...assignForm, custom_section_name: e.target.value })}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Assigned Teacher *</label>
              <select
                className="form-control"
                value={assignForm.teacher_name}
                onChange={e => setAssignForm({ ...assignForm, teacher_name: e.target.value })}
              >
                {teacherOptions.map((t, idx) => (
                  <option key={idx} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              <UserCheck size={16} />
              <span>Assign Class & Teacher & Provision Credentials</span>
            </button>
          </form>
        </div>
      )}

      {/* EDIT CHILD MODAL WITH CUSTOM CLASS SUPPORT */}
      {editingChild && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '1rem'
        }}>
          <div className="card" style={{ maxWidth: '550px', width: '100%' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--primary-blue)' }}>
              Edit Child & Class Assignment
            </h3>

            <form onSubmit={handleUpdateChildRecord}>
              <div className="form-group">
                <label className="form-label">Child Name</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={editingChild.name || editingChild.child_full_name}
                  onChange={e => setEditingChild({ ...editingChild, name: e.target.value, child_full_name: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Class Level</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Level 2 - Primary"
                    value={editingChild.class_level || ''}
                    onChange={e => setEditingChild({ ...editingChild, class_level: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Section Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Section A"
                    value={editingChild.section_name || ''}
                    onChange={e => setEditingChild({ ...editingChild, section_name: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Assigned Teacher</label>
                <select
                  className="form-control"
                  value={editingChild.teacher}
                  onChange={e => setEditingChild({ ...editingChild, teacher: e.target.value })}
                >
                  {teacherOptions.map((t, idx) => (
                    <option key={idx} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setEditingChild(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
