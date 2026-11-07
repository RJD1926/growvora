import React from 'react';
import { 
  FiHome, 
  FiLayout, 
  FiLayers, 
  FiBriefcase, 
  FiUsers, 
  FiStar, 
  FiInbox, 
  FiExternalLink, 
  FiLogOut, 
  FiX,
  FiShield
} from 'react-icons/fi';

const AdminSidebar = ({ 
  activeTab, 
  setActiveTab, 
  inquiriesCount = 0, 
  onLogout, 
  adminUser,
  isMobileOpen,
  setIsMobileOpen
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiHome },
    { id: 'content', label: 'Website Content', icon: FiLayout },
    { id: 'services', label: 'Services', icon: FiLayers },
    { id: 'projects', label: 'Projects & Work', icon: FiBriefcase },
    { id: 'team', label: 'Team Members', icon: FiUsers },
    { id: 'testimonials', label: 'Testimonials', icon: FiStar },
    { 
      id: 'inquiries', 
      label: 'Inquiries & Leads', 
      icon: FiInbox,
      badge: inquiriesCount > 0 ? inquiriesCount : null 
    },
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isMobileOpen && (
        <div 
          className="admin-mobile-backdrop" 
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside className={`admin-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        {/* Brand Header */}
        <div className="admin-sidebar-header">
          <div className="admin-brand-lockup">
            <img src="/logo.png" alt="GrowVora Logo" className="admin-logo-img" />
            <div className="admin-brand-text">
              <span className="brand-title">GROWVORA</span>
              <span className="brand-badge">ADMIN</span>
            </div>
          </div>
          <button 
            type="button" 
            className="admin-mobile-close-btn"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close navigation"
          >
            <FiX />
          </button>
        </div>

        {/* Status / Role pill */}
        <div className="admin-sidebar-status">
          <div className="status-dot-pulse" />
          <span>PORTAL ACTIVE // ENCRYPTED</span>
        </div>

        {/* Nav Items */}
        <nav className="admin-nav-menu">
          <div className="nav-group-label">MANAGEMENT CONSOLE</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`admin-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <span className="nav-icon-wrap">
                  <Icon />
                </span>
                <span className="nav-label">{item.label}</span>
                {item.badge && (
                  <span className="nav-badge-pill">{item.badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="admin-sidebar-footer">
          <a 
            href="/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="admin-footer-btn live-site-link"
          >
            <FiExternalLink />
            <span>View Public Site</span>
          </a>

          {/* User Info Card */}
          <div className="admin-user-card">
            <img 
              src={adminUser?.avatar || '/imgs/harshil.png'} 
              alt={adminUser?.name || 'Admin'} 
              className="admin-avatar-small"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/logo.png';
              }}
            />
            <div className="admin-user-details">
              <span className="admin-user-name">{adminUser?.name || 'Administrator'}</span>
              <span className="admin-user-email">{adminUser?.email || 'admin@growvora.me'}</span>
            </div>
          </div>

          <button 
            type="button" 
            className="admin-logout-btn" 
            onClick={onLogout}
          >
            <FiLogOut />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;

