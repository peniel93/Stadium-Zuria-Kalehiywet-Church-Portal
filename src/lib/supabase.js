import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://skhc-placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// LocalStorage Mock Layer for Full Standalone Offline Evaluation
const STORAGE_KEY = 'SKHC_PORTAL_DATABASE_V1';

const initialMockDB = {
  site_settings: {
    site_title: 'SKHC PORTAL',
    logo_url: '',
    hero_background_url: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1600&auto=format&fit=crop&q=80',
    about_description: 'Stadium Zuria Kalehiywet Church is dedicated to worship, discipleship, community service, and spreading the Gospel across our city and internationally.',
    copyright_description: '© 2026 Stadium Zuria Kalehiywet Church. All rights reserved.'
  },
  users: [
    {
      id: 'usr-1',
      username_id: 'SKHC/MainRegistrar/0001/2026',
      full_name: 'Main Registrar Admin',
      email: 'registrar@skhc.org',
      phone_number: '+251911000001',
      role: 'MainRegistrar',
      leadership_role: 'Sebsabi',
      default_pin: '1234',
      pin_changed: true,
      status: 'Active',
      created_at: '2026-01-10T08:00:00Z'
    },
    {
      id: 'usr-2',
      username_id: 'SKHC/Pastor/0002/2026',
      full_name: 'Senior Church Pastor',
      email: 'pastor@skhc.org',
      phone_number: '+251911000002',
      role: 'Pastor',
      leadership_role: 'Sebsabi',
      default_pin: '1234',
      pin_changed: true,
      status: 'Active',
      created_at: '2026-01-12T09:00:00Z'
    },
    {
      id: 'usr-3',
      username_id: 'SKHC/FCL/0003/2026',
      full_name: 'Fathers Church Leader',
      email: 'fcl@skhc.org',
      phone_number: '+251911000003',
      role: 'FCL',
      leadership_role: 'Hisab_Shum',
      default_pin: '1234',
      pin_changed: false,
      status: 'Active',
      created_at: '2026-01-15T10:00:00Z'
    },
    {
      id: 'usr-4',
      username_id: 'SKHC/Evang/0004/2026',
      full_name: 'Lead Evangelist',
      email: 'evang@skhc.org',
      phone_number: '+251911000004',
      role: 'Evang',
      leadership_role: 'Member',
      default_pin: '1234',
      pin_changed: false,
      status: 'Active',
      created_at: '2026-01-16T11:00:00Z'
    },
    {
      id: 'usr-5',
      username_id: 'SKHC/CSM/0005/2026',
      full_name: 'Church Store Manager',
      email: 'store@skhc.org',
      phone_number: '+251911000005',
      role: 'CSM',
      leadership_role: 'Coordinator',
      default_pin: '1234',
      pin_changed: true,
      status: 'Active',
      created_at: '2026-01-18T12:00:00Z'
    },
    {
      id: 'usr-6',
      username_id: 'SKHC/Accountant/0006/2026',
      full_name: 'Head Accountant',
      email: 'accountant@skhc.org',
      phone_number: '+251911000006',
      role: 'Accountant',
      leadership_role: 'Genzeb_Yazh',
      default_pin: '1234',
      pin_changed: true,
      status: 'Active',
      created_at: '2026-01-20T14:00:00Z'
    }
  ],
  site_settings: {
    site_title: 'Stadium Zuria Kalehiywet Church Portal',
    logo_url: 'https://images.unsplash.com/photo-1548625361-1867c29375e8?w=150&auto=format&fit=crop&q=80',
    hero_background_url: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1600&auto=format&fit=crop&q=80',
    about_description: 'Stadium Zuria Kalehiywet Church is dedicated to worship, discipleship, community service, and spreading the Gospel across our city and internationally.',
    copyright_year: 2026,
    copyright_description: 'Stadium Zuria Kalehiywet Church. All rights reserved.',
    contact_email: 'info@skhc.org',
    contact_phone: '+251 11 551 2345 / +251 911 000 001',
    contact_address: 'Stadium Zuria, Kirkos Sub-City, Woreda 02, Addis Ababa, Ethiopia',
    office_hours: 'Mon - Sat: 8:30 AM - 5:30 PM | Sun: 8:00 AM - 1:00 PM',
    google_map_embed_url: 'https://maps.google.com/maps?q=Stadium+Zuria+Kalehiywet+Church+Addis+Ababa&t=&z=15&ie=UTF8&iwloc=&output=embed',
    // 8 Bank Accounts Default Mock Data (Name, Account Number & Purpose)
    bank_1_name: 'Commercial Bank of Ethiopia (CBE)',
    bank_1_account: '1000123456789',
    bank_1_purpose: 'Tithes & General Offerings / ለአስራት እና አጠቃላይ መባ',
    bank_2_name: 'Dashen Bank',
    bank_2_account: '5289123456001',
    bank_2_purpose: 'Church Building & Expansion Fund / ለሕንፃ ግንባታ',
    bank_3_name: 'Awash Bank',
    bank_3_account: '01320987654300',
    bank_3_purpose: 'Evangelism & Missions Ministry / ለወንጌል እና ሚሽን',
    bank_4_name: 'Bank of Abyssinia',
    bank_4_account: '8923104561',
    bank_4_purpose: 'Charity, Mercy & Support Fund / ለምህረት እና በጎ አድራጎት',
    bank_5_name: 'CBE Birr',
    bank_5_account: '0911000001',
    bank_5_purpose: 'Quick Mobile Tithes & Offerings / ሞባይል ባንኪንግ መባ',
    bank_6_name: 'Telebirr',
    bank_6_account: '0911000001',
    bank_6_purpose: 'Telebirr Merchant Payment / ቴሌብር ክፍያ',
    bank_7_name: 'Hibret Bank',
    bank_7_account: '182390124567',
    bank_7_purpose: 'Children & Sunday School Department / የሕፃናት ዘርፍ',
    bank_8_name: 'Nib International Bank',
    bank_8_account: '70000123456',
    bank_8_purpose: 'Choir & Worship Ministry Fund / የመዘምራን ዘርፍ',
    // Social Media Links Default Mock Data
    facebook_url: 'https://facebook.com',
    youtube_url: 'https://youtube.com',
    instagram_url: 'https://instagram.com',
    whatsapp_url: 'https://whatsapp.com',
    tiktok_url: 'https://tiktok.com',
    twitter_url: 'https://twitter.com',
    telegram_url: 'https://t.me',
    // 10 Weekly Church Programs Default Mock Data
    weekly_program_1: 'Sunday Main Gospel & Worship Service | 8:30 AM - 12:00 PM',
    weekly_program_2: 'Sunday Afternoon Youth & Sub-Choir Fellowship | 2:00 PM - 5:00 PM',
    weekly_program_3: 'Tuesday Mothers & Sisters Prayer Fellowship | 4:30 PM - 6:30 PM',
    weekly_program_4: 'Wednesday Mid-Week Bible Study & Fasting Prayer | 5:00 PM - 7:00 PM',
    weekly_program_5: 'Thursday Medeb Sefer Neighborhood Prayer Groups | 5:30 PM - 7:00 PM',
    weekly_program_6: 'Friday Night Spiritual Warfare & Deliverance Chapel | 6:00 PM - 8:30 PM',
    weekly_program_7: 'Saturday Children Education & Teacher Training | 9:00 AM - 12:00 PM',
    weekly_program_8: 'Saturday Main Choir & Music Rehearsal | 3:00 PM - 6:00 PM',
    weekly_program_9: '',
    weekly_program_10: ''
  },
  daily_bible_verses: [
    {
      id: 'v-1',
      verse_text: 'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.',
      scripture_reference: 'Jeremiah 29:11',
      date_posted: '2026-07-27',
      is_active: true
    }
  ],
  vacancies: [
    {
      id: 'vac-1',
      title: 'Youth Ministry Coordinator & Teacher',
      job_type: 'Full-Time',
      description: 'We are seeking an energetic Youth Coordinator to oversee youth activities, discipleship programs, and weekly services.',
      place_of_application: 'Stadium Zuria SKHC Main Office Room 102',
      application_start_date: '2026-07-20',
      expiry_date: '2026-08-30',
      online_apply_link: '#apply',
      is_active: true
    },
    {
      id: 'vac-2',
      title: 'Senior Sound & Media Technician (ICT Zerf)',
      job_type: 'Contract',
      description: 'Responsible for sound system operation, live streaming, equipment maintenance, and recording Sunday services.',
      place_of_application: 'Stadium Zuria SKHC Media Department',
      application_start_date: '2026-07-22',
      expiry_date: '2026-09-05',
      online_apply_link: '#apply',
      is_active: true
    }
  ],
  job_applications: [],
  exam_announcements: [
    {
      id: 'exam-1',
      vacancy_id: 'vac-1',
      notice_type: 'Written_Exam',
      title: 'Call for Written Examination - Youth Ministry Coordinator',
      written_exam_date: '2026-09-02T09:00',
      written_exam_venue: 'SKHC Main Fellowship Hall',
      interview_date: '',
      interview_venue: '',
      instructions: 'Please bring original Fayda ID card, Bible Degree certificate, and exam invitation ticket.'
    },
    {
      id: 'exam-2',
      vacancy_id: 'vac-1',
      notice_type: 'Interview',
      title: 'Call for Oral Interview - Youth Ministry Coordinator',
      written_exam_date: '',
      written_exam_venue: '',
      interview_date: '2026-09-04T14:00',
      interview_venue: 'Pastoral Conference Room 3',
      instructions: 'Shortlisted candidates who passed written exam: please arrive 15 minutes before scheduled slot.'
    }
  ],
  exam_results: [
    {
      id: 'res-1',
      vacancy_id: 'vac-1',
      applicant_phone: '+251911223344',
      applicant_email: 'applicant@example.com',
      applicant_name: 'Solomon Bekele',
      written_exam_score: 88.5,
      interview_score: 92.0,
      total_score: 90.25,
      status: 'Passed',
      remarks: 'Selected for the Youth Coordinator role.'
    }
  ],
  church_members: [
    {
      id: 'mb-1',
      username_id: 'SKHC/Member/0007/2026',
      default_pin: '4892',
      password_pin: '4892',
      full_name: 'Abebe Kebede',
      email: 'abebe@example.com',
      phone_number: '+251911112233',
      gender: 'Male',
      age: 42,
      medeb_zone: 'Stadium_Zuria',
      medib_number: 'Medib-1',
      region: 'Addis Ababa',
      zone: 'Kirkos',
      kebele: '02',
      family_size: 4,
      number_of_sons: 2,
      number_of_daughters: 0,
      wife_name: 'Tigist Alemu',
      sons_names: 'Dawit Abebe, Michael Abebe',
      daughters_names: '',
      occupation: 'Government Employee',
      is_active: true,
      created_at: '2026-02-01'
    }
  ],
  store_assets: [
    {
      id: 'ast-1',
      name: 'Plastic Chairs - White',
      item_name: 'Plastic Chairs - White',
      category: 'Plastic Chairs',
      color: 'White',
      item_color: 'White',
      total: 350,
      total_quantity: 350,
      normal: 340,
      normal_quantity: 340,
      defective: 10,
      defective_quantity: 10,
      location: 'Main Hall Store A',
      storage_location: 'Main Hall Store A',
      notes: '10 chairs require leg repair'
    },
    {
      id: 'ast-2',
      name: 'Yamaha Keyboard Synthesizer',
      item_name: 'Yamaha Keyboard Synthesizer',
      category: 'Keyboards',
      color: 'Black',
      item_color: 'Black',
      total: 2,
      total_quantity: 2,
      normal: 2,
      normal_quantity: 2,
      defective: 0,
      defective_quantity: 0,
      location: 'Worship Team Media Booth',
      storage_location: 'Worship Team Media Booth',
      notes: 'Used in main service'
    }
  ],
  financial_records: [
    {
      id: 'fin-1',
      type: 'Income',
      record_type: 'Income',
      amount: 45000.00,
      category: 'Night Chapel Collection',
      date: '2026-07-25 20:00',
      transaction_date_time: '2026-07-25 20:00',
      reason: 'Friday Night Chapel Tithes',
      reason_description: 'Friday Night Prayer Chapel Tithes & Free Will Offerings',
      spent_by: 'Genzeb Yazh Committee',
      spent_by_or_received_from: 'Genzeb Yazh Committee',
      receipt_document_url: ''
    },
    {
      id: 'fin-2',
      type: 'Expense',
      record_type: 'Expense',
      amount: 8500.00,
      category: 'Utilities',
      date: '2026-07-26 11:30',
      transaction_date_time: '2026-07-26 11:30',
      reason: 'Monthly Electricity Settlement',
      reason_description: 'Monthly Electricity & Water Utility Settlement',
      spent_by: 'Astedader Office',
      spent_by_or_received_from: 'Astedader Office',
      receipt_document_url: ''
    }
  ],
  children_age_categories: [
    { id: 'ac-1', name: 'Beginners Level 1', min_age: 4, max_age: 6, level_code: 'Level 1', description: 'Early childhood Bible stories, coloring & prayer basics' },
    { id: 'ac-2', name: 'Primary Level 2', min_age: 7, max_age: 9, level_code: 'Level 2', description: 'Elementary scripture memorization & Christian character' },
    { id: 'ac-3', name: 'Junior Level 3', min_age: 10, max_age: 12, level_code: 'Level 3', description: 'Intermediate Bible doctrine & fellowship leadership' },
    { id: 'ac-4', name: 'Teens Level 4', min_age: 13, max_age: 15, level_code: 'Level 4', description: 'Youth discipleship, ministry service & Bible study' }
  ],
  children_classes: [
    { id: 'cls-1', class_name: 'Level 1 - Beginners', section: 'Section A', age_category_id: 'ac-1', age_range: '4-6 yrs', teacher_name: 'Sister Bethlehem Markos', room: 'Children Hall 1' },
    { id: 'cls-2', class_name: 'Level 2 - Primary', section: 'Section A', age_category_id: 'ac-2', age_range: '7-9 yrs', teacher_name: 'Brother Dawit Alemu', room: 'Children Hall 2' },
    { id: 'cls-3', class_name: 'Level 2 - Primary', section: 'Section B', age_category_id: 'ac-2', age_range: '7-9 yrs', teacher_name: 'Sister Tigist Alemu', room: 'Children Hall 3' },
    { id: 'cls-4', class_name: 'Level 3 - Junior', section: 'Section A', age_category_id: 'ac-3', age_range: '10-12 yrs', teacher_name: 'Deacon Solomon Wolde', room: 'Upper Room 1' }
  ],
  children_records: [
    {
      id: 'child-1',
      child_full_name: 'Hannah Solomon',
      name: 'Hannah Solomon',
      age: 8,
      gender: 'Female',
      medeb_zone: 'Stadium_Zuria',
      medib_number: 'Medib-1',
      class_level: 'Level 2 - Primary',
      section_name: 'Section A',
      guardian_name: 'Solomon Bekele',
      guardian_phone: '+251911223344',
      teacher: 'Brother Dawit Alemu',
      username_id: 'hannah/4829/2026',
      default_pin: '4892'
    },
    {
      id: 'child-2',
      child_full_name: 'Daniel Yonas',
      name: 'Daniel Yonas',
      age: 9,
      gender: 'Male',
      medeb_zone: 'Kutir_1',
      medib_number: 'Medib-2',
      class_level: 'Level 2 - Primary',
      section_name: 'Section A',
      guardian_name: 'Yonas Tadesse',
      guardian_phone: '+251911556677',
      teacher: 'Brother Dawit Alemu',
      username_id: 'daniel/7382/2026',
      default_pin: '1234'
    }
  ],
  children_grades: [
    {
      id: 'grd-1',
      child_id: 'child-1',
      subject_name: 'Bible Stories & Scripture Memory',
      test_score: 45.0,
      exam_score: 48.0,
      academic_term: 'Term 1 2026'
    }
  ],
  grade_assessment_schemes: [
    { id: 'sc-1', category_name: 'Midterm Test', max_score: 30 },
    { id: 'sc-2', category_name: 'Final Exam', max_score: 50 },
    { id: 'sc-3', category_name: 'Bible Memory Verses & Homework', max_score: 20 }
  ],
  submitted_student_grades: [
    { id: '1', student_id: 'SKHC-STU-001', username_id: 'hannah/4829/2026', name: 'Hannah Solomon', age: 8, class: 'Level 2 - Primary', section: 'Section A', teacher: 'Brother Dawit Alemu', midterm: 28, final_exam: 46, bible_recitation: 19, total: 93, avg: 93, rank: 1, promotion_status: 'Promoted to Level 3', status: 'Approved' },
    { id: '2', student_id: 'SKHC-STU-002', username_id: 'daniel/7382/2026', name: 'Daniel Yonas', age: 9, class: 'Level 2 - Primary', section: 'Section A', teacher: 'Brother Dawit Alemu', midterm: 25, final_exam: 42, bible_recitation: 18, total: 85, avg: 85, rank: 2, promotion_status: 'Promoted to Level 3', status: 'Approved' }
  ],
  guardian_shifts: [
    {
      id: 'shf-1',
      guardian_id: 'usr-1',
      guardian_name: 'Deacon Berhanu Tadesse',
      name: 'Deacon Berhanu Tadesse',
      phone: '+251911889900',
      days: 'Monday, Wednesday, Friday',
      shift_days: 'Monday, Wednesday, Friday',
      hours: '07:00 AM - 03:00 PM',
      shift_hours: '07:00 AM - 03:00 PM',
      location: 'Gate 1 Gatekeeper Duty',
      notes: 'Gate 1 Gatekeeper Duty'
    }
  ],
  baptism_records: [
    { id: 'b-1', name: 'Michael Tesfaye', full_name: 'Michael Tesfaye', age: 24, gender: 'Male', phone: '+251911443322', phone_number: '+251911443322', zone: 'Stadium_Zuria', medeb_zone: 'Stadium_Zuria', year: 2026, date: '2026-07-20', cert: 'SKHC-BAP-2026-001', certificate_number: 'SKHC-BAP-2026-001' }
  ],
  sub_choirs: [
    { id: 'c-1', name: 'Eftah Choir', leader: 'Deacon Yohannes Alemu', members_count: 45, service_schedule: 'Sunday Morning Main Service' },
    { id: 'c-2', name: 'Johanan Choir', leader: 'Sister Martha Bekele', members_count: 38, service_schedule: 'Sunday Evening Service' },
    { id: 'c-3', name: 'Elroe Choir', leader: 'Brother Caleb Markos', members_count: 32, service_schedule: 'Friday Night Chapel' },
    { id: 'c-4', name: 'Temer Choir', leader: 'Sister Rachel Daniel', members_count: 28, service_schedule: 'Youth Fellowship Service' }
  ],
  choir_members: [
    { id: 'm-1', name: 'Brother Samuel Tesfaye', full_name: 'Brother Samuel Tesfaye', choir: 'Eftah Choir', choir_name: 'Eftah Choir', voice: 'Tenor', vocal_part: 'Tenor', phone: '+251911443322', phone_number: '+251911443322' }
  ],
  choir_announcements: [
    { id: 'a-1', title: 'Choir Vocal Training Workshop', date: '2026-08-01', choir: 'All Choirs', content: 'Vocal warm-up and multi-part harmony training session.' }
  ],
  counselling_materials: [
    { id: '1', title: 'Pre-Marital Counselling & Covenant Guide', format: 'PDF', date: '2026-07-20' },
    { id: '2', title: 'Family & Marriage Conflict Resolution', format: 'Word', date: '2026-07-22' }
  ],
  teaching_materials: [
    { id: '1', title: 'New Believers Foundation Course 2026', target: 'Menfesawi Zerf & Youth', format: 'PDF', status: 'Approved' },
    { id: '2', title: 'Sunday School Teacher Training Manual', target: 'Lijoch Zerf', format: 'Word', status: 'Pending Approval' }
  ],
  evangelism_reports: [
    { id: '1', person_name: 'Solomon Kebede', name: 'Solomon Kebede', gender: 'Male', phone: '+251911887766', outcome: 'Believed & Received Jesus', date: '2026-07-25' }
  ],
  missionary_plans_and_requests: [
    { id: 'm-1', location: 'Southern Region Mission Field', funding_status: 'Pending', requested_funding_amount: 75000.00 }
  ],
  fundraising_projects: [
    { id: '1', title: 'Stadium Building Expansion Fund 2026', target: 5000000, target_amount: 5000000, raised: 3200000, raised_amount: 3200000, status: 'Active' },
    { id: '2', title: 'Evangelism Vehicle Purchase Drive', target: 1200000, target_amount: 1200000, raised: 850000, raised_amount: 850000, status: 'Active' }
  ],
  worship_team_members: [
    { id: '1', name: 'Brother Dawit Alemu', role: 'Lead Vocalist / Guitarist', phone: '+251911443322' }
  ],
  ladies_zerf_members: [
    { id: '1', name: 'Sister Tigist Alemu', phone: '+251911223344', medeb_zone: 'Stadium_Zuria', role: 'Ladies Program Coordinator' }
  ],
  health_professionals_registry: [
    { id: '1', name: 'Dr. Yosef Alemu', profession: 'Medical Doctor', phone: '+251911221100', specialty: 'General Practice' },
    { id: '2', name: 'Engineer Solomon Desta', profession: 'Civil Engineer', phone: '+251911334455', specialty: 'Structural Design' }
  ],
  technology_issues: [
    { id: '1', issue_title: 'Sound Mixer Board Channel 4 Noise', status: 'Open', urgency: 'High', description: 'Intermittent noise on main sanctuary mixer board channel 4.' }
  ],
  sermon_schedules: [
    { id: '1', date: '2026-08-02', sermon_date: '2026-08-02', preacher: 'Pastor Bekele Solomon', preacher_name: 'Pastor Bekele Solomon', title: 'Unshakable Faith in Times of Renewal', sermon_title: 'Unshakable Faith in Times of Renewal', text: 'Hebrews 11:1-6', biblical_text: 'Hebrews 11:1-6' }
  ],
  choir_rosters: [
    { id: '1', choir: 'Eftah Choir', choir_name: 'Eftah Choir', date: '2026-08-02', service_date: '2026-08-02', session: 'Morning Main Service', session_time: 'Morning Main Service', songs: '1. Glorious Praise, 2. Grace Supreme', songs_list: '1. Glorious Praise, 2. Grace Supreme' }
  ],
  medeb_attendance_reports: [],
  medeb_course_requests: [],
  contact_messages: [],
  member_testimonies_and_prayers: [],
  reports_inbox: [],
  leadership_reports_inbox: [],
  portal_announcements: [],
  audit_logs: []
};

export const getMockDB = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  let dbObj = initialMockDB;
  if (data) {
    try {
      dbObj = JSON.parse(data);
    } catch (err) {
      dbObj = initialMockDB;
    }
  }

  // Ensure all entities are initialized safely
  let updated = false;
  Object.keys(initialMockDB).forEach(key => {
    if (dbObj[key] === undefined || dbObj[key] === null) {
      dbObj[key] = initialMockDB[key];
      updated = true;
    }
  });

  if (!data || updated) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dbObj));
  }

  return dbObj;
};

export const saveMockDB = (db) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
};

// Database Persistence Layer for Portal Site Settings & Logo Across All Devices
export const fetchSiteSettingsFromSupabase = async () => {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.warn('Supabase site_settings fetch error:', error);
    }

    if (data) {
      const currentDb = getMockDB();
      currentDb.site_settings = {
        ...initialMockDB.site_settings,
        ...currentDb.site_settings,
        ...data
      };
      saveMockDB(currentDb);
      return currentDb.site_settings;
    } else {
      // Seed row id=1 if not yet created in remote database
      const initialSettings = getMockDB().site_settings || initialMockDB.site_settings;
      await supabase
        .from('site_settings')
        .upsert({ id: 1, ...initialSettings, updated_at: new Date().toISOString() });
      return initialSettings;
    }
  } catch (err) {
    console.warn('Network/Supabase error fetching site settings:', err);
    return getMockDB().site_settings;
  }
};

export const saveSiteSettingsToSupabase = async (newSettings) => {
  const currentDb = getMockDB();
  const mergedSettings = {
    ...currentDb.site_settings,
    ...newSettings
  };

  currentDb.site_settings = mergedSettings;
  saveMockDB(currentDb);

  try {
    const payload = {
      id: 1,
      ...mergedSettings,
      updated_at: new Date().toISOString()
    };
    const { error } = await supabase
      .from('site_settings')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('Error saving site settings to Supabase database:', error);
    }
  } catch (err) {
    console.warn('Network error saving site settings to Supabase database:', err);
  }

  return mergedSettings;
};

export const subscribeToSiteSettings = (onSettingsChange) => {
  try {
    const channel = supabase
      .channel('public:site_settings')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'site_settings' },
        (payload) => {
          if (payload.new) {
            const currentDb = getMockDB();
            currentDb.site_settings = {
              ...currentDb.site_settings,
              ...payload.new
            };
            saveMockDB(currentDb);
            if (typeof onSettingsChange === 'function') {
              onSettingsChange(currentDb.site_settings);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (err) {
    console.warn('Failed to subscribe to site_settings real-time channel:', err);
    return () => {};
  }
};

export const uploadImageToSupabaseStorage = async (file, pathPrefix = 'logos') => {
  try {
    const fileExt = file.name ? file.name.split('.').pop() : 'png';
    const fileName = `${pathPrefix}_${Date.now()}.${fileExt}`;
    const filePath = `${pathPrefix}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('church-assets')
      .upload(filePath, file, { upsert: true });

    if (!uploadError) {
      const { data: publicUrlData } = supabase.storage
        .from('church-assets')
        .getPublicUrl(filePath);

      if (publicUrlData?.publicUrl) {
        return publicUrlData.publicUrl;
      }
    }
  } catch (err) {
    console.warn('Supabase storage upload failed:', err);
  }
  return null;
};

