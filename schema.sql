-- ============================================================================
-- Stadium Zuria Kalehiywet Church (SKHC) Portal System - Comprehensive SQL Schema
-- Fully Idempotent Script (Re-runnable without errors)
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. ENUM TYPES DEFINITION (Safe Conditional Creation)
-- ----------------------------------------------------------------------------

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE public.user_role AS ENUM (
            'MainRegistrar', 'FCL', 'MCL', 'YL', 'FMSL', 'MMSL', 'YMSL',
            'Evang', 'Missionary', 'IntMissionary', 'Pastor', 'CT', 'Guardian',
            'Accountant', 'MZL', 'CL', 'TCL', 'SL', 'ZPTL', 'PPTL', 'Astedader',
            'CSM', 'Janitor', 'NTL', 'CTL', 'FTL', 'ORTL', 'ETTL', 'YelijochZerf',
            'YesetochZerf', 'Tena', 'Timihirt', 'Gibrina', 'ICT', 'Negade', 'NGO',
            'MengistSerategna', 'Hig', 'Mehandis', 'Member', 'Finance', 'WorshipLeader',
            'CharityLeader', 'SubChoirLeader', 'Student', 'Admin'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'leadership_position') THEN
        CREATE TYPE public.leadership_position AS ENUM (
            'Sebsabi', 'Hisab_Shum', 'Mikitel_Sebsabi', 'Genzeb_Yazh',
            'Gabicha_Asfetsami', 'Tsehafi', 'Member', 'Coordinator'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'medeb_zone') THEN
        CREATE TYPE public.medeb_zone AS ENUM (
            'Maremiya', 'Kutir_1', 'Memeheran', 'Muya_and_Technique', 'Stadium_Zuria'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'medib_number') THEN
        CREATE TYPE public.medib_number AS ENUM (
            'Medib-1', 'Medib-2', 'Medib-3', 'Medib-4', 'Medib-5',
            'Medib-6', 'Medib-7', 'Medib-8', 'Medib-9', 'Medib-10'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'account_status') THEN
        CREATE TYPE public.account_status AS ENUM ('Active', 'Inactive', 'Disabled');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'application_status') THEN
        CREATE TYPE public.application_status AS ENUM ('Pending', 'Written_Exam', 'Interview', 'Passed', 'Rejected');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'exam_status') THEN
        CREATE TYPE public.exam_status AS ENUM ('Passed', 'Failed', 'Waitlist');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'financial_type') THEN
        CREATE TYPE public.financial_type AS ENUM ('Income', 'Expense');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'asset_condition') THEN
        CREATE TYPE public.asset_condition AS ENUM ('Normal', 'Defective');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'gender_type') THEN
        CREATE TYPE public.gender_type AS ENUM ('Male', 'Female');
    END IF;
END $$;

-- Safely append 'Student' and 'Admin' enum values if user_role type was created in an earlier migration
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'Student';
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'Admin';

-- ----------------------------------------------------------------------------
-- 2. USERS & PROFILES TABLE
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username_id VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone_number VARCHAR(50),
    role VARCHAR(100) NOT NULL DEFAULT 'Member',
    leadership_role public.leadership_position DEFAULT 'Member',
    default_pin VARCHAR(4) NOT NULL DEFAULT '1234',
    password_hash VARCHAR(255) NOT NULL,
    pin_changed BOOLEAN NOT NULL DEFAULT FALSE,
    status public.account_status NOT NULL DEFAULT 'Active',
    profile_picture_url TEXT,
    date_of_birth DATE,
    address TEXT,
    region VARCHAR(100),
    zone_or_woreda VARCHAR(100),
    kebele VARCHAR(100),
    medeb_zone public.medeb_zone,
    medib_number public.medib_number,
    round_of_leadership VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 3. SITE SETTINGS & HOMEPAGE CONTENT TABLES
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.site_settings (
    id INT PRIMARY KEY DEFAULT 1,
    site_title VARCHAR(255) DEFAULT 'Stadium Zuria Kalehiywet Church Portal',
    logo_url TEXT,
    hero_background_url TEXT,
    about_description TEXT,
    copyright_year INT DEFAULT 2026,
    copyright_description TEXT DEFAULT 'Stadium Zuria Kalehiywet Church. All rights reserved.',
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    contact_address TEXT,
    office_hours TEXT,
    google_map_embed_url TEXT,
    -- Bank Accounts (8 Fields for Names, 8 Fields for Numbers & 8 Fields for Purpose)
    bank_1_name VARCHAR(255),
    bank_1_account VARCHAR(100),
    bank_1_purpose TEXT,
    bank_2_name VARCHAR(255),
    bank_2_account VARCHAR(100),
    bank_2_purpose TEXT,
    bank_3_name VARCHAR(255),
    bank_3_account VARCHAR(100),
    bank_3_purpose TEXT,
    bank_4_name VARCHAR(255),
    bank_4_account VARCHAR(100),
    bank_4_purpose TEXT,
    bank_5_name VARCHAR(255),
    bank_5_account VARCHAR(100),
    bank_5_purpose TEXT,
    bank_6_name VARCHAR(255),
    bank_6_account VARCHAR(100),
    bank_6_purpose TEXT,
    bank_7_name VARCHAR(255),
    bank_7_account VARCHAR(100),
    bank_7_purpose TEXT,
    bank_8_name VARCHAR(255),
    bank_8_account VARCHAR(100),
    bank_8_purpose TEXT,
    -- Social Media Links
    facebook_url TEXT,
    youtube_url TEXT,
    instagram_url TEXT,
    whatsapp_url TEXT,
    tiktok_url TEXT,
    twitter_url TEXT,
    telegram_url TEXT,
    -- Weekly Church Programs (10 Fields)
    weekly_program_1 TEXT,
    weekly_program_2 TEXT,
    weekly_program_3 TEXT,
    weekly_program_4 TEXT,
    weekly_program_5 TEXT,
    weekly_program_6 TEXT,
    weekly_program_7 TEXT,
    weekly_program_8 TEXT,
    weekly_program_9 TEXT,
    weekly_program_10 TEXT,
    updated_by UUID REFERENCES public.users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT single_row CHECK (id = 1)
);

CREATE TABLE IF NOT EXISTS public.daily_bible_verses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    verse_text TEXT NOT NULL,
    scripture_reference VARCHAR(100) NOT NULL,
    date_posted DATE DEFAULT CURRENT_DATE,
    posted_by UUID REFERENCES public.users(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 4. CHURCH MEMBERS DIRECTORY TABLE
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.church_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone_number VARCHAR(50) NOT NULL,
    gender public.gender_type NOT NULL,
    age INT,
    medeb_zone public.medeb_zone NOT NULL,
    medib_number public.medib_number NOT NULL,
    region VARCHAR(100),
    zone VARCHAR(100),
    kebele VARCHAR(100),
    family_size INT DEFAULT 1,
    number_of_sons INT DEFAULT 0,
    number_of_daughters INT DEFAULT 0,
    wife_name VARCHAR(255),
    sons_names TEXT,
    daughters_names TEXT,
    occupation VARCHAR(150),
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 5. VACANCIES & APPLICANTS PORTAL TABLES
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.vacancies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    job_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    place_of_application TEXT NOT NULL,
    application_start_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    online_apply_link TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    posted_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.job_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vacancy_id UUID REFERENCES public.vacancies(id) ON DELETE CASCADE,
    applicant_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address TEXT,
    region VARCHAR(100),
    zone VARCHAR(100),
    woreda VARCHAR(100),
    kebele VARCHAR(100),
    cv_url TEXT,
    academic_doc_url TEXT,
    university_temp_doc_url TEXT,
    bible_degree_url TEXT,
    bible_diploma_url TEXT,
    grade_12_transcript_url TEXT,
    grade_10_transcript_url TEXT,
    grade_8_transcript_url TEXT,
    grade_12_entrance_cert_url TEXT,
    grade_10_matric_cert_url TEXT,
    grade_6_ministry_cert_url TEXT,
    grade_8_ministry_cert_url TEXT,
    birth_certificate_url TEXT,
    fayda_or_id_url TEXT,
    status public.application_status DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.exam_announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vacancy_id UUID REFERENCES public.vacancies(id) ON DELETE CASCADE,
    notice_type VARCHAR(50) DEFAULT 'Written_Exam', -- 'Written_Exam', 'Interview', 'Combined'
    title VARCHAR(255),
    written_exam_date TIMESTAMP WITH TIME ZONE,
    written_exam_venue TEXT,
    interview_date TIMESTAMP WITH TIME ZONE,
    interview_venue TEXT,
    instructions TEXT,
    posted_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.exam_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vacancy_id UUID REFERENCES public.vacancies(id) ON DELETE CASCADE,
    applicant_phone VARCHAR(50) NOT NULL,
    applicant_email VARCHAR(255),
    applicant_name VARCHAR(255) NOT NULL,
    written_exam_score NUMERIC(5,2),
    interview_score NUMERIC(5,2),
    total_score NUMERIC(5,2),
    status public.exam_status NOT NULL,
    remarks TEXT,
    posted_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 6. MEDEB SEFER ZONES & ATTENDANCE REPORTS
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.medeb_sefer_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    zone_name public.medeb_zone NOT NULL,
    medib_number public.medib_number NOT NULL,
    leader_id UUID REFERENCES public.users(id),
    meeting_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(zone_name, medib_number)
);

CREATE TABLE IF NOT EXISTS public.medeb_attendance_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES public.medeb_sefer_groups(id) ON DELETE CASCADE,
    reporter_id UUID REFERENCES public.users(id),
    report_date DATE NOT NULL DEFAULT CURRENT_DATE,
    total_attendees INT NOT NULL DEFAULT 0,
    next_program_host_name VARCHAR(255),
    next_program_house_address TEXT,
    weekly_lesson_topic TEXT,
    night_chapel_money_collected NUMERIC(12,2) DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.medeb_course_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES public.medeb_sefer_groups(id) ON DELETE CASCADE,
    requested_by UUID REFERENCES public.users(id),
    course_name VARCHAR(255) NOT NULL,
    requested_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(50) DEFAULT 'Pending',
    fulfilled_doc_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 7. EVANGELISM & MISSIONARY REPORTS
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.evangelism_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    evangelist_id UUID REFERENCES public.users(id),
    report_date DATE DEFAULT CURRENT_DATE,
    target_area VARCHAR(255),
    male_count INT DEFAULT 0,
    female_count INT DEFAULT 0,
    repented_and_back_count INT DEFAULT 0,
    believed_accepted_jesus_count INT DEFAULT 0,
    heard_about_jesus_count INT DEFAULT 0,
    healed_count INT DEFAULT 0,
    gave_future_hope_count INT DEFAULT 0,
    summary_report TEXT,
    target_recipient_role public.user_role DEFAULT 'Pastor',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.missionary_plans_and_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    missionary_id UUID REFERENCES public.users(id),
    mission_type VARCHAR(50) DEFAULT 'Local',
    location VARCHAR(255) NOT NULL,
    accomplished_tasks TEXT,
    next_year_plan TEXT,
    requested_funding_amount NUMERIC(12,2) DEFAULT 0.00,
    funding_status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 8. CHILDREN'S EDUCATION & GRADING SYSTEM
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.children_age_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    min_age INT NOT NULL,
    max_age INT NOT NULL,
    level_code VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.children_classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_name VARCHAR(255) NOT NULL,
    section VARCHAR(50) NOT NULL,
    age_category_id UUID REFERENCES public.children_age_categories(id) ON DELETE SET NULL,
    age_range VARCHAR(50),
    teacher_name VARCHAR(255) NOT NULL,
    room VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.children_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_full_name VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    gender public.gender_type NOT NULL,
    medeb_zone public.medeb_zone,
    medib_number public.medib_number,
    class_level VARCHAR(100) NOT NULL,
    section_name VARCHAR(50) NOT NULL,
    guardian_name VARCHAR(255),
    guardian_phone VARCHAR(50),
    teacher VARCHAR(255),
    username_id VARCHAR(100),
    default_pin VARCHAR(4) DEFAULT '1234',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.submitted_student_grades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id VARCHAR(100) NOT NULL,
    username_id VARCHAR(100),
    name VARCHAR(255) NOT NULL,
    age INT,
    class VARCHAR(100),
    section VARCHAR(50),
    teacher VARCHAR(255),
    midterm NUMERIC(5,2) DEFAULT 0.00,
    final_exam NUMERIC(5,2) DEFAULT 0.00,
    bible_recitation NUMERIC(5,2) DEFAULT 0.00,
    total NUMERIC(5,2) DEFAULT 0.00,
    avg NUMERIC(5,2) DEFAULT 0.00,
    rank INT,
    promotion_status VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Pending Registrar Approval',
    submitted_at DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.children_grades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID REFERENCES public.children_records(id) ON DELETE CASCADE,
    subject_name VARCHAR(150) NOT NULL,
    test_score NUMERIC(5,2) DEFAULT 0.00,
    exam_score NUMERIC(5,2) DEFAULT 0.00,
    academic_term VARCHAR(50) NOT NULL,
    recorded_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.teaching_materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    target_role VARCHAR(100) NOT NULL,
    description TEXT,
    file_format VARCHAR(10) NOT NULL,
    file_url TEXT NOT NULL,
    uploaded_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 9. GUARDIAN SHIFTS
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.guardian_shifts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guardian_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    shift_days TEXT NOT NULL,
    shift_hours TEXT NOT NULL,
    notes TEXT,
    assigned_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 10. FINANCIAL RECORDS & EXPENSES
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.financial_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    record_type public.financial_type NOT NULL,
    amount NUMERIC(14,2) NOT NULL,
    category VARCHAR(150) NOT NULL,
    transaction_date_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reason_description TEXT NOT NULL,
    spent_by_or_received_from VARCHAR(255),
    receipt_document_url TEXT,
    recorded_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 11. CHURCH STORE INVENTORY ASSETS
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.store_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_name VARCHAR(255) NOT NULL,
    category VARCHAR(150) NOT NULL,
    item_color VARCHAR(50),
    total_quantity INT NOT NULL DEFAULT 0,
    normal_quantity INT NOT NULL DEFAULT 0,
    defective_quantity INT NOT NULL DEFAULT 0,
    storage_location VARCHAR(150),
    notes TEXT,
    recorded_by UUID REFERENCES public.users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 12. MENFESAWI ZERF, CHOIRS & BAPTISM RECORDS
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.choir_rosters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    choir_name VARCHAR(100) NOT NULL,
    service_date DATE NOT NULL,
    session_time VARCHAR(50),
    songs_list TEXT,
    assigned_leader_id UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.sermon_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sermon_date DATE NOT NULL,
    preacher_name VARCHAR(255) NOT NULL,
    sermon_title VARCHAR(255) NOT NULL,
    biblical_text VARCHAR(150),
    notes_file_url TEXT,
    scheduled_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.baptism_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    age INT,
    gender public.gender_type NOT NULL,
    address TEXT,
    phone_number VARCHAR(50),
    medeb_zone public.medeb_zone,
    medib_number public.medib_number,
    year_of_baptism INT NOT NULL,
    date_of_baptism DATE NOT NULL,
    certificate_number VARCHAR(100) UNIQUE,
    recorded_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.health_professionals_registry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_name VARCHAR(255) NOT NULL,
    profession VARCHAR(150) NOT NULL,
    specialty VARCHAR(150),
    phone_number VARCHAR(50) NOT NULL,
    zerf_department VARCHAR(100) DEFAULT 'Tena Zerf',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.technology_issues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    urgency VARCHAR(50) DEFAULT 'Medium',
    status VARCHAR(50) DEFAULT 'Open',
    reported_by UUID REFERENCES public.users(id),
    assigned_to UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 13. MULTIDIRECTIONAL REPORTS & ANNOUNCEMENTS
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.portal_announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    target_roles public.user_role[] NOT NULL,
    expiry_date DATE,
    media_file_url TEXT,
    posted_by UUID REFERENCES public.users(id),
    posted_by_role public.user_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.leadership_reports_inbox (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES public.users(id),
    sender_role public.user_role NOT NULL,
    recipient_role public.user_role NOT NULL,
    report_title VARCHAR(255) NOT NULL,
    accomplishments_summary TEXT,
    next_year_plans TEXT,
    budget_allocated NUMERIC(12,2) DEFAULT 0.00,
    budget_spent NUMERIC(12,2) DEFAULT 0.00,
    report_attachment_url TEXT,
    review_comments TEXT,
    status VARCHAR(50) DEFAULT 'Submitted',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id),
    action_type VARCHAR(100) NOT NULL,
    target_table VARCHAR(100),
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Additional Sub-Choir & Zerf Specific Tables
CREATE TABLE IF NOT EXISTS public.sub_choirs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL UNIQUE,
    leader_name VARCHAR(255) NOT NULL,
    members_count INT DEFAULT 0,
    service_schedule VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.choir_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    choir_name VARCHAR(150) NOT NULL,
    vocal_part VARCHAR(50) DEFAULT 'Soprano',
    phone_number VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.choir_announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    target_choir VARCHAR(150) DEFAULT 'All Choirs',
    content TEXT NOT NULL,
    date_posted DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.counselling_materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    file_format VARCHAR(50) DEFAULT 'PDF',
    date_uploaded DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.grade_assessment_schemes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_name VARCHAR(150) NOT NULL,
    max_score NUMERIC(5,2) NOT NULL DEFAULT 10.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.submitted_student_grades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id VARCHAR(100) NOT NULL,
    student_name VARCHAR(255) NOT NULL,
    age INT,
    class_name VARCHAR(100),
    section_name VARCHAR(50),
    midterm_score NUMERIC(5,2) DEFAULT 0.00,
    final_exam_score NUMERIC(5,2) DEFAULT 0.00,
    bible_recitation_score NUMERIC(5,2) DEFAULT 0.00,
    total_score NUMERIC(5,2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'Pending Registrar Approval',
    submitted_at DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.fundraising_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    target_amount NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    raised_amount NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.worship_team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(150) NOT NULL,
    phone_number VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ladies_zerf_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50),
    medeb_zone public.medeb_zone,
    role VARCHAR(150) DEFAULT 'Participant',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_name VARCHAR(255) NOT NULL,
    sender_email VARCHAR(255),
    sender_phone VARCHAR(50),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.member_testimonies_and_prayers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID REFERENCES public.users(id),
    member_name VARCHAR(255),
    content TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Submitted',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 14. ROW LEVEL SECURITY (RLS) POLICIES (Idempotent)
-- ----------------------------------------------------------------------------

-- Ensure required columns exist even on pre-existing tables
ALTER TABLE IF EXISTS public.daily_bible_verses ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE IF EXISTS public.vacancies ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE IF EXISTS public.church_members ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE IF EXISTS public.users ALTER COLUMN role TYPE VARCHAR(100);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.church_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vacancies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_assets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public site settings access" ON public.site_settings;
DROP POLICY IF EXISTS "Public daily verses access" ON public.daily_bible_verses;
DROP POLICY IF EXISTS "Public vacancies access" ON public.vacancies;
DROP POLICY IF EXISTS "Public apply to vacancies" ON public.job_applications;
DROP POLICY IF EXISTS "Users read all profiles" ON public.users;
DROP POLICY IF EXISTS "Users update own profile" ON public.users;

CREATE POLICY "Public site settings access" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public daily verses access" ON public.daily_bible_verses FOR SELECT USING (is_active = true);
CREATE POLICY "Public vacancies access" ON public.vacancies FOR SELECT USING (is_active = true);
CREATE POLICY "Public apply to vacancies" ON public.job_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Users read all profiles" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- ----------------------------------------------------------------------------
-- 15. INITIAL SEED DATA FOR DEMO & TESTING
-- ----------------------------------------------------------------------------

INSERT INTO public.site_settings (id, site_title, copyright_year, copyright_description)
VALUES (1, 'Stadium Zuria Kalehiywet Church Portal System', 2026, 'Stadium Zuria Kalehiywet Church. All rights reserved.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.daily_bible_verses (verse_text, scripture_reference)
VALUES ('For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.', 'Jeremiah 29:11')
ON CONFLICT DO NOTHING;

-- Seed Sample Accounts (including Student and Admin users)
INSERT INTO public.users (username_id, full_name, email, phone_number, role, default_pin, password_hash, status)
VALUES 
('SKHC/MainRegistrar/0001/2026', 'Main Registrar Admin', 'registrar@skhc.org', '+251911000001', 'MainRegistrar', '1234', crypt('1234', gen_salt('bf')), 'Active'),
('SKHC/Pastor/0002/2026', 'Senior Church Pastor', 'pastor@skhc.org', '+251911000002', 'Pastor', '1234', crypt('1234', gen_salt('bf')), 'Active'),
('SKHC/FCL/0003/2026', 'Fathers Church Leader', 'fcl@skhc.org', '+251911000003', 'FCL', '1234', crypt('1234', gen_salt('bf')), 'Active'),
('SKHC/Evang/0004/2026', 'Head Evangelist', 'evangelist@skhc.org', '+251911000004', 'Evang', '1234', crypt('1234', gen_salt('bf')), 'Active'),
('SKHC/CSM/0005/2026', 'Store Manager Admin', 'store@skhc.org', '+251911000005', 'CSM', '1234', crypt('1234', gen_salt('bf')), 'Active'),
('SKHC/Accountant/0006/2026', 'Head Accountant', 'accountant@skhc.org', '+251911000006', 'Accountant', '1234', crypt('1234', gen_salt('bf')), 'Active'),
('hannah/4829/2026', 'Hannah Solomon', 'hannah@skhc.org', '+251911223344', 'Student', '4892', crypt('4892', gen_salt('bf')), 'Active')
ON CONFLICT (username_id) DO NOTHING;

-- Seed Sample Children Age Categories
INSERT INTO public.children_age_categories (name, min_age, max_age, level_code, description)
VALUES 
('Beginners Level 1', 4, 6, 'Level 1', 'Early childhood Bible stories, coloring & prayer basics'),
('Primary Level 2', 7, 9, 'Level 2', 'Elementary scripture memorization & Christian character'),
('Junior Level 3', 10, 12, 'Level 3', 'Intermediate Bible doctrine & fellowship leadership'),
('Teens Level 4', 13, 15, 'Level 4', 'Youth discipleship, ministry service & Bible study')
ON CONFLICT DO NOTHING;

-- Seed Sample Children Classes
INSERT INTO public.children_classes (class_name, section, age_range, teacher_name, room)
VALUES 
('Level 1 - Beginners', 'Section A', '4-6 yrs', 'Sister Bethlehem Markos', 'Children Hall 1'),
('Level 2 - Primary', 'Section A', '7-9 yrs', 'Brother Dawit Alemu', 'Children Hall 2'),
('Level 2 - Primary', 'Section B', '7-9 yrs', 'Sister Tigist Alemu', 'Children Hall 3'),
('Level 3 - Junior', 'Section A', '10-12 yrs', 'Deacon Solomon Wolde', 'Upper Room 1')
ON CONFLICT DO NOTHING;


