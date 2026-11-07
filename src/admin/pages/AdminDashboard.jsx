import React from 'react';
import { 
  FiBriefcase, 
  FiLayers, 
  FiUsers, 
  FiStar, 
  FiInbox, 
  FiTrendingUp, 
  FiArrowUpRight, 
  FiCheckCircle, 
  FiClock, 
  FiPlus, 
  FiChevronRight,
  FiActivity,
  FiDatabase,
  FiRefreshCw,
  FiCloud
} from 'react-icons/fi';
import { isSupabaseConfigured } from '../services/supabaseClient';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';

const chartData = [
  { month: 'Jun', inquiries: 14, impressions: '2.8M', reachGrowth: 40 },
  { month: 'Jul', inquiries: 22, impressions: '4.2M', reachGrowth: 58 },
  { month: 'Aug', inquiries: 29, impressions: '6.5M', reachGrowth: 72 },
  { month: 'Sep', inquiries: 38, impressions: '8.9M', reachGrowth: 85 },
  { month: 'Oct', inquiries: 47, impressions: '11.4M', reachGrowth: 110 },
  { month: 'Nov', inquiries: 56, impressions: '12.8M', reachGrowth: 135 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-custom-tooltip">
        <p className="tooltip-title">{label} 2026</p>
        <p className="tooltip-value highlight">
          <span>Inquiries:</span> <strong>{payload[0].value} leads</strong>
        </p>
        <p className="tooltip-value muted">
          <span>Brand Reach:</span> <strong>{payload[0].payload.impressions}</strong>
        </p>
      </div>
    );
  }
  return null;
};

const AdminDashboard = ({ 
  stats, 
  projects = [], 
  services = [], 
  team = [], 
  testimonials = [], 
  inquiries = [], 
  setActiveTab,
  onResetDefaults,
  onOpenCloudSync
}) => {
  const hasCloud = isSupabaseConfigured();
  const newInquiries = inquiries.filter(i => i.status === 'New');
  const recentInquiries = inquiries.slice(0, 5);
  const recentProjects = projects.slice(0, 4);

  return (
    <div className="admin-dashboard-view">
      {/* Top Welcome Banner */}
      <div className="dashboard-hero-banner">
        <div className="banner-text">
          <span className="banner-tag">GROWVORA EXECUTIVE CONSOLE</span>
          <h2>Welcome back, Harshil</h2>
          <p>
            Your digital growth operations are running smoothly. You have{' '}
            <strong className="text-electric">{newInquiries.length} pending new {newInquiries.length === 1 ? 'inquiry' : 'inquiries'}</strong>{' '}
            requiring review today.
          </p>
        </div>
        <div className="banner-actions">
          <button 
            type="button" 
            className="admin-btn admin-btn-primary"
            onClick={() => setActiveTab('inquiries')}
          >
            <FiInbox />
            <span>Review Leads ({newInquiries.length})</span>
          </button>
          <button 
            type="button" 
            className="admin-btn admin-btn-secondary"
            onClick={() => setActiveTab('projects')}
          >
            <FiPlus />
            <span>Add Project</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card glow-card" onClick={() => setActiveTab('projects')}>
          <div className="stat-card-header">
            <span className="stat-label">Total Projects</span>
            <div className="stat-icon-wrap electric">
              <FiBriefcase />
            </div>
          </div>
          <div className="stat-number-row">
            <span className="stat-number">{projects.length}</span>
            <span className="stat-growth-tag positive">
              <FiTrendingUp /> +32%
            </span>
          </div>
          <div className="stat-footer-text">
            <span>Across Instagram, Web & Branding</span>
            <FiChevronRight className="stat-arrow" />
          </div>
        </div>

        <div className="admin-stat-card" onClick={() => setActiveTab('services')}>
          <div className="stat-card-header">
            <span className="stat-label">Active Services</span>
            <div className="stat-icon-wrap cyan">
              <FiLayers />
            </div>
          </div>
          <div className="stat-number-row">
            <span className="stat-number">{services.filter(s => s.status === 'Active').length}</span>
            <span className="stat-growth-tag neutral">All Active</span>
          </div>
          <div className="stat-footer-text">
            <span>High-performing disciplines</span>
            <FiChevronRight className="stat-arrow" />
          </div>
        </div>

        <div className="admin-stat-card" onClick={() => setActiveTab('team')}>
          <div className="stat-card-header">
            <span className="stat-label">Team Collective</span>
            <div className="stat-icon-wrap purple">
              <FiUsers />
            </div>
          </div>
          <div className="stat-number-row">
            <span className="stat-number">{team.length}</span>
            <span className="stat-growth-tag positive">6 Specialists</span>
          </div>
          <div className="stat-footer-text">
            <span>Leadership, Design & Tech</span>
            <FiChevronRight className="stat-arrow" />
          </div>
        </div>

        <div className="admin-stat-card" onClick={() => setActiveTab('inquiries')}>
          <div className="stat-card-header">
            <span className="stat-label">Client Inquiries</span>
            <div className="stat-icon-wrap orange">
              <FiInbox />
            </div>
          </div>
          <div className="stat-number-row">
            <span className="stat-number">{inquiries.length}</span>
            <span className="stat-growth-tag alert">
              {newInquiries.length} New
            </span>
          </div>
          <div className="stat-footer-text">
            <span>Lead pipeline & submissions</span>
            <FiChevronRight className="stat-arrow" />
          </div>
        </div>

        <div className="admin-stat-card" onClick={() => setActiveTab('testimonials')}>
          <div className="stat-card-header">
            <span className="stat-label">Client Reviews</span>
            <div className="stat-icon-wrap gold">
              <FiStar />
            </div>
          </div>
          <div className="stat-number-row">
            <span className="stat-number">{testimonials.length}</span>
            <span className="stat-growth-tag positive">5.0 ★ Rating</span>
          </div>
          <div className="stat-footer-text">
            <span>Verified client endorsements</span>
            <FiChevronRight className="stat-arrow" />
          </div>
        </div>

        <div className="admin-stat-card" onClick={() => setActiveTab('content')}>
          <div className="stat-card-header">
            <span className="stat-label">Monthly Impressions</span>
            <div className="stat-icon-wrap electric">
              <FiActivity />
            </div>
          </div>
          <div className="stat-number-row">
            <span className="stat-number">12.8M</span>
            <span className="stat-growth-tag positive">3.4x Lift</span>
          </div>
          <div className="stat-footer-text">
            <span>Agency performance manifesto</span>
            <FiChevronRight className="stat-arrow" />
          </div>
        </div>
      </div>

      {/* Main 2-Column Analytics & Recent Work Section */}
      <div className="admin-grid-2col">
        {/* Growth & Inquiries Chart */}
        <div className="admin-card chart-card">
          <div className="card-header-flex">
            <div>
              <h3>Inquiry Pipeline & Growth Velocity</h3>
              <p className="card-sub">Monthly verified lead submissions and campaign impressions</p>
            </div>
            <div className="chart-legend-badge">
              <span className="legend-dot" />
              <span>Inquiries (2026)</span>
            </div>
          </div>

          <div className="chart-container-box">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C6FF3B" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#C6FF3B" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="month" stroke="#8A8A8A" fontSize={12} tickLine={false} />
                <YAxis stroke="#8A8A8A" fontSize={12} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="inquiries" 
                  stroke="#C6FF3B" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#growthGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-footer-metrics">
            <div className="metric-col">
              <span className="m-label">Conversion Rate</span>
              <span className="m-val text-electric">28.4%</span>
            </div>
            <div className="metric-col">
              <span className="m-label">Avg. Deal Value</span>
              <span className="m-val">₹1,25,000</span>
            </div>
            <div className="metric-col">
              <span className="m-label">Response Time</span>
              <span className="m-val">&lt; 3 Hours</span>
            </div>
            <div className="metric-col">
              <span className="m-label">Organic Share</span>
              <span className="m-val">76%</span>
            </div>
          </div>
        </div>

        {/* Quick Actions & Storage Status */}
        <div className="admin-card quick-actions-card">
          <div className="card-header-flex">
            <div>
              <h3>Fast Operations</h3>
              <p className="card-sub">One-click management shortcuts</p>
            </div>
          </div>

          <div className="action-buttons-stack">
            <button 
              type="button" 
              className="quick-action-row"
              onClick={() => setActiveTab('projects')}
            >
              <div className="qa-icon electric"><FiBriefcase /></div>
              <div className="qa-text">
                <strong>Create New Case Study</strong>
                <span>Add project results, imagery & metrics</span>
              </div>
              <FiArrowUpRight className="qa-arrow" />
            </button>

            <button 
              type="button" 
              className="quick-action-row"
              onClick={() => setActiveTab('content')}
            >
              <div className="qa-icon cyan"><FiDatabase /></div>
              <div className="qa-text">
                <strong>Update Website Copy</strong>
                <span>Edit Hero headlines, metrics & contact info</span>
              </div>
              <FiArrowUpRight className="qa-arrow" />
            </button>

            <button 
              type="button" 
              className="quick-action-row"
              onClick={() => setActiveTab('services')}
            >
              <div className="qa-icon purple"><FiLayers /></div>
              <div className="qa-text">
                <strong>Manage Agency Services</strong>
                <span>Add disciplines, features & descriptions</span>
              </div>
              <FiArrowUpRight className="qa-arrow" />
            </button>

            <button 
              type="button" 
              className="quick-action-row"
              onClick={() => setActiveTab('testimonials')}
            >
              <div className="qa-icon gold"><FiStar /></div>
              <div className="qa-text">
                <strong>Add Client Testimonial</strong>
                <span>Showcase ratings and client quotes</span>
              </div>
              <FiArrowUpRight className="qa-arrow" />
            </button>
          </div>

          {/* Cloud Database & Local Persistence Box */}
          <div className="storage-status-box">
            <div className="status-top">
              <span className={`storage-dot ${hasCloud ? 'cloud-active' : ''}`} />
              <strong>{hasCloud ? 'Supabase Real-Time Cloud Sync Active' : 'Local Persistence (Offline Mode)'}</strong>
            </div>
            <p>
              {hasCloud 
                ? 'Your changes automatically sync to Supabase so visitors across mobile and desktop devices see updates in real-time.' 
                : 'Modifications are saved locally. Connect Supabase to sync your changes so everyone on other laptops and phones sees them.'}
            </p>
            <div className="status-footer-actions">
              {onOpenCloudSync && (
                <button
                  type="button"
                  className="cloud-sync-trigger-btn"
                  onClick={onOpenCloudSync}
                >
                  <FiCloud />
                  <span>{hasCloud ? 'Cloud DB Settings' : 'Connect Cloud Database'}</span>
                </button>
              )}
              <button 
                type="button" 
                className="reset-defaults-link"
                onClick={onResetDefaults}
                title="Reset all demo data back to defaults"
              >
                <FiRefreshCw />
                <span>Reset Demo Seed Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Inquiries and Spotlight Projects */}
      <div className="admin-grid-2col bottom-grid">
        {/* Recent Inquiries List */}
        <div className="admin-card">
          <div className="card-header-flex">
            <div>
              <h3>Recent Inquiries</h3>
              <p className="card-sub">Latest leads received from potential clients</p>
            </div>
            <button 
              type="button" 
              className="view-all-link-btn"
              onClick={() => setActiveTab('inquiries')}
            >
              <span>View All</span>
              <FiChevronRight />
            </button>
          </div>

          <div className="recent-inquiries-list">
            {recentInquiries.length === 0 ? (
              <div className="empty-state-small">No inquiries yet.</div>
            ) : (
              recentInquiries.map((inq) => (
                <div key={inq.id} className="inquiry-mini-card" onClick={() => setActiveTab('inquiries')}>
                  <div className="inq-avatar-circle">
                    {inq.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="inq-mini-content">
                    <div className="inq-title-row">
                      <span className="inq-client-name">{inq.fullName}</span>
                      <span className={`status-badge status-${inq.status.toLowerCase().replace(/\s+/g, '-')}`}>
                        {inq.status}
                      </span>
                    </div>
                    <div className="inq-details-row">
                      <span>{inq.company || inq.email}</span>
                      <span className="bullet-sep">•</span>
                      <span className="inq-service-tag">{inq.service}</span>
                    </div>
                  </div>
                  <FiChevronRight className="inq-arrow" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Projects Showcase */}
        <div className="admin-card">
          <div className="card-header-flex">
            <div>
              <h3>Portfolio Showcase</h3>
              <p className="card-sub">Active client case studies on the live website</p>
            </div>
            <button 
              type="button" 
              className="view-all-link-btn"
              onClick={() => setActiveTab('projects')}
            >
              <span>Manage All</span>
              <FiChevronRight />
            </button>
          </div>

          <div className="recent-projects-list">
            {recentProjects.map((p) => (
              <div key={p.id} className="project-mini-row" onClick={() => setActiveTab('projects')}>
                <img 
                  src={p.image || '/logo.png'} 
                  alt={p.title} 
                  className="project-thumb-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/logo.png';
                  }}
                />
                <div className="project-mini-info">
                  <span className="project-name">{p.title}</span>
                  <span className="project-cat">{p.category} // {p.service}</span>
                </div>
                <div className="project-reach-badge">
                  <span>Reach: <strong>{p.reach || '1M+'}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

