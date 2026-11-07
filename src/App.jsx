import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import Background3DCanvas from './components/3D/Background3DCanvas';
import Custom3DCursor from './components/3D/Custom3DCursor';
import { initRealtimeSync, syncFromCloud } from './admin/services/adminStorage';

import Home from './pages/Home/Home';
import Dashboard from './pages/Dashboard/Dashboard';
import InstagramManagement from './pages/InstagramManagement/InstagramManagement';
import WebDevelopment from './pages/WebDevelopment/WebDevelopment';
import GraphicDesigning from './pages/GraphicDesigning/GraphicDesigning';
import Projects from './pages/Projects/Projects';
import ProjectDetails from './pages/ProjectDetails/ProjectDetails';
import About from './pages/About/About';
import Team from './pages/Team/Team';
import Contact from './pages/Contact/Contact';
import NotFound from './pages/NotFound/NotFound';
import FAQChatbot from './components/FAQChatbot/FAQChatbot';
import AdminApp from './admin/AdminApp';

function AppContent({ isLoading, setIsLoading }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Initialize Supabase Realtime synchronization across all devices
  useEffect(() => {
    initRealtimeSync();

    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible') {
        syncFromCloud();
      }
    };

    window.addEventListener('focus', handleVisibilityOrFocus);
    document.addEventListener('visibilitychange', handleVisibilityOrFocus);

    return () => {
      window.removeEventListener('focus', handleVisibilityOrFocus);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
    };
  }, []);

  return (
    <>
      {!isAdminRoute && <Custom3DCursor />}
      <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />
      {!isAdminRoute && <Background3DCanvas />}
      
      <ScrollToTop />
      <div 
        className={`app-container ${isAdminRoute ? 'admin-mode' : ''}`} 
        style={{ position: 'relative', zIndex: 1 }}
      >
        {!isAdminRoute && <Navbar />}
        <main className={`main-content ${isAdminRoute ? 'admin-main-content' : ''}`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/instagram-management" element={<InstagramManagement />} />
            <Route path="/web-development" element={<WebDevelopment />} />
            <Route path="/graphic-designing" element={<GraphicDesigning />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/team" element={<Team />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Admin Panel Portal */}
            <Route path="/admin/*" element={<AdminApp />} />
            <Route path="/admin" element={<AdminApp />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        {!isAdminRoute && <Footer />}
        {!isAdminRoute && <FAQChatbot />}
      </div>
    </>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Router>
      <AppContent isLoading={isLoading} setIsLoading={setIsLoading} />
    </Router>
  );
}

export default App;
