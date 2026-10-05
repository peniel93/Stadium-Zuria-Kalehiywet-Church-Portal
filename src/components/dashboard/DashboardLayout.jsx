import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../common/ToastAlert';
import { ChurchLogo } from '../common/ChurchLogo';
import {
  Users, UserCheck, Shield, BookOpen, Briefcase, DollarSign,
  Package, Heart, Cross, Globe, Moon, Sun, LogOut, LayoutDashboard,
  Layers, FileText, Settings, KeyRound, Award, ChevronRight, Sparkles, User, Menu
} from 'lucide-react';

export const DashboardLayout = ({ currentRole, onSelectRole, onOpenProfile, onBackToPublic, children }) => {
  const { currentUser, logout } = useAuth();
  const { t, language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showAllRoles, setShowAllRoles] = useState(false);

  // List of all 44 role categories for administrative role switcher
  const roleCategories = [
    { id: 'MainRegistrar', name: 'Main Registrar Dashboard', icon: Shield },
    { id: 'Pastor', name: 'Church Pastor Dashboard', icon: Cross },
    { id: 'Member', name: 'Church Member Profile', icon: User },
    { id: 'Student', name: 'Children Student Portal', icon: BookOpen },
    { id: 'MemberDirectory', name: 'Church Members Directory Admin', icon: Users },
    { id: 'FCL', name: 'Fathers Church Leader (FCL)', icon: Users },
    { id: 'MCL', name: 'Mothers Church Leader (MCL)', icon: Users },
    { id: 'YL', name: 'Youth Leader Dashboard (YL)', icon: Users },
    { id: 'FMSL', name: 'Fathers Medeb Sefer Leader', icon: Layers },
    { id: 'MMSL', name: 'Mothers Medeb Sefer Leader', icon: Layers },
    { id: 'YMSL', name: 'Youth Medeb Sefer Leader', icon: Layers },
    { id: 'Evang', name: 'Evangelists Dashboard', icon: Heart },
    { id: 'Missionary', name: 'Missionary Dashboard', icon: Globe },
    { id: 'IntMissionary', name: 'International Missionary', icon: Globe },
    { id: 'CT', name: 'Childrens Teacher (CT)', icon: BookOpen },
    { id: 'Guardian', name: 'Guardian & Security Duty', icon: Shield },
    { id: 'Accountant', name: 'Accountant Dashboard', icon: DollarSign },
    { id: 'Astedader', name: 'Astedader Financial Admin', icon: DollarSign },
    { id: 'Finance', name: 'Finance Zerf Dashboard', icon: DollarSign },
    { id: 'CSM', name: 'Church Store Manager (CSM)', icon: Package },
    { id: 'MZL', name: 'Menfesawi Zerf Leader (MZL)', icon: BookOpen },
    { id: 'CL', name: 'Choir Leader & Sub-Choirs', icon: Sparkles },
    { id: 'TCL', name: 'Temer Choir Dashboard (TCL)', icon: Sparkles },
    { id: 'WorshipLeader', name: 'Worship Team Dashboard', icon: Sparkles },
    { id: 'SL', name: 'Salem Team Dashboard', icon: Heart },
    { id: 'ZPTL', name: 'Zetseat Prayers Team Leader', icon: Heart },
    { id: 'PPTL', name: 'Peniel Prayers Team Leader', icon: Heart },
    { id: 'CTL', name: 'Counselling Team Dashboard', icon: Heart },
    { id: 'FTL', name: 'Fundraising Team Dashboard', icon: DollarSign },
    { id: 'ORTL', name: 'Outreach & Evangelism Team', icon: Globe },
    { id: 'ETTL', name: 'Education & Training Team', icon: BookOpen },
    { id: 'YelijochZerf', name: 'Yelijoch Zerf Dashboard', icon: BookOpen },
    { id: 'YesetochZerf', name: 'Yesetoch Zerf Dashboard', icon: Users },
    { id: 'Baptism', name: 'Baptism Records Registry', icon: FileText },
    { id: 'Tena', name: 'Tena Zerf (Health Pros)', icon: Heart },
    { id: 'Timihirt', name: 'Timihirt Zerf Dashboard', icon: BookOpen },
    { id: 'Gibrina', name: 'Gibrina Zerf Dashboard', icon: Layers },
    { id: 'ICT', name: 'ICT Zerf Tech Issues', icon: Settings },
    { id: 'Negade', name: 'Negade Zerf (Business)', icon: Briefcase },
    { id: 'NGO', name: 'NGO Serategnoh Zerf', icon: Users },
    { id: 'MengistSerategna', name: 'Mengist Serategnoch Zerf', icon: Users },
    { id: 'Hig', name: 'Yehig Zerf (Legal Team)', icon: FileText },
    { id: 'Mehandis', name: 'Mehandisoch (Engineers)', icon: Settings },
    { id: 'CharityLeader', name: 'Charity Team Dashboard', icon: Heart }
  ];

  const { showToast } = useToast();

  const handleSignout = () => {
    logout();
    if (showToast) showToast(language === 'am' ? 'በተሳካ ሁኔታ ከዳሽቦርድ ወጥተዋል' : 'Successfully signed out of dashboard portal.', 'info');
    if (onBackToPublic) onBackToPublic();
  };

  const getUserRoleId = (role) => {
    if (!role) return 'MainRegistrar';
    if (role === 'Janitor') return 'Guardian';
    return role;
  };

  const userRoleId = getUserRoleId(currentUser?.role);
  const isMainRegistrar = userRoleId === 'MainRegistrar';

  const visibleRoleCategories = isMainRegistrar
    ? roleCategories
    : roleCategories.filter(r => r.id === userRoleId || r.id === currentRole);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-main)', position: 'relative' }}>
      
      {/* Sidebar Navigation */}
      <aside
        className={`sidebar-drawer ${sidebarOpen ? 'open' : 'closed'}`}
        style={{
          width: sidebarOpen ? '280px' : '70px',
          backgroundColor: 'var(--bg-card)',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s ease',
          flexShrink: 0,
          zIndex: 100
        }}
      >
        {/* Sidebar Header */}
        <div style={{
          padding: '1.25rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarOpen ? 'space-between' : 'center',
          borderBottom: '1px solid var(--border-color)'
        }}>
          {sidebarOpen && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ChurchLogo size={32} iconSize={18} />
              <h2 style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--primary-blue)' }}>
                SKHC PORTALS
              </h2>
            </div>
          )}

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="btn btn-secondary btn-sm"
            style={{ padding: '4px 8px' }}
          >
            <ChevronRight size={16} style={{ transform: sidebarOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
          </button>
        </div>

        {/* User Profile Card */}
        {sidebarOpen && currentUser && (
          <div
            onClick={onOpenProfile}
            style={{
              padding: '1rem',
              borderBottom: '1px solid var(--border-color)',
              backgroundColor: 'var(--primary-light-blue)',
              cursor: 'pointer'
            }}
            title="Click to View & Edit Profile"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                overflow: 'hidden',
                backgroundColor: '#ffffff',
                border: '2px solid var(--primary-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {currentUser.profile_picture_url || currentUser.avatar_url ? (
                  <img src={currentUser.profile_picture_url || currentUser.avatar_url} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <User size={20} style={{ color: 'var(--primary-blue)' }} />
                )}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', margin: 0 }}>
                  {currentUser.full_name}
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--primary-blue)', fontWeight: 600, margin: 0 }}>
                  {currentUser.username_id}
                </p>
                <small style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 600 }}>Click to Edit Profile ✎</small>
              </div>
            </div>
          </div>
        )}

        {/* Role Selector List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem 0.5rem' }}>
          {sidebarOpen && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {isMainRegistrar ? '44 Portal Dashboards' : 'Assigned Dashboard'}
              </span>

              {isMainRegistrar && (
                <button
                  onClick={() => setShowAllRoles(!showAllRoles)}
                  style={{ background: 'none', border: 'none', color: 'var(--primary-blue)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 700 }}
                >
                  {showAllRoles ? 'Show Less ▲' : 'Show All (44) ▼'}
                </button>
              )}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {(isMainRegistrar && !showAllRoles
              ? visibleRoleCategories.slice(0, 8)
              : visibleRoleCategories
            ).map((r) => {
              const Icon = r.icon;
              const isSelected = currentRole === r.id;

              return (
                <button
                  key={r.id}
                  onClick={() => onSelectRole(r.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    width: '100%',
                    padding: '0.625rem 0.75rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: isSelected ? 'var(--primary-light-blue)' : 'transparent',
                    color: isSelected ? 'var(--primary-blue)' : 'var(--text-main)',
                    fontWeight: isSelected ? 700 : 500,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    justifyContent: sidebarOpen ? 'flex-start' : 'center',
                    textAlign: 'left'
                  }}
                  title={r.name}
                >
                  <Icon size={18} style={{ color: isSelected ? 'var(--primary-blue)' : 'var(--text-muted)', flexShrink: 0 }} />
                  {sidebarOpen && <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</span>}
                </button>
              );
            })}

            {isMainRegistrar && !showAllRoles && (
              <button
                onClick={() => setShowAllRoles(true)}
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', marginTop: '0.5rem', fontSize: '0.8125rem' }}
              >
                <span>Show More Dashboards ({visibleRoleCategories.length - 8} More) ▼</span>
              </button>
            )}
          </div>
        </div>

        {/* Sidebar Footer Controls */}
        <div style={{ padding: '0.75rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button onClick={onBackToPublic} className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: sidebarOpen ? 'flex-start' : 'center' }}>
            <Globe size={16} />
            {sidebarOpen && <span>Public Portal</span>}
          </button>
          
          <button onClick={handleSignout} className="btn btn-danger btn-sm" style={{ width: '100%', justifyContent: sidebarOpen ? 'flex-start' : 'center' }}>
            <LogOut size={16} />
            {sidebarOpen && <span>{t('logout')}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowY: 'auto' }}>
        
        {/* Top Dashboard Header */}
        <header style={{
          backgroundColor: 'var(--bg-card)',
          borderBottom: '1px solid var(--border-color)',
          padding: '0.875rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="btn btn-secondary btn-sm mobile-toggle-btn"
              aria-label="Toggle Dashboard Menu"
            >
              <Menu size={20} />
            </button>

            <div>
              <span className="badge badge-warning" style={{ marginBottom: '0.25rem' }}>Active Dashboard</span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-blue)' }}>
                {roleCategories.find(r => r.id === currentRole)?.name || 'Dashboard System'}
              </h2>
            </div>
          </div>

          <div className="dashboard-header-right">
            <button onClick={onOpenProfile} className="btn btn-secondary btn-sm" title="View / Edit Profile">
              <User size={16} />
              <span className="btn-text-label">My Profile</span>
            </button>

            <button onClick={toggleLanguage} className="btn btn-secondary btn-sm" title="Translate Language">
              <Globe size={16} />
              <span className="btn-text-label">{language === 'en' ? 'አማርኛ' : 'English'}</span>
            </button>

            <button onClick={toggleTheme} className="btn btn-secondary btn-sm" title="Toggle Light/Dark Theme">
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              <span className="btn-text-label">{theme === 'light' ? 'Dark' : 'Light'}</span>
            </button>

            <button
              onClick={handleSignout}
              className="btn btn-danger btn-sm"
              title={t('logout')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: 600 }}
            >
              <LogOut size={16} />
              <span className="btn-text-label">{t('logout')}</span>
            </button>
          </div>
        </header>

        {/* Dashboard Content Injection */}
        <div style={{ padding: '1.5rem', flex: 1 }}>
          {children}
        </div>
      </main>

    </div>
  );
};
