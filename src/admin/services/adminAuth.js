/**
 * GrowVora Admin Authentication Service
 * Frontend-only authentication with localStorage session persistence
 */

const AUTH_KEY = 'growvora_admin_session_v1';

export const ADMIN_CREDENTIALS = {
  email: 'admin@growvora.me',
  password: 'admin123',
  displayName: 'Harshil Pawar',
  role: 'Super Administrator',
  avatar: '/imgs/harshil.png'
};

export const checkAuth = () => {
  try {
    const session = localStorage.getItem(AUTH_KEY);
    if (!session) return false;
    const parsed = JSON.parse(session);
    return Boolean(parsed && parsed.authenticated && parsed.email === ADMIN_CREDENTIALS.email);
  } catch (e) {
    return false;
  }
};

export const getAdminUser = () => {
  try {
    const session = localStorage.getItem(AUTH_KEY);
    if (!session) return null;
    const parsed = JSON.parse(session);
    return parsed.user || null;
  } catch (e) {
    return null;
  }
};

export const loginAdmin = (email, password) => {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPassword = (password || '').trim();

  if (!cleanEmail || !cleanPassword) {
    return {
      success: false,
      message: 'Please provide both email and password.'
    };
  }

  if (
    cleanEmail === ADMIN_CREDENTIALS.email.toLowerCase() &&
    cleanPassword === ADMIN_CREDENTIALS.password
  ) {
    const user = {
      email: ADMIN_CREDENTIALS.email,
      name: ADMIN_CREDENTIALS.displayName,
      role: ADMIN_CREDENTIALS.role,
      avatar: ADMIN_CREDENTIALS.avatar,
      loginTime: new Date().toISOString()
    };

    const sessionData = {
      authenticated: true,
      email: ADMIN_CREDENTIALS.email,
      user,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    };

    localStorage.setItem(AUTH_KEY, JSON.stringify(sessionData));
    window.dispatchEvent(new CustomEvent('growvora_auth_state_changed', { detail: { authenticated: true } }));

    return {
      success: true,
      user
    };
  }

  return {
    success: false,
    message: 'Invalid email or password. Please verify credentials.'
  };
};

export const logoutAdmin = () => {
  localStorage.removeItem(AUTH_KEY);
  window.dispatchEvent(new CustomEvent('growvora_auth_state_changed', { detail: { authenticated: false } }));
  return true;
};

