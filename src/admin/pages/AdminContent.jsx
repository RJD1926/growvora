import React, { useState } from 'react';
import { 
  FiSave, 
  FiCheckCircle, 
  FiRefreshCw, 
  FiGlobe, 
  FiTrendingUp, 
  FiPhone, 
  FiMail, 
  FiMapPin,
  FiInstagram,
  FiLinkedin,
  FiYoutube,
  FiEye
} from 'react-icons/fi';
import { getContent, saveContent } from '../services/adminStorage';

const AdminContent = () => {
  const [content, setContent] = useState(() => getContent());
  const [activeTab, setActiveTab] = useState('hero'); // 'hero' | 'manifesto' | 'contact'
  const [showToast, setShowToast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Handle updates to nested objects
  const handleHeroChange = (e) => {
    const { name, value } = e.target;
    setContent(prev => ({
      ...prev,
      hero: { ...prev.hero, [name]: value }
    }));
  };

  const handleManifestoChange = (e) => {
    const { name, value } = e.target;
    setContent(prev => ({
      ...prev,
      manifesto: { ...prev.manifesto, [name]: value }
    }));
  };

  const handleMetricChange = (index, field, value) => {
    setContent(prev => {
      const updatedMetrics = [...prev.manifesto.metrics];
      updatedMetrics[index] = { ...updatedMetrics[index], [field]: value };
      return {
        ...prev,
        manifesto: { ...prev.manifesto, metrics: updatedMetrics }
      };
    });
  };

  const handleAgencyChange = (e) => {
    const { name, value } = e.target;
    setContent(prev => ({
      ...prev,
      agency: { ...prev.agency, [name]: value }
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    saveContent(content);
    setTimeout(() => {
      setIsSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3500);
    }, 400);
  };

  const handleResetToCurrent = () => {
    setContent(getContent());
  };

  return (
    <div className="admin-content-view">
      {/* Toast Notification */}
      {showToast && (
        <div className="admin-toast success" role="alert">
          <FiCheckCircle />
          <span>Website content saved successfully! Changes are persisted locally.</span>
        </div>
      )}

      {/* Header bar */}
      <div className="content-toolbar">
        <div className="content-tabs-nav">
          <button 
            type="button" 
            className={`content-nav-tab ${activeTab === 'hero' ? 'active' : ''}`}
            onClick={() => setActiveTab('hero')}
          >
            <FiGlobe />
            <span>Hero Section</span>
          </button>
          <button 
            type="button" 
            className={`content-nav-tab ${activeTab === 'manifesto' ? 'active' : ''}`}
            onClick={() => setActiveTab('manifesto')}
          >
            <FiTrendingUp />
            <span>Manifesto & Metrics</span>
          </button>
          <button 
            type="button" 
            className={`content-nav-tab ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            <FiMail />
            <span>Agency & Contact Info</span>
          </button>
        </div>

        <div className="content-actions-right">
          <button 
            type="button" 
            className="admin-btn admin-btn-secondary admin-btn-sm"
            onClick={handleResetToCurrent}
            title="Discard unsaved changes"
          >
            <FiRefreshCw />
            <span>Reset Form</span>
          </button>
          <button 
            type="button" 
            className="admin-btn admin-btn-primary admin-btn-sm"
            onClick={handleSave}
            disabled={isSaving}
          >
            <FiSave />
            <span>{isSaving ? 'Saving...' : 'Save All Changes'}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="admin-form-container">
        {/* TAB 1: HERO SECTION */}
        {activeTab === 'hero' && (
          <div className="content-section-card">
            <div className="section-intro">
              <h3>Homepage Hero Configuration</h3>
              <p>Customize the high-impact headline, subline, and primary calls-to-action on the landing page.</p>
            </div>

            <div className="form-grid-2col">
              <div className="form-group full-width">
                <label>Top Badge / Ticker Text</label>
                <input 
                  type="text" 
                  name="badge" 
                  value={content.hero?.badge || ''} 
                  onChange={handleHeroChange} 
                  placeholder="e.g. GROWTH IN MOTION // DIGITAL STUDIO"
                />
              </div>

              <div className="form-group">
                <label>Headline Line 1</label>
                <input 
                  type="text" 
                  name="headlinePrefix" 
                  value={content.hero?.headlinePrefix || ''} 
                  onChange={handleHeroChange} 
                  placeholder="WE DON'T JUST"
                />
              </div>

              <div className="form-group">
                <label>Headline Line 2</label>
                <input 
                  type="text" 
                  name="headlineLine2" 
                  value={content.hero?.headlineLine2 || ''} 
                  onChange={handleHeroChange} 
                  placeholder="BUILD BRANDS."
                />
              </div>

              <div className="form-group">
                <label>Headline Line 3</label>
                <input 
                  type="text" 
                  name="headlineLine3" 
                  value={content.hero?.headlineLine3 || ''} 
                  onChange={handleHeroChange} 
                  placeholder="WE MAKE THEM"
                />
              </div>

              <div className="form-group">
                <label>Electric Highlight Word</label>
                <input 
                  type="text" 
                  name="electricWord" 
                  value={content.hero?.electricWord || ''} 
                  onChange={handleHeroChange} 
                  placeholder="GROW."
                  className="electric-input"
                />
                <small className="help-text">Renders in neon green (#C6FF3B) font on public site</small>
              </div>

              <div className="form-group full-width">
                <label>Hero Tagline / Subtitle</label>
                <textarea 
                  rows={3}
                  name="tagline" 
                  value={content.hero?.tagline || ''} 
                  onChange={handleHeroChange} 
                  placeholder="A creative growth studio combining high-impact visual design..."
                />
              </div>

              <div className="form-group">
                <label>Primary CTA Button Label</label>
                <input 
                  type="text" 
                  name="ctaPrimaryText" 
                  value={content.hero?.ctaPrimaryText || ''} 
                  onChange={handleHeroChange} 
                  placeholder="Start a Project"
                />
              </div>

              <div className="form-group">
                <label>Showreel Button Label</label>
                <input 
                  type="text" 
                  name="showreelText" 
                  value={content.hero?.showreelText || ''} 
                  onChange={handleHeroChange} 
                  placeholder="Showreel (01:20)"
                />
              </div>
            </div>

            {/* Live Hero Preview Box */}
            <div className="hero-preview-box">
              <span className="preview-label"><FiEye /> Visual Typography Preview</span>
              <div className="preview-content">
                <span className="preview-badge">{content.hero?.badge}</span>
                <h2 className="preview-headline">
                  {content.hero?.headlinePrefix}<br />
                  {content.hero?.headlineLine2}<br />
                  {content.hero?.headlineLine3}<br />
                  <span className="text-electric">{content.hero?.electricWord}</span>
                </h2>
                <p className="preview-tagline">{content.hero?.tagline}</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MANIFESTO & METRICS */}
        {activeTab === 'manifesto' && (
          <div className="content-section-card">
            <div className="section-intro">
              <h3>Brand Manifesto & Social Proof Metrics</h3>
              <p>Configure the narrative philosophy and live achievement statistics displayed across the website.</p>
            </div>

            <div className="form-grid-2col">
              <div className="form-group full-width">
                <label>Eyebrow Tag</label>
                <input 
                  type="text" 
                  name="eyebrow" 
                  value={content.manifesto?.eyebrow || ''} 
                  onChange={handleManifestoChange} 
                  placeholder="MANIFESTO"
                />
              </div>

              <div className="form-group full-width">
                <label>Giant Editorial Title</label>
                <input 
                  type="text" 
                  name="giantTitle" 
                  value={content.manifesto?.giantTitle || ''} 
                  onChange={handleManifestoChange} 
                  placeholder="SMALL IDEAS. BIG DIGITAL IMPACT."
                />
              </div>

              <div className="form-group full-width">
                <label>Manifesto Philosophy Paragraph</label>
                <textarea 
                  rows={4}
                  name="paragraph" 
                  value={content.manifesto?.paragraph || ''} 
                  onChange={handleManifestoChange} 
                  placeholder="We believe exceptional growth is engineered at the intersection of bold aesthetics and rigorous data..."
                />
              </div>
            </div>

            <h4 className="subsection-title">Proof-Point Metrics</h4>
            <div className="metrics-editor-grid">
              {(content.manifesto?.metrics || []).map((m, idx) => (
                <div key={m.id || idx} className="metric-edit-card">
                  <div className="metric-badge-label">Metric #{idx + 1}</div>
                  <div className="form-group">
                    <label>Big Stat Value</label>
                    <input 
                      type="text" 
                      value={m.number} 
                      onChange={(e) => handleMetricChange(idx, 'number', e.target.value)}
                      placeholder="e.g. 250+"
                      className="metric-number-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Description Label</label>
                    <input 
                      type="text" 
                      value={m.label} 
                      onChange={(e) => handleMetricChange(idx, 'label', e.target.value)}
                      placeholder="Deployments Delivered"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: CONTACT & AGENCY */}
        {activeTab === 'contact' && (
          <div className="content-section-card">
            <div className="section-intro">
              <h3>Agency Details & Social Touchpoints</h3>
              <p>Official communication channels, lead intake addresses, and social links.</p>
            </div>

            <div className="form-grid-2col">
              <div className="form-group">
                <label><FiGlobe /> Brand Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={content.agency?.name || ''} 
                  onChange={handleAgencyChange} 
                  placeholder="GrowVora"
                />
              </div>

              <div className="form-group">
                <label><FiGlobe /> Official Website</label>
                <input 
                  type="text" 
                  name="website" 
                  value={content.agency?.website || ''} 
                  onChange={handleAgencyChange} 
                  placeholder="https://growvora.com"
                />
              </div>

              <div className="form-group">
                <label><FiMail /> Client Inquiries Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={content.agency?.email || ''} 
                  onChange={handleAgencyChange} 
                  placeholder="novamanagement819@gmail.com"
                />
              </div>

              <div className="form-group">
                <label><FiMail /> Admin Escalation Email</label>
                <input 
                  type="email" 
                  name="adminEmail" 
                  value={content.agency?.adminEmail || ''} 
                  onChange={handleAgencyChange} 
                  placeholder="admin@growvora.me"
                />
              </div>

              <div className="form-group">
                <label><FiPhone /> Contact Phone Number</label>
                <input 
                  type="text" 
                  name="phone" 
                  value={content.agency?.phone || ''} 
                  onChange={handleAgencyChange} 
                  placeholder="+91 81419 53998"
                />
              </div>

              <div className="form-group">
                <label><FiMapPin /> Physical Studio Location</label>
                <input 
                  type="text" 
                  name="location" 
                  value={content.agency?.location || ''} 
                  onChange={handleAgencyChange} 
                  placeholder="Surat, Gujarat, India"
                />
              </div>

              <div className="form-group full-width">
                <label>Agency Tagline / Bio</label>
                <textarea 
                  rows={2}
                  name="description" 
                  value={content.agency?.description || ''} 
                  onChange={handleAgencyChange} 
                  placeholder="We create result-driven digital solutions..."
                />
              </div>

              <div className="form-group">
                <label><FiInstagram /> Instagram Profile URL</label>
                <input 
                  type="text" 
                  name="instagram" 
                  value={content.agency?.instagram || ''} 
                  onChange={handleAgencyChange} 
                  placeholder="https://www.instagram.com/thegrowvora.co.in/"
                />
              </div>

              <div className="form-group">
                <label><FiLinkedin /> LinkedIn Page URL</label>
                <input 
                  type="text" 
                  name="linkedin" 
                  value={content.agency?.linkedin || ''} 
                  onChange={handleAgencyChange} 
                  placeholder="https://linkedin.com/company/growvora"
                />
              </div>
            </div>
          </div>
        )}

        {/* Bottom Save Bar */}
        <div className="form-submit-footer">
          <button 
            type="submit" 
            className="admin-btn admin-btn-primary admin-btn-lg"
            disabled={isSaving}
          >
            <FiSave />
            <span>{isSaving ? 'Saving Changes...' : 'Save Website Content'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminContent;

