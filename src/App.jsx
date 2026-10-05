import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/common/ToastAlert';
import { ScrollToTop } from './components/common/ScrollToTop';
import { Navbar } from './components/public/Navbar';
import { HomePage } from './components/public/HomePage';
import { AboutPage } from './components/public/AboutPage';
import { ContactPage } from './components/public/ContactPage';
import { GalleryPage } from './components/public/GalleryPage';
import { AnnouncementsPage } from './components/public/AnnouncementsPage';
import { VacancyPortal } from './components/public/VacancyPortal';
import { Footer } from './components/public/Footer';
import { LoginModal } from './components/auth/LoginModal';
import { UserProfileModal } from './components/common/UserProfileModal';
import { DashboardLayout } from './components/dashboard/DashboardLayout';

// Dashboard Imports
import { MainRegistrarDashboard } from './components/dashboard/MainRegistrarDashboard';
import { PastorDashboard } from './components/dashboard/PastorDashboard';
import { ChurchMembersDashboard } from './components/dashboard/ChurchMembersDashboard';
import { ChurchLeadersDashboard } from './components/dashboard/ChurchLeadersDashboard';
import { MedebSeferDashboard } from './components/dashboard/MedebSeferDashboard';
import { EvangelistsDashboard } from './components/dashboard/EvangelistsDashboard';
import { ChildrenTeacherDashboard } from './components/dashboard/ChildrenTeacherDashboard';
import { GuardianDashboard } from './components/dashboard/GuardianDashboard';
import { FinanceAccountantDashboard } from './components/dashboard/FinanceAccountantDashboard';
import { StoreManagerDashboard } from './components/dashboard/StoreManagerDashboard';
import { MenfesawiZerfDashboard } from './components/dashboard/MenfesawiZerfDashboard';

// Specialized Zerf & Team Dashboard Imports
import { ChoirLeaderDashboard } from './components/dashboard/ChoirLeaderDashboard';
import { YelijochZerfDashboard } from './components/dashboard/YelijochZerfDashboard';
import { YesetochZerfDashboard } from './components/dashboard/YesetochZerfDashboard';
import { BaptismDashboard } from './components/dashboard/BaptismDashboard';
import { OutreachDashboard } from './components/dashboard/OutreachDashboard';
import { FundraisingDashboard } from './components/dashboard/FundraisingDashboard';
import { CounsellingTeamDashboard } from './components/dashboard/CounsellingTeamDashboard';
import { EducationTrainingDashboard } from './components/dashboard/EducationTrainingDashboard';
import { ProfessionalZerfsDashboard } from './components/dashboard/ProfessionalZerfsDashboard';
import { WorshipSalemPrayerDashboard } from './components/dashboard/WorshipSalemPrayerDashboard';

import { MemberProfileDashboard } from './components/dashboard/MemberProfileDashboard';
import { ChildrenStudentDashboard } from './components/dashboard/ChildrenStudentDashboard';

const MainContent = () => {
  const { currentUser } = useAuth();

  const [currentTab, setCurrentTab] = useState('home');
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(() => currentUser?.role || 'MainRegistrar');

  useEffect(() => {
    if (currentUser?.role) {
      setSelectedRole(currentUser.role);
    }
  }, [currentUser]);

  const handleNavigate = (tab) => {
    if (tab === 'dashboard' && !currentUser) {
      setLoginModalOpen(true);
      return;
    }
    setCurrentTab(tab);
  };

  const handleSelectRole = (roleId) => {
    if (currentUser?.role && currentUser.role !== 'MainRegistrar') {
      setSelectedRole(currentUser.role);
    } else {
      setSelectedRole(roleId);
    }
  };

  const renderDashboardContent = () => {
    switch (selectedRole) {
      case 'MainRegistrar':
      case 'Admin':
      case 'None':
        return <MainRegistrarDashboard />;
      case 'Pastor':
        return <PastorDashboard />;
      case 'Member':
        return <MemberProfileDashboard />;
      case 'Student':
        return <ChildrenStudentDashboard />;
      case 'MemberDirectory':
        return <ChurchMembersDashboard />;
      case 'FCL':
        return <ChurchLeadersDashboard roleTitle="Fathers' Church Leader (FCL)" />;
      case 'MCL':
        return <ChurchLeadersDashboard roleTitle="Mothers' Church Leader (MCL)" />;
      case 'YL':
        return <ChurchLeadersDashboard roleTitle="Youth Leader (YL)" />;
      case 'FMSL':
        return <MedebSeferDashboard roleTitle="Fathers' Medeb Sefer Leader (FMSL)" />;
      case 'MMSL':
        return <MedebSeferDashboard roleTitle="Mothers' Medeb Sefer Leader (MMSL)" />;
      case 'YMSL':
        return <MedebSeferDashboard roleTitle="Youth Medeb Sefer Leader (YMSL)" />;
      case 'Evang':
        return <EvangelistsDashboard roleTitle="Evangelists Dashboard" />;
      case 'Missionary':
        return <EvangelistsDashboard roleTitle="Missionary Dashboard" />;
      case 'IntMissionary':
        return <EvangelistsDashboard roleTitle="International Missionary Dashboard" />;
      case 'CT':
        return <ChildrenTeacherDashboard />;
      case 'YelijochZerf':
        return <YelijochZerfDashboard />;
      case 'YesetochZerf':
        return <YesetochZerfDashboard />;
      case 'Baptism':
        return <BaptismDashboard />;
      case 'ORTL':
        return <OutreachDashboard />;
      case 'FTL':
        return <FundraisingDashboard />;
      case 'Guardian':
      case 'Janitor':
        return <GuardianDashboard />;
      case 'Accountant':
        return <FinanceAccountantDashboard roleTitle="Accountant Dashboard" />;
      case 'Astedader':
        return <FinanceAccountantDashboard roleTitle="Astedader Administrator Dashboard" />;
      case 'Finance':
        return <FinanceAccountantDashboard roleTitle="Finance Zerf Dashboard" />;
      case 'CSM':
        return <StoreManagerDashboard />;
      case 'CTL':
        return <CounsellingTeamDashboard />;
      case 'ETTL':
        return <EducationTrainingDashboard />;
      case 'Tena':
        return <ProfessionalZerfsDashboard zerfTitle="Tena Zerf (Health Professionals)" />;
      case 'Timihirt':
        return <ProfessionalZerfsDashboard zerfTitle="Timihirt Zerf (Education Professionals)" />;
      case 'Gibrina':
        return <ProfessionalZerfsDashboard zerfTitle="Gibrina Zerf (Agriculture Professionals)" />;
      case 'ICT':
        return <ProfessionalZerfsDashboard zerfTitle="ICT Zerf (Technology & Solutions)" />;
      case 'Negade':
        return <ProfessionalZerfsDashboard zerfTitle="Negade Zerf (Business Professionals)" />;
      case 'NGO':
        return <ProfessionalZerfsDashboard zerfTitle="NGO Serategnoh Zerf" />;
      case 'MengistSerategna':
        return <ProfessionalZerfsDashboard zerfTitle="Mengist Serategnoch (Govt Workers)" />;
      case 'Hig':
        return <ProfessionalZerfsDashboard zerfTitle="Yehig Zerf (Legal Team)" />;
      case 'Mehandis':
        return <ProfessionalZerfsDashboard zerfTitle="Mehandisoch Zerf (Engineers)" />;
      case 'WorshipLeader':
        return <WorshipSalemPrayerDashboard teamTitle="Worship Team Dashboard" />;
      case 'SL':
        return <WorshipSalemPrayerDashboard teamTitle="Salem Team Dashboard" />;
      case 'ZPTL':
        return <WorshipSalemPrayerDashboard teamTitle="Zetseat Prayers Team Leader" />;
      case 'PPTL':
        return <WorshipSalemPrayerDashboard teamTitle="Peniel Prayers Team Leader" />;
      case 'CharityLeader':
        return <WorshipSalemPrayerDashboard teamTitle="Charity Team Dashboard" />;
      case 'CL':
      case 'TCL':
      case 'SubChoirLeader':
        return <ChoirLeaderDashboard choirTitle={`${selectedRole} - Sub-Choir Dashboard`} />;
      case 'MZL':
      default:
        return <MenfesawiZerfDashboard roleTitle={`${selectedRole} Dashboard`} />;
    }
  };

  if (currentTab === 'dashboard' && currentUser) {
    return (
      <>
        <DashboardLayout
          currentRole={selectedRole}
          onSelectRole={handleSelectRole}
          onOpenProfile={() => setProfileModalOpen(true)}
          onBackToPublic={() => setCurrentTab('home')}
        >
          {renderDashboardContent()}
        </DashboardLayout>

        <UserProfileModal
          isOpen={profileModalOpen}
          onClose={() => setProfileModalOpen(false)}
        />
      </>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onOpenLogin={() => setLoginModalOpen(true)}
        onOpenProfile={() => setProfileModalOpen(true)}
      />

      <main className="container" style={{ flex: 1, paddingTop: '2rem' }}>
        {currentTab === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onOpenLogin={() => setLoginModalOpen(true)}
          />
        )}

        {currentTab === 'about' && <AboutPage />}
        {currentTab === 'contact' && <ContactPage />}
        {currentTab === 'gallery' && <GalleryPage />}
        {currentTab === 'announcements' && <AnnouncementsPage />}

        {currentTab === 'vacancies' && (
          <VacancyPortal initialTab="list" />
        )}

        {currentTab === 'exam-results' && (
          <VacancyPortal initialTab="results" />
        )}
      </main>

      <Footer
        onNavigate={handleNavigate}
        onOpenLogin={() => setLoginModalOpen(true)}
      />

      <ScrollToTop />

      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={(user) => {
          setSelectedRole(user?.role || 'MainRegistrar');
          setCurrentTab('dashboard');
        }}
      />

      <UserProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <ToastProvider>
            <MainContent />
          </ToastProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
