import { createContext, useContext, useState, useEffect } from 'react';
import { DEMO_PROPERTIES } from '@/lib/demoProperties';

const AdminDataContext = createContext();
const STORAGE_KEY = 'nepal_estates_admin_v3';

export const AGENTS = [
  'Ramesh Shrestha', 'Sunita Pradhan', 'Bikash Gurung', 'Arun Bajracharya',
  'Priya Tamrakar', 'Anjali Maharjan', 'Dipak Karmacharya', 'Sushma Khadka',
  'Deepak Paudel', 'Binod Adhikari',
];

export const MONTHLY_DATA = [
  { month: 'Nov', listings: 4, inquiries: 8 },
  { month: 'Dec', listings: 6, inquiries: 12 },
  { month: 'Jan', listings: 9, inquiries: 18 },
  { month: 'Feb', listings: 12, inquiries: 22 },
  { month: 'Mar', listings: 14, inquiries: 31 },
  { month: 'Apr', listings: 17, inquiries: 28 },
];

const SEED_VIEWS = [
  120, 340, 89, 456, 210, 67, 580, 145, 720, 198, 312, 88, 540, 267, 183,
  421, 95, 348, 614, 231, 177, 402, 156, 293, 71, 508, 139, 384, 215, 463,
  118, 372, 241, 89, 416, 297, 153, 528, 184, 367, 94, 437, 262, 81, 349,
  207, 131, 476, 223, 88,
];
const SEED_INQ = [
  3,7,2,5,1,2,9,1,11,2,4,1,6,3,5,2,1,8,12,3,2,5,1,4,1,7,2,6,3,2,
  1,3,1,2,1,4,2,3,1,5,2,1,3,1,2,1,2,3,1,1,
];
const SEED_STATUS = [
  'Active','Active','Active','Active','Pending','Sold','Rented',
  'Active','Active','Active','Active','Active','Active','Active','Active',
];

const INITIAL_PROPERTIES = DEMO_PROPERTIES.map((p, i) => ({
  ...p,
  admin_status: SEED_STATUS[i % SEED_STATUS.length],
  views: SEED_VIEWS[i] ?? 150,
  inquiries_count: SEED_INQ[i] ?? 2,
}));

const INITIAL_INQUIRIES = [
  { id: 1, name: 'Arjun Thapa', email: 'arjun.thapa@gmail.com', phone: '+977-980-1112233', property: 'Modern 3BHK Apartment in Thamel', propertyId: 'demo-1', assignedAgent: 'Ramesh Shrestha', message: 'I am interested in viewing this property this weekend. Please let me know availability.', date: '2026-04-30', status: 'New' },
  { id: 2, name: 'Priya Rai', email: 'priya.rai@yahoo.com', phone: '+977-984-2223344', property: 'Luxury 5BHK Villa with Garden & Pool', propertyId: 'demo-2', assignedAgent: 'Sunita Pradhan', message: 'Is the swimming pool heated? What is the minimum lease period?', date: '2026-04-29', status: 'Contacted' },
  { id: 3, name: 'Sanjay Gurung', email: 'sanjay.gurung@hotmail.com', phone: '+977-986-3334455', property: 'Cozy 4BHK House near Fewa Lake', propertyId: 'demo-3', assignedAgent: 'Bikash Gurung', message: 'We are a family of 5 looking to rent from June. Are pets allowed?', date: '2026-04-28', status: 'New' },
  { id: 4, name: 'Meena Sharma', email: 'meena.sharma@gmail.com', phone: '+977-981-4445566', property: 'Prime Commercial Space in New Road', propertyId: 'demo-4', assignedAgent: 'Anjali Maharjan', message: 'Looking to open a pharmacy. What is the electrical capacity?', date: '2026-04-27', status: 'Closed' },
  { id: 5, name: 'Rohan Basnet', email: 'rohan.basnet@gmail.com', phone: '+977-985-5556677', property: 'Residential Plot in Suryamadhi', propertyId: 'demo-5', assignedAgent: 'Dipak Karmacharya', message: 'Interested in buying. Is the price negotiable?', date: '2026-04-26', status: 'Contacted' },
  { id: 6, name: 'Kavita Joshi', email: 'kavita.joshi@gmail.com', phone: '+977-982-6667788', property: 'Furnished Studio near Pulchowk Campus', propertyId: 'demo-6', assignedAgent: 'Priya Tamrakar', message: 'I am a student at IOE. Is it available from May 1st?', date: '2026-04-25', status: 'New' },
  { id: 7, name: 'Bikram Lama', email: 'bikram.lama@gmail.com', phone: '+977-980-7778899', property: 'Penthouse Apartment in Lazimpat', propertyId: 'demo-9', assignedAgent: 'Arun Bajracharya', message: 'Please arrange a viewing at your earliest convenience.', date: '2026-04-24', status: 'Contacted' },
  { id: 8, name: 'Sunita Magar', email: 'sunita.magar@gmail.com', phone: '+977-984-8889900', property: 'Traditional Newari House in Bhaktapur', propertyId: 'demo-13', assignedAgent: 'Dipak Karmacharya', message: 'We are interested in converting this to a heritage boutique hotel.', date: '2026-04-23', status: 'New' },
  { id: 9, name: 'Nabin Poudel', email: 'nabin.poudel@gmail.com', phone: '+977-986-9990011', property: 'Restaurant Space in Lakeside, Pokhara', propertyId: 'demo-25', assignedAgent: 'Bikash Gurung', message: 'I am a restaurateur with 10 years experience. Very interested.', date: '2026-04-22', status: 'Contacted' },
  { id: 10, name: 'Anita Shrestha', email: 'anita.shrestha@gmail.com', phone: '+977-985-0001122', property: 'Commercial Plot in Chabahil', propertyId: 'demo-28', assignedAgent: 'Ramesh Shrestha', message: 'We are a hotel development company. Please send all documentation.', date: '2026-04-21', status: 'Closed' },
  { id: 11, name: 'Dipendra KC', email: 'dipendra.kc@gmail.com', phone: '+977-981-1112233', property: 'Luxury Villa in Dhulikhel', propertyId: 'demo-39', assignedAgent: 'Sunita Pradhan', message: 'Price looks good. Can we do a site visit this coming Saturday?', date: '2026-04-20', status: 'New' },
  { id: 12, name: 'Rekha Tamang', email: 'rekha.tamang@gmail.com', phone: '+977-980-2223344', property: '3BHK Apartment in Butwal', propertyId: 'demo-33', assignedAgent: 'Sushma Khadka', message: 'Is there a grocery store nearby? We are relocating from Kathmandu.', date: '2026-04-19', status: 'New' },
  { id: 13, name: 'Suresh Bhandari', email: 'suresh.bhandari@gmail.com', phone: '+977-977-3334455', property: '3BHK House for Rent in Itahari', propertyId: 'demo-37', assignedAgent: 'Arun Bajracharya', message: 'We need it for 2 years minimum. Is that acceptable?', date: '2026-04-18', status: 'Contacted' },
  { id: 14, name: 'Kamala Rana', email: 'kamala.rana@gmail.com', phone: '+977-971-4445566', property: 'Residential Land in Bhairahawa', propertyId: 'demo-48', assignedAgent: 'Sushma Khadka', message: 'Near which landmark exactly? Please confirm.', date: '2026-04-17', status: 'New' },
  { id: 15, name: 'Pratap Oli', email: 'pratap.oli@gmail.com', phone: '+977-975-5556677', property: 'Scenic Land for Sale in Tansen', propertyId: 'demo-50', assignedAgent: 'Sushma Khadka', message: 'I grew up in Tansen. Very interested in this plot.', date: '2026-04-16', status: 'Contacted' },
];

const INITIAL_USERS = [
  { id: 1, name: 'Ramesh Shrestha', email: 'ramesh.shrestha@nepalestates.com', phone: '+977-980-1234567', role: 'Agent', status: 'Active', joinDate: '2025-01-10', listings: 8, city: 'Kathmandu' },
  { id: 2, name: 'Sunita Pradhan', email: 'sunita.pradhan@nepalestates.com', phone: '+977-984-9876543', role: 'Agent', status: 'Active', joinDate: '2025-01-15', listings: 6, city: 'Lalitpur' },
  { id: 3, name: 'Bikash Gurung', email: 'bikash.gurung@nepalestates.com', phone: '+977-986-5554433', role: 'Agent', status: 'Active', joinDate: '2025-02-01', listings: 7, city: 'Pokhara' },
  { id: 4, name: 'Arun Bajracharya', email: 'arun.bajracharya@nepalestates.com', phone: '+977-980-9876543', role: 'Agent', status: 'Active', joinDate: '2025-02-15', listings: 9, city: 'Kathmandu' },
  { id: 5, name: 'Priya Tamrakar', email: 'priya.tamrakar@nepalestates.com', phone: '+977-982-6601234', role: 'Agent', status: 'Active', joinDate: '2025-03-01', listings: 5, city: 'Lalitpur' },
  { id: 6, name: 'Anjali Maharjan', email: 'anjali.maharjan@nepalestates.com', phone: '+977-981-7778899', role: 'Agent', status: 'Active', joinDate: '2025-03-10', listings: 7, city: 'Kathmandu' },
  { id: 7, name: 'Deepak Paudel', email: 'deepak.paudel@nepalestates.com', phone: '+977-981-2345678', role: 'Agent', status: 'Active', joinDate: '2025-03-20', listings: 5, city: 'Kathmandu' },
  { id: 8, name: 'Dipak Karmacharya', email: 'dipak.karmacharya@nepalestates.com', phone: '+977-985-3312211', role: 'Agent', status: 'Active', joinDate: '2025-03-25', listings: 4, city: 'Bhaktapur' },
  { id: 9, name: 'Sushma Khadka', email: 'sushma.khadka@nepalestates.com', phone: '+977-984-3456789', role: 'Agent', status: 'Active', joinDate: '2025-04-01', listings: 6, city: 'Butwal' },
  { id: 10, name: 'Binod Adhikari', email: 'binod.adhikari@nepalestates.com', phone: '+977-985-4567890', role: 'Agent', status: 'Active', joinDate: '2025-04-15', listings: 3, city: 'Kathmandu' },
  { id: 11, name: 'Arjun Thapa', email: 'arjun.thapa@gmail.com', phone: '+977-980-1112233', role: 'Customer', status: 'Active', joinDate: '2026-01-05', listings: 0, city: 'Kathmandu' },
  { id: 12, name: 'Priya Rai', email: 'priya.rai@yahoo.com', phone: '+977-984-2223344', role: 'Customer', status: 'Active', joinDate: '2026-01-10', listings: 0, city: 'Lalitpur' },
  { id: 13, name: 'Sanjay Gurung', email: 'sanjay.gurung@hotmail.com', phone: '+977-986-3334455', role: 'Customer', status: 'Active', joinDate: '2026-02-01', listings: 0, city: 'Pokhara' },
  { id: 14, name: 'Meena Sharma', email: 'meena.sharma@gmail.com', phone: '+977-981-4445566', role: 'Customer', status: 'Suspended', joinDate: '2026-02-15', listings: 0, city: 'Kathmandu' },
  { id: 15, name: 'Kavita Joshi', email: 'kavita.joshi@gmail.com', phone: '+977-982-6667788', role: 'Customer', status: 'Pending', joinDate: '2026-04-01', listings: 0, city: 'Lalitpur' },
];

const INITIAL_SETTINGS = {
  siteName: 'NepalEstates',
  tagline: "Nepal's Most Trusted Property Platform",
  address: 'Durbar Marg, Kathmandu 44600, Nepal',
  email: 'info@nepalestates.com',
  phone: '+977-1-4234567',
  currency: 'NPR',
  featuredLimit: '10',
  requireApproval: false,
  emailNotifications: true,
  maintenanceMode: false,
};

const INITIAL_ACTIVITY = [
  { id: 1, action: 'New inquiry received', detail: 'Arjun Thapa — Modern 3BHK Apartment in Thamel', time: '5 min ago', type: 'inquiry' },
  { id: 2, action: 'Property status changed', detail: 'Commercial Plot in Chabahil → Sold', time: '2 hrs ago', type: 'property' },
  { id: 3, action: 'New user registered', detail: 'Kavita Joshi (Customer)', time: '4 hrs ago', type: 'user' },
  { id: 4, action: 'Inquiry closed', detail: 'Meena Sharma — Prime Commercial Space', time: '6 hrs ago', type: 'inquiry' },
  { id: 5, action: 'New property listed', detail: 'Luxury Villa in Dhulikhel', time: '1 day ago', type: 'property' },
  { id: 6, action: 'Agent approved', detail: 'Dipak Karmacharya — Bhaktapur Office', time: '2 days ago', type: 'user' },
  { id: 7, action: 'Featured property updated', detail: 'Penthouse Apartment in Lazimpat', time: '2 days ago', type: 'property' },
  { id: 8, action: 'User suspended', detail: 'Meena Sharma — Policy violation', time: '3 days ago', type: 'user' },
];

function loadFromStorage() {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? JSON.parse(s) : null;
  } catch { return null; }
}

function saveToStorage(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { /**/ }
}

export const AdminDataProvider = ({ children }) => {
  const [properties, setProperties] = useState(() => loadFromStorage()?.properties ?? INITIAL_PROPERTIES);
  const [inquiries, setInquiries] = useState(() => loadFromStorage()?.inquiries ?? INITIAL_INQUIRIES);
  const [users, setUsers] = useState(() => loadFromStorage()?.users ?? INITIAL_USERS);
  const [settings, setSettings] = useState(() => loadFromStorage()?.settings ?? INITIAL_SETTINGS);
  const [activityLog, setActivityLog] = useState(() => loadFromStorage()?.activityLog ?? INITIAL_ACTIVITY);

  useEffect(() => {
    saveToStorage({ properties, inquiries, users, settings, activityLog });
  }, [properties, inquiries, users, settings, activityLog]);

  const logActivity = (action, detail, type = 'general') => {
    setActivityLog(prev => [{ id: Date.now(), action, detail, time: 'just now', type }, ...prev].slice(0, 50));
  };

  // Properties
  const addProperty = (prop) => {
    const newProp = { ...prop, id: `admin-${Date.now()}`, admin_status: 'Active', views: 0, inquiries_count: 0, listed_date: new Date().toISOString().split('T')[0] };
    setProperties(prev => [newProp, ...prev]);
    logActivity('New property listed', prop.title, 'property');
    return newProp;
  };
  const updateProperty = (id, updates) => {
    setProperties(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    logActivity('Property updated', updates.title || String(id), 'property');
  };
  const deleteProperty = (id) => {
    const prop = properties.find(p => p.id === id);
    setProperties(prev => prev.filter(p => p.id !== id));
    if (prop) logActivity('Property deleted', prop.title, 'property');
  };
  const bulkDeleteProperties = (ids) => {
    setProperties(prev => prev.filter(p => !ids.includes(p.id)));
    logActivity('Bulk delete', `${ids.length} properties removed`, 'property');
  };
  const toggleFeatured = (id) => {
    setProperties(prev => prev.map(p => p.id === id ? { ...p, featured: !p.featured } : p));
  };
  const updatePropertyStatus = (id, admin_status) => {
    const prop = properties.find(p => p.id === id);
    setProperties(prev => prev.map(p => p.id === id ? { ...p, admin_status } : p));
    if (prop) logActivity('Property status changed', `${prop.title} → ${admin_status}`, 'property');
  };

  // Inquiries
  const addInquiry = (inq) => {
    const newInq = { ...inq, id: Date.now(), date: new Date().toISOString().split('T')[0], status: 'New' };
    setInquiries(prev => [newInq, ...prev]);
    logActivity('New inquiry received', `${inq.name} — ${inq.property}`, 'inquiry');
    return newInq;
  };
  const updateInquiry = (id, updates) => {
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
    if (updates.status) logActivity('Inquiry status updated', `→ ${updates.status}`, 'inquiry');
  };
  const deleteInquiry = (id) => {
    setInquiries(prev => prev.filter(i => i.id !== id));
    logActivity('Inquiry deleted', `ID ${id}`, 'inquiry');
  };

  // Users
  const addUser = (user) => {
    const newUser = { ...user, id: Date.now(), joinDate: new Date().toISOString().split('T')[0], listings: 0, status: 'Active' };
    setUsers(prev => [...prev, newUser]);
    logActivity('New user added', `${user.name} (${user.role})`, 'user');
    return newUser;
  };
  const updateUser = (id, updates) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    if (updates.status) logActivity('User status changed', `ID ${id} → ${updates.status}`, 'user');
    if (updates.role) logActivity('User role changed', `ID ${id} → ${updates.role}`, 'user');
  };
  const deleteUser = (id) => {
    const user = users.find(u => u.id === id);
    setUsers(prev => prev.filter(u => u.id !== id));
    if (user) logActivity('User removed', user.name, 'user');
  };

  const updateSettings = (updates) => setSettings(prev => ({ ...prev, ...updates }));

  return (
    <AdminDataContext.Provider value={{
      properties, inquiries, users, settings, activityLog,
      addProperty, updateProperty, deleteProperty, bulkDeleteProperties, toggleFeatured, updatePropertyStatus,
      addInquiry, updateInquiry, deleteInquiry,
      addUser, updateUser, deleteUser,
      updateSettings,
      agents: AGENTS,
    }}>
      {children}
    </AdminDataContext.Provider>
  );
};

export const useAdminData = () => {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error('useAdminData must be used within AdminDataProvider');
  return ctx;
};
