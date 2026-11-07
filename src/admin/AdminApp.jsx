import React, { useState, useEffect } from 'react';
import { 
  checkAuth, 
  getAdminUser, 
  logoutAdmin, 
  ADMIN_CREDENTIALS 
} from './services/adminAuth';
import { 
  getContent, 
  getServices, 
  getProjects, 
  getTeam, 
  getTestimonials, 
  getInquiries,
  resetToDefaults
} from './services/adminStorage';

import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';
import ConfirmModal from './components/ConfirmModal';
import CloudSyncModal from './components/CloudSyncModal';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminContent from './pages/AdminContent';
import AdminServices from './pages/AdminServices';
import AdminProjects from './pages/AdminProjects';
import AdminTeam from './pages/AdminTeam';
import AdminTestimonials from './pages/AdminTestimonials';
import AdminInquiries from './pages/AdminInquiries';

import './AdminApp.scss';

const AdminApp = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => checkAuth());
  const [adminUser, setAdminUser] = useState(() => getAdminUser());
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isCloudModalOpen, setIsCloudModalOpen] = useState(false);

  // Live state from localStorage
  const [content, setContent] = useState(() => getContent());
  const [services, setServices] = useState(() => getServices());
  const [projects, setProjects] = useState(() => getProjects());
  const [team, setTeam] = useState(() => getTeam());
  const [testimonials, setTestimonials] = useState(() => getTestimonials());
  const [inquiries, setInquiries] = useState(() => getInquiries());

  // Reload data from local storage
  const reloadAllData = () => {
    setContent(getContent());
    setServices(getServices());
    setProjects(getProjects());
    setTeam(getTeam());
    setTestimonials(getTestimonials());
    setInquiries(getInquiries());
  };

  useEffect(() => {
    // Listen for storage / cross-tab / cross-component updates
    const handleDataUpdate = () => {
      reloadAllData();
    };

    const handleAuthChange = (e) => {
      const isAuthed = e.detail?.authenticated ?? checkAuth();
      setIsAuthenticated(isAuthed);
      setAdminUser(getAdminUser());
    };

    window.addEventListener('growvora_data_updated', handleDataUpdate);
    window.addEventListener('growvora_auth_state_changed', handleAuthChange);

    return () => {
      window.removeEventListener('growvora_data_updated', handleDataUpdate);
      window.removeEventListener('growvora_auth_state_changed', handleAuthChange);
    };
  }, []);

  // Handle Login success
  const handleLoginSuccess = (user) => {
    setIsAuthenticated(true);
    setAdminUser(user);
    setActiveTab('dashboard');
  };

  // Handle Logout
  const handleConfirmLogout = () => {
    logoutAdmin();
    setIsAuthenticated(false);
    setAdminUser(null);
    setIsLogoutModalOpen(false);
  };

  // Handle Reset Demo Data
  const handleConfirmReset = () => {
    resetToDefaults();
    reloadAllData();
    setIsResetModalOpen(false);
  };

  // Quick Add router
  const handleQuickAdd = () => {
    if (activeTab === 'dashboard') setActiveTab('projects');
    // If on a specific tab, that tab's header button or modal is already available
  };

  // If not authenticated, show login page
  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  const unreadInquiriesCount = inquiries.filter(i => i.status === 'New').length;

  return (
    <div className="growvora-admin-layout">
      {/* Sidebar Navigation */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        inquiriesCount={unreadInquiriesCount}
        onLogout={() => setIsLogoutModalOpen(true)}
        adminUser={adminUser}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Admin Workspace Area */}
      <div className="admin-main-wrapper">
        <AdminHeader
          activeTab={activeTab}
          setIsMobileOpen={setIsMobileOpen}
          onLogout={() => setIsLogoutModalOpen(true)}
          adminUser={adminUser}
          onQuickAdd={activeTab === 'dashboard' ? handleQuickAdd : null}
          onOpenCloudSync={() => setIsCloudModalOpen(true)}
        />

        <main className="admin-content-area">
          {activeTab === 'dashboard' && (
            <AdminDashboard
              projects={projects}
              services={services}
              team={team}
              testimonials={testimonials}
              inquiries={inquiries}
              setActiveTab={setActiveTab}
              onResetDefaults={() => setIsResetModalOpen(true)}
              onOpenCloudSync={() => setIsCloudModalOpen(true)}
            />
          )}

          {activeTab === 'content' && <AdminContent />}

          {activeTab === 'services' && <AdminServices />}

          {activeTab === 'projects' && <AdminProjects />}

          {activeTab === 'team' && <AdminTeam />}

          {activeTab === 'testimonials' && <AdminTestimonials />}

          {activeTab === 'inquiries' && <AdminInquiries />}
        </main>
      </div>

      {/* LOGOUT CONFIRMATION MODAL */}
      <ConfirmModal
        isOpen={isLogoutModalOpen}
        title="Sign Out of Admin Console"
        message="Are you sure you want to log out? Your session will end."
        confirmText="Sign Out"
        isDanger={false}
        onConfirm={handleConfirmLogout}
        onClose={() => setIsLogoutModalOpen(false)}
      />

      {/* RESET TO DEFAULTS CONFIRMATION MODAL */}
      <ConfirmModal
        isOpen={isResetModalOpen}
        title="Reset Demo Data to Defaults"
        message="This will restore all default projects, services, team members, testimonials, inquiries, and website copy to their original state. Continue?"
        confirmText="Reset All Data"
        isDanger={true}
        onConfirm={handleConfirmReset}
        onClose={() => setIsResetModalOpen(false)}
      />

      {/* CLOUD DATABASE SYNC MODAL */}
      <CloudSyncModal
        isOpen={isCloudModalOpen}
        onClose={() => setIsCloudModalOpen(false)}
      />
    </div>
  );
};

export default AdminApp;

