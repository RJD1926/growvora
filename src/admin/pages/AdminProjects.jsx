import React, { useState, useMemo } from 'react';
import { 
  FiPlus, 
  FiSearch, 
  FiEdit, 
  FiTrash2, 
  FiBriefcase, 
  FiCheckCircle, 
  FiX, 
  FiImage, 
  FiTrendingUp,
  FiExternalLink
} from 'react-icons/fi';
import ConfirmModal from '../components/ConfirmModal';
import { 
  getProjects, 
  addProject, 
  updateProject, 
  deleteProject 
} from '../services/adminStorage';

const emptyProject = {
  title: '',
  category: 'Food',
  service: 'Instagram',
  handle: '',
  followers: '',
  reach: '',
  engagement: '',
  image: '',
  description: '',
  followersGrowth: '',
  reachGrowth: '',
  engagementGrowth: '',
  websiteClicks: '',
  whatWeDidText: '',
  featured: false
};

const AdminProjects = () => {
  const [projects, setProjects] = useState(() => getProjects());
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyProject);

  // Delete confirm modal
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const showNotification = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const categories = ['All', 'Beauty', 'Fitness', 'Food', 'Travel', 'Fashion'];

  // Search & Filter
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesCategory = categoryFilter === 'All' || p.category.toLowerCase() === categoryFilter.toLowerCase();
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        p.title.toLowerCase().includes(query) ||
        (p.handle && p.handle.toLowerCase().includes(query)) ||
        (p.category && p.category.toLowerCase().includes(query)) ||
        (p.service && p.service.toLowerCase().includes(query)) ||
        (p.description && p.description.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [projects, categoryFilter, searchQuery]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingId(null);
    setForm(emptyProject);
    setIsEditModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (p) => {
    setEditingId(p.id);
    setForm({
      title: p.title || '',
      category: p.category || 'Food',
      service: p.service || 'Instagram',
      handle: p.handle || '',
      followers: p.followers || '',
      reach: p.reach || '',
      engagement: p.engagement || '',
      image: p.image || '',
      description: p.description || '',
      followersGrowth: p.results?.followersGrowth || '+150%',
      reachGrowth: p.results?.reachGrowth || '+200%',
      engagementGrowth: p.results?.engagementGrowth || '+85%',
      websiteClicks: p.results?.websiteClicks || '+120%',
      whatWeDidText: Array.isArray(p.whatWeDid) ? p.whatWeDid.join('\n') : '',
      featured: Boolean(p.featured)
    });
    setIsEditModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    const whatWeDid = form.whatWeDidText
      .split('\n')
      .map(item => item.trim())
      .filter(Boolean);

    const payload = {
      title: form.title.trim(),
      category: form.category,
      service: form.service,
      handle: form.handle.trim() || `@${form.title.toLowerCase().replace(/\s+/g, '')}`,
      followers: form.followers.trim() || '15K',
      reach: form.reach.trim() || '1.5M',
      engagement: form.engagement.trim() || '8.5%',
      image: form.image.trim(),
      description: form.description.trim(),
      results: {
        followersGrowth: form.followersGrowth.trim() || '+100%',
        reachGrowth: form.reachGrowth.trim() || '+150%',
        engagementGrowth: form.engagementGrowth.trim() || '+75%',
        websiteClicks: form.websiteClicks.trim() || '+90%'
      },
      whatWeDid,
      featured: form.featured
    };

    if (editingId) {
      updateProject(editingId, payload);
      showNotification(`Case study "${payload.title}" updated.`);
    } else {
      addProject(payload);
      showNotification(`Case study "${payload.title}" created.`);
    }

    setProjects(getProjects());
    setIsEditModalOpen(false);
  };

  // Confirm delete
  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteProject(deleteTarget.id);
    setProjects(getProjects());
    showNotification(`Project "${deleteTarget.title}" deleted.`);
    setDeleteTarget(null);
  };

  return (
    <div className="admin-page-container">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="admin-toast success" role="alert">
          <FiCheckCircle />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Action Bar */}
      <div className="admin-action-bar">
        <div className="action-bar-left">
          <div className="admin-search-input-wrap">
            <FiSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search case studies by name, handle, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                type="button" 
                className="clear-search-btn" 
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <FiX />
              </button>
            )}
          </div>

          <div className="admin-filter-pills">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                className={`filter-pill-btn ${categoryFilter === cat ? 'active' : ''}`}
                onClick={() => setCategoryFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <button 
          type="button" 
          className="admin-btn admin-btn-primary"
          onClick={handleOpenCreate}
        >
          <FiPlus />
          <span>Add Case Study</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="admin-projects-grid">
        {filteredProjects.length === 0 ? (
          <div className="admin-empty-state">
            <FiBriefcase className="empty-icon" />
            <h3>No case studies found</h3>
            <p>Try modifying your search query or add a new case study to the portfolio.</p>
            <button 
              type="button" 
              className="admin-btn admin-btn-primary admin-btn-sm"
              onClick={handleOpenCreate}
            >
              <FiPlus />
              <span>Create First Case Study</span>
            </button>
          </div>
        ) : (
          filteredProjects.map((p) => (
            <div key={p.id} className="admin-project-card">
              <div className="project-media-wrap">
                <img 
                  src={p.image || '/logo.png'} 
                  alt={p.title} 
                  className="project-cover-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/logo.png';
                  }}
                />
                <span className="project-category-tag">{p.category}</span>
                {p.featured && <span className="project-featured-badge">Featured</span>}
              </div>

              <div className="project-card-body">
                <div className="project-title-header">
                  <h3 className="project-title-text">{p.title}</h3>
                  <span className="project-service-badge">{p.service}</span>
                </div>
                <span className="project-handle-text">{p.handle}</span>
                <p className="project-desc-clamp">{p.description}</p>

                {/* Key Growth Metrics */}
                <div className="project-stats-bar">
                  <div className="stat-pill">
                    <span className="stat-sub">Reach</span>
                    <span className="stat-main">{p.reach || '—'}</span>
                  </div>
                  <div className="stat-pill">
                    <span className="stat-sub">Engagement</span>
                    <span className="stat-main">{p.engagement || '—'}</span>
                  </div>
                  <div className="stat-pill">
                    <span className="stat-sub">Followers</span>
                    <span className="stat-main">{p.followers || '—'}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="project-tags-row">
                  {(p.whatWeDid || []).slice(0, 3).map((tag, idx) => (
                    <span key={idx} className="project-tag-item">{tag}</span>
                  ))}
                  {(p.whatWeDid || []).length > 3 && (
                    <span className="project-tag-more">+{p.whatWeDid.length - 3}</span>
                  )}
                </div>

                {/* Card Action footer */}
                <div className="project-card-actions">
                  <a 
                    href={`/projects`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="preview-site-link"
                  >
                    <FiExternalLink /> Public View
                  </a>
                  <div className="action-buttons-group">
                    <button 
                      type="button" 
                      className="icon-action-btn edit" 
                      onClick={() => handleOpenEdit(p)}
                      title="Edit Case Study"
                    >
                      <FiEdit />
                    </button>
                    <button 
                      type="button" 
                      className="icon-action-btn delete" 
                      onClick={() => setDeleteTarget({ id: p.id, title: p.title })}
                      title="Delete Case Study"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isEditModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="admin-modal-container modal-wide" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div className="modal-title-wrap">
                <FiBriefcase className="modal-header-icon" />
                <h3>{editingId ? 'Edit Project Case Study' : 'Create New Case Study'}</h3>
              </div>
              <button 
                type="button" 
                className="modal-close-btn" 
                onClick={() => setIsEditModalOpen(false)}
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="admin-modal-form">
              <div className="form-grid-2col">
                <div className="form-group">
                  <label>Brand / Client Title *</label>
                  <input 
                    type="text" 
                    name="title" 
                    value={form.title} 
                    onChange={handleChange} 
                    required 
                    placeholder="e.g. Lumina Aesthetics" 
                  />
                </div>

                <div className="form-group">
                  <label>Social Handle / Domain</label>
                  <input 
                    type="text" 
                    name="handle" 
                    value={form.handle} 
                    onChange={handleChange} 
                    placeholder="e.g. @lumina.aesthetics" 
                  />
                </div>

                <div className="form-group">
                  <label>Industry Category</label>
                  <select name="category" value={form.category} onChange={handleChange}>
                    <option value="Beauty">Beauty & Wellness</option>
                    <option value="Fitness">Fitness & Sports</option>
                    <option value="Food">Food & Hospitality</option>
                    <option value="Travel">Travel & Lifestyle</option>
                    <option value="Fashion">Fashion & Luxury</option>
                    <option value="SaaS">SaaS & Tech</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Primary Service</label>
                  <select name="service" value={form.service} onChange={handleChange}>
                    <option value="Instagram">Instagram Management</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Graphic Design">Graphic Design</option>
                    <option value="Branding">Brand Identity</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Image URL (Cover Photo)</label>
                  <div className="input-with-preview">
                    <input 
                      type="url" 
                      name="image" 
                      value={form.image} 
                      onChange={handleChange} 
                      placeholder="https://... or /logo.png" 
                    />
                    {form.image && (
                      <div className="image-live-preview-box">
                        <img 
                          src={form.image} 
                          alt="Preview" 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/logo.png';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Executive Summary / Narrative</label>
                  <textarea 
                    rows={3} 
                    name="description" 
                    value={form.description} 
                    onChange={handleChange} 
                    placeholder="Describe how GrowVora transformed this brand's market performance..." 
                  />
                </div>

                {/* Top Metrics Row */}
                <div className="form-group">
                  <label>Audience / Followers</label>
                  <input 
                    type="text" 
                    name="followers" 
                    value={form.followers} 
                    onChange={handleChange} 
                    placeholder="e.g. 15.2K" 
                  />
                </div>

                <div className="form-group">
                  <label>Monthly Reach</label>
                  <input 
                    type="text" 
                    name="reach" 
                    value={form.reach} 
                    onChange={handleChange} 
                    placeholder="e.g. 2.1M" 
                  />
                </div>

                <div className="form-group">
                  <label>Engagement Rate</label>
                  <input 
                    type="text" 
                    name="engagement" 
                    value={form.engagement} 
                    onChange={handleChange} 
                    placeholder="e.g. 9.8%" 
                  />
                </div>

                <div className="form-group">
                  <label>Followers Growth Lift</label>
                  <input 
                    type="text" 
                    name="followersGrowth" 
                    value={form.followersGrowth} 
                    onChange={handleChange} 
                    placeholder="+185%" 
                  />
                </div>

                <div className="form-group">
                  <label>Reach Growth Lift</label>
                  <input 
                    type="text" 
                    name="reachGrowth" 
                    value={form.reachGrowth} 
                    onChange={handleChange} 
                    placeholder="+210%" 
                  />
                </div>

                <div className="form-group">
                  <label>Website Clicks Lift</label>
                  <input 
                    type="text" 
                    name="websiteClicks" 
                    value={form.websiteClicks} 
                    onChange={handleChange} 
                    placeholder="+140%" 
                  />
                </div>

                <div className="form-group full-width">
                  <label>Deliverables Executed (What We Did - One per line)</label>
                  <textarea 
                    rows={4} 
                    name="whatWeDidText" 
                    value={form.whatWeDidText} 
                    onChange={handleChange} 
                    placeholder="Visual Identity Refresh&#10;Educational Reels Production&#10;Micro-Influencer Seeding&#10;Community Management" 
                  />
                </div>

                <div className="form-group checkbox-group full-width">
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      name="featured" 
                      checked={form.featured} 
                      onChange={handleChange} 
                    />
                    <span>Feature in Homepage Editorial Showcase</span>
                  </label>
                </div>
              </div>

              <div className="admin-modal-actions">
                <button 
                  type="button" 
                  className="admin-btn admin-btn-secondary" 
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  {editingId ? 'Save Case Study' : 'Publish Case Study'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Case Study"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"? This cannot be undone.`}
        confirmText="Delete Record"
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default AdminProjects;

