import React, { useState, useMemo } from 'react';
import { 
  FiPlus, 
  FiSearch, 
  FiEdit, 
  FiTrash2, 
  FiCheck, 
  FiX, 
  FiLayers, 
  FiCheckCircle, 
  FiArrowUpRight,
  FiFilter
} from 'react-icons/fi';
import ConfirmModal from '../components/ConfirmModal';
import { 
  getServices, 
  addService, 
  updateService, 
  deleteService 
} from '../services/adminStorage';

const emptyService = {
  title: '',
  subtitle: '',
  description: '',
  category: 'Social Media',
  path: '',
  featuresText: '',
  icon: 'instagram',
  status: 'Active',
  featured: true
};

const AdminServices = () => {
  const [services, setServices] = useState(() => getServices());
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [form, setForm] = useState(emptyService);
  
  // Delete confirm modal state
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, title }
  const [toastMessage, setToastMessage] = useState('');

  const showNotification = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Filter & Search
  const filteredServices = useMemo(() => {
    return services.filter(srv => {
      const matchesCategory = categoryFilter === 'All' || srv.category === categoryFilter;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        srv.title.toLowerCase().includes(query) ||
        (srv.subtitle && srv.subtitle.toLowerCase().includes(query)) ||
        (srv.description && srv.description.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [services, categoryFilter, searchQuery]);

  const categories = ['All', 'Social Media', 'Engineering', 'Design', 'Marketing'];

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingServiceId(null);
    setForm(emptyService);
    setIsEditModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (srv) => {
    setEditingServiceId(srv.id);
    setForm({
      title: srv.title || '',
      subtitle: srv.subtitle || '',
      description: srv.description || '',
      category: srv.category || 'Social Media',
      path: srv.path || '',
      featuresText: Array.isArray(srv.features) ? srv.features.join('\n') : '',
      icon: srv.icon || 'instagram',
      status: srv.status || 'Active',
      featured: Boolean(srv.featured)
    });
    setIsEditModalOpen(true);
  };

  // Handle Form Change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Save Service (Create or Update)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    const features = form.featuresText
      .split('\n')
      .map(f => f.trim())
      .filter(Boolean);

    const payload = {
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      description: form.description.trim(),
      category: form.category,
      path: form.path.trim() || `/${form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      features,
      icon: form.icon,
      status: form.status,
      featured: form.featured
    };

    if (editingServiceId) {
      updateService(editingServiceId, payload);
      showNotification(`Service "${payload.title}" updated successfully.`);
    } else {
      addService(payload);
      showNotification(`Service "${payload.title}" created successfully.`);
    }

    setServices(getServices());
    setIsEditModalOpen(false);
  };

  // Delete Service
  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteService(deleteTarget.id);
    setServices(getServices());
    showNotification(`Service "${deleteTarget.title}" deleted.`);
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
              placeholder="Search services by title or keyword..."
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
          <span>Add New Service</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="admin-cards-grid">
        {filteredServices.length === 0 ? (
          <div className="admin-empty-state">
            <FiLayers className="empty-icon" />
            <h3>No services found</h3>
            <p>Try adjusting your search query or category filter, or create a new service.</p>
            <button 
              type="button" 
              className="admin-btn admin-btn-primary admin-btn-sm"
              onClick={handleOpenCreate}
            >
              <FiPlus />
              <span>Create First Service</span>
            </button>
          </div>
        ) : (
          filteredServices.map((srv) => (
            <div key={srv.id} className="admin-item-card">
              <div className="card-top-row">
                <span className="card-category-badge">{srv.category}</span>
                <div className="card-status-badges">
                  <span className={`status-pill ${srv.status === 'Active' ? 'active' : 'draft'}`}>
                    {srv.status}
                  </span>
                  {srv.featured && <span className="featured-pill">Featured</span>}
                </div>
              </div>

              <h3 className="card-title">{srv.title}</h3>
              {srv.subtitle && <p className="card-subtitle-text">{srv.subtitle}</p>}
              <p className="card-description-text">{srv.description}</p>

              {/* Feature Tags */}
              <div className="card-tags-list">
                {(srv.features || []).map((feat, idx) => (
                  <span key={idx} className="feature-chip">
                    <FiCheck /> {feat}
                  </span>
                ))}
              </div>

              {/* Card Footer Actions */}
              <div className="card-footer-actions">
                <span className="service-path-tag">{srv.path}</span>
                <div className="action-buttons-group">
                  <button 
                    type="button" 
                    className="icon-action-btn edit" 
                    onClick={() => handleOpenEdit(srv)}
                    title="Edit Service"
                  >
                    <FiEdit />
                  </button>
                  <button 
                    type="button" 
                    className="icon-action-btn delete" 
                    onClick={() => setDeleteTarget({ id: srv.id, title: srv.title })}
                    title="Delete Service"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isEditModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="admin-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div className="modal-title-wrap">
                <FiLayers className="modal-header-icon" />
                <h3>{editingServiceId ? 'Edit Service' : 'Add New Service'}</h3>
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
                <div className="form-group full-width">
                  <label>Service Title *</label>
                  <input 
                    type="text" 
                    name="title" 
                    value={form.title} 
                    onChange={handleChange} 
                    required 
                    placeholder="e.g. Instagram Management" 
                  />
                </div>

                <div className="form-group full-width">
                  <label>Subtitle / One-line Hook</label>
                  <input 
                    type="text" 
                    name="subtitle" 
                    value={form.subtitle} 
                    onChange={handleChange} 
                    placeholder="e.g. Organic Growth, Content Strategy & Reels" 
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select name="category" value={form.category} onChange={handleChange}>
                    <option value="Social Media">Social Media</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Public Route / Path</label>
                  <input 
                    type="text" 
                    name="path" 
                    value={form.path} 
                    onChange={handleChange} 
                    placeholder="/instagram-management" 
                  />
                </div>

                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea 
                    rows={3} 
                    name="description" 
                    value={form.description} 
                    onChange={handleChange} 
                    placeholder="Detailed explanation of what this service delivers..." 
                  />
                </div>

                <div className="form-group full-width">
                  <label>Features & Key Deliverables (One per line)</label>
                  <textarea 
                    rows={4} 
                    name="featuresText" 
                    value={form.featuresText} 
                    onChange={handleChange} 
                    placeholder="Custom Content Calendars&#10;Short-form Video Production&#10;Audience Community Management&#10;Paid Ad Strategy" 
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select name="status" value={form.status} onChange={handleChange}>
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>

                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      name="featured" 
                      checked={form.featured} 
                      onChange={handleChange} 
                    />
                    <span>Highlight on Homepage</span>
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
                  {editingServiceId ? 'Save Changes' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Service"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"? This cannot be undone.`}
        confirmText="Delete Service"
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default AdminServices;

