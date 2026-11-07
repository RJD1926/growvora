export const team = [
  {
    id: "harshil-pawar",
    name: "Harshil Pawar",
    role: "Founder",
    image: "/imgs/harshil.png",
    linkedin: "#",
    instagram: "https://www.instagram.com/pawar_harshil19/"
  },
  {
    id: "yugal-solanki",
    name: "Yugal Solanki",
    role: "Manager / Account Handler",
    image: "/imgs/yug.png",
    linkedin: "#",
    instagram: "https://www.instagram.com/yugal__solanki/"
  },
  {
    id: "dharmesh-bhatt",
    name: "Dharmesh Bhatt",
    role: "Graphic Designer",
    image: "/imgs/db.png",
    linkedin: "#",
    instagram: "https://www.instagram.com/dharmeshbhatt18/"
  },
  {
    id: "yug-solanki",
    name: "Yug Solanki",
    role: "Content Writer / Reel Researcher",
    image: "/imgs/yugal.png",
    linkedin: "#",
    instagram: "https://www.instagram.com/yug.solanki2007/"
  },
  {
    id: "rudra-dave",
    name: "Rudra Dave",
    role: "Web Developer",
    image: "https://avatars.githubusercontent.com/u/197351114?s=400&u=748c018f12b66f8aadb77b66c5412f7a67427709&v=4",
    linkedin: "#",
    instagram: "https://www.instagram.com/rudra__1926/",
    github: "https://github.com/RJD1926"
  },
  {
    id: "bhavya-solanki",
    name: "Bhavya Solanki",
    role: "Web/AI Developer",
    image: "https://avatars.githubusercontent.com/u/154740336?v=4",
    linkedin: "#",
    instagram: "https://www.instagram.com/bhavyasolanki_07/",
    github: "https://github.com/BSS2707"
  }
];

const ADMIN_TEAM_KEY = 'growvora_admin_team_v1';

export const getTeam = () => {
  try {
    const adminTeamRaw = localStorage.getItem(ADMIN_TEAM_KEY);
    if (adminTeamRaw) {
      const parsed = JSON.parse(adminTeamRaw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    return team;
  } catch (error) {
    return team;
  }
};
