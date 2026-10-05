import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getMockDB,
  saveMockDB,
  fetchSiteSettingsFromSupabase,
  saveSiteSettingsToSupabase,
  subscribeToSiteSettings
} from '../lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('SKHC_CURRENT_USER');
    return saved ? JSON.parse(saved) : null;
  });

  const [db, setDb] = useState(() => getMockDB());

  const refreshDB = () => {
    setDb(getMockDB());
  };

  // Sync site settings from database on mount & subscribe to real-time updates across devices
  useEffect(() => {
    fetchSiteSettingsFromSupabase().then(() => {
      setDb(getMockDB());
    });

    const unsubscribe = subscribeToSiteSettings(() => {
      setDb(getMockDB());
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('SKHC_CURRENT_USER', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('SKHC_CURRENT_USER');
    }
  }, [currentUser]);

  // Login handler accepting auto-generated Username ID and 4-digit PIN
  const login = (usernameId, pin) => {
    const freshDb = getMockDB();
    const allUsers = [
      ...(freshDb.users || []),
      ...(freshDb.church_members || []).map(m => ({
        ...m,
        role: 'Member',
        default_pin: m.default_pin || m.password_pin || '4892',
        status: m.status || 'Active'
      }))
    ];

    const cleanInputId = usernameId ? usernameId.trim().toLowerCase() : '';
    let found = allUsers.find(
      u => u.username_id && u.username_id.trim().toLowerCase() === cleanInputId
    );

    // Dynamic Member Login Fallback: Allow any member ID (e.g. SKHC/Member/0007/2026) to log in
    if (!found && cleanInputId.includes('member')) {
      const memberTemplate = (freshDb.church_members && freshDb.church_members[0]) || {};
      found = {
        id: `mb-user-${Date.now()}`,
        username_id: usernameId.trim(),
        full_name: memberTemplate.full_name || 'Church Member User',
        email: memberTemplate.email || 'member@skhc.org',
        phone_number: memberTemplate.phone_number || '+251911112233',
        role: 'Member',
        leadership_role: 'Member',
        medeb_zone: memberTemplate.medeb_zone || 'Stadium_Zuria',
        medib_number: memberTemplate.medib_number || 'Medib-1',
        occupation: memberTemplate.occupation || 'Church Member',
        default_pin: pin.trim(),
        password_pin: pin.trim(),
        pin_changed: true,
        status: 'Active'
      };

      if (!freshDb.users) freshDb.users = [];
      freshDb.users.push(found);
      saveMockDB(freshDb);
      refreshDB();
    }

    if (!found) {
      return { success: false, message: "User ID not found in system." };
    }

    if (found.status && found.status !== 'Active') {
      return { success: false, message: "Account is disabled or inactive. Contact Main Registrar." };
    }

    const expectedPin = (found.default_pin || found.password_pin || '1234').toString().trim();
    if (expectedPin !== pin.trim()) {
      return { success: false, message: "Invalid 4-digit PIN password." };
    }

    setCurrentUser(found);
    return { success: true, user: found, pinChanged: found.pin_changed };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Change password / PIN handler
  const updatePIN = (newPin) => {
    if (!currentUser) return false;
    const freshDb = getMockDB();
    const updatedUsers = freshDb.users.map(u => {
      if (u.id === currentUser.id) {
        return { ...u, default_pin: newPin, pin_changed: true };
      }
      return u;
    });
    freshDb.users = updatedUsers;
    saveMockDB(freshDb);
    setDb(freshDb);
    const updatedSelf = { ...currentUser, default_pin: newPin, pin_changed: true };
    setCurrentUser(updatedSelf);
    return true;
  };

  // Main Registrar ID Generator helper with guaranteed uniqueness
  // SKHC/{Role_name}/{4-digit-id}/{year_of_creation}
  const generateUsernameId = (roleName, customYear) => {
    const freshDb = getMockDB();
    const year = customYear || new Date().getFullYear();
    const existingIds = (freshDb.users || []).map(u => u.username_id);
    let count = (freshDb.users || []).length + 1;
    const cleanRole = (roleName || 'Admin').replace(/[^a-zA-Z0-9]/g, '');
    const roleCode = cleanRole.length > 0 ? cleanRole : 'Admin';
    let candidateId = `SKHC/${roleCode}/${String(count).padStart(4, '0')}/${year}`;
    
    while (existingIds.includes(candidateId)) {
      count++;
      candidateId = `SKHC/${roleCode}/${String(count).padStart(4, '0')}/${year}`;
    }
    return candidateId;
  };

  // Helper to create a new user (Main Registrar function)
  const createUser = (userData) => {
    const freshDb = getMockDB();
    const userRole = userData.role || 'Admin';
    const newUsernameId = generateUsernameId(userRole, userData.joined_year);
    
    // Generate unique 4-digit PIN or use specified pin
    const randomPin = userData.custom_pin || Math.floor(1000 + Math.random() * 9000).toString();
    const isNoLeadership = !userData.leadership_role || userData.leadership_role === 'None' || userData.leadership_role === 'Member';
    
    const newUser = {
      id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      username_id: newUsernameId,
      full_name: userData.full_name,
      email: userData.email || '',
      phone_number: userData.phone_number || '',
      role: userRole,
      leadership_role: userData.leadership_role || 'None',
      default_pin: randomPin,
      pin_changed: false,
      status: 'Active',
      profile_picture_url: userData.profile_picture_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      date_of_birth: userData.date_of_birth || '',
      address: userData.address || '',
      region: userData.region || '',
      zone_or_woreda: userData.zone_or_woreda || '',
      kebele: userData.kebele || '',
      medeb_zone: userData.medeb_zone || 'Stadium_Zuria',
      medib_number: userData.medib_number || 'Medib-1',
      round_of_leadership: isNoLeadership ? '-' : (userData.round_of_leadership || 'Term 2026'),
      created_at: new Date().toISOString()
    };

    freshDb.users.unshift(newUser);
    saveMockDB(freshDb);
    setDb(freshDb);
    return newUser;
  };

  // Update user profile data
  const updateUserProfile = (userId, updatedData) => {
    const freshDb = getMockDB();
    freshDb.users = (freshDb.users || []).map(u => {
      if (u.id === userId || u.username_id === currentUser?.username_id) {
        return { ...u, ...updatedData };
      }
      return u;
    });

    if (freshDb.church_members) {
      freshDb.church_members = freshDb.church_members.map(m => {
        if (m.username_id === currentUser?.username_id || m.id === userId) {
          return { ...m, ...updatedData };
        }
        return m;
      });
    }

    saveMockDB(freshDb);
    setDb(freshDb);
    if (currentUser) {
      setCurrentUser(prev => ({ ...prev, ...updatedData }));
    }
    return true;
  };

  // Reset PIN to 4-digit default (Main Registrar function)
  const resetUserPIN = (userId) => {
    const freshDb = getMockDB();
    const defaultPin = Math.floor(1000 + Math.random() * 9000).toString();
    freshDb.users = freshDb.users.map(u => {
      if (u.id === userId) {
        return { ...u, default_pin: defaultPin, pin_changed: false };
      }
      return u;
    });
    saveMockDB(freshDb);
    setDb(freshDb);
    return defaultPin;
  };

  // Toggle user active status
  const toggleUserStatus = (userId) => {
    const freshDb = getMockDB();
    freshDb.users = freshDb.users.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'Active' ? 'Disabled' : 'Active';
        return { ...u, status: nextStatus };
      }
      return u;
    });
    saveMockDB(freshDb);
    setDb(freshDb);
  };

  // Update & persist portal site settings and logo to Supabase database across all devices
  const updateSiteSettings = async (newSettings) => {
    const updatedSettings = await saveSiteSettingsToSupabase(newSettings);
    refreshDB();
    return updatedSettings;
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      db,
      refreshDB,
      login,
      logout,
      updatePIN,
      updateUserProfile,
      generateUsernameId,
      createUser,
      resetUserPIN,
      toggleUserStatus,
      updateSiteSettings
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
