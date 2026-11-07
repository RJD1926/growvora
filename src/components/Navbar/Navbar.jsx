import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiArrowUpRight, FiSun, FiMoon, FiChevronDown, FiInstagram, FiMonitor, FiPenTool } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from '../SearchBar/SearchBar';
import './Navbar.scss';

const serviceItems = [
  {
    name: 'Instagram Management',
    desc: 'Organic Growth, Content Strategy & Viral Reels',
    path: '/instagram-management',
    icon: <FiInstagram />
  },
  {
    name: 'Web Development',
    desc: 'High-Impact Custom Web Experiences & Platforms',
    path: '/web-development',
    icon: <FiMonitor />
  },
  {
    name: 'Graphic Designing',
    desc: 'Brand Identity Systems, Visuals & Pitch Decks',
    path: '/graphic-designing',
    icon: <FiPenTool />
  }
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const dropdownTimeoutRef = useRef(null);
  const location = useLocation();

  // Theme state: defaults to dark mode
  const [isLightMode, setIsLightMode] = useState(() => {
    return localStorage.getItem('growvora_theme') === 'light';
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isLightMode) {
      document.body.classList.add('light-mode');
      localStorage.setItem('growvora_theme', 'light');
    } else {
      document.body.classList.remove('light-mode');
      localStorage.setItem('growvora_theme', 'dark');
    }
  }, [isLightMode]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  // Close dropdown on route change
  useEffect(() => {
    setServicesDropdownOpen(false);
    setIsOpen(false);
  }, [location.pathname]);

  const toggleTheme = () => {
    setIsLightMode(prev => !prev);
  };

  const handleMouseEnterServices = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setServicesDropdownOpen(true);
  };

  const handleMouseLeaveServices = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setServicesDropdownOpen(false);
    }, 200);
  };

  const isServicesActive = [
    '/instagram-management',
    '/web-development',
    '/graphic-designing'
  ].includes(location.pathname);

  return (
    <>
      <header className={`floating-navbar ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="nav-container">
          {/* Left: Brand Logo & Text */}
          <Link to="/" className="brand-logo">
            <div className="logo-icon-wrap">
              <img
                src="/logo.png"
                alt="GrowVora Logo"
                className="brand-logo-img"
              />
            </div>
            <span className="brand-name">GROWVORA</span>
            <span className="brand-dot" />
          </Link>

          {/* Center: Editorial Nav Links with Services Dropdown */}
          <nav className="nav-center-links">
            <NavLink
              to="/projects"
              className={({ isActive }) => `nav-item ${isActive ? 'is-active' : ''}`}
            >
              <span>Work</span>
            </NavLink>

            {/* Services Dropdown Item */}
            <div
              className="nav-dropdown-trigger"
              onMouseEnter={handleMouseEnterServices}
              onMouseLeave={handleMouseLeaveServices}
            >
              <button
                className={`nav-item services-btn ${isServicesActive ? 'is-active' : ''}`}
                onClick={() => setServicesDropdownOpen(prev => !prev)}
                aria-expanded={servicesDropdownOpen}
              >
                <span>Services</span>
                <FiChevronDown className={`chevron-icon ${servicesDropdownOpen ? 'rotate' : ''}`} />
              </button>

              <AnimatePresence>
                {servicesDropdownOpen && (
                  <motion.div
                    className="services-mega-dropdown"
                    initial={{ opacity: 0, y: 12, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="dropdown-inner-list">
                      {serviceItems.map((item) => (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          className={({ isActive }) => `dropdown-service-card ${isActive ? 'active' : ''}`}
                        >
                          <div className="dropdown-icon-box">
                            {item.icon}
                          </div>
                          <div className="dropdown-text-box">
                            <span className="dropdown-item-title">{item.name}</span>
                            <span className="dropdown-item-desc">{item.desc}</span>
                          </div>
                          <FiArrowUpRight className="dropdown-arrow" />
                        </NavLink>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <NavLink
              to="/team"
              className={({ isActive }) => `nav-item ${isActive ? 'is-active' : ''}`}
            >
              <span>Team</span>
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) => `nav-item ${isActive ? 'is-active' : ''}`}
            >
              <span>About</span>
            </NavLink>

            <NavLink
              to="/admin"
              className={({ isActive }) => `nav-item nav-admin-item ${isActive ? 'is-active' : ''}`}
              title="GrowVora Admin Module & Management Console"
            >
              <span>Admin</span>
              <span className="nav-admin-badge">PORTAL</span>
            </NavLink>
          </nav>

          {/* Right: Theme Toggle & Action Button */}
          <div className="nav-right-action">
            <SearchBar />
            <button
              className="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label="Toggle light / dark mode"
              title={isLightMode ? "Switch to Dark Mode" : "Switch to Light Mode"}
            >
              <div className="toggle-thumb">
                <AnimatePresence mode="wait">
                  {isLightMode ? (
                    <motion.div
                      key="moon"
                      initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                      animate={{ rotate: 0, opacity: 1, scale: 1 }}
                      exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FiMoon />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="sun"
                      initial={{ rotate: 90, opacity: 0, scale: 0.6 }}
                      animate={{ rotate: 0, opacity: 1, scale: 1 }}
                      exit={{ rotate: -90, opacity: 0, scale: 0.6 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FiSun />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </button>

            <Link to="/contact" className="nav-talk-btn">
              <span>Let's Talk</span>
              <FiArrowUpRight className="arrow-icon" />
            </Link>

            <button
              className="mobile-hamburger"
              onClick={() => setIsOpen(true)}
              aria-label="Open Menu"
            >
              <FiMenu />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="mobile-menu-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="mobile-menu-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="drawer-header">
                <div className="drawer-logo-group">
                  <img
                    src="https://cdn.corenexis.com/f/pzO06agieXb.png"
                    alt="GrowVora Logo"
                    className="drawer-logo-img"
                  />
                  <span className="drawer-title">GROWVORA</span>
                </div>

                <div className="drawer-header-actions">
                  <button
                    className="theme-toggle-btn in-drawer"
                    onClick={toggleTheme}
                    aria-label="Toggle Mode"
                  >
                    <div className="toggle-thumb">
                      {isLightMode ? <FiMoon /> : <FiSun />}
                    </div>
                  </button>

                  <button
                    className="drawer-close-btn"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close Menu"
                  >
                    <FiX />
                  </button>
                </div>
              </div>

              <div className="drawer-nav">
                <NavLink
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => `drawer-link ${isActive ? 'active' : ''}`}
                >
                  <span className="drawer-num">01</span>
                  <span className="drawer-text">Home</span>
                </NavLink>

                <NavLink
                  to="/projects"
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => `drawer-link ${isActive ? 'active' : ''}`}
                >
                  <span className="drawer-num">02</span>
                  <span className="drawer-text">Work / Projects</span>
                </NavLink>

                {/* Mobile Services Group */}
                <div className="drawer-services-group">
                  <span className="drawer-group-label">ALL SERVICES</span>
                  <div className="drawer-sub-links">
                    {serviceItems.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) => `drawer-sub-item ${isActive ? 'active' : ''}`}
                      >
                        <span className="sub-icon">{item.icon}</span>
                        <span className="sub-title">{item.name}</span>
                      </NavLink>
                    ))}
                  </div>
                </div>

                <NavLink
                  to="/team"
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => `drawer-link ${isActive ? 'active' : ''}`}
                >
                  <span className="drawer-num">04</span>
                  <span className="drawer-text">Team</span>
                </NavLink>

                <NavLink
                  to="/about"
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => `drawer-link ${isActive ? 'active' : ''}`}
                >
                  <span className="drawer-num">05</span>
                  <span className="drawer-text">About Studio</span>
                </NavLink>

                <NavLink
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => `drawer-link ${isActive ? 'active' : ''}`}
                >
                  <span className="drawer-num">06</span>
                  <span className="drawer-text">Dashboard</span>
                </NavLink>

                <NavLink
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => `drawer-link drawer-admin-link ${isActive ? 'active' : ''}`}
                >
                  <span className="drawer-num">07</span>
                  <span className="drawer-text">Admin Module</span>
                  <span className="drawer-badge">PORTAL</span>
                </NavLink>
              </div>

              <div className="drawer-footer">
                <Link
                  to="/contact"
                  className="drawer-cta-btn"
                  onClick={() => setIsOpen(false)}
                >
                  Start a Project <FiArrowUpRight />
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
