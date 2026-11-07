import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import ProjectModal from '../../components/ProjectModal/ProjectModal';
import CTASection from '../../components/CTASection/CTASection';
import SectionTitle from '../../components/SectionTitle/SectionTitle';
import { getProjects } from '../../data/projects';
import { subscribeToDataUpdates } from '../../admin/services/adminStorage';
import './Projects.scss';

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [projectsList, setProjectsList] = useState(() => getProjects());

  useEffect(() => {
    return subscribeToDataUpdates(() => {
      setProjectsList(getProjects());
    });
  }, []);

  const filters = ['All', 'Instagram', 'Web Development', 'Graphic Design', 'Branding'];
  
  const filteredProjects = useMemo(() => {
    let result = projectsList;
    
    // Apply category filter
    if (activeFilter !== 'All') {
      result = result.filter(p => p.service === activeFilter || (activeFilter === 'Graphic Design' && p.service === 'Branding'));
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(query) || 
        p.category.toLowerCase().includes(query) || 
        p.service.toLowerCase().includes(query)
      );
    }
    
    return result;
  }, [activeFilter, searchQuery]);

  return (
    <div className="projects-page pt-20">
      <ProjectModal isOpen={!!selectedProject} project={selectedProject} onClose={() => setSelectedProject(null)} />
      
      <div className="container">
        <SectionTitle 
          title="Our Portfolio" 
          subtitle="Explore our successful campaigns, beautifully designed websites, and powerful brand identities."
          centered
        />

        <div className="projects-controls mb-12">
          <div className="filters-container">
            {filters.map(filter => (
              <button 
                key={filter}
                className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
          
          <div className="search-container">
            <FiSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search projects..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input form-control"
            />
          </div>
        </div>

        <motion.div className="projects-grid mb-20" layout>
          <AnimatePresence>
            {filteredProjects.length > 0 ? (
              filteredProjects.map(project => (
                <ProjectCard key={project.id} project={project} onClick={setSelectedProject} />
              ))
            ) : (
              <motion.div 
                className="no-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h3>No projects found</h3>
                <p>Try another category or search term.</p>
                <button 
                  className="btn btn-outline mt-4" 
                  onClick={() => {
                    setActiveFilter('All');
                    setSearchQuery('');
                  }}
                >
                  Clear Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      
      <CTASection />
    </div>
  );
};

export default Projects;
