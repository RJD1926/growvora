import React, { useState, useMemo } from 'react';
import { 
  FiPlus, 
  FiSearch, 
  FiEdit, 
  FiTrash2, 
  FiStar, 
  FiCheckCircle, 
  FiX, 
  FiMessageSquare,
  FiUser
} from 'react-icons/fi';
import ConfirmModal from '../components/ConfirmModal';
import { 
  getTestimonials, 
  addTestimonial, 
  updateTestimonial, 
  deleteTestimonial 
} from '../services/adminStorage';

const emptyTestimonial = {
  clientName: '',
  clientRole: '',
  company: '',
  avatar: '',
  rating: 5,
  quote: '',
  projectOrService: '',
  date: new Date().toISOString().split('T')[0],
  featured: false
};

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState(() => getTestimonials());
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState('All');

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyTestimonial);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const showNotification = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const ratings = ['All', '5 Stars', '4 Stars'];

  // Filter & Search
  const filteredTestimonials = useMemo(() => {
    return testimonials.filter(t => {
      const matchesRating = ratingFilter === 'All' || 
        (ratingFilter === '5 Stars' && t.rating === 5) ||
        (ratingFilter === '4 Stars' && t.rating === 4);
      
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        t.clientName.toLowerCase().includes(query) ||
        (t.company && t.company.toLowerCase().includes(query)) ||
        (t.quote && t.quote.toLowerCase().includes(query)) ||
        (t.projectOrService && t.projectOrService.toLowerCase().includes(query));
      
      return matchesRating && matchesSearch;
    });
  }, [testimonials, ratingFilter, searchQuery]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingId(null);
    setForm(emptyTestimonial);
    setIsEditModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (t) => {
    setEditingId(t.id);
    setForm({
      clientName: t.clientName || '',
      clientRole: t.clientRole || '',
      company: t.company || '',
      avatar: t.avatar || '',
      rating: t.rating || 5,
      quote: t.quote || '',
      projectOrService: t.projectOrService || '',
      date: t.date || new Date().toISOString().split('T')[0],
      featured: Boolean(t.featured)
    });
    setIsEditModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'rating' ? Number(value) : value)
    }));
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.clientName.trim() || !form.quote.trim()) return;

    const payload = {
      clientName: form.clientName.trim(),
      clientRole: form.clientRole.trim(),
      company: form.company.trim(),
      avatar: form.avatar.trim(),
      rating: Number(form.rating) || 5,
      quote: form.quote.trim(),
      projectOrService: form.projectOrService.trim(),
      date: form.date,
      featured: form.featured
    };

    if (editingId) {
      updateTestimonial(editingId, payload);
      showNotification(`Testimonial from "${payload.clientName}" updated.`);
    } else {
      addTestimonial(payload);
      showNotification(`Testimonial from "${payload.clientName}" added.`);
    }

    setTestimonials(getTestimonials());
    setIsEditModalOpen(false);
  };

  // Confirm delete
  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteTestimonial(deleteTarget.id);
    setTestimonials(getTestimonials());
    showNotification(`Testimonial from "${deleteTarget.name}" deleted.`);
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
              placeholder="Search reviews by client, brand, feedback..."
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
            {ratings.map(r => (
              <button
                key={r}
                type="button"
                className={`filter-pill-btn ${ratingFilter === r ? 'active' : ''}`}
                onClick={() => setRatingFilter(r)}
              >
                {r}
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
          <span>Add Testimonial</span>
        </button>
      </div>

      {/* Testimonials Grid */}
      <div className="admin-testimonials-grid">
        {filteredTestimonials.length === 0 ? (
          <div className="admin-empty-state">
            <FiStar className="empty-icon" />
            <h3>No testimonials found</h3>
            <p>Try modifying your search or add a new verified client review.</p>
            <button 
              type="button" 
              className="admin-btn admin-btn-primary admin-btn-sm"
              onClick={handleOpenCreate}
            >
              <FiPlus />
              <span>Add First Testimonial</span>
            </button>
          </div>
        ) : (
          filteredTestimonials.map((t) => (
            <div key={t.id} className="admin-testimonial-card">
              <div className="testimonial-card-header">
                <div className="client-meta-lockup">
                  {t.avatar ? (
                    <img 
                      src={t.avatar} 
                      alt={t.clientName} 
                      className="client-avatar"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="client-avatar client-initial-badge">
                      {t.clientName ? t.clientName.charAt(0).toUpperCase() : 'C'}
                    </div>
                  )}
                  <div>
                    <h4 className="client-name">{t.clientName}</h4>
                    <span className="client-role-company">
                      {t.clientRole} {t.company && `• ${t.company}`}
                    </span>
                  </div>
                </div>

                {t.featured && <span className="featured-pill">Featured</span>}
              </div>

              {/* Star Rating */}
              <div className="stars-row">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <FiStar 
                    key={idx} 
                    className={`star-icon ${idx < t.rating ? 'filled' : 'empty'}`} 
                  />
                ))}
                <span className="rating-numeric">({t.rating}.0)</span>
              </div>

              {/* Quote */}
              <blockquote className="testimonial-quote-text">
                "{t.quote}"
              </blockquote>

              {/* Scope Tag & Actions */}
              <div className="testimonial-footer">
                <div className="scope-tag">
                  <span>Scope: <strong>{t.projectOrService || 'Growth Strategy'}</strong></span>
                </div>

                <div className="action-buttons-group">
                  <button 
                    type="button" 
                    className="icon-action-btn edit" 
                    onClick={() => handleOpenEdit(t)}
                    title="Edit Review"
                  >
                    <FiEdit />
                  </button>
                  <button 
                    type="button" 
                    className="icon-action-btn delete" 
                    onClick={() => setDeleteTarget({ id: t.id, name: t.clientName })}
                    title="Delete Review"
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
                <FiStar className="modal-header-icon" />
                <h3>{editingId ? 'Edit Testimonial' : 'Add Client Testimonial'}</h3>
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
                  <label>Client Full Name *</label>
                  <input 
                    type="text" 
                    name="clientName" 
                    value={form.clientName} 
                    onChange={handleChange} 
                    required 
                    placeholder="e.g. Dr. Ananya Sharma" 
                  />
                </div>

                <div className="form-group">
                  <label>Client Job Title / Role</label>
                  <input 
                    type="text" 
                    name="clientRole" 
                    value={form.clientRole} 
                    onChange={handleChange} 
                    placeholder="e.g. Founder & Chief Dermatologist" 
                  />
                </div>

                <div className="form-group">
                  <label>Company / Brand Name</label>
                  <input 
                    type="text" 
                    name="company" 
                    value={form.company} 
                    onChange={handleChange} 
                    placeholder="e.g. Lumina Aesthetics" 
                  />
                </div>

                <div className="form-group">
                  <label>Star Rating (1 - 5)</label>
                  <select name="rating" value={form.rating} onChange={handleChange}>
                    <option value={5}>★★★★★ (5 Stars)</option>
                    <option value={4}>★★★★☆ (4 Stars)</option>
                    <option value={3}>★★★☆☆ (3 Stars)</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Client Avatar Photo URL</label>
                  <input 
                    type="url" 
                    name="avatar" 
                    value={form.avatar} 
                    onChange={handleChange} 
                    placeholder="https://images.unsplash.com/photo-..." 
                  />
                </div>

                <div className="form-group full-width">
                  <label>Testimonial Quote *</label>
                  <textarea 
                    rows={4} 
                    name="quote" 
                    value={form.quote} 
                    onChange={handleChange} 
                    required 
                    placeholder="Client's review and endorsement of GrowVora's impact..." 
                  />
                </div>

                <div className="form-group">
                  <label>Project / Service Delivered</label>
                  <input 
                    type="text" 
                    name="projectOrService" 
                    value={form.projectOrService} 
                    onChange={handleChange} 
                    placeholder="e.g. Instagram Management & Paid Ads" 
                  />
                </div>

                <div className="form-group">
                  <label>Review Date</label>
                  <input 
                    type="date" 
                    name="date" 
                    value={form.date} 
                    onChange={handleChange} 
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
                    <span>Highlight in Featured Endorsements Carousel</span>
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
                  {editingId ? 'Save Testimonial' : 'Publish Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Testimonial"
        message={`Are you sure you want to delete the testimonial from "${deleteTarget?.name}"?`}
        confirmText="Delete Record"
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default AdminTestimonials;

