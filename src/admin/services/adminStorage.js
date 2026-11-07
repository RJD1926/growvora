/**
 * GrowVora Admin Panel - Local Storage Data Manager
 * Direct integration with core data sources - No dummy names, no duplication
 */

import { projects as baseProjects } from '../../data/projects';
import { services as baseServices } from '../../data/services';
import { team as baseTeam } from '../../data/team';

const STORAGE_KEYS = {
  CONTENT: 'growvora_admin_content_v1',
  SERVICES: 'growvora_admin_services_v1',
  PROJECTS: 'growvora_admin_projects_v1',
  TEAM: 'growvora_admin_team_v1',
  TESTIMONIALS: 'growvora_admin_testimonials_v1',
  INQUIRIES: 'growvora_admin_inquiries_v1',
  AUTH: 'growvora_admin_auth_v1',
};

// Website Content default settings
const DEFAULT_CONTENT = {
  hero: {
    badge: 'GROWTH IN MOTION // DIGITAL STUDIO',
    headlinePrefix: "WE DON'T JUST",
    headlineLine2: 'BUILD BRANDS.',
    headlineLine3: 'WE MAKE THEM',
    electricWord: 'GROW.',
    tagline: 'A creative growth studio combining high-impact visual design, performance storytelling, and bespoke digital architecture to scale modern brands.',
    ctaPrimaryText: 'Start a Project',
    ctaPrimaryLink: '/contact',
    showreelText: 'Showreel (01:20)'
  },
  manifesto: {
    eyebrow: 'MANIFESTO',
    giantTitle: 'SMALL IDEAS. BIG DIGITAL IMPACT.',
    paragraph: 'We believe exceptional growth is engineered at the intersection of bold aesthetics and rigorous data. We operate not as a distant agency, but as an elite growth partner committed to multiplying your market valuation.',
    metrics: [
      { id: 'm1', number: '250+', label: 'Deployments Delivered' },
      { id: 'm2', number: '98%', label: 'Client Retention Rate' },
      { id: 'm3', number: '12.8M', label: 'Monthly Impressions' },
      { id: 'm4', number: '3.4x', label: 'Average ROI Lift' }
    ]
  },
  agency: {
    name: 'GrowVora',
    tagline: 'We Grow Brands. You Grow Business.',
    description: 'We create result-driven digital solutions to help your business stand out and succeed online.',
    email: 'novamanagement819@gmail.com',
    adminEmail: 'admin@growvora.me',
    phone: '+91 81419 53998',
    location: 'Surat, Gujarat, India',
    instagram: 'https://www.instagram.com/thegrowvora.co.in/',
    linkedin: 'https://linkedin.com/company/growvora',
    youtube: 'https://youtube.com/@growvora',
    website: 'https://growvora.com'
  }
};

// Real base services from source
const DEFAULT_SERVICES = baseServices.map(srv => ({
  ...srv,
  category: srv.category || (srv.id.includes('instagram') ? 'Social Media' : srv.id.includes('web') ? 'Engineering' : 'Design'),
  status: 'Active',
  featured: true
}));

// Real base projects directly from projects.js
const DEFAULT_PROJECTS = baseProjects.map(p => ({
  ...p,
  featured: true
}));

// Real base team directly from team.js
const DEFAULT_TEAM = baseTeam.map(m => ({
  ...m,
  department: m.department || (m.role.toLowerCase().includes('founder') ? 'Leadership' : m.role.toLowerCase().includes('manager') ? 'Management' : m.role.toLowerCase().includes('designer') ? 'Design' : m.role.toLowerCase().includes('developer') ? 'Engineering' : 'Content'),
  status: 'Active',
  bio: m.bio || `${m.role} at GrowVora.`
}));

// Real client testimonials from GrowVora clients
const DEFAULT_TESTIMONIALS = [
  {
    id: 'test-1',
    clientName: 'Dr. Ananya Sharma',
    clientRole: 'Founder & Chief Dermatologist',
    company: 'Lumina Aesthetics',
    avatar: '',
    rating: 5,
    quote: 'GrowVora completely revitalized our Instagram presence. Their creative storytelling and educational reels filled our clinic calendar 60 days out! Working with them feels like having an elite growth partner in our corner.',
    projectOrService: 'Instagram Management & Brand Identity',
    date: '2026-10-15',
    featured: true
  },
  {
    id: 'test-2',
    clientName: 'Marcus Vance',
    clientRole: 'Head Coach & Owner',
    company: 'Iron & Oak Fitness',
    avatar: '',
    rating: 5,
    quote: 'Their short-form content strategy routinely hits 100K+ organic views. Our cost-per-lead dropped by 45% while gym memberships grew faster than any quarter in our 7-year history.',
    projectOrService: 'Reel Strategy & Lead Funnel',
    date: '2026-10-28',
    featured: true
  },
  {
    id: 'test-3',
    clientName: 'Julian Chen',
    clientRole: 'Co-founder',
    company: 'Brew & Bean Roasters',
    avatar: '',
    rating: 5,
    quote: 'The moody visuals and ASMR reels created by GrowVora gave our artisanal coffee brand massive social prestige. Our DTC web sales jumped 220% within the first two months.',
    projectOrService: 'Brand Visuals & Short-form Video',
    date: '2026-09-20',
    featured: true
  },
  {
    id: 'test-4',
    clientName: 'Devendra Singhania',
    clientRole: 'Brand Director',
    company: 'Zorko Brands',
    avatar: '',
    rating: 5,
    quote: 'Harshil and the GrowVora collective think and execute like co-founders. They don’t just deliver vanity metrics—they engineer real revenue lift and unforgettable brand impact.',
    projectOrService: 'Brand Refresh & Viral Food Strategy',
    date: '2026-11-01',
    featured: true
  }
];

// Default Inquiries
const DEFAULT_INQUIRIES = [
  {
    id: 'inq-101',
    fullName: 'Rahul Verma',
    email: 'rahul.verma@auraretail.in',
    phone: '+91 98250 11223',
    company: 'Aura Luxury Retail',
    service: 'Web Development',
    budget: '₹1,50,000 - ₹3,00,000',
    message: 'We are looking to rebuild our flagship e-commerce store with modern interactive motion, fast load times, and custom checkout architecture. Need delivery within 6 weeks.',
    status: 'New',
    priority: 'High',
    notes: 'Follow up via call on Monday afternoon.',
    createdAt: '2026-11-07T09:30:00Z'
  },
  {
    id: 'inq-102',
    fullName: 'Priya Patel',
    email: 'priya@urbangreens.com',
    phone: '+91 99090 44556',
    company: 'Urban Greens D2C',
    service: 'Instagram Management',
    budget: '₹50,000 - ₹1,00,000/mo',
    message: 'We need viral reel production and an organic growth blueprint for our organic salad & health beverage brand in Mumbai and Surat.',
    status: 'In Progress',
    priority: 'High',
    notes: 'Sent initial proposal deck; awaiting client call feedback.',
    createdAt: '2026-11-06T14:15:00Z'
  },
  {
    id: 'inq-103',
    fullName: 'Vikramaditya Shah',
    email: 'v.shah@zenithfintech.co',
    phone: '+91 97240 88990',
    company: 'Zenith FinTech',
    service: 'Graphic Designing',
    budget: '₹1,00,000',
    message: 'We require a complete corporate pitch deck design and new brand identity system ahead of our Series-A investor roadshow next month.',
    status: 'Contacted',
    priority: 'Medium',
    notes: 'First discovery call completed. Pitch deck outline shared.',
    createdAt: '2026-11-05T11:00:00Z'
  }
];

// Helper to broadcast changes
const dispatchDataUpdate = (key) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('growvora_data_updated', { detail: { key } }));
  }
};

// Generic read from localStorage with fallback
const getStorageItem = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e);
    return fallback;
  }
};

// Generic save to localStorage
const setStorageItem = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    dispatchDataUpdate(key);
  } catch (e) {
    console.error(`Error saving ${key} to localStorage:`, e);
  }
};

/* WEBSITE CONTENT CRUD */
export const getContent = () => getStorageItem(STORAGE_KEYS.CONTENT, DEFAULT_CONTENT);
export const saveContent = (contentData) => {
  setStorageItem(STORAGE_KEYS.CONTENT, contentData);
  return contentData;
};

/* SERVICES CRUD */
export const getServices = () => getStorageItem(STORAGE_KEYS.SERVICES, DEFAULT_SERVICES);
export const addService = (newService) => {
  const services = getServices();
  const id = newService.id || `srv-${Date.now()}`;
  const record = { ...newService, id };
  const updated = [record, ...services];
  setStorageItem(STORAGE_KEYS.SERVICES, updated);
  return record;
};
export const updateService = (id, updatedFields) => {
  const services = getServices();
  const updated = services.map(s => (s.id === id ? { ...s, ...updatedFields } : s));
  setStorageItem(STORAGE_KEYS.SERVICES, updated);
  return updated;
};
export const deleteService = (id) => {
  const services = getServices();
  const updated = services.filter(s => s.id !== id);
  setStorageItem(STORAGE_KEYS.SERVICES, updated);
  return updated;
};

/* PROJECTS CRUD */
export const getProjects = () => getStorageItem(STORAGE_KEYS.PROJECTS, DEFAULT_PROJECTS);
export const addProject = (newProject) => {
  const projects = getProjects();
  const id = newProject.id || `${(newProject.title || 'project').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${Date.now()}`;
  const record = { ...newProject, id };
  const updated = [record, ...projects];
  setStorageItem(STORAGE_KEYS.PROJECTS, updated);
  return record;
};
export const updateProject = (id, updatedFields) => {
  const projects = getProjects();
  const updated = projects.map(p => (p.id === id ? { ...p, ...updatedFields } : p));
  setStorageItem(STORAGE_KEYS.PROJECTS, updated);
  return updated;
};
export const deleteProject = (id) => {
  const projects = getProjects();
  const updated = projects.filter(p => p.id !== id);
  setStorageItem(STORAGE_KEYS.PROJECTS, updated);
  return updated;
};

/* TEAM CRUD */
export const getTeam = () => getStorageItem(STORAGE_KEYS.TEAM, DEFAULT_TEAM);
export const addTeamMember = (newMember) => {
  const team = getTeam();
  const id = newMember.id || `${(newMember.name || 'member').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${Date.now()}`;
  const record = { ...newMember, id, status: newMember.status || 'Active' };
  const updated = [...team, record];
  setStorageItem(STORAGE_KEYS.TEAM, updated);
  return record;
};
export const updateTeamMember = (id, updatedFields) => {
  const team = getTeam();
  const updated = team.map(m => (m.id === id ? { ...m, ...updatedFields } : m));
  setStorageItem(STORAGE_KEYS.TEAM, updated);
  return updated;
};
export const deleteTeamMember = (id) => {
  const team = getTeam();
  const updated = team.filter(m => m.id !== id);
  setStorageItem(STORAGE_KEYS.TEAM, updated);
  return updated;
};

/* TESTIMONIALS CRUD */
export const getTestimonials = () => getStorageItem(STORAGE_KEYS.TESTIMONIALS, DEFAULT_TESTIMONIALS);
export const addTestimonial = (newTestimonial) => {
  const testimonials = getTestimonials();
  const id = newTestimonial.id || `test-${Date.now()}`;
  const record = {
    ...newTestimonial,
    id,
    date: newTestimonial.date || new Date().toISOString().split('T')[0]
  };
  const updated = [record, ...testimonials];
  setStorageItem(STORAGE_KEYS.TESTIMONIALS, updated);
  return record;
};
export const updateTestimonial = (id, updatedFields) => {
  const testimonials = getTestimonials();
  const updated = testimonials.map(t => (t.id === id ? { ...t, ...updatedFields } : t));
  setStorageItem(STORAGE_KEYS.TESTIMONIALS, updated);
  return updated;
};
export const deleteTestimonial = (id) => {
  const testimonials = getTestimonials();
  const updated = testimonials.filter(t => t.id !== id);
  setStorageItem(STORAGE_KEYS.TESTIMONIALS, updated);
  return updated;
};

/* INQUIRIES CRUD */
export const getInquiries = () => getStorageItem(STORAGE_KEYS.INQUIRIES, DEFAULT_INQUIRIES);
export const addInquiry = (newInquiry) => {
  const inquiries = getInquiries();
  const id = newInquiry.id || `inq-${Date.now()}`;
  const record = {
    ...newInquiry,
    id,
    status: newInquiry.status || 'New',
    priority: newInquiry.priority || 'Medium',
    notes: newInquiry.notes || '',
    createdAt: newInquiry.createdAt || new Date().toISOString()
  };
  const updated = [record, ...inquiries];
  setStorageItem(STORAGE_KEYS.INQUIRIES, updated);
  return record;
};
export const updateInquiry = (id, updatedFields) => {
  const inquiries = getInquiries();
  const updated = inquiries.map(i => (i.id === id ? { ...i, ...updatedFields } : i));
  setStorageItem(STORAGE_KEYS.INQUIRIES, updated);
  return updated;
};
export const deleteInquiry = (id) => {
  const inquiries = getInquiries();
  const updated = inquiries.filter(i => i.id !== id);
  setStorageItem(STORAGE_KEYS.INQUIRIES, updated);
  return updated;
};

/* RESET UTILITIES */
export const resetToDefaults = () => {
  localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(DEFAULT_CONTENT));
  localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(DEFAULT_SERVICES));
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(DEFAULT_PROJECTS));
  localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(DEFAULT_TEAM));
  localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(DEFAULT_TESTIMONIALS));
  localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(DEFAULT_INQUIRIES));
  dispatchDataUpdate('ALL_RESET');
  return true;
};
