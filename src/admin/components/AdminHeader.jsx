import React from 'react';
import { 
  FiMenu, 
  FiExternalLink, 
  FiLogOut, 
  FiPlus, 
  FiCheckCircle, 
  FiShield
} from 'react-icons/fi';

const sectionTitles = {
  dashboard: { title: 'Dashboard Overview', desc: 'Real-time performance, quick statistics, and recent activity' },
  content: { title: 'Website Content', desc: 'Hero section, manifesto, metrics, and agency contact details' },
  services: { title: 'Services Management', desc: 'Manage agency service pillars, features, and public visibility' },
  projects: { title: 'Projects & Case Studies', desc: 'Portfolio entries, campaign metrics, and client deliverables' },
  team: { title: 'Team Collective', desc: 'Manage founders, strategists, designers, and engineers' },
  testimonials: { title: 'Client Testimonials', desc: 'Manage client reviews, star ratings, and featured endorsements' },
  inquiries: { title: 'Inquiries & Leads', desc: 'Client project submissions, status tracking, and internal follow-up notes' },
};

const AdminHeader = ({ 
  activeTab, 
  setIsMobileOpen, 
  onLogout,
  adminUser,
  onQuickAdd
}) => {
  const current = sectionTitles[activeTab] || { title: 'Admin Panel', desc: 'GrowVora Digital Studio Management' };

  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <button 
          type="button" 
          className="admin-hamburger-btn" 
          onClick={() => setIsMobileOpen(true)}
          aria-label="Open mobile menu"
        >
          <FiMenu />
        </button>

        <div className="admin-header-title-block">
          <div className="admin-breadcrumb">
            <span className="crumb-root">GROWVORA</span>
            <span className="crumb-separator">/</span>
            <span className="crumb-current">{current.title}</span>
          </div>
          <h1 className="admin-page-heading">{current.title}</h1>
          <p className="admin-page-desc">{current.desc}</p>
        </div>
      </div>

      <div className="admin-header-right">
        {onQuickAdd && (
          <button 
            type="button" 
            className="admin-btn admin-btn-primary admin-btn-sm header-quick-add"
            onClick={onQuickAdd}
          >
            <FiPlus />
            <span>Create New</span>
          </button>
        )}

        <a 
          href="/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="admin-btn admin-btn-secondary admin-btn-sm header-site-btn"
          title="Open live public website"
        >
          <FiExternalLink />
          <span className="hide-on-mobile">Live Website</span>
        </a>

        <div className="header-admin-badge hide-on-mobile">
          <span className="badge-dot" />
          <span>{adminUser?.email || 'admin@growvora.me'}</span>
        </div>

        <button 
          type="button" 
          className="header-logout-btn" 
          onClick={onLogout}
          title="Sign Out"
          aria-label="Sign Out"
        >
          <FiLogOut />
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;

