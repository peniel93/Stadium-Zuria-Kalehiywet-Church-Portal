import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    // Navigation & General
    church_name: "Stadium Zuria Kalehiywet Church Portal",
    home: "Home",
    about_us: "About Us",
    announcements: "Announcements",
    gallery: "Gallery & Events",
    vacancies: "Vacancies",
    exam_results: "Exam Results",
    contact_us: "Contact Us",
    login: "Portal Login",
    logout: "Sign Out",
    dashboard: "Dashboard",
    my_profile: "My Profile",
    theme_light: "Light Mode",
    theme_dark: "Dark Mode",
    language: "English",

    // Exam & Interview Schedules
    exam_schedules: "Exam & Interview Schedules",
    written_exam: "Written Exam",
    interview_exam: "Interview Exam",
    exam_venue: "Exam Venue / Location",
    interview_place: "Interview Place",
    call_for_exam: "Call for Written Exam & Interview",
    exam_instructions: "Exam Instructions & Required Documents",

    // Roles & Titles
    main_registrar: "Main Registrar",
    pastor: "Church Pastor",
    fathers_leader: "Fathers Church Leader",
    mothers_leader: "Mothers Church Leader",
    youth_leader: "Youth Leader",
    evangelist: "Evangelist",
    missionary: "Missionary",
    store_manager: "Store Manager",
    accountant: "Accountant",
    children_teacher: "Children Teacher",

    // Common Actions
    add_new: "Add New",
    edit: "Edit",
    delete: "Delete",
    save: "Save Changes",
    cancel: "Cancel",
    search: "Search...",
    export_csv: "Export CSV",
    export_pdf: "Export PDF",
    print: "Print Report",
    reset_password: "Reset Password",
    change_pin: "Change 4-Digit PIN",

    // Vacancy Portal
    job_vacancies: "Church Job Vacancies",
    apply_now: "Apply Now",
    application_form: "Job Application Form",
    check_results: "Check Exam & Interview Results",
    enter_phone_email: "Enter your Phone Number or Email to view status",
    mandatory_docs: "Mandatory & Optional Application Documents",

    // Medeb Sefer & Stores
    medeb_sefer: "Medeb Sefer Zone",
    store_inventory: "Church Store Assets & Items",
    financial_ledger: "Financial Expenses & Incomes",
    grades_ranking: "Children Grades & Ranking"
  },
  am: {
    // Navigation & General
    church_name: "የስታዲየም ዙሪያ ቃለ ሕይወት ቤተ ክርስቲያን ፖርታል",
    home: "ዋና ገጽ",
    about_us: "ስለ እኛ",
    announcements: "ማስታወቂያዎች",
    gallery: "የፎቶና ቪዲዮ ጋለሪ",
    vacancies: "የሥራ ማስታወቂያዎች",
    exam_results: "የፈተና ውጤቶች",
    contact_us: "ያግኙን / አድራሻ",
    login: "ወደ ፖርታል ግባ",
    logout: "ውጣ",
    dashboard: "ዳሽቦርድ",
    my_profile: "የግል መገለጫዬ",
    theme_light: "ብርሃን ሁነታ",
    theme_dark: "ጨለማ ሁነታ",
    language: "አማርኛ",

    // Exam & Interview Schedules
    exam_schedules: "የፈተና እና ቃለ መጠይቅ ፕሮግራሞች",
    written_exam: "የጽሑፍ ፈተና",
    interview_exam: "የቃለ መጠይቅ ፈተና",
    exam_venue: "የፈተና ቦታ / አዳራሽ",
    interview_place: "የቃለ መጠይቅ ቦታ",
    call_for_exam: "የጽሑፍ ፈተና እና ቃለ መጠይቅ ጥሪ ማስታወቂያ",
    exam_instructions: "የፈተና መመሪያዎች እና አስፈላጊ ሰነዶች",

    // Roles & Titles
    main_registrar: "ዋና መዝገብ ቤት (Registrar)",
    pastor: "የቤተ ክርስቲያን ፓስተር",
    fathers_leader: "የአባቶች መሪ",
    mothers_leader: "የእናቶች መሪ",
    youth_leader: "የወጣቶች መሪ",
    evangelist: "ወንጌላዊ (Evangelist)",
    missionary: "ሚሲዮናዊ",
    store_manager: "የዕቃ ግብጃ ኃላፊ",
    accountant: "ሒሳብ ሹም / አካውንታንት",
    children_teacher: "የሕፃናት አስተማሪ",

    // Common Actions
    add_new: "አዲስ አክል",
    edit: "አስተካክል",
    delete: "ሰርዝ",
    save: "ለውጦችን አስቀምጥ",
    cancel: "ሰርዝ",
    search: "ፈልግ...",
    export_csv: "ወደ CSV ላክ",
    export_pdf: "ወደ PDF ላክ",
    print: "ሪፖርት አትም",
    reset_password: "የይለፍ ቃል ቀይር",
    change_pin: "ባለ 4-አሃዝ ፒን ቀይር",

    // Vacancy Portal
    job_vacancies: "የቤተ ክርስቲያን የሥራ ማስታወቂያዎች",
    apply_now: "አሁኑኑ ያመልክቱ",
    application_form: "የሥራ ማመልከቻ ፎርም",
    check_results: "የፈተና እና ቃለ መጠይቅ ውጤት ይመልከቱ",
    enter_phone_email: "ውጤት ለማየት ስልክ ቁጥር ወይም ኢሜይል ያስገቡ",
    mandatory_docs: "አስፈላጊ ሰነዶች እና ማስረጃዎች",

    // Medeb Sefer & Stores
    medeb_sefer: "መደብ ሰፈር ዞን",
    store_inventory: "የቤተ ክርስቲያን ዕቃዎች እና ንብረት",
    financial_ledger: "የፋይናንስ ወጪ እና ገቢ መዝገብ",
    grades_ranking: "የሕፃናት ውጤት እና ደረጃ"
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('SKHC_LANG') || 'en';
  });

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'am' : 'en';
    setLanguage(nextLang);
    localStorage.setItem('SKHC_LANG', nextLang);
  };

  const t = (key) => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
