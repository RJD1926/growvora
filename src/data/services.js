export const services = [
  {
    id: "instagram-management",
    title: "Instagram Management",
    description: "We craft organic content strategies, manage daily community engagement, and launch highly targeted ad campaigns to actually convert followers into paying customers.",
    features: [
      "Custom Content Calendars",
      "Short-form Video Production",
      "Audience Community Management",
      "Paid Ad Strategy"
    ],
    path: "/instagram-management",
    icon: "instagram"
  },
  {
    id: "web-development",
    title: "Web Development",
    description: "We build blazing-fast, technically optimized websites using modern frameworks that don't just look pretty, but are engineered to capture and convert leads.",
    features: [
      "Business Websites",
      "E-commerce Solutions",
      "Landing Pages",
      "Website Maintenance"
    ],
    path: "/web-development",
    icon: "https://cdn.corenexis.com/f/pzO06agieXb.png"
  },
  {
    id: "graphic-designing",
    title: "Graphic Designing",
    description: "From corporate rebranding to bespoke social assets, we create visual systems that communicate your core values and differentiate you from competitors.",
    features: [
      "Brand Identity & Logo Systems",
      "Corporate Pitch Decks",
      "Bespoke Social Assets",
      "Print & Packaging Design"
    ],
    path: "/graphic-designing",
    icon: "design"
  }
];

const ADMIN_SERVICES_KEY = 'growvora_admin_services_v1';

export const getServices = () => {
  try {
    const adminRaw = localStorage.getItem(ADMIN_SERVICES_KEY);
    if (adminRaw) {
      const parsed = JSON.parse(adminRaw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    return services;
  } catch (error) {
    return services;
  }
};
