// mockStorage.js
const STORAGE_KEYS = {
  USERS: "hicet_users",
  UPDATES: "hicet_updates",
  JOBS: "hicet_local_jobs",
  STUDENTS: "hicet_hall_of_fame",
  ANNOUNCEMENTS: "hicet_announcements",
  APPLICATIONS: "hicet_applications",
  SESSION: "hicet_session",
};

const INITIAL_DATA = {
  users: [
    { username: "admin", password: "admin123", roles: ["Admin"], name: "Admin User", dept: "Placement Cell" },
    { username: "student", password: "student123", roles: ["Student"], name: "Viknesh K", dept: "CSE", skills: ["React", "Node.js", "MySQL"] },
  ],
  updates: [
    { id: 1, company: "Google", role: "SDE Intern", date: "2024-04-10", status: "Upcoming", color: "primary", location: "Bangalore", type: "Full-time", appliedCount: 145, shortlistedCount: 20, selectedCount: 0 },
    { id: 2, company: "Microsoft", role: "UX Intern", date: "2024-04-12", status: "Open", color: "success", location: "Hyderabad", type: "Full-time", appliedCount: 320, shortlistedCount: 50, selectedCount: 15 },
    { id: 3, company: "Amazon", role: "SDE-1", date: "2024-04-14", status: "Completed", color: "warning", location: "Coimbatore", type: "Full-time", appliedCount: 500, shortlistedCount: 80, selectedCount: 42 },
  ],
  jobs: [
    { id: 1, title: "Cafe Manager", employer: "Emerald Brew", type: "Part-time", pay: "₹8,000", category: "Hospitality", description: "Near college gate." },
    { id: 2, title: "Web Developer", employer: "TechSpark", type: "Internship", pay: "₹15,000", category: "IT", description: "Startup in Coimbatore." },
  ],
  students: [
    { id: 101, name: "Viknesh K", company: "Google", package: "24 LPA", year: "2024", dept: "CSE", status: "Selected" },
    { id: 102, name: "Sanjay K", company: "Amazon", package: "18 LPA", year: "2024", dept: "ECE", status: "Selected" },
  ],
  announcements: [
    { id: 1, title: "Google Drive Updated", content: "The interview dates for Google have been shifted back by 2 days.", date: new Date().toISOString(), author: "Dr. Sanjay (Director)" },
    { id: 2, title: "Soft Skills Workshop", content: "Mandatory workshop for all final year students tomorrow at 10 AM.", date: new Date().toISOString(), author: "Placement Cell" },
  ],
  applications: [
    { id: 1, studentId: "student", placementId: 1, company: "Google", role: "SDE Intern", status: "Shortlisted", date: new Date().toISOString() },
  ]
};

export const mockStorage = {
  init: () => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_DATA.users));

    Object.keys(STORAGE_KEYS).forEach((key) => {
      if (key === "USERS") return;
      const dataKey = key.toLowerCase();
      if (!localStorage.getItem(STORAGE_KEYS[key]) && INITIAL_DATA[dataKey]) {
        localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(INITIAL_DATA[dataKey]));
      }
    });
  },

  get: (key) => JSON.parse(localStorage.getItem(STORAGE_KEYS[key])) || [],

  set: (key, data) => localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(data)),

  login: (username, password) => {
    const users = mockStorage.get("USERS");
    const user = users.find((u) => u.username === username && u.password === password);
    if (user) {
      const session = { user, token: "mock-jwt-token-" + Date.now() };
      return { success: true, data: session, message: "Login successful" };
    }
    return { success: false, message: "Invalid username or password" };
  },

  add: (key, item) => {
    const data = mockStorage.get(key);
    const newItem = { ...item, id: Date.now(), date: new Date().toISOString() };
    mockStorage.set(key, [newItem, ...data]);
    return newItem;
  },

  update: (key, id, updates) => {
    const data = mockStorage.get(key);
    const updatedData = data.map(item => item.id === id ? { ...item, ...updates } : item);
    mockStorage.set(key, updatedData);
    return updatedData.find(item => item.id === id);
  },

  delete: (key, id) => {
    const data = mockStorage.get(key);
    mockStorage.set(key, data.filter((item) => item.id !== id));
  },
};
