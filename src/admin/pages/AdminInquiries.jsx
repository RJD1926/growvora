import React, { useState, useMemo } from 'react';
import { 
  FiSearch, 
  FiTrash2, 
  FiInbox, 
  FiCheckCircle, 
  FiX, 
  FiEye, 
  FiMail, 
  FiPhone, 
  FiCalendar, 
  FiPlus, 
  FiMessageSquare,
  FiFilter,
  FiEdit,
  FiSave
} from 'react-icons/fi';
import ConfirmModal from '../components/ConfirmModal';
import { 
  getInquiries, 
  addInquiry, 
  updateInquiry, 
  deleteInquiry 
} from '../services/adminStorage';

const emptyInquiry = {
  fullName: '',
  email: '',
  phone: '',
  company: '',
  service: 'Web Development',
  budget: '₹1,00,000+',
  message: '',
  status: 'New',
  priority: 'High',
  notes: ''
};

const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState(() => getInquiries());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Detail / View Modal
  const [viewingInquiry, setViewingInquiry] = useState(null);
  const [internalNotes, setInternalNotes] = useState('');

  // Manual Add Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [form, setForm] = useState(emptyInquiry);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const showNotification = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const statusOptions = ['All', 'New', 'In Progress', 'Contacted', 'Converted', 'Archived'];

  // Filter & Search
  const filteredInquiries = useMemo(() => {
    return inquiries.filter(inq => {
      const matchesStatus = statusFilter === 'All' || inq.status === statusFilter;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        inq.fullName.toLowerCase().includes(query) ||
        (inq.email && inq.email.toLowerCase().includes(query)) ||
        (inq.company && inq.company.toLowerCase().includes(query)) ||
        (inq.service && inq.service.toLowerCase().includes(query)) ||
        (inq.message && inq.message.toLowerCase().includes(query));
      
      return matchesStatus && matchesSearch;
    });
  }, [inquiries, statusFilter, searchQuery]);

  // Open Inquiry Detail
  const handleOpenDetail = (inq) => {
    setViewingInquiry(inq);
    setInternalNotes(inq.notes || '');
  };

  // Quick Status Change on card/table
  const handleStatusChange = (id, newStatus) => {
    updateInquiry(id, { status: newStatus });
    setInquiries(getInquiries());
    if (viewingInquiry && viewingInquiry.id === id) {
      setViewingInquiry(prev => ({ ...prev, status: newStatus }));
    }
    showNotification(`Lead status updated to "${newStatus}".`);
  };

  // Save Notes inside modal
  const handleSaveNotes = () => {
    if (!viewingInquiry) return;
    updateInquiry(viewingInquiry.id, { notes: internalNotes });
    setInquiries(getInquiries());
    setViewingInquiry(prev => ({ ...prev, notes: internalNotes }));
    showNotification('Internal notes saved.');
  };

  // Add Manual Lead
  const handleAddLeadSubmit = (e) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.email.trim()) return;

    const payload = {
      ...form,
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      company: form.company.trim(),
      message: form.message.trim() || 'Manual lead entry created by admin.'
    };

    addInquiry(payload);
    setInquiries(getInquiries());
    setIsAddModalOpen(false);
    setForm(emptyInquiry);
    showNotification(`New lead for "${payload.fullName}" created.`);
  };

  // Confirm delete
  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteInquiry(deleteTarget.id);
    setInquiries(getInquiries());
    if (viewingInquiry && viewingInquiry.id === deleteTarget.id) {
      setViewingInquiry(null);
    }
    showNotification(`Inquiry from "${deleteTarget.name}" deleted.`);
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
              placeholder="Search leads by client name, email, company, service..."
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
            {statusOptions.map(st => (
              <button
                key={st}
                type="button"
                className={`filter-pill-btn ${statusFilter === st ? 'active' : ''}`}
                onClick={() => setStatusFilter(st)}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <button 
          type="button" 
          className="admin-btn admin-btn-primary"
          onClick={() => setIsAddModalOpen(true)}
        >
          <FiPlus />
          <span>Record Lead</span>
        </button>
      </div>

      {/* Inquiries Table / Cards */}
      <div className="inquiries-container">
        {filteredInquiries.length === 0 ? (
          <div className="admin-empty-state">
            <FiInbox className="empty-icon" />
            <h3>No inquiries found</h3>
            <p>Try modifying your status filter or search query.</p>
          </div>
        ) : (
          <div className="inquiries-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Client / Company</th>
                  <th>Contact Details</th>
                  <th>Service & Budget</th>
                  <th>Received</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInquiries.map((inq) => (
                  <tr key={inq.id} className={inq.status === 'New' ? 'row-highlight' : ''}>
                    <td>
                      <div className="client-cell">
                        <div className="client-avatar-mini">
                          {inq.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <strong className="client-name-bold">{inq.fullName}</strong>
                          <span className="client-company-sub">{inq.company || 'Direct Client'}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="contact-cell">
                        <a href={`mailto:${inq.email}`} className="contact-link">
                          <FiMail /> {inq.email}
                        </a>
                        {inq.phone && (
                          <a href={`tel:${inq.phone}`} className="contact-link phone">
                            <FiPhone /> {inq.phone}
                          </a>
                        )}
                      </div>
                    </td>

                    <td>
                      <div className="service-cell">
                        <span className="service-badge">{inq.service || 'General'}</span>
                        {inq.budget && <span className="budget-tag">{inq.budget}</span>}
                      </div>
                    </td>

                    <td>
                      <span className="date-cell">
                        {inq.createdAt ? new Date(inq.createdAt).toLocaleDateString() : 'Recent'}
                      </span>
                    </td>

                    <td>
                      <select 
                        className={`status-dropdown status-select-${inq.status.toLowerCase().replace(/\s+/g, '-')}`}
                        value={inq.status}
                        onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                      >
                        <option value="New">New</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Converted">Converted</option>
                        <option value="Archived">Archived</option>
                      </select>
                    </td>

                    <td className="text-right">
                      <div className="action-buttons-group justify-end">
                        <button 
                          type="button" 
                          className="icon-action-btn view"
                          onClick={() => handleOpenDetail(inq)}
                          title="View Inquiry Message"
                        >
                          <FiEye />
                        </button>
                        <button 
                          type="button" 
                          className="icon-action-btn delete"
                          onClick={() => setDeleteTarget({ id: inq.id, name: inq.fullName })}
                          title="Delete Lead"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DETAIL VIEW MODAL */}
      {viewingInquiry && (
        <div className="admin-modal-overlay" onClick={() => setViewingInquiry(null)}>
          <div className="admin-modal-container modal-wide" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div className="modal-title-wrap">
                <FiInbox className="modal-header-icon" />
                <div>
                  <h3>Inquiry from {viewingInquiry.fullName}</h3>
                  <span className="modal-sub-date">
                    Submitted: {new Date(viewingInquiry.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
              <button 
                type="button" 
                className="modal-close-btn" 
                onClick={() => setViewingInquiry(null)}
              >
                <FiX />
              </button>
            </div>

            <div className="inquiry-detail-body">
              {/* Top Summary Bar */}
              <div className="inquiry-meta-grid">
                <div className="meta-box">
                  <span className="meta-lbl">Client Email</span>
                  <a href={`mailto:${viewingInquiry.email}`} className="meta-val link">
                    <FiMail /> {viewingInquiry.email}
                  </a>
                </div>
                <div className="meta-box">
                  <span className="meta-lbl">Phone Number</span>
                  <a href={`tel:${viewingInquiry.phone || ''}`} className="meta-val link">
                    <FiPhone /> {viewingInquiry.phone || 'Not provided'}
                  </a>
                </div>
                <div className="meta-box">
                  <span className="meta-lbl">Company / Brand</span>
                  <span className="meta-val">{viewingInquiry.company || 'Individual'}</span>
                </div>
                <div className="meta-box">
                  <span className="meta-lbl">Selected Service</span>
                  <span className="meta-val highlight">{viewingInquiry.service}</span>
                </div>
                <div className="meta-box">
                  <span className="meta-lbl">Estimated Budget</span>
                  <span className="meta-val">{viewingInquiry.budget || 'Open / Flexible'}</span>
                </div>
                <div className="meta-box">
                  <span className="meta-lbl">Workflow Status</span>
                  <select 
                    className="status-dropdown in-modal"
                    value={viewingInquiry.status}
                    onChange={(e) => handleStatusChange(viewingInquiry.id, e.target.value)}
                  >
                    <option value="New">New</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Converted">Converted</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Message Content */}
              <div className="inquiry-message-section">
                <label className="section-label"><FiMessageSquare /> Project Requirement & Message</label>
                <div className="message-content-bubble">
                  {viewingInquiry.message || 'No project description provided.'}
                </div>
              </div>

              {/* Internal Notes Section */}
              <div className="inquiry-notes-section">
                <div className="notes-header">
                  <label className="section-label"><FiEdit /> Internal Team Notes & Follow-up Actions</label>
                  <button 
                    type="button" 
                    className="admin-btn admin-btn-sm admin-btn-secondary"
                    onClick={handleSaveNotes}
                  >
                    <FiSave />
                    <span>Save Notes</span>
                  </button>
                </div>
                <textarea 
                  rows={3}
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="Record call logs, action items, meeting dates, or quote notes..."
                />
              </div>
            </div>

            <div className="admin-modal-actions">
              <a 
                href={`mailto:${viewingInquiry.email}?subject=Re:%20GrowVora%20Project%20Inquiry`}
                className="admin-btn admin-btn-primary"
              >
                <FiMail />
                <span>Compose Direct Email</span>
              </a>
              <button 
                type="button" 
                className="admin-btn admin-btn-secondary"
                onClick={() => setViewingInquiry(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RECORD LEAD MODAL */}
      {isAddModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="admin-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div className="modal-title-wrap">
                <FiInbox className="modal-header-icon" />
                <h3>Record New Client Lead</h3>
              </div>
              <button 
                type="button" 
                className="modal-close-btn" 
                onClick={() => setIsAddModalOpen(false)}
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleAddLeadSubmit} className="admin-modal-form">
              <div className="form-grid-2col">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    placeholder="e.g. Rahul Verma"
                  />
                </div>

                <div className="form-group">
                  <label>Email Address *</label>
                  <input 
                    type="email" 
                    required 
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="client@company.com"
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input 
                    type="text" 
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div className="form-group">
                  <label>Company / Brand</label>
                  <input 
                    type="text" 
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    placeholder="Company Name"
                  />
                </div>

                <div className="form-group">
                  <label>Requested Service</label>
                  <select 
                    value={form.service} 
                    onChange={(e) => setForm({ ...form, service: e.target.value })}
                  >
                    <option value="Instagram Management">Instagram Management</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Graphic Designing">Graphic Designing</option>
                    <option value="Digital Growth & Ads">Digital Growth & Ads</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Budget Range</label>
                  <input 
                    type="text" 
                    value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: e.target.value })}
                    placeholder="₹1,00,000+"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Project Details / Initial Notes</label>
                  <textarea 
                    rows={3}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Summary of project requirements..."
                  />
                </div>
              </div>

              <div className="admin-modal-actions">
                <button 
                  type="button" 
                  className="admin-btn admin-btn-secondary" 
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  Record Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Inquiry Record"
        message={`Are you sure you want to delete the inquiry from "${deleteTarget?.name}"?`}
        confirmText="Delete Record"
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default AdminInquiries;

