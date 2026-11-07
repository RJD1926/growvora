import React, { useState, useMemo } from 'react';
import { 
  FiPlus, 
  FiSearch, 
  FiEdit, 
  FiTrash2, 
  FiUsers, 
  FiCheckCircle, 
  FiX, 
  FiLinkedin, 
  FiInstagram, 
  FiGithub,
  FiMail
} from 'react-icons/fi';
import ConfirmModal from '../components/ConfirmModal';
import { 
  getTeam, 
  addTeamMember, 
  updateTeamMember, 
  deleteTeamMember 
} from '../services/adminStorage';

const emptyMember = {
  name: '',
  role: '',
  department: 'Leadership',
  image: '',
  bio: '',
  linkedin: '',
  instagram: '',
  github: '',
  status: 'Active'
};

const AdminTeam = () => {
  const [team, setTeam] = useState(() => getTeam());
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyMember);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const showNotification = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const departments = ['All', 'Leadership', 'Management', 'Design', 'Engineering', 'Content'];

  // Filter & Search
  const filteredTeam = useMemo(() => {
    return team.filter(m => {
      const matchesDept = deptFilter === 'All' || m.department === deptFilter;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        m.name.toLowerCase().includes(query) ||
        (m.role && m.role.toLowerCase().includes(query)) ||
        (m.department && m.department.toLowerCase().includes(query)) ||
        (m.bio && m.bio.toLowerCase().includes(query));
      return matchesDept && matchesSearch;
    });
  }, [team, deptFilter, searchQuery]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingId(null);
    setForm(emptyMember);
    setIsEditModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (m) => {
    setEditingId(m.id);
    setForm({
      name: m.name || '',
      role: m.role || '',
      department: m.department || 'Leadership',
      image: m.image || '',
      bio: m.bio || '',
      linkedin: m.linkedin || '#',
      instagram: m.instagram || '',
      github: m.github || '',
      status: m.status || 'Active'
    });
    setIsEditModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    const payload = {
      name: form.name.trim(),
      role: form.role.trim(),
      department: form.department,
      image: form.image.trim(),
      bio: form.bio.trim(),
      linkedin: form.linkedin.trim(),
      instagram: form.instagram.trim(),
      github: form.github.trim(),
      status: form.status
    };

    if (editingId) {
      updateTeamMember(editingId, payload);
      showNotification(`Team member "${payload.name}" updated.`);
    } else {
      addTeamMember(payload);
      showNotification(`Team member "${payload.name}" added to collective.`);
    }

    setTeam(getTeam());
    setIsEditModalOpen(false);
  };

  // Confirm delete
  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteTeamMember(deleteTarget.id);
    setTeam(getTeam());
    showNotification(`Team member "${deleteTarget.name}" removed.`);
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
              placeholder="Search team by name, role, department..."
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
            {departments.map(dept => (
              <button
                key={dept}
                type="button"
                className={`filter-pill-btn ${deptFilter === dept ? 'active' : ''}`}
                onClick={() => setDeptFilter(dept)}
              >
                {dept}
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
          <span>Add Member</span>
        </button>
      </div>

      {/* Team Cards Grid */}
      <div className="admin-team-grid">
        {filteredTeam.length === 0 ? (
          <div className="admin-empty-state">
            <FiUsers className="empty-icon" />
            <h3>No collective members found</h3>
            <p>Try modifying your search or add a new team member.</p>
            <button 
              type="button" 
              className="admin-btn admin-btn-primary admin-btn-sm"
              onClick={handleOpenCreate}
            >
              <FiPlus />
              <span>Add First Member</span>
            </button>
          </div>
        ) : (
          filteredTeam.map((m) => (
            <div key={m.id} className="admin-team-card">
              <div className="member-avatar-block">
                {m.image ? (
                  <img 
                    src={m.image} 
                    alt={m.name} 
                    className="member-photo"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="member-photo member-initial-badge">
                    {m.name ? m.name.charAt(0).toUpperCase() : 'M'}
                  </div>
                )}
                <span className="member-dept-badge">{m.department || 'Creative'}</span>
              </div>

              <div className="member-body">
                <h3 className="member-name">{m.name}</h3>
                <span className="member-role-text">{m.role}</span>
                {m.bio && <p className="member-bio-text">{m.bio}</p>}

                {/* Social icons row */}
                <div className="member-social-links">
                  {m.instagram && (
                    <a href={m.instagram} target="_blank" rel="noopener noreferrer" title="Instagram">
                      <FiInstagram />
                    </a>
                  )}
                  {m.linkedin && (
                    <a href={m.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn">
                      <FiLinkedin />
                    </a>
                  )}
                  {m.github && (
                    <a href={m.github} target="_blank" rel="noopener noreferrer" title="GitHub">
                      <FiGithub />
                    </a>
                  )}
                </div>

                {/* Card actions */}
                <div className="card-footer-actions">
                  <span className={`status-pill ${m.status === 'Active' ? 'active' : 'draft'}`}>
                    {m.status || 'Active'}
                  </span>
                  <div className="action-buttons-group">
                    <button 
                      type="button" 
                      className="icon-action-btn edit" 
                      onClick={() => handleOpenEdit(m)}
                      title="Edit Member"
                    >
                      <FiEdit />
                    </button>
                    <button 
                      type="button" 
                      className="icon-action-btn delete" 
                      onClick={() => setDeleteTarget({ id: m.id, name: m.name })}
                      title="Delete Member"
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
          <div className="admin-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div className="modal-title-wrap">
                <FiUsers className="modal-header-icon" />
                <h3>{editingId ? 'Edit Team Member' : 'Add Team Member'}</h3>
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
                  <label>Full Name *</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={form.name} 
                    onChange={handleChange} 
                    required 
                    placeholder="e.g. Harshil Pawar" 
                  />
                </div>

                <div className="form-group">
                  <label>Role / Job Title *</label>
                  <input 
                    type="text" 
                    name="role" 
                    value={form.role} 
                    onChange={handleChange} 
                    required 
                    placeholder="e.g. Founder & Strategic Director" 
                  />
                </div>

                <div className="form-group">
                  <label>Department</label>
                  <select name="department" value={form.department} onChange={handleChange}>
                    <option value="Leadership">Leadership</option>
                    <option value="Management">Management & Operations</option>
                    <option value="Design">Visual Design</option>
                    <option value="Engineering">Web & AI Engineering</option>
                    <option value="Content">Content & Reels</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select name="status" value={form.status} onChange={handleChange}>
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Profile Image URL or Local Path</label>
                  <div className="input-with-preview">
                    <input 
                      type="text" 
                      name="image" 
                      value={form.image} 
                      onChange={handleChange} 
                      placeholder="/imgs/harshil.png or https://..." 
                    />
                    {form.image && (
                      <div className="image-live-preview-box avatar-preview">
                        <img 
                          src={form.image} 
                          alt="Avatar" 
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
                  <label>Short Biography</label>
                  <textarea 
                    rows={2} 
                    name="bio" 
                    value={form.bio} 
                    onChange={handleChange} 
                    placeholder="Brief background and expertise..." 
                  />
                </div>

                <div className="form-group">
                  <label>Instagram URL</label>
                  <input 
                    type="text" 
                    name="instagram" 
                    value={form.instagram} 
                    onChange={handleChange} 
                    placeholder="https://www.instagram.com/..." 
                  />
                </div>

                <div className="form-group">
                  <label>LinkedIn URL</label>
                  <input 
                    type="text" 
                    name="linkedin" 
                    value={form.linkedin} 
                    onChange={handleChange} 
                    placeholder="https://linkedin.com/in/..." 
                  />
                </div>

                <div className="form-group full-width">
                  <label>GitHub Profile URL (Optional)</label>
                  <input 
                    type="text" 
                    name="github" 
                    value={form.github} 
                    onChange={handleChange} 
                    placeholder="https://github.com/..." 
                  />
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
                  {editingId ? 'Save Changes' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Remove Team Member"
        message={`Are you sure you want to remove "${deleteTarget?.name}" from the collective? This cannot be undone.`}
        confirmText="Remove Member"
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default AdminTeam;

