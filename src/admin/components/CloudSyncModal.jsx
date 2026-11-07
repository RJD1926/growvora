import React, { useState, useEffect } from 'react';
import { 
  FiCloud, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiX, 
  FiCopy, 
  FiRefreshCw, 
  FiUploadCloud, 
  FiDownloadCloud, 
  FiExternalLink,
  FiDatabase,
  FiCheck
} from 'react-icons/fi';
import { 
  getSupabaseConfig, 
  saveSupabaseConfig, 
  clearSupabaseConfig, 
  isSupabaseConfigured, 
  testSupabaseConnection 
} from '../services/supabaseClient';
import { pushAllToCloud, syncFromCloud } from '../services/adminStorage';

const SQL_SETUP_SCRIPT = `-- GrowVora Cloud Database Schema
-- Run this once in your Supabase SQL Editor:

CREATE TABLE IF NOT EXISTS growvora_store (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable public access for frontend read and write
ALTER TABLE growvora_store ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anon all" ON growvora_store;
CREATE POLICY "Allow anon all" ON growvora_store FOR ALL USING (true);
`;

const CloudSyncModal = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState(() => getSupabaseConfig());
  const [isConnected, setIsConnected] = useState(() => isSupabaseConfigured());
  const [testResult, setTestResult] = useState(null); // { success, message, needsTable }
  const [isTesting, setIsTesting] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [actionNotice, setActionNotice] = useState('');

  useEffect(() => {
    if (isOpen) {
      const current = getSupabaseConfig();
      setConfig(current);
      setIsConnected(isSupabaseConfigured());
      setTestResult(null);
      setActionNotice('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    if (!config.url || !config.anonKey) {
      setTestResult({ success: false, message: 'Please provide both Supabase URL and Anon Key.' });
      return;
    }

    saveSupabaseConfig(config.url, config.anonKey);
    setIsConnected(true);
    setIsTesting(true);
    setTestResult(null);

    const result = await testSupabaseConnection();
    setIsTesting(false);
    setTestResult(result);

    if (result.success) {
      setActionNotice('Connected! You can now push your local data to cloud.');
    }
  };

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    saveSupabaseConfig(config.url, config.anonKey);
    const result = await testSupabaseConnection();
    setIsTesting(false);
    setTestResult(result);
  };

  const handlePushToCloud = async () => {
    setIsPushing(true);
    setActionNotice('');
    const res = await pushAllToCloud();
    setIsPushing(false);
    if (res.success) {
      setActionNotice('Success! All local projects, services, team & inquiries uploaded to Cloud Database.');
    } else {
      setTestResult({ success: false, message: res.message });
    }
  };

  const handlePullFromCloud = async () => {
    setIsPulling(true);
    setActionNotice('');
    const res = await syncFromCloud();
    setIsPulling(false);
    if (res.success) {
      setActionNotice(res.message);
    } else {
      setTestResult({ success: false, message: res.message });
    }
  };

  const handleDisconnect = () => {
    clearSupabaseConfig();
    setConfig({ url: '', anonKey: '' });
    setIsConnected(false);
    setTestResult(null);
    setActionNotice('Disconnected from Supabase. Working in local storage mode.');
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SQL_SETUP_SCRIPT);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className="admin-modal-container modal-wide" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="admin-modal-header">
          <div className="modal-title-wrap">
            <FiCloud className="modal-header-icon" />
            <div>
              <h3>Cloud Database Sync</h3>
              <span className="modal-sub-date">
                Make your admin changes visible to all viewers worldwide in real time
              </span>
            </div>
          </div>
          <button 
            type="button" 
            className="modal-close-btn" 
            onClick={onClose}
            aria-label="Close dialog"
          >
            <FiX />
          </button>
        </div>

        <div className="admin-modal-form">
          {/* Status Banner */}
          <div className={`cloud-status-banner ${isConnected ? 'connected' : 'disconnected'}`}>
            <div className="status-indicator-dot" />
            <div className="status-banner-text">
              <strong>{isConnected ? 'Connected to Supabase Cloud Database' : 'Working in Local Browser Mode'}</strong>
              <p>
                {isConnected 
                  ? 'All changes made in this admin panel sync to the cloud so every visitor sees your updates.'
                  : 'Changes are currently saved only on this machine. Connect Supabase to sync across all devices.'}
              </p>
            </div>
            {isConnected && (
              <button 
                type="button" 
                className="disconnect-btn"
                onClick={handleDisconnect}
              >
                Disconnect
              </button>
            )}
          </div>

          {actionNotice && (
            <div className="admin-toast-inline success">
              <FiCheckCircle />
              <span>{actionNotice}</span>
            </div>
          )}

          {testResult && (
            <div className={`admin-toast-inline ${testResult.success ? 'success' : 'error'}`}>
              {testResult.success ? <FiCheckCircle /> : <FiAlertCircle />}
              <span>{testResult.message}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSave} className="cloud-config-form">
            <div className="form-group full-width">
              <label>Supabase Project URL *</label>
              <input 
                type="url" 
                placeholder="https://your-project-id.supabase.co"
                value={config.url}
                onChange={(e) => setConfig({ ...config, url: e.target.value })}
                required
              />
              <span className="help-text">Found in Supabase: Project Settings → API → Project URL</span>
            </div>

            <div className="form-group full-width">
              <label>Supabase Anon Public API Key *</label>
              <input 
                type="text" 
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={config.anonKey}
                onChange={(e) => setConfig({ ...config, anonKey: e.target.value })}
                required
              />
              <span className="help-text">Found in Supabase: Project Settings → API → Project API Keys (anon public)</span>
            </div>

            <div className="cloud-actions-row">
              <button 
                type="button" 
                className="admin-btn admin-btn-secondary"
                onClick={handleTest}
                disabled={isTesting || !config.url || !config.anonKey}
              >
                <FiRefreshCw className={isTesting ? 'spin-anim' : ''} />
                <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
              </button>

              <button 
                type="submit" 
                className="admin-btn admin-btn-primary"
                disabled={isTesting}
              >
                <FiCloud />
                <span>Save & Connect Cloud DB</span>
              </button>
            </div>
          </form>

          {/* Quick Migration Buttons */}
          {isConnected && (
            <div className="cloud-sync-ops-box">
              <h4>Database Sync Operations</h4>
              <div className="ops-buttons-grid">
                <button 
                  type="button" 
                  className="ops-btn primary"
                  onClick={handlePushToCloud}
                  disabled={isPushing}
                >
                  <FiUploadCloud />
                  <div>
                    <strong>Push Local Data to Cloud</strong>
                    <span>Upload all existing projects, team, services & copy to Supabase</span>
                  </div>
                </button>

                <button 
                  type="button" 
                  className="ops-btn secondary"
                  onClick={handlePullFromCloud}
                  disabled={isPulling}
                >
                  <FiDownloadCloud />
                  <div>
                    <strong>Pull from Cloud to Local</strong>
                    <span>Fetch latest updates made on other devices</span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* 1-Click SQL Setup Script */}
          <div className="sql-helper-box">
            <div className="sql-header">
              <div className="sql-title-lockup">
                <FiDatabase />
                <strong>Supabase SQL Setup (Run Once)</strong>
              </div>
              <button 
                type="button" 
                className="copy-sql-btn"
                onClick={handleCopySql}
              >
                {copiedSql ? <FiCheck /> : <FiCopy />}
                <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy SQL Script'}</span>
              </button>
            </div>
            <pre className="sql-code-block">
              <code>{SQL_SETUP_SCRIPT}</code>
            </pre>
            <p className="sql-instructions">
              <strong>How to run:</strong> In your <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer">Supabase Dashboard <FiExternalLink /></a>, open your project → click <strong>SQL Editor</strong> on the left → paste this code → click <strong>Run</strong>. Done!
            </p>
          </div>
        </div>

        <div className="admin-modal-actions">
          <button 
            type="button" 
            className="admin-btn admin-btn-secondary" 
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CloudSyncModal;
