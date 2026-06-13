import React, { useMemo, useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Award, Bell, Building2, CalendarCheck, CheckCircle2, ChevronLeft,
  ChevronRight, CircleDollarSign, ClipboardCheck, DoorOpen, Eye,
  FileCheck2, FileText, FolderOpen, Globe2, GraduationCap,
  Home, Key, LayoutDashboard, LockKeyhole, LogIn, LogOut,
  MapPin, Menu, MessageSquareWarning, Moon, Navigation, Phone,
  Plus, Save, Search, ShieldCheck, Sparkles, Star, Sun,
  Trash2, Upload, UserCheck, Users, Utensils, Wifi, X, Zap,
  AlertCircle, RefreshCw, Settings
} from 'lucide-react';
import './styles.css';

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const ADMIN_CREDENTIALS = { email: 'admin@hostel-hub.in', password: 'Admin@1234' };
const STUDENT_PASSWORD  = 'Student@123';
const DOC_ACCEPT        = '.pdf,.jpg,.jpeg,.png,.webp';

// ─── SEED DATA ───────────────────────────────────────────────────────────────
const coastalLocations = {
  'NITK Surathkal': { lat: 13.0108, lng: 74.7943, x: 44, y: 48, label: 'NITK Surathkal' },
  'Mangalore City':  { lat: 12.9141, lng: 74.856,  x: 54, y: 70, label: 'Mangalore City' },
  'Udupi Town':      { lat: 13.3409, lng: 74.7421, x: 36, y: 22, label: 'Udupi Town' },
  'Manipal (MAHE)':  { lat: 13.3525, lng: 74.7928, x: 52, y: 18, label: 'Manipal (MAHE)' },
};

const seedRooms = [
  { id: 'NITK-BH1', hostel: 'NITK Boys Hostel – Brahmaputra Block', type: '2 Sharing', floor: 2, fee: 44000, available: 3, city: 'NITK Surathkal', rating: 4.5, warden: 'Dr. Ramesh Bhat',    phone: '+91 824 2474000', amenities: ['Wi-Fi','Mess','Gym','Laundry'] },
  { id: 'NITK-GH1', hostel: 'NITK Girls Hostel – Saraswati Bhavan',  type: '2 Sharing', floor: 1, fee: 44000, available: 2, city: 'NITK Surathkal', rating: 4.7, warden: 'Dr. Anitha Nayak',   phone: '+91 824 2474001', amenities: ['Wi-Fi','Mess','Reading Room','24×7 Security'] },
  { id: 'MAHE-GH',  hostel: 'MAHE Girls Hostel – Kasturba Niwas',    type: '3 Sharing', floor: 1, fee: 52000, available: 4, city: 'Manipal (MAHE)',  rating: 4.6, warden: 'Mrs. Shobha Kamath', phone: '+91 820 2922345', amenities: ['Wi-Fi','Canteen','Gym','AC Rooms'] },
  { id: 'MAHE-BH',  hostel: 'MAHE Boys Hostel – Tiger Circle Block',  type: '2 Sharing', floor: 3, fee: 52000, available: 2, city: 'Manipal (MAHE)',  rating: 4.4, warden: 'Mr. Suresh Shenoy',  phone: '+91 820 2922346', amenities: ['Wi-Fi','Mess','Sports','Parking'] },
  { id: 'SDM-BH',   hostel: 'SDM College Boys Hostel, Ujire Road',    type: '3 Sharing', floor: 0, fee: 30000, available: 5, city: 'Mangalore City',  rating: 4.3, warden: 'Mr. Mohan Rao',     phone: '+91 824 2441234', amenities: ['Mess','Study Hall','Laundry'] },
  { id: 'UDU-RS',   hostel: 'Udupi Research Scholars Block (MIT)',     type: 'Single',    floor: 2, fee: 65000, available: 1, city: 'Udupi Town',      rating: 4.8, warden: 'Dr. Vidya Rao',    phone: '+91 820 2523456', amenities: ['Wi-Fi','AC','Attached Bath','Library'] },
];

const seedPgs = [
  { id:'pg-1', name:'NITK Gate PG – Srinivasnagar',  city:'NITK Surathkal', area:'Srinivasnagar, near NITK Main Gate',      rent:8500,  rating:4.7, seats:3, safety:'College verified', contact:'+91 98441 23456', lat:13.0119, lng:74.7932, x:46, y:47, amenities:['Wi-Fi','Meals','Security','CCTV'] },
  { id:'pg-2', name:'Bejai Student PG – Mangalore',   city:'Mangalore City',  area:'Bejai, near St. Aloysius College',        rent:9200,  rating:4.5, seats:4, safety:'Women-friendly',  contact:'+91 97421 87654', lat:12.882,  lng:74.836,  x:46, y:74, amenities:['Wi-Fi','Meals','Women-only','Housekeeping'] },
  { id:'pg-3', name:'Hampankatta Central PG',          city:'Mangalore City',  area:'Hampankatta, near KMC Hospital',          rent:10200, rating:4.6, seats:7, safety:'Verified listing', contact:'+91 96321 45678', lat:12.8708, lng:74.8428, x:50, y:78, amenities:['Wi-Fi','Meals','Laundry','Parking'] },
  { id:'pg-4', name:'Kadri Park PG Residence',         city:'Mangalore City',  area:'Kadri, near Kadri Manjunath Temple',      rent:9800,  rating:4.4, seats:5, safety:'College listed',  contact:'+91 94482 76543', lat:12.8916, lng:74.8558, x:56, y:70, amenities:['Wi-Fi','Meals','Gym','CCTV'] },
  { id:'pg-5', name:'Tiger Circle Scholar Stay',        city:'Manipal (MAHE)',  area:'Tiger Circle, near MIT Campus',           rent:9800,  rating:4.7, seats:4, safety:'MAHE verified',   contact:'+91 98440 34567', lat:13.3515, lng:74.7921, x:54, y:18, amenities:['Wi-Fi','Meals','AC','24×7 Security'] },
  { id:'pg-6', name:'End Point Road PG – Manipal',     city:'Manipal (MAHE)',  area:'End Point Road, near KMC Manipal',        rent:10800, rating:4.5, seats:3, safety:'College listed',  contact:'+91 96323 65432', lat:13.3569, lng:74.7881, x:58, y:14, amenities:['Wi-Fi','Meals','AC','Housekeeping'] },
  { id:'pg-7', name:'Brahmagiri PG – Udupi',           city:'Udupi Town',      area:'Brahmagiri, near Sri Krishna Matha',      rent:7800,  rating:4.4, seats:5, safety:'College listed',  contact:'+91 98801 23456', lat:13.3402, lng:74.7428, x:38, y:22, amenities:['Meals','Laundry','Security'] },
  { id:'pg-8', name:'Kunjibettu Residence – Udupi',    city:'Udupi Town',      area:'Kunjibettu, near MGM College',            rent:8200,  rating:4.3, seats:4, safety:'Verified',         contact:'+91 94491 87654', lat:13.3447, lng:74.7609, x:44, y:20, amenities:['Wi-Fi','Meals','CCTV'] },
];

const seedStudents = [
  { id:'st-rahul', name:'Rahul Shetty',  admissionNo:'NITHH2026CSE014', gmail:'rahul.shetty26@hostel-hub.in',  department:'CSE',        year:'2nd Year', phone:'+91 98765 41014', guardian:'Suresh Shetty', city:'NITK Surathkal', roomId:'NITK-BH1', preferredStay:'hostel:NITK-BH1', stayType:'hostel', present:true,  verified:true,  priorityScore:92, feeDue:12000, photoColor:'#d7a84f' },
  { id:'st-aisha', name:'Aisha D Souza', admissionNo:'NITHH2026ECE021', gmail:'aisha.dsouza26@hostel-hub.in',  department:'ECE',        year:'1st Year', phone:'+91 98452 62021', guardian:'Maria D Souza', city:'NITK Surathkal', roomId:'NITK-GH1', preferredStay:'hostel:NITK-GH1', stayType:'hostel', present:false, verified:true,  priorityScore:88, feeDue:0,     photoColor:'#f2cf75' },
  { id:'st-kiran', name:'Kiran Hegde',   admissionNo:'NITHH2026ME033',  gmail:'kiran.hegde26@hostel-hub.in',   department:'Mechanical', year:'3rd Year', phone:'+91 99807 11033', guardian:'Prakash Hegde', city:'Udupi Town',      roomId:'UDU-RS',   preferredStay:'hostel:UDU-RS',   stayType:'hostel', present:true,  verified:false, priorityScore:79, feeDue:18500, photoColor:'#bb8c2d' },
];

const seedWardens = [
  { id:'w-1', name:'Dr. Ramesh Bhat',    block:'NITK Boys Block 1',  role:'Chief Warden',    phone:'+91 824 2474000', active:true },
  { id:'w-2', name:'Dr. Anitha Nayak',   block:'NITK Girls Block',   role:'Girls Warden',    phone:'+91 824 2474001', active:true },
  { id:'w-3', name:'Mrs. Shobha Kamath', block:'MAHE Girls Hostel',  role:'Resident Warden', phone:'+91 820 2922345', active:true },
  { id:'w-4', name:'Mr. Suresh Shenoy',  block:'MAHE Boys Block',    role:'Resident Warden', phone:'+91 820 2922346', active:true },
  { id:'w-5', name:'Mr. Mohan Rao',      block:'SDM Hostel',         role:'Block Warden',    phone:'+91 824 2441234', active:true },
  { id:'w-6', name:'Dr. Vidya Rao',      block:'Udupi Research',     role:'Research Warden', phone:'+91 820 2523456', active:true },
  { id:'w-7', name:'Mr. Ravi Kumar',     block:'Security Post A',    role:'Security Head',   phone:'+91 98001 11234', active:true },
];

const seedGatePasses = [
  { id:'GP-001', studentId:'st-rahul', type:'Day Out',   purpose:'Medical appointment at KMC Hospital',        departure:'2026-06-13 09:00', arrival:'2026-06-13 18:00', parentApproval:'Approved', wardenApproval:'Approved', status:'Approved', createdAt:'2026-06-12' },
  { id:'GP-002', studentId:'st-aisha', type:'Long Leave', purpose:'Udupi Rathayatra family function',          departure:'2026-06-14 07:00', arrival:'2026-06-16 20:00', parentApproval:'Approved', wardenApproval:'Pending',  status:'Pending',  createdAt:'2026-06-12' },
];

const seedComplaints = [
  { id:'GR-1284', studentId:'st-rahul', issue:'Wi-Fi outage in NITK Block 1 – Room 204',      category:'Wi-Fi/Network', priority:'High',   status:'In Progress', owner:'Network Cell', assetTag:'Router_B1_Flr2' },
  { id:'GR-1279', studentId:'st-aisha', issue:'Water filter servicing – Girls Hostel kitchen', category:'Plumbing',      priority:'Medium', status:'Resolved',    owner:'Maintenance',  assetTag:'' },
  { id:'GR-1280', studentId:'st-kiran', issue:'Ceiling fan wobbling in Room 402',              category:'Electrical',    priority:'Medium', status:'Ticket Lodged', owner:'Electrician', assetTag:'Fan_R402' },
  { id:'GR-1281', studentId:'st-rahul', issue:'Corridor light flickering – Block B Ground',   category:'Electrical',    priority:'Low',    status:'Assigned',    owner:'Electrician',  assetTag:'Light_B_G01' },
];

const seedLeaves = [
  { id:'LV-204', studentId:'st-aisha', from:'2026-06-14', to:'2026-06-16', reason:'Family function – Udupi Rathayatra', status:'Approved' },
];

const seedVisitors = [
  { id:'VS-118', studentId:'st-rahul', name:'Suresh Shetty', relation:'Father', time:'2026-06-15 10:30', status:'Scheduled' },
];

const seedNotices = [
  { id:'NO-1', title:'Document verification extended to 18 June',  body:'NITK, Manipal, Udupi, and Mangalore hostel students can submit Aadhaar and TC at the warden office by 18 June 2026.', type:'Admissions', date:'12 Jun 2026' },
  { id:'NO-2', title:'Southwest monsoon advisory – June 2026',      body:'Carry rain gear, follow warden instructions, and report waterlogging near Surathkal and Udupi blocks immediately.',   type:'Safety',      date:'12 Jun 2026' },
  { id:'NO-3', title:'Udupi-style mess menu this week',             body:'Neer dosa, coconut chutney, sambar, curd rice, and Mangalorean fish curry (vegetarian: drumstick sambar). Evening tea at 5:30 PM.', type:'Mess', date:'11 Jun 2026' },
  { id:'NO-4', title:'KSRTC Udupi–Mangalore shuttle revised',       body:'Direct bus from NITK Surathkal to Udupi now runs at 7:00 AM and 6:00 PM daily. Book at warden office or reception.', type:'Transport',   date:'10 Jun 2026' },
];

const seedArrangements = [
  { id:'AR-1', title:'Replace mattress – NITK-BH1 Room 203', status:'Scheduled',   owner:'Housekeeping' },
  { id:'AR-2', title:'Deep-clean NITK Girls Hostel GF',       status:'In progress', owner:'Warden Office' },
  { id:'AR-3', title:'Repair CCTV – MAHE Block-B entrance',   status:'Scheduled',   owner:'Security Cell' },
];

const seedWifi = [
  { id:'dev-1', type:'Laptop',         mac:'A4:C3:F0:12:34:56', ip:'10.0.1.45',  bw:45.2, status:'Active',   label:'Dell XPS 15',   studentId:'st-rahul' },
  { id:'dev-2', type:'Smartphone',      mac:'B8:27:EB:98:76:54', ip:'10.0.1.46',  bw:12.8, status:'Active',   label:'OnePlus 12',    studentId:'st-rahul' },
  { id:'dev-3', type:'Microcontroller', mac:'DC:A6:32:AB:CD:EF', ip:'10.0.1.102', bw:0.1,  status:'Inactive', label:'Raspberry Pi',  studentId:'st-rahul' },
];

const seedLaundry = [
  { id:'ls-1', machine:'Machine A', block:'NITK-BH1', studentId:'st-rahul', date:'2026-06-13', time:'08:00', status:'Booked' },
  { id:'ls-2', machine:'Machine B', block:'NITK-BH1', studentId:'st-aisha', date:'2026-06-13', time:'10:00', status:'Booked' },
  { id:'ls-3', machine:'Machine C', block:'NITK-BH1', studentId:null,       date:'2026-06-13', time:'12:00', status:'Available' },
];

const MESS_MENU = {
  Breakfast:['Idli + Sambar + Chutney','Neer Dosa + Coconut Chutney','Poha + Banana','Upma + Pickle','Dosa + Sambar','Bread + Egg + Tea','Pongal + Vada'],
  Lunch:['Rice + Sambar + Rasam + Papad','Chapati + Dal + Sabzi','Rice + Fish Curry + Salad','Pulao + Raita + Pickle','Rice + Rajma + Curd','Biryani + Raita','Curd Rice + Mango Pickle'],
  Snacks:['Bonda + Tea','Samosa + Chai','Banana + Milk','Bread Butter + Coffee','Vada + Coffee','Popcorn + Juice','Biscuits + Tea'],
  Dinner:['Chapati + Paneer Curry','Rice + Dal + Papad','Dosa + Sambar','Fried Rice + Manchurian','Chapati + Mixed Veg','Neer Dosa + Chicken Curry','Puri + Bhaji'],
};

const REQUIRED_DOCS = [
  { id:'aadhaar',     label:'Aadhaar Card',           note:'Front and back scan, PDF or image' },
  { id:'tc',          label:'Transfer Certificate',   note:'Original TC from previous institution' },
  { id:'marksheet',   label:'Latest Marksheet',       note:'10th / 12th / UG semester marksheet' },
  { id:'photo',       label:'Passport Photo',         note:'Recent colour photo, white background' },
  { id:'medical',     label:'Medical Fitness Cert.',  note:'From registered MBBS doctor' },
  { id:'income',      label:'Income Certificate',     note:'Family income proof for fee waiver' },
  { id:'domicile',    label:'Domicile / Caste Cert.', note:'Karnataka domicile or caste cert.' },
  { id:'antiRagging', label:'Anti-Ragging Affidavit', note:'Signed by student and parent/guardian' },
];

const LAUNDRY_TIMES = ['06:00','08:00','10:00','12:00','14:00','16:00','18:00'];
const LAUNDRY_MACHINES = ['Machine A','Machine B','Machine C'];

// ─── UTILITIES ───────────────────────────────────────────────────────────────
// Clear stale localStorage from old schema versions on startup
(function migrateStorage() {
  const legacyKeys = ['hostelhub-auth','hostelhub-students','hostelhub-rooms','hostelhub-pgs',
    'hostelhub-complaints','hostelhub-leaves','hostelhub-visitors','hostelhub-notices',
    'hostelhub-arrangements','hh-auth'];
  // If hh-students exists but has old shape (missing stayType), wipe it
  try {
    const stored = localStorage.getItem('hh-students');
    if (stored) {
      const arr = JSON.parse(stored);
      if (Array.isArray(arr) && arr[0] && arr[0].stayType === undefined) {
        localStorage.removeItem('hh-students');
        localStorage.removeItem('hh-rooms');
        localStorage.removeItem('hh-pgs');
        localStorage.removeItem('hh-complaints');
        localStorage.removeItem('hh-auth');
      }
    }
  } catch(e) { /* ignore */ }
})();
function loadState(key, fallback) {
  try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : fallback; } catch { return fallback; }
}
function useStoredState(key, fallback) {
  const [value, setValue] = useState(() => loadState(key, fallback));
  const update = (next) => setValue((cur) => {
    const resolved = typeof next === 'function' ? next(cur) : next;
    localStorage.setItem(key, JSON.stringify(resolved));
    return resolved;
  });
  return [value, update];
}
function kmBetween(a, b) {
  const r = (n) => (n * Math.PI) / 180, E = 6371;
  const h = Math.sin(r(b.lat-a.lat)/2)**2 + Math.cos(r(a.lat))*Math.cos(r(b.lat))*Math.sin(r(b.lng-a.lng)/2)**2;
  return (E * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1-h))).toFixed(1);
}
function initials(name) { return name.split(' ').map((p) => p[0]).slice(0,2).join('').toUpperCase(); }
function scrollToTop() { window.scrollTo({ top:0, behavior:'smooth' }); }
function scrollToNext() { window.scrollBy({ top: Math.round(window.innerHeight * 0.88), behavior:'smooth' }); }
const photoColors = ['#d7a84f','#f2cf75','#bb8c2d','#c9974f','#e8b96a','#a8762f','#f0d06a','#d4983c'];
function randomColor() { return photoColors[Math.floor(Math.random() * photoColors.length)]; }

// Simple deterministic QR-like SVG generator
function generateQRSVG(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) { hash = ((hash << 5) - hash) + seed.charCodeAt(i); hash |= 0; }
  const size = 21; const cell = 8;
  const cells = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Finder patterns (top-left, top-right, bottom-left)
      const inFinder = (r < 7 && c < 7) || (r < 7 && c > 13) || (r > 13 && c < 7);
      let dark;
      if (inFinder) {
        const fr = r % 7, fc = c % 7;
        dark = (fr === 0 || fr === 6 || fc === 0 || fc === 6 || (fr >= 2 && fr <= 4 && fc >= 2 && fc <= 4));
      } else {
        dark = !!(Math.abs(hash * (r * size + c) * 1103515245 + 12345) & 1);
      }
      if (dark) cells.push(`<rect x="${c*cell}" y="${r*cell}" width="${cell}" height="${cell}"/>`);
    }
  }
  const total = size * cell;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" width="168" height="168"><rect width="${total}" height="${total}" fill="white"/><g fill="#0a0a09">${cells.join('')}</g></svg>`;
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [theme,    setTheme]    = useState('dark');
  const [lang,     setLang]     = useState('en');
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');

  const [auth,         setAuth]         = useStoredState('hh-auth', null);
  const [students,     setStudents]     = useStoredState('hh-students', seedStudents);
  const [rooms,        setRooms]        = useStoredState('hh-rooms', seedRooms);
  const [pgs,          setPgs]          = useStoredState('hh-pgs', seedPgs);
  const [complaints,   setComplaints]   = useStoredState('hh-complaints', seedComplaints);
  const [leaves,       setLeaves]       = useStoredState('hh-leaves', seedLeaves);
  const [visitors,     setVisitors]     = useStoredState('hh-visitors', seedVisitors);
  const [notices,      setNotices]      = useStoredState('hh-notices', seedNotices);
  const [arrangements, setArrangements] = useStoredState('hh-arrangements', seedArrangements);
  const [documents,    setDocuments]    = useStoredState('hh-documents', {});
  const [wardens,      setWardens]      = useStoredState('hh-wardens', seedWardens);
  const [gatePasses,   setGatePasses]   = useStoredState('hh-gatepasses', seedGatePasses);
  const [messRsvp,     setMessRsvp]     = useStoredState('hh-messrsvp', {});
  const [wifiDevices,  setWifiDevices]  = useStoredState('hh-wifi', seedWifi);
  const [laundrySlots, setLaundrySlots] = useStoredState('hh-laundry', seedLaundry);
  const [activePg,     setActivePg]     = useState(seedPgs[0]);

  const currentStudent = auth?.role === 'student' ? students.find((s) => s.id === auth.id) : null;

  const login  = (a) => { setAuth(a); setActiveView('dashboard'); requestAnimationFrame(scrollToTop); };
  const logout = ()  => { setAuth(null); requestAnimationFrame(scrollToTop); };
  const updateStudent = (id, patch) => setStudents((arr) => arr.map((s) => s.id === id ? { ...s, ...patch } : s));
  const resetDemoData = () => {
    // Clear all stored keys so stale data from old schema doesn't cause crashes
    ['hh-auth','hh-students','hh-rooms','hh-pgs','hh-complaints','hh-leaves',
     'hh-visitors','hh-notices','hh-arrangements','hh-documents','hh-wardens',
     'hh-gatepasses','hh-messrsvp','hh-wifi','hh-laundry',
     // legacy keys from old versions
     'hostelhub-auth','hostelhub-students','hostelhub-rooms','hostelhub-pgs',
     'hostelhub-complaints','hostelhub-leaves','hostelhub-visitors',
     'hostelhub-notices','hostelhub-arrangements','hostelhub-pgs',
    ].forEach((k) => localStorage.removeItem(k));
    setStudents(seedStudents); setRooms(seedRooms); setPgs(seedPgs);
    setComplaints(seedComplaints); setLeaves(seedLeaves); setVisitors(seedVisitors);
    setNotices(seedNotices); setArrangements(seedArrangements); setDocuments({});
    setWardens(seedWardens); setGatePasses(seedGatePasses); setMessRsvp({});
    setWifiDevices(seedWifi); setLaundrySlots(seedLaundry); setAuth(null);
  };

  const nav = (view) => { setActiveView(view); setMenuOpen(false); scrollToTop(); };

  const studentNav = [
    { id:'dashboard',  label:'Dashboard',     icon:<LayoutDashboard size={18}/> },
    { id:'gatepass',   label:'Gate Pass',      icon:<CalendarCheck size={18}/> },
    { id:'complaints', label:'Complaints',     icon:<MessageSquareWarning size={18}/> },
    { id:'mess',       label:'Mess Menu',      icon:<Utensils size={18}/> },
    { id:'wardens',    label:'Warden Hotline', icon:<Phone size={18}/> },
    { id:'utilities',  label:'IT & Laundry',   icon:<Wifi size={18}/> },
    { id:'documents',  label:'Documents',      icon:<FileText size={18}/> },
    { id:'pg',         label:'PG Tracker',     icon:<MapPin size={18}/> },
    { id:'hostels',    label:'Hostels',        icon:<Building2 size={18}/> },
  ];
  const adminNav = [
    { id:'dashboard',  label:'Dashboard',       icon:<LayoutDashboard size={18}/> },
    { id:'students',   label:'Students',        icon:<Users size={18}/> },
    { id:'documents',  label:'Doc Verification',icon:<FileCheck2 size={18}/> },
    { id:'wardens',    label:'Warden CRUD',     icon:<Phone size={18}/> },
    { id:'notices',    label:'Notices',         icon:<Bell size={18}/> },
    { id:'maintenance',label:'Maintenance',     icon:<ClipboardCheck size={18}/> },
  ];

  return (
    <div className={`site ${theme}`}>
      <header className="topbar">
        <a className="brand" href="#top" onClick={scrollToTop}>
          <span className="brand-mark"><GraduationCap size={20}/></span>
          <span>HOSTEL-HUB</span>
        </a>
        <div className="top-actions">
          {auth && <span className="session-pill">{auth.role==='admin' ? '⚡ Admin' : currentStudent?.name}</span>}
          {auth && <button className="icon-btn" onClick={logout}><LogOut size={17}/><span>Logout</span></button>}
          <button className="icon-btn" onClick={() => setLang(l => l==='en'?'kn':'en')}>
            <Globe2 size={17}/><span>{lang==='en'?'ಕನ್ನಡ':'EN'}</span>
          </button>
          <button className="icon-btn square" onClick={() => setTheme(t => t==='dark'?'light':'dark')}>
            {theme==='dark' ? <Sun size={17}/> : <Moon size={17}/>}
          </button>
          {auth && <button className="icon-btn square mobile-menu" onClick={() => setMenuOpen(o => !o)}>
            {menuOpen ? <X size={20}/> : <Menu size={20}/>}
          </button>}
        </div>
      </header>

      <main id="top">
        {!auth && (
          <AuthLanding login={login} students={students} setStudents={setStudents} rooms={rooms} setRooms={setRooms} pgs={pgs} setPgs={setPgs}/>
        )}
        {auth?.role === 'student' && currentStudent && (
          <div className="app-layout">
            <Sidebar nav={studentNav} active={activeView} onNav={nav} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} mobileOpen={menuOpen} setMobileOpen={setMenuOpen}/>
            <div className={`content-area ${sidebarCollapsed ? 'collapsed' : ''}`}>
              {activeView==='dashboard'  && <StudentDashboard student={currentStudent} updateStudent={updateStudent} rooms={rooms} setRooms={setRooms} pgs={pgs} complaints={complaints} leaves={leaves} visitors={visitors} notices={notices} documents={documents} wifiDevices={(wifiDevices||[]).filter(d=>d.studentId===currentStudent.id)}/>}
              {activeView==='gatepass'   && <GatePassView student={currentStudent} gatePasses={gatePasses} setGatePasses={setGatePasses}/>}
              {activeView==='complaints' && <ComplaintsView student={currentStudent} complaints={complaints} setComplaints={setComplaints}/>}
              {activeView==='mess'       && <MessView student={currentStudent} messRsvp={messRsvp} setMessRsvp={setMessRsvp} students={students}/>}
              {activeView==='wardens'    && <WardenView wardens={wardens} isAdmin={false}/>}
              {activeView==='utilities'  && <UtilitiesView student={currentStudent} wifiDevices={wifiDevices} setWifiDevices={setWifiDevices} laundrySlots={laundrySlots} setLaundrySlots={setLaundrySlots} rooms={rooms}/>}
              {activeView==='documents'  && <DocumentsPage student={currentStudent} documents={documents} setDocuments={setDocuments}/>}
              {activeView==='pg'         && <PgTracker pgs={pgs} setPgs={setPgs} activePg={activePg} setActivePg={setActivePg} student={currentStudent}/>}
              {activeView==='hostels'    && <Hostels rooms={rooms} students={students}/>}
            </div>
          </div>
        )}
        {auth?.role === 'admin' && (
          <div className="app-layout">
            <Sidebar nav={adminNav} active={activeView} onNav={nav} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} mobileOpen={menuOpen} setMobileOpen={setMenuOpen}/>
            <div className={`content-area ${sidebarCollapsed ? 'collapsed' : ''}`}>
              <AdminPlatform
                auth={auth} login={login} activeView={activeView}
                students={students} updateStudent={updateStudent}
                rooms={rooms} setRooms={setRooms} pgs={pgs} setPgs={setPgs}
                complaints={complaints} setComplaints={setComplaints}
                leaves={leaves} setLeaves={setLeaves}
                visitors={visitors} setVisitors={setVisitors}
                notices={notices} setNotices={setNotices}
                arrangements={arrangements} setArrangements={setArrangements}
                documents={documents}
                wardens={wardens} setWardens={setWardens}
                resetDemoData={resetDemoData}
              />
            </div>
          </div>
        )}
      </main>
      {auth && <button className="scroll-fab" onClick={scrollToTop}>↑</button>}
    </div>
  );
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
function Sidebar({ nav, active, onNav, collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  return (
    <>
      <aside className={`sidebar ${collapsed?'collapsed':''} ${mobileOpen?'mobile-open':''}`}>
        <div className="sidebar-header">
          {!collapsed && <span className="sidebar-brand">HOSTEL-HUB</span>}
        </div>
        <nav className="sidebar-nav">
          {nav.map((item) => (
            <button key={item.id} className={`sidebar-item ${active===item.id?'active':''}`} onClick={() => onNav(item.id)}>
              <span className="sidebar-icon">{item.icon}</span>
              {!collapsed && <span className="sidebar-label">{item.label}</span>}
            </button>
          ))}
        </nav>
        <button className="sidebar-toggle" onClick={() => setCollapsed(c => !c)}>
          {collapsed ? <ChevronRight size={16}/> : <ChevronLeft size={16}/>}
          {!collapsed && <span>Collapse</span>}
        </button>
      </aside>
      {mobileOpen && <div className="sidebar-backdrop" onClick={() => setMobileOpen(false)}/>}
    </>
  );
}

// ─── AUTH LANDING ─────────────────────────────────────────────────────────────
function AuthLanding({ login, students, setStudents, rooms, setRooms, pgs, setPgs }) {
  return (
    <section className="auth-landing" id="login">
      <div className="auth-bg"/>
      <div className="auth-copy reveal">
        <div className="eyebrow"><Sparkles size={15}/> Coastal Karnataka · College Hostel Portal</div>
        <h1>HOSTEL<span className="brand-dash">-</span>HUB</h1>
        <p>Smart hostel management for NITK Surathkal, Manipal, Udupi, and Mangalore. Track your room, PG, attendance, fees, mess, and hostel services — all in one place.</p>
        <div className="auth-highlights">
          <div className="highlight-chip"><ShieldCheck size={16}/><span>Verified access</span></div>
          <div className="highlight-chip"><MapPin size={16}/><span>PG allocation</span></div>
          <div className="highlight-chip"><UserCheck size={16}/><span>Live presence</span></div>
          <div className="highlight-chip"><Bell size={16}/><span>Notices</span></div>
          <div className="highlight-chip"><Utensils size={16}/><span>Mess RSVP</span></div>
          <div className="highlight-chip"><Wifi size={16}/><span>Wi-Fi & Laundry</span></div>
        </div>
        <div className="demo-creds">
          <p className="demo-label"><Zap size={12}/> Quick demo</p>
          <p><strong>Student:</strong> NITHH2026CSE014 / Student@123</p>
          <p><strong>Admin:</strong> admin@hostel-hub.in / Admin@1234</p>
        </div>
      </div>
      <LoginPanel login={login} students={students} setStudents={setStudents} rooms={rooms} setRooms={setRooms} pgs={pgs} setPgs={setPgs}/>
      <button className="scroll-cue" onClick={scrollToNext}>↓</button>
    </section>
  );
}

function LoginPanel({ login, students, setStudents, rooms, setRooms, pgs, setPgs }) {
  const [mode, setMode]             = useState('login');
  const [identifier, setIdentifier] = useState('NITHH2026CSE014');
  const [password,   setPassword]   = useState(STUDENT_PASSWORD);
  const [message,    setMessage]    = useState('');
  const [step,       setStep]       = useState(1);
  const [form, setForm] = useState({
    name:'', admissionNo:'', gmail:'', password:'', confirm:'',
    department:'CSE', year:'1st Year', phone:'', guardian:'',
    city:'NITK Surathkal', stayType:'pg', preferredStayId:'',
  });
  const set = (k,v) => setForm((f) => ({...f,[k]:v}));

  const allStayOptions = useMemo(() => [
    ...rooms.map((r) => ({ id:r.id, type:'hostel', label:r.hostel,  city:r.city, rating:r.rating, rent:r.fee,  seats:r.available, meta:`${r.type} · ₹${r.fee.toLocaleString('en-IN')}/yr`, amenities:r.amenities||[] })),
    ...pgs.map(  (p) => ({ id:p.id, type:'pg',     label:p.name,    city:p.city, rating:p.rating, rent:p.rent, seats:p.seats,     meta:`PG · ₹${p.rent.toLocaleString('en-IN')}/mo`,       amenities:p.amenities||[] })),
  ].sort((a,b) => b.rating - a.rating), [rooms, pgs]);

  const regionOptions = useMemo(() => {
    const f = allStayOptions.filter((o) => o.city===form.city && o.seats>0 && o.type===form.stayType);
    return f.length ? f : allStayOptions.filter((o) => o.seats>0 && o.type===form.stayType);
  }, [allStayOptions, form.city, form.stayType]);

  const chosen = useMemo(() => allStayOptions.find((o) => o.id===form.preferredStayId) || regionOptions[0], [form.preferredStayId, regionOptions, allStayOptions]);

  useEffect(() => { if (regionOptions[0]) set('preferredStayId', regionOptions[0].id); }, [form.city, form.stayType]);

  const handleLogin = (e) => {
    e && e.preventDefault();
    if (identifier.trim().toLowerCase()===ADMIN_CREDENTIALS.email && password===ADMIN_CREDENTIALS.password) { login({role:'admin'}); return; }
    const norm = identifier.trim().toLowerCase();
    let s = students.find((s) => [s.admissionNo.toLowerCase(), s.gmail.toLowerCase()].includes(norm));
    if (!s) { const seed = seedStudents.find((s) => [s.admissionNo.toLowerCase(), s.gmail.toLowerCase()].includes(norm)); if (seed) { s=seed; setStudents((arr) => [seed,...arr.filter((x) => x.id!==seed.id)]); } }
    if (s && password===(s.password||STUDENT_PASSWORD)) { login({role:'student', id:s.id}); return; }
    setMessage('Invalid credentials.');
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const admissionNo=form.admissionNo.trim(), gmail=form.gmail.trim().toLowerCase();
    if (!form.name.trim()||!admissionNo||!gmail||!form.password) { setMessage('Fill all required fields.'); return; }
    if (form.password!==form.confirm) { setMessage('Passwords do not match.'); return; }
    if (students.some((s) => s.admissionNo.toLowerCase()===admissionNo.toLowerCase()||s.gmail.toLowerCase()===gmail)) { setMessage('Admission number or email already registered.'); return; }
    if (!chosen||chosen.seats<1) { setMessage('Selected stay has no available seats.'); return; }
    let roomId='';
    if (chosen.type==='hostel') { roomId=chosen.id; setRooms((arr) => arr.map((r) => r.id===chosen.id?{...r,available:r.available-1}:r)); }
    else { setPgs((arr) => arr.map((p) => p.id===chosen.id?{...p,seats:p.seats-1}:p)); const fb=rooms.find((r) => r.city===form.city&&r.available>0)||rooms.find((r) => r.available>0); roomId=fb?fb.id:rooms[0].id; }
    const ns = { id:`st-${Date.now()}`, name:form.name.trim(), admissionNo, gmail, department:form.department, year:form.year, phone:form.phone.trim()||'+91 90000 00000', guardian:form.guardian.trim()||'Not added', city:form.city, roomId, preferredStay:`${chosen.type}:${chosen.id}`, stayType:chosen.type, pgId:chosen.type==='pg'?chosen.id:null, pgName:chosen.type==='pg'?chosen.label:null, present:false, verified:false, priorityScore:70, feeDue:chosen.type==='hostel'?chosen.rent:0, photoColor:randomColor(), password:form.password };
    setStudents((arr) => [ns,...arr]);
    login({role:'student', id:ns.id});
  };

  return (
    <div className="auth-panel reveal delay-1">
      <div className="portal-card login-card">
        <div className="login-card-head">
          <span className="eyebrow"><LockKeyhole size={14}/> Secure access</span>
          <h2>{mode==='login'?'Sign in':'Create account'}</h2>
          <p>{mode==='login'?'Enter your admission number or email to continue.':'Register and get instantly allocated to your chosen hostel or PG.'}</p>
        </div>
        <div className="segmented">
          <button type="button" className={mode==='login'?'active':''} onClick={() => {setMode('login');setMessage('');setStep(1);}}>Login</button>
          <button type="button" className={mode==='register'?'active':''} id="register" onClick={() => {setMode('register');setMessage('');setStep(1);}}>Register</button>
        </div>
        {mode==='login' && (
          <form className="stack-form" onSubmit={handleLogin}>
            <label><span>Admission number or email</span><input value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="NITHH2026CSE014 or email"/></label>
            <label><span>Password</span><input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/></label>
            <button className="btn primary full-width" type="submit"><LogIn size={17}/> Continue to Portal</button>
            {message && <p className="form-message error">{message}</p>}
          </form>
        )}
        {mode==='register' && step===1 && (
          <form className="stack-form" onSubmit={(e) => { e.preventDefault(); if (!form.name.trim()||!form.admissionNo.trim()||!form.gmail.trim()||!form.password||!form.confirm){setMessage('Fill all fields.');return;} if(form.password!==form.confirm){setMessage('Passwords do not match.');return;} setMessage('');setStep(2); }}>
            <div className="form-row-2">
              <label><span>Full name *</span><input value={form.name} onChange={(e) => set('name',e.target.value)} placeholder="e.g. Priya Kamath"/></label>
              <label><span>Admission number *</span><input value={form.admissionNo} onChange={(e) => set('admissionNo',e.target.value)} placeholder="NITHH2026CSE099"/></label>
            </div>
            <label><span>Email *</span><input value={form.gmail} onChange={(e) => set('gmail',e.target.value)} placeholder="yourname@email.com"/></label>
            <div className="form-row-2">
              <label><span>Password *</span><input type="password" value={form.password} onChange={(e) => set('password',e.target.value)} placeholder="Create password"/></label>
              <label><span>Confirm *</span><input type="password" value={form.confirm} onChange={(e) => set('confirm',e.target.value)} placeholder="Repeat password"/></label>
            </div>
            <div className="form-row-3">
              <label><span>Department</span><select value={form.department} onChange={(e) => set('department',e.target.value)}>{['CSE','ECE','Mechanical','Civil','Chemical','Research'].map((d) => <option key={d}>{d}</option>)}</select></label>
              <label><span>Year</span><select value={form.year} onChange={(e) => set('year',e.target.value)}>{['1st Year','2nd Year','3rd Year','4th Year','PG/Research'].map((y) => <option key={y}>{y}</option>)}</select></label>
              <label><span>Campus</span><select value={form.city} onChange={(e) => set('city',e.target.value)}>{Object.keys(coastalLocations).map((c) => <option key={c}>{c}</option>)}</select></label>
            </div>
            <div className="form-row-2">
              <label><span>Phone</span><input value={form.phone} onChange={(e) => set('phone',e.target.value)} placeholder="+91 98765 00000"/></label>
              <label><span>Guardian</span><input value={form.guardian} onChange={(e) => set('guardian',e.target.value)} placeholder="Parent / Guardian"/></label>
            </div>
            {message && <p className="form-message error">{message}</p>}
            <button className="btn primary full-width" type="submit">Choose your stay <ChevronRight size={17}/></button>
          </form>
        )}
        {mode==='register' && step===2 && (
          <form className="stack-form" onSubmit={handleRegister}>
            <div className="stay-type-tabs">
              <button type="button" className={form.stayType==='pg'?'active':''} onClick={() => {set('stayType','pg');set('preferredStayId','');}}>
                <Home size={16}/> PG Accommodation
              </button>
              <button type="button" className={form.stayType==='hostel'?'active':''} onClick={() => {set('stayType','hostel');set('preferredStayId','');}}>
                <Building2 size={16}/> College Hostel
              </button>
            </div>
            <p className="region-helper">Showing {form.city} options</p>
            <div className="stay-cards-list">
              {regionOptions.length===0 && <p className="empty-state">No available seats in {form.city}.</p>}
              {regionOptions.map((opt) => (
                <button type="button" key={opt.id} className={`stay-card ${form.preferredStayId===opt.id?'selected':''}`} onClick={() => set('preferredStayId',opt.id)}>
                  <div className="stay-card-header"><strong>{opt.label}</strong><span className="stay-rating"><Star size={13}/> {opt.rating}</span></div>
                  <div className="stay-card-meta"><span>{opt.seats} seat{opt.seats!==1?'s':''} left</span><span>{opt.meta}</span></div>
                  {opt.amenities?.length>0 && <div className="stay-amenities">{opt.amenities.slice(0,4).map((a) => <span key={a}>{a}</span>)}</div>}
                  {form.preferredStayId===opt.id && <div className="stay-selected-badge"><CheckCircle2 size={14}/> Selected</div>}
                </button>
              ))}
            </div>
            {message && <p className="form-message error">{message}</p>}
            <div className="form-row-2">
              <button type="button" className="btn ghost" onClick={() => {setStep(1);setMessage('');}}>← Back</button>
              <button className="btn primary" type="submit"><Key size={16}/> Confirm &amp; Register</button>
            </div>
          </form>
        )}
      </div>
      <div className="auth-insight-card portal-card">
        {mode==='login' ? (
          <>
            <span className="eyebrow"><Award size={14}/> Top rated stays</span>
            <h3>Best hostels &amp; PGs</h3>
            <p>Across NITK, Manipal, Udupi &amp; Mangalore — verified and rated.</p>
            <div className="ranked-stays">
              {allStayOptions.slice(0,6).map((opt,i) => (
                <div key={opt.id} className="ranked-stay">
                  <strong>{i+1}</strong>
                  <span>{opt.label.length>32?opt.label.slice(0,32)+'…':opt.label}<small>{opt.type==='pg'?'PG':'Hostel'} · {opt.city} · {opt.rating}★</small></span>
                </div>
              ))}
            </div>
          </>
        ) : step===1 ? (
          <>
            <span className="eyebrow"><MapPin size={14}/> Step 1 of 2</span>
            <h3>Your details</h3>
            <p>Fill your personal information. Next step: pick your hostel or PG.</p>
            <div className="onboarding-steps">
              <div className="onboarding-step active"><span>1</span> Personal details</div>
              <div className="onboarding-step"><span>2</span> Choose stay</div>
              <div className="onboarding-step"><span>3</span> Access portal</div>
            </div>
          </>
        ) : (
          <>
            <span className="eyebrow"><Home size={14}/> Step 2 of 2</span>
            <h3>Pick your stay</h3>
            <p>You'll be instantly allocated a seat when you register.</p>
            {chosen && form.preferredStayId && (
              <div className="stay-summary-box">
                <p className="stay-summary-label">Your selection</p>
                <strong>{chosen.label}</strong>
                <p>{chosen.city}</p>
                <p>{chosen.meta}</p>
                <p>{chosen.seats} seat{chosen.seats!==1?'s':''} available</p>
                <div className="stay-amenities">{chosen.amenities?.map((a) => <span key={a}>{a}</span>)}</div>
              </div>
            )}
            <div className="onboarding-steps">
              <div className="onboarding-step done"><span>✓</span> Personal details</div>
              <div className="onboarding-step active"><span>2</span> Choose stay</div>
              <div className="onboarding-step"><span>3</span> Access portal</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── STUDENT DASHBOARD ────────────────────────────────────────────────────────
function StudentDashboard({ student, updateStudent, rooms, setRooms, pgs, complaints, leaves, visitors, notices, documents, wifiDevices }) {
  const [activeTab, setActiveTab] = useState('overview');
  const myRoom = rooms.find((r) => r.id===student.roomId);
  const myPg   = student.stayType==='pg' ? pgs.find((p) => p.id===student.pgId) : null;
  const myComplaints = complaints.filter((c) => c.studentId===student.id);
  const myLeaves     = leaves.filter((l) => l.studentId===student.id);
  const myVisitors   = visitors.filter((v) => v.studentId===student.id);
  const myDocs       = documents[student.id]||{};
  const docsUploaded = Object.keys(myDocs).length;
  const activeDev    = (wifiDevices||[]).filter((d) => d.status==='Active').length;
  const totalBw      = (wifiDevices||[]).reduce((s,d) => s+(d.bw||0), 0).toFixed(1);

  const tabs = ['overview','room','notices'];
  const tabLabels = { overview:'Overview', room:'Room & Fees', notices:'Notices' };

  return (
    <section className="section student-app" id="student-dashboard">
      <div className="dash-hero">
        <div className="dash-hero-left">
          <div className="student-avatar" style={{'--photo':student.photoColor}}>{initials(student.name)}</div>
          <div>
            <p className="dash-eyebrow">Welcome back</p>
            <h2 className="dash-name">{student.name}</h2>
            <p className="dash-sub">{student.admissionNo} · {student.department} · {student.year} · {student.city}</p>
          </div>
        </div>
        <div className="dash-hero-right">
          <button className={`presence-toggle ${student.present?'in':'out'}`} onClick={() => updateStudent(student.id,{present:!student.present})}>
            <span className="presence-dot"/>
            {student.present?'Present in hostel':'Outside hostel'}
          </button>
          {student.feeDue>0 ? <div className="fee-badge due"><CircleDollarSign size={15}/> ₹{student.feeDue.toLocaleString('en-IN')} due</div> : <div className="fee-badge clear"><CheckCircle2 size={15}/> Fees clear</div>}
          <div className="score-badge"><Award size={14}/> Score {student.priorityScore}</div>
        </div>
      </div>

      {myPg ? (
        <div className="stay-banner pg-banner"><Home size={18}/>
          <div><strong>PG allocated: {myPg.name}</strong><span>{myPg.area}, {myPg.city} · ₹{myPg.rent.toLocaleString('en-IN')}/month · {myPg.rating}★ · {myPg.contact}</span></div>
          <a className="btn ghost compact" href={`https://www.google.com/maps/search/?api=1&query=${myPg.lat},${myPg.lng}`} target="_blank" rel="noreferrer"><MapPin size={15}/> Map</a>
        </div>
      ) : myRoom ? (
        <div className="stay-banner hostel-banner"><Building2 size={18}/>
          <div><strong>Hostel: {myRoom.hostel}</strong><span>{myRoom.city} · {myRoom.type} · Floor {myRoom.floor} · ₹{myRoom.fee.toLocaleString('en-IN')}/yr · Warden: {myRoom.warden}</span></div>
          <a className="btn ghost compact" href={`tel:${myRoom.phone?.replace(/\s/g,'')}`}><Phone size={15}/> Warden</a>
        </div>
      ) : null}

      <div className="dash-tabs">
        {tabs.map((t) => <button key={t} className={activeTab===t?'active':''} onClick={() => setActiveTab(t)}>{tabLabels[t]}</button>)}
      </div>

      {activeTab==='overview' && (
        <div className="tab-content overview-grid">
          <div className="portal-card profile-full">
            <p className="module-title"><UserCheck size={16}/> Profile</p>
            <div className="profile-grid">
              <div className="pf-row"><strong>Email</strong><span>{student.gmail}</span></div>
              <div className="pf-row"><strong>Phone</strong><span>{student.phone}</span></div>
              <div className="pf-row"><strong>Guardian</strong><span>{student.guardian}</span></div>
              <div className="pf-row"><strong>Department</strong><span>{student.department} — {student.year}</span></div>
              <div className="pf-row"><strong>Campus</strong><span>{student.city}</span></div>
              <div className="pf-row"><strong>Stay</strong><span>{student.stayType==='pg'?'Private PG':'College Hostel'}</span></div>
              <div className="pf-row"><strong>Verified</strong><span>{student.verified?'✅ Yes':'⏳ Pending'}</span></div>
            </div>
            <div className="sys-health-card">
              <p className="module-title" style={{marginBottom:10}}><Wifi size={15}/> System Health</p>
              <div className="health-row"><span>Network</span><span className="health-val ok">● Online</span></div>
              <div className="health-row"><span>Active devices</span><span className="health-val">{activeDev}</span></div>
              <div className="health-row"><span>Bandwidth used</span><span className="health-val">{totalBw} GB</span></div>
              <div className="health-row"><span>Wi-Fi quota</span><span className="health-val">100 GB</span></div>
              <div className="bw-bar"><div className="bw-fill" style={{width:`${Math.min((totalBw/100)*100,100)}%`}}/></div>
              <p style={{fontSize:11,color:'var(--muted)',marginTop:4}}>{totalBw} / 100 GB used this month</p>
            </div>
          </div>
          <div className="overview-cards">
            <div className="ov-card"><span className="ov-icon"><CalendarCheck size={20}/></span><strong>{myLeaves.length}</strong><small>Leave requests</small></div>
            <div className="ov-card"><span className="ov-icon"><MessageSquareWarning size={20}/></span><strong>{myComplaints.filter(c=>c.status!=='Resolved').length}</strong><small>Open complaints</small></div>
            <div className="ov-card"><span className="ov-icon"><Users size={20}/></span><strong>{myVisitors.length}</strong><small>Visitor logs</small></div>
            <div className="ov-card"><span className="ov-icon"><FileText size={20}/></span><strong>{docsUploaded}/{REQUIRED_DOCS.length}</strong><small>Docs uploaded</small></div>
          </div>
        </div>
      )}

      {activeTab==='room' && (
        <div className="tab-content">
          <div className="portal-card">
            <p className="module-title"><Building2 size={16}/> Room allocation</p>
            <div className="room-picker">
              {rooms.map((room) => (
                <button key={room.id} className={`room-row ${student.roomId===room.id?'active':''}`} onClick={() => { if(room.id===student.roomId||room.available<1)return; setRooms((arr) => arr.map((r) => r.id===room.id?{...r,available:r.available-1}:r.id===student.roomId?{...r,available:r.available+1}:r)); updateStudent(student.id,{roomId:room.id}); }} disabled={room.available<1&&student.roomId!==room.id}>
                  <span><strong>{room.id}</strong>{room.hostel} · {room.type} · {room.city}</span>
                  <small>{student.roomId===room.id?'✓ Current':`${room.available} beds`} · ₹{room.fee.toLocaleString('en-IN')}/yr</small>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab==='notices' && (
        <div className="tab-content">
          <div className="notice-grid">
            {notices.map((n) => (
              <article key={n.id} className="notice">
                <span className={`notice-tag tag-${n.type.toLowerCase()}`}>{n.type}</span>
                <strong>{n.title}</strong>
                <p>{n.body}</p>
                <small>{n.date}</small>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

// ─── GATE PASS VIEW ───────────────────────────────────────────────────────────
function GatePassView({ student, gatePasses, setGatePasses }) {
  const myPasses = gatePasses.filter((p) => p.studentId===student.id);
  const [step, setStep]         = useState(0);
  const [form, setForm]         = useState({ type:'Day Out', purpose:'', departure:'', arrival:'', parentPhone:'' });
  const [parentConfirmed, setParentConfirmed] = useState(false);
  const [msg, setMsg]           = useState('');
  const set = (k,v) => setForm((f) => ({...f,[k]:v}));

  const submit = () => {
    if (!form.purpose.trim()||!form.departure||!form.arrival) { setMsg('Fill all fields.'); return; }
    const id = `GP-${Date.now().toString().slice(-4)}`;
    setGatePasses((arr) => [{ id, studentId:student.id, type:form.type, purpose:form.purpose, departure:form.departure, arrival:form.arrival, parentApproval: parentConfirmed?'Approved':'Pending', wardenApproval:'Pending', status:'Pending', createdAt:new Date().toISOString().split('T')[0] }, ...arr]);
    setStep(0); setForm({type:'Day Out',purpose:'',departure:'',arrival:'',parentPhone:''}); setParentConfirmed(false); setMsg('');
  };

  return (
    <section className="section">
      <SectionTitle kicker="Gate Pass" title="Leave Request &amp; Digital Gate Pass" text="Apply for day out, night out, or long leave. Track approval status and get your QR gate pass once approved."/>
      <div className="gp-layout">
        <div className="portal-card gp-form-card">
          <p className="module-title"><CalendarCheck size={16}/> New leave application</p>
          <div className="gp-stepper">
            {['Leave Details','Parent Auth','Summary & QR'].map((lbl,i) => (
              <div key={i} className={`gp-step ${step===i?'active':step>i?'done':''}`}>
                <span>{step>i?'✓':i+1}</span><small>{lbl}</small>
              </div>
            ))}
          </div>

          {step===0 && (
            <div className="stack-form" style={{marginTop:16}}>
              <label><span>Leave type</span>
                <select value={form.type} onChange={(e) => set('type',e.target.value)}>
                  {['Day Out','Night Out','Long Leave'].map((t) => <option key={t}>{t}</option>)}
                </select>
              </label>
              <label><span>Purpose</span><textarea value={form.purpose} onChange={(e) => set('purpose',e.target.value)} placeholder="Reason for leave (medical, festival, family…)" style={{minHeight:80,padding:10,resize:'vertical'}}/></label>
              <div className="form-row-2">
                <label><span>Departure</span><input type="datetime-local" value={form.departure} onChange={(e) => set('departure',e.target.value)}/></label>
                <label><span>Expected return</span><input type="datetime-local" value={form.arrival} onChange={(e) => set('arrival',e.target.value)}/></label>
              </div>
              {msg && <p className="form-message error">{msg}</p>}
              <button className="btn primary" onClick={() => { if(!form.purpose.trim()||!form.departure||!form.arrival){setMsg('Fill all fields.');return;} setMsg('');setStep(1); }}>Next <ChevronRight size={16}/></button>
            </div>
          )}

          {step===1 && (
            <div className="stack-form" style={{marginTop:16}}>
              <label><span>Parent / Guardian phone</span><input value={form.parentPhone} onChange={(e) => set('parentPhone',e.target.value)} placeholder="+91 98765 00000"/></label>
              <div className="otp-mock">
                <span>📱 OTP sent to {form.parentPhone||'parent number'}</span>
                <small>In production this triggers a real SMS OTP via Twilio / MSG91.</small>
              </div>
              <label style={{display:'flex',alignItems:'center',gap:10,cursor:'pointer'}}>
                <input type="checkbox" checked={parentConfirmed} onChange={(e) => setParentConfirmed(e.target.checked)} style={{width:18,height:18,minHeight:0}}/>
                <span style={{fontSize:14}}>Parent has confirmed and authorized this leave</span>
              </label>
              <div className="form-row-2">
                <button className="btn ghost" onClick={() => setStep(0)}>← Back</button>
                <button className="btn primary" onClick={() => { if(!parentConfirmed){setMsg('Parent confirmation required.');return;} setMsg('');setStep(2); }}>Next <ChevronRight size={16}/></button>
              </div>
              {msg && <p className="form-message error">{msg}</p>}
            </div>
          )}

          {step===2 && (
            <div style={{marginTop:16}}>
              <div className="gp-summary">
                <div className="pf-row"><strong>Type</strong><span>{form.type}</span></div>
                <div className="pf-row"><strong>Purpose</strong><span>{form.purpose}</span></div>
                <div className="pf-row"><strong>Departure</strong><span>{form.departure}</span></div>
                <div className="pf-row"><strong>Return</strong><span>{form.arrival}</span></div>
                <div className="pf-row"><strong>Parent auth</strong><span>{parentConfirmed?'✅ Confirmed':'⏳ Pending'}</span></div>
              </div>
              <div className="form-row-2" style={{marginTop:14}}>
                <button className="btn ghost" onClick={() => setStep(1)}>← Back</button>
                <button className="btn primary" onClick={submit}><CheckCircle2 size={16}/> Submit Application</button>
              </div>
            </div>
          )}
        </div>

        <div className="portal-card">
          <p className="module-title"><FileText size={16}/> My gate passes</p>
          {myPasses.length===0 && <p className="empty-state">No passes yet.</p>}
          {myPasses.map((pass) => (
            <div key={pass.id} className="gp-pass-card">
              <div className="gp-pass-header">
                <div>
                  <strong>{pass.type}</strong>
                  <small>{pass.purpose}</small>
                  <small>Departure: {pass.departure}</small>
                  <small>Return: {pass.arrival}</small>
                </div>
                <span className={`gp-status-badge ${pass.status.toLowerCase()}`}>{pass.status}</span>
              </div>
              <div className="gp-approval-row">
                <span className={`approval-chip ${pass.parentApproval.toLowerCase()}`}><Users size={12}/> Parent: {pass.parentApproval}</span>
                <span className={`approval-chip ${pass.wardenApproval.toLowerCase()}`}><ShieldCheck size={12}/> Warden: {pass.wardenApproval}</span>
              </div>
              {pass.status==='Approved' && (
                <div className="qr-container">
                  <p style={{fontSize:11,color:'var(--gold-2)',fontWeight:700,marginBottom:8,textAlign:'center'}}>SCAN AT GATE — VALID GATE PASS</p>
                  <div dangerouslySetInnerHTML={{__html:generateQRSVG(pass.id+pass.studentId+pass.departure)}} style={{borderRadius:8,overflow:'hidden'}}/>
                  <p style={{fontSize:11,color:'var(--muted)',marginTop:8,textAlign:'center'}}>Pass ID: {pass.id}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── COMPLAINTS KANBAN ────────────────────────────────────────────────────────
const KANBAN_COLS = ['Ticket Lodged','Assigned','In Progress','Resolved'];

function ComplaintsView({ student, complaints, setComplaints }) {
  const myComplaints = complaints.filter((c) => c.studentId===student.id);
  const [form, setForm] = useState({ issue:'', category:'Wi-Fi/Network', priority:'Medium', assetTag:'' });
  const [dragId, setDragId] = useState(null);
  const set = (k,v) => setForm((f) => ({...f,[k]:v}));

  const addComplaint = (e) => {
    e.preventDefault();
    if (!form.issue.trim()) return;
    setComplaints((arr) => [{id:`GR-${Date.now().toString().slice(-4)}`, studentId:student.id, issue:form.issue.trim(), category:form.category, priority:form.priority, assetTag:form.assetTag.trim(), status:'Ticket Lodged', owner:'Warden Office'}, ...arr]);
    setForm({issue:'',category:'Wi-Fi/Network',priority:'Medium',assetTag:''});
  };

  const moveCard = (id, newStatus) => {
    setComplaints((arr) => arr.map((c) => c.id===id ? {...c, status:newStatus} : c));
  };

  return (
    <section className="section">
      <SectionTitle kicker="Complaints" title="Maintenance &amp; Grievance Portal" text="Submit issues with category, priority, and asset tag. Drag cards across the Kanban board to track resolution."/>
      <div className="portal-card" style={{marginBottom:16}}>
        <p className="module-title"><Plus size={16}/> File a complaint</p>
        <form onSubmit={addComplaint}>
          <div className="form-row-3" style={{marginBottom:10}}>
            <label><span>Category</span>
              <select value={form.category} onChange={(e) => set('category',e.target.value)}>
                {['Electrical','Plumbing','Wi-Fi/Network','Structural','Cleanliness'].map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label><span>Priority</span>
              <select value={form.priority} onChange={(e) => set('priority',e.target.value)}>
                {['Low','Medium','High'].map((p) => <option key={p}>{p}</option>)}
              </select>
            </label>
            <label><span>Asset tag (optional)</span><input value={form.assetTag} onChange={(e) => set('assetTag',e.target.value)} placeholder="e.g. Router_B1_Flr2"/></label>
          </div>
          <div className="inline-form">
            <input value={form.issue} onChange={(e) => set('issue',e.target.value)} placeholder="Describe the issue clearly"/>
            <button className="btn primary compact" type="submit"><Plus size={15}/> Submit</button>
          </div>
        </form>
      </div>

      <div className="kanban-board">
        {KANBAN_COLS.map((col) => (
          <div key={col} className="kanban-col"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); if(dragId) moveCard(dragId, col); setDragId(null); }}>
            <div className="kanban-col-header">
              <span>{col}</span>
              <strong>{myComplaints.filter((c) => c.status===col).length}</strong>
            </div>
            <div className="kanban-col-body">
              {myComplaints.filter((c) => c.status===col).map((c) => (
                <div key={c.id} className={`kanban-card priority-${c.priority?.toLowerCase()}`}
                  draggable
                  onDragStart={() => setDragId(c.id)}
                  onDragEnd={() => setDragId(null)}>
                  <div className="kanban-card-top">
                    <span className="kc-id">{c.id}</span>
                    <span className={`priority-badge p-${c.priority?.toLowerCase()}`}>{c.priority}</span>
                  </div>
                  <p className="kc-issue">{c.issue}</p>
                  <div className="kc-meta">
                    <span>{c.category}</span>
                    {c.assetTag && <span>{c.assetTag}</span>}
                    <span>{c.owner}</span>
                  </div>
                </div>
              ))}
              {myComplaints.filter((c) => c.status===col).length===0 && <p className="empty-state" style={{padding:'16px 0'}}>No tickets</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── MESS MENU VIEW ───────────────────────────────────────────────────────────
function MessView({ student, messRsvp, setMessRsvp, students }) {
  const days = useMemo(() => {
    const arr = [];
    const d = new Date('2026-06-12');
    for (let i=0;i<7;i++) { const nd=new Date(d); nd.setDate(d.getDate()+i); arr.push(nd); }
    return arr;
  }, []);
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const meals    = ['Breakfast','Lunch','Snacks','Dinner'];
  const mealTimes = { Breakfast:7, Lunch:13, Snacks:17, Dinner:20 };

  const key = (date, meal) => `${student.id}|${date.toISOString().split('T')[0]}|${meal}`;
  const isAttending = (date, meal) => {
    const k = key(date, meal);
    return messRsvp[k] !== false;
  };
  const toggle = (date, meal) => {
    const k = key(date, meal);
    const now = new Date('2026-06-12T08:00:00');
    const mealDt = new Date(date);
    mealDt.setHours(mealTimes[meal], 0, 0, 0);
    if ((mealDt - now) < 4 * 3600000 && isAttending(date, meal)) { alert('Cannot cancel a meal within 4 hours of serving time.'); return; }
    setMessRsvp((prev) => ({ ...prev, [k]: !isAttending(date, meal) }));
  };

  const totalConfirmed = days.reduce((sum, d) => sum + meals.filter((m) => isAttending(d, m)).length, 0);

  return (
    <section className="section">
      <SectionTitle kicker="Mess Menu" title="7-Day Menu &amp; RSVP" text="Toggle your meal attendance at least 4 hours before serving time. Your RSVP helps the kitchen reduce food waste."/>
      <div className="mess-summary-bar">
        <div className="mess-stat"><strong>{totalConfirmed}</strong><span>Meals confirmed this week</span></div>
        <div className="mess-stat"><strong>{days.length*meals.length - totalConfirmed}</strong><span>Meals skipped</span></div>
        <div className="mess-stat"><span style={{color:'var(--gold-2)'}}>Cutoff: 4 hrs before meal</span></div>
      </div>
      <div className="mess-grid">
        {days.map((day, di) => (
          <div key={di} className="mess-day">
            <div className="mess-day-header">
              <span className="mess-day-name">{dayNames[day.getDay()]}</span>
              <span className="mess-day-date">{day.getDate()} Jun</span>
            </div>
            {meals.map((meal, mi) => (
              <div key={meal} className={`meal-slot ${isAttending(day, meal)?'on':'off'}`}>
                <div className="meal-info">
                  <span className="meal-name">{meal}</span>
                  <span className="meal-item">{MESS_MENU[meal][(di+mi)%7]}</span>
                </div>
                <button className={`meal-toggle ${isAttending(day, meal)?'active':''}`} onClick={() => toggle(day, meal)} title={isAttending(day,meal)?'Click to skip':'Click to attend'}>
                  <span className="toggle-knob"/>
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── WARDEN HOTLINE ───────────────────────────────────────────────────────────
function WardenView({ wardens, setWardens, isAdmin }) {
  const [editId, setEditId]   = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm]       = useState({ name:'', block:'', role:'', phone:'', active:true });
  const set = (k,v) => setForm((f) => ({...f,[k]:v}));

  const saveWarden = () => {
    if (!form.name.trim()||!form.phone.trim()) return;
    if (editId) {
      setWardens && setWardens((arr) => arr.map((w) => w.id===editId?{...w,...form}:w));
      setEditId(null);
    } else {
      setWardens && setWardens((arr) => [...arr, {...form, id:`w-${Date.now()}`}]);
    }
    setForm({name:'',block:'',role:'',phone:'',active:true}); setShowAdd(false);
  };

  const activeWardens = wardens.filter((w) => w.active);

  return (
    <section className="section">
      <SectionTitle kicker="Warden Hotline" title="Hostel Warden Helpline" text="Direct contact for all hostel blocks. Tap 'Call Now' to connect immediately."/>
      {isAdmin && (
        <div className="portal-card" style={{marginBottom:16}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
            <p className="module-title" style={{margin:0}}><Settings size={16}/> Warden management</p>
            <button className="btn primary compact" onClick={() => {setShowAdd(true);setEditId(null);setForm({name:'',block:'',role:'',phone:'',active:true});}}><Plus size={15}/> Add warden</button>
          </div>
          {(showAdd || editId) && (
            <div className="form-row-2" style={{marginBottom:12}}>
              <label><span>Name</span><input value={form.name} onChange={(e) => set('name',e.target.value)} placeholder="Dr. Name"/></label>
              <label><span>Block</span><input value={form.block} onChange={(e) => set('block',e.target.value)} placeholder="Block / Hostel name"/></label>
              <label><span>Role</span><input value={form.role} onChange={(e) => set('role',e.target.value)} placeholder="Chief Warden etc."/></label>
              <label><span>Phone</span><input value={form.phone} onChange={(e) => set('phone',e.target.value)} placeholder="+91 98765 00000"/></label>
              <div style={{gridColumn:'1/-1',display:'flex',gap:8}}>
                <button className="btn primary compact" onClick={saveWarden}><Save size={14}/> {editId?'Update':'Add'}</button>
                <button className="btn ghost compact" onClick={() => {setShowAdd(false);setEditId(null);}}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}
      <div className="warden-grid">
        {activeWardens.map((w) => (
          <div key={w.id} className="warden-card">
            <div className="warden-avatar">{initials(w.name)}</div>
            <div className="warden-info">
              <strong>{w.name}</strong>
              <span>{w.role}</span>
              <span>{w.block}</span>
            </div>
            <a className="btn primary compact call-btn" href={`tel:${w.phone.replace(/\s/g,'')}`}><Phone size={15}/> Call Now</a>
            {isAdmin && setWardens && (
              <div style={{display:'flex',gap:6,marginTop:8}}>
                <button className="btn ghost compact" style={{flex:1}} onClick={() => {setEditId(w.id);setShowAdd(false);setForm({name:w.name,block:w.block,role:w.role,phone:w.phone,active:w.active});}}>Edit</button>
                <button className="btn ghost compact" style={{flex:1,color:'#ffb3a7'}} onClick={() => setWardens((arr) => arr.filter((x) => x.id!==w.id))}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── IT & LAUNDRY UTILITIES ───────────────────────────────────────────────────
function UtilitiesView({ student, wifiDevices, setWifiDevices, laundrySlots, setLaundrySlots, rooms }) {
  const [wifiForm, setWifiForm] = useState({ type:'Laptop', mac:'', label:'' });
  const myDevices = (wifiDevices||[]).filter((d) => d.studentId===student.id);
  const myRoom    = rooms.find((r) => r.id===student.roomId);
  const block     = myRoom?.id || 'NITK-BH1';
  const today     = '2026-06-13';

  const addDevice = (e) => {
    e.preventDefault();
    if (!wifiForm.mac.trim()) return;
    setWifiDevices((arr) => [...arr, { id:`dev-${Date.now()}`, type:wifiForm.type, mac:wifiForm.mac.trim(), ip:'10.0.1.'+Math.floor(50+Math.random()*100), bw:0, status:'Active', label:wifiForm.label.trim()||wifiForm.type, studentId:student.id }]);
    setWifiForm({type:'Laptop',mac:'',label:''});
  };

  const maskMac = (mac) => { const p=mac.split(':'); return [...p.slice(0,3),'**','**','**'].join(':'); };

  const bookSlot = (machine, time) => {
    const exists = laundrySlots.find((s) => s.machine===machine&&s.date===today&&s.time===time);
    if (exists) return;
    setLaundrySlots((arr) => [...arr, { id:`ls-${Date.now()}`, machine, block, studentId:student.id, date:today, time, status:'Booked' }]);
  };
  const cancelSlot = (id) => setLaundrySlots((arr) => arr.filter((s) => s.id!==id));

  const getSlot = (machine, time) => (laundrySlots||[]).find((s) => s.machine===machine&&s.date===today&&s.time===time&&s.block===block);

  return (
    <section className="section">
      <SectionTitle kicker="IT & Laundry" title="Utilities Dashboard" text="Register your devices on the hostel Wi-Fi whitelist and book laundry machine slots."/>

      <div className="util-grid">
        <div className="portal-card">
          <p className="module-title"><Wifi size={16}/> Wi-Fi device registry</p>
          <form onSubmit={addDevice}>
            <div className="form-row-3" style={{marginBottom:10}}>
              <label><span>Device type</span>
                <select value={wifiForm.type} onChange={(e) => setWifiForm(f=>({...f,type:e.target.value}))}>
                  {['Laptop','Smartphone','Tablet','Microcontroller','Smart Watch'].map((t) => <option key={t}>{t}</option>)}
                </select>
              </label>
              <label><span>MAC address</span><input value={wifiForm.mac} onChange={(e) => setWifiForm(f=>({...f,mac:e.target.value}))} placeholder="AA:BB:CC:DD:EE:FF"/></label>
              <label><span>Label</span><input value={wifiForm.label} onChange={(e) => setWifiForm(f=>({...f,label:e.target.value}))} placeholder="Device name"/></label>
            </div>
            <button className="btn primary compact" type="submit"><Plus size={15}/> Register device</button>
          </form>
          <div className="wifi-table">
            <div className="wifi-header">
              <span>Type</span><span>MAC</span><span>IP</span><span>BW (GB)</span><span>Status</span><span></span>
            </div>
            {myDevices.length===0 && <p className="empty-state" style={{padding:'12px 0'}}>No devices registered.</p>}
            {myDevices.map((d) => (
              <div key={d.id} className="wifi-row">
                <span>{d.type}</span>
                <span className="mac-addr">{maskMac(d.mac)}</span>
                <span>{d.ip}</span>
                <span>{d.bw.toFixed(1)}</span>
                <span className={`dev-status ${d.status.toLowerCase()}`}>{d.status}</span>
                <button className="icon-btn square" style={{minHeight:30,width:30}} onClick={() => setWifiDevices((arr) => arr.filter((x) => x.id!==d.id))}><Trash2 size={13}/></button>
              </div>
            ))}
          </div>
        </div>

        <div className="portal-card">
          <p className="module-title"><RefreshCw size={16}/> Laundry slot booking — {today}</p>
          <p style={{fontSize:12,color:'var(--muted)',marginBottom:12}}>Block: {block} · Green=free · Your bookings highlighted</p>
          <div className="laundry-grid">
            <div className="laundry-header-row">
              <span></span>
              {LAUNDRY_MACHINES.map((m) => <span key={m}>{m}</span>)}
            </div>
            {LAUNDRY_TIMES.map((time) => (
              <div key={time} className="laundry-time-row">
                <span className="laundry-time">{time}</span>
                {LAUNDRY_MACHINES.map((machine) => {
                  const slot = getSlot(machine, time);
                  const isMine = slot?.studentId===student.id;
                  const isTaken = slot && !isMine;
                  return (
                    <button key={machine} className={`laundry-slot ${isMine?'mine':isTaken?'taken':'free'}`}
                      onClick={() => { if(isMine) cancelSlot(slot.id); else if(!isTaken) bookSlot(machine, time); }}
                      title={isMine?'Your booking — click to cancel':isTaken?'Booked by another student':'Click to book'}>
                      {isMine?'Yours':isTaken?'Taken':'Free'}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── DOCUMENTS PAGE ───────────────────────────────────────────────────────────
function DocumentsPage({ student, documents, setDocuments }) {
  const myDocs = documents[student.id]||{};
  const [draggingOver, setDraggingOver] = useState(null);

  const uploadCount   = Object.keys(myDocs).length;
  const pendingCount  = REQUIRED_DOCS.filter((d) => !myDocs[d.id]).length;
  const verifiedCount = Object.values(myDocs).filter((d) => d.status==='Verified').length;

  const handleFile = (docId, file) => {
    if (!file) return;
    if (file.size > 8*1024*1024) { alert('File too large. Max 8 MB.'); return; }
    const reader = new FileReader();
    reader.onload = (e) => setDocuments((prev) => ({ ...prev, [student.id]: { ...(prev[student.id]||{}), [docId]: { name:file.name, size:file.size, type:file.type, dataUrl:e.target.result, status:'Submitted', uploadedAt:new Date().toLocaleString('en-IN',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}) } } }));
    reader.readAsDataURL(file);
  };

  const removeDoc = (docId) => setDocuments((prev) => { const u={...(prev[student.id]||{})}; delete u[docId]; return {...prev,[student.id]:u}; });
  const previewDoc = (doc) => { const w=window.open(); w.document.write(doc.type?.startsWith('image/')?`<html><body style="margin:0;background:#0e0d0b;display:flex;align-items:center;justify-content:center;min-height:100vh"><img src="${doc.dataUrl}" style="max-width:100%;max-height:100vh"/></body></html>`:`<html><body style="margin:0"><embed src="${doc.dataUrl}" width="100%" height="100%" type="application/pdf"/></body></html>`); };
  const fmt = (b) => b<1024?`${b}B`:b<1048576?`${(b/1024).toFixed(1)}KB`:`${(b/1048576).toFixed(1)}MB`;

  return (
    <section className="section">
      <SectionTitle kicker="Documents" title="Document Upload &amp; Verification" text="Upload all required documents. Admin will verify them. Drag and drop files directly onto each card."/>
      <div className="docs-summary">
        <div className="docs-stat"><strong>{uploadCount}</strong><span>Uploaded</span></div>
        <div className="docs-stat pending"><strong>{pendingCount}</strong><span>Pending</span></div>
        <div className="docs-stat verified"><strong>{verifiedCount}</strong><span>Verified</span></div>
        <div className="docs-progress-wrap">
          <div className="docs-progress-label"><span>Progress</span><span>{uploadCount}/{REQUIRED_DOCS.length}</span></div>
          <div className="docs-progress-bar"><div className="docs-progress-fill" style={{width:`${(uploadCount/REQUIRED_DOCS.length)*100}%`}}/></div>
        </div>
      </div>
      {pendingCount>0 ? <div className="docs-info-banner"><AlertCircle size={16}/><span>{pendingCount} document{pendingCount!==1?'s':''} still required. Upload before 18 Jun 2026.</span></div>
                      : <div className="docs-info-banner success"><CheckCircle2 size={16}/><span>All required documents submitted. Awaiting admin verification.</span></div>}
      <div className="docs-grid">
        {REQUIRED_DOCS.map((req) => {
          const uploaded = myDocs[req.id];
          return (
            <div key={req.id} className={`doc-card ${uploaded?'uploaded':'missing'} ${draggingOver===req.id?'drag-over':''}`}
              onDragOver={(e) => { e.preventDefault(); if(!uploaded) setDraggingOver(req.id); }}
              onDragLeave={() => setDraggingOver(null)}
              onDrop={(e) => { e.preventDefault(); setDraggingOver(null); if(!uploaded){const f=e.dataTransfer.files[0]; if(f) handleFile(req.id,f);} }}>
              <div className="doc-card-strip"/>
              <div className="doc-card-header">
                <div className="doc-icon-wrap">{uploaded?(uploaded.type?.startsWith('image/')?<img src={uploaded.dataUrl} alt={req.label} className="doc-thumb"/>:<FileText size={26}/>):<FolderOpen size={26}/>}</div>
                <div className="doc-card-info"><strong>{req.label}</strong><small>{req.note}</small></div>
                {uploaded && <span className={`doc-status-badge ${uploaded.status.toLowerCase().replace(' ','-')}`}>{uploaded.status==='Verified'?'✅ ':uploaded.status==='Submitted'?'⏳ ':'❌ '}{uploaded.status}</span>}
              </div>
              {uploaded && <div className="doc-file-meta"><span className="doc-filename">{uploaded.name}</span><span className="doc-filesize">{fmt(uploaded.size)}</span><span className="doc-date">{uploaded.uploadedAt}</span></div>}
              <div className="doc-card-actions">
                {!uploaded ? (
                  <label className="doc-upload-btn"><Upload size={15}/> Choose file<input type="file" accept={DOC_ACCEPT} style={{display:'none'}} onChange={(e) => handleFile(req.id,e.target.files[0])}/></label>
                ) : (
                  <>
                    <button className="doc-action-btn view" onClick={() => previewDoc(uploaded)}><Eye size={14}/> Preview</button>
                    <label className="doc-action-btn replace"><Upload size={14}/> Replace<input type="file" accept={DOC_ACCEPT} style={{display:'none'}} onChange={(e) => handleFile(req.id,e.target.files[0])}/></label>
                    <button className="doc-action-btn remove" onClick={() => removeDoc(req.id)}><Trash2 size={14}/> Remove</button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <p className="docs-footer-note">Accepted: PDF, JPG, PNG, WEBP · Max 8 MB per document · Stored locally; connect Supabase Storage for cloud persistence.</p>
    </section>
  );
}

// ─── HOSTELS ─────────────────────────────────────────────────────────────────
function Hostels({ rooms, students }) {
  const cards = rooms.map((room) => { const assigned=students.filter((s) => s.roomId===room.id).length; const cap=assigned+room.available; return {...room, occupancy:cap?Math.round((assigned/cap)*100):100}; });
  return (
    <section className="section" id="hostels">
      <SectionTitle kicker="Hostel inventory" title="Residential overview — NITK, Manipal, Udupi &amp; Mangalore" text="Live availability, warden contacts, amenities, and occupancy across all registered hostel blocks."/>
      <div className="hostel-grid">
        {cards.map((room, i) => (
          <article key={room.id} className="hostel-card" style={{'--accent':room.city==='Udupi Town'?'#bb8c2d':room.city==='Mangalore City'?'#f2cf75':'#d8a742','--delay':`${i*70}ms`}}>
            <div className="card-top"><Building2 size={20}/><span>{room.city} · Floor {room.floor}</span></div>
            <h3>{room.hostel}</h3>
            <p>{room.type} · {room.rating}★</p>
            <div className="occupancy"><span>{room.occupancy}% occupied</span><span>{room.available} beds open</span></div>
            <div className="bar"><span style={{width:`${room.occupancy}%`}}/></div>
            {room.amenities?.length>0 && <div className="hostel-amenities">{room.amenities.map((a) => <span key={a}>{a}</span>)}</div>}
            {room.warden && <p className="hostel-warden"><strong>Warden:</strong> {room.warden}{room.phone && <a href={`tel:${room.phone.replace(/\s/g,'')}`} className="hostel-phone"><Phone size={13}/> {room.phone}</a>}</p>}
          </article>
        ))}
      </div>
    </section>
  );
}

// ─── LEAFLET MAP ─────────────────────────────────────────────────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl:'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl:'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl:'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});
const pgIcon = L.divIcon({ className:'', html:`<div style="width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#ffe9a0,#c9913a);border:2px solid rgba(255,233,160,0.9);display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 6px rgba(201,145,58,0.18),0 4px 14px rgba(0,0,0,0.45);color:#120f07;font-size:15px;">📍</div>`, iconSize:[34,34], iconAnchor:[17,17], popupAnchor:[0,-20] });
const pgIconActive = L.divIcon({ className:'', html:`<div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#fff3c0,#f0c96a);border:2px solid #fff3c0;display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 10px rgba(201,145,58,0.22),0 6px 20px rgba(0,0,0,0.5);color:#120f07;font-size:17px;">📍</div>`, iconSize:[40,40], iconAnchor:[20,20], popupAnchor:[0,-22] });

function LeafletMap({ filtered, activePg, setActivePg, origin, campus }) {
  const containerRef = useRef(null);
  const mapRef       = useRef(null);
  const markersRef   = useRef({});
  const campusRef    = useRef(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, { center:[origin.lat,origin.lng], zoom:13, zoomControl:true });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { attribution:'&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>', subdomains:'abcd', maxZoom:19 }).addTo(map);
    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setView([origin.lat,origin.lng], 13, {animate:true});
    if (campusRef.current) campusRef.current.remove();
    const icon = L.divIcon({ className:'', html:`<div style="padding:5px 11px;border-radius:8px;background:rgba(6,6,5,0.9);border:1px solid rgba(240,201,106,0.55);color:#f0c96a;font-size:12px;font-weight:800;white-space:nowrap;backdrop-filter:blur(8px);box-shadow:0 4px 14px rgba(0,0,0,0.5);">🎓 ${campus}</div>`, iconSize:[0,0], iconAnchor:[0,0] });
    campusRef.current = L.marker([origin.lat,origin.lng], {icon, zIndexOffset:1000}).addTo(mapRef.current);
  }, [origin, campus]);

  useEffect(() => {
    if (!mapRef.current) return;
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};
    filtered.forEach((pg) => {
      const isActive = activePg?.name===pg.name;
      const marker = L.marker([pg.lat,pg.lng], {icon:isActive?pgIconActive:pgIcon}).addTo(mapRef.current)
        .bindPopup(`<div style="font-family:Inter,sans-serif;min-width:180px"><strong style="font-size:14px;display:block;margin-bottom:4px">${pg.name}</strong><span style="color:#888;font-size:12px">${pg.area}, ${pg.city}</span><br/><span style="color:#f0c96a;font-weight:700">₹${pg.rent.toLocaleString('en-IN')}/mo</span> · <span>${pg.rating}★</span> · <span>${pg.seats} seats</span><br/><span style="font-size:12px;color:#aaa">${pg.safety}</span></div>`, {maxWidth:240});
      marker.on('click', () => setActivePg(pg));
      markersRef.current[pg.id||pg.name] = marker;
    });
  }, [filtered, activePg, setActivePg]);

  useEffect(() => {
    if (!mapRef.current || !activePg) return;
    mapRef.current.panTo([activePg.lat,activePg.lng], {animate:true, duration:0.6});
    const m = markersRef.current[activePg.id||activePg.name];
    if (m) m.openPopup();
  }, [activePg]);

  return <div ref={containerRef} className="leaflet-map-container" aria-label="Interactive PG map"/>;
}

function PgTracker({ pgs, setPgs, activePg, setActivePg, student }) {
  // Ensure campus always maps to a valid key in coastalLocations
  const validCampus = Object.keys(coastalLocations).includes(student?.city) ? student.city : 'NITK Surathkal';
  const [campus, setCampus] = useState(validCampus);
  const [query,  setQuery]  = useState('');
  const [newPg,  setNewPg]  = useState('');
  const origin = coastalLocations[campus] || coastalLocations['NITK Surathkal'];
  const filtered = pgs.map((p) => ({...p, distance:kmBetween(origin,p)})).filter((p) => `${p.name} ${p.city} ${p.area} ${p.safety}`.toLowerCase().includes(query.toLowerCase())).sort((a,b) => Number(a.distance)-Number(b.distance));

  const addPg = (e) => {
    e.preventDefault();
    if (!newPg.trim()) return;
    setPgs((arr) => [{id:`pg-${Date.now()}`, name:newPg.trim(), city:campus, area:`${campus} local area`, rent:8900, rating:4.2, seats:1, safety:'New listing', contact:'TBC', lat:origin.lat+0.008, lng:origin.lng+0.008, x:Math.min(origin.x+6,80), y:Math.min(origin.y+6,80), amenities:[]}, ...arr]);
    setNewPg('');
  };

  // Guard: origin must exist
  if (!origin) return null;

  const routeUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${activePg.lat},${activePg.lng}&travelmode=driving`;
  const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${activePg.lat},${activePg.lng}`;

  return (
    <section className="section pg-section" id="pg">
      <SectionTitle kicker="Live PG tracker" title="Verified PGs — Mangalore, Surathkal, Udupi &amp; Manipal" text="Select your campus, search by area or tag, compare distance and rent."/>
      <div className="pg-controls">
        <label className="search-box"><MapPin size={17}/><select value={campus} onChange={(e) => setCampus(e.target.value)}>{Object.keys(coastalLocations).map((c) => <option key={c}>{c}</option>)}</select></label>
        <label className="search-box"><Search size={17}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name, area, city, or tag"/></label>
        <form className="inline-form" onSubmit={addPg}><input value={newPg} onChange={(e) => setNewPg(e.target.value)} placeholder="Add PG listing"/><button className="btn primary compact" type="submit"><Plus size={15}/> Add</button></form>
      </div>
      <div className="pg-shell">
        <LeafletMap filtered={filtered} activePg={activePg} setActivePg={setActivePg} origin={origin} campus={campus}/>
        <aside className="pg-list">
          {filtered.length===0 && <p className="empty-state">No PGs match your search.</p>}
          {filtered.map((pg) => (
            <button key={pg.id||pg.name} className={`pg-item ${activePg.name===pg.name?'active':''}`} onClick={() => setActivePg(pg)}>
              <span><strong>{pg.name}</strong><small><MapPin size={11}/> {pg.area}, {pg.city}</small><small>{pg.distance} km away · {pg.safety}</small></span>
              <span><b>₹{pg.rent.toLocaleString('en-IN')}</b><small><Star size={12}/> {pg.rating} · {pg.seats} seats</small></span>
            </button>
          ))}
          {activePg && (
            <div className="pg-detail">
              <strong>{activePg.name}</strong>
              <p>{activePg.safety} · {activePg.area}, {activePg.city}</p>
              <p>₹{activePg.rent?.toLocaleString('en-IN')}/mo · {activePg.seats} seats · {activePg.rating}★</p>
              {activePg.contact && <p><Phone size={13}/> {activePg.contact}</p>}
              {activePg.amenities?.length>0 && <div className="stay-amenities">{activePg.amenities.map((a) => <span key={a}>{a}</span>)}</div>}
              <div className="pg-actions">
                <a className="btn primary compact" href={routeUrl} target="_blank" rel="noreferrer"><Navigation size={15}/> Directions</a>
                <a className="btn ghost compact" href={gmapsUrl} target="_blank" rel="noreferrer"><MapPin size={15}/> View map</a>
              </div>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}

// ─── ADMIN PLATFORM ──────────────────────────────────────────────────────────
function AdminPlatform({ auth, login, activeView, students, updateStudent, rooms, setRooms, pgs, setPgs, complaints, setComplaints, leaves, setLeaves, visitors, setVisitors, notices, setNotices, arrangements, setArrangements, documents, wardens, setWardens, resetDemoData }) {
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeBody,  setNoticeBody]  = useState('');
  const [noticeType,  setNoticeType]  = useState('Admin');
  const [taskTitle,   setTaskTitle]   = useState('');
  const isAdmin = auth?.role==='admin';

  const allocate = (studentId, roomId) => {
    const s = students.find((x) => x.id===studentId);
    if (!s||s.roomId===roomId) return;
    const t = rooms.find((r) => r.id===roomId);
    if (!t||t.available<1) return;
    setRooms((arr) => arr.map((r) => r.id===roomId?{...r,available:r.available-1}:r.id===s.roomId?{...r,available:r.available+1}:r));
    updateStudent(studentId, {roomId});
  };

  const addNotice = (e) => {
    e.preventDefault();
    if (!noticeTitle.trim()) return;
    const d = new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'});
    setNotices((arr) => [{id:`NO-${Date.now()}`,title:noticeTitle.trim(),body:noticeBody.trim()||'Published from admin platform.',type:noticeType,date:d},...arr]);
    setNoticeTitle(''); setNoticeBody('');
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    setArrangements((arr) => [{id:`AR-${Date.now()}`,title:taskTitle.trim(),status:'Scheduled',owner:'Warden Office'},...arr]);
    setTaskTitle('');
  };

  if (!isAdmin) {
    return (
      <section className="section">
        <div className="portal-card admin-lock">
          <LockKeyhole size={26}/>
          <div><h3>Admin access required</h3><p>Use <strong>admin@hostel-hub.in</strong> / <strong>Admin@1234</strong> or click below.</p></div>
          <button className="btn primary" onClick={() => login({role:'admin'})}>Quick admin demo</button>
        </div>
      </section>
    );
  }

  return (
    <section className="section admin-app" id="admin">
      {(activeView==='dashboard'||!activeView) && (
        <>
          <SectionTitle kicker="Admin platform" title="HOSTEL-HUB management console" text="Use the sidebar to navigate between Students, Documents, Wardens, Notices, and Maintenance."/>
          <div className="admin-metrics">
            <Metric icon={<Users/>}      value={students.length}                           label="Total students"/>
            <Metric icon={<UserCheck/>}  value={students.filter((s) => s.present).length}  label="Present today"/>
            <Metric icon={<DoorOpen/>}   value={rooms.reduce((s,r) => s+r.available,0)}    label="Vacant beds"/>
            <Metric icon={<FileCheck2/>} value={students.filter((s) => !s.verified).length} label="Need verification"/>
          </div>
          <div className="portal-card admin-toolbar" style={{marginTop:14}}>
            <div><strong>Admin</strong><span>{ADMIN_CREDENTIALS.email} / {ADMIN_CREDENTIALS.password}</span></div>
            <button className="btn ghost compact" onClick={resetDemoData}>Reset demo</button>
          </div>
        </>
      )}

      {activeView==='students' && (
        <>
          <SectionTitle kicker="Student records" title="Students &amp; Room Allocation"/>
          <div className="portal-card wide">
            <p className="module-title"><ShieldCheck size={16}/> All students</p>
            <div className="data-table">
              {students.map((s) => (
                <div className="data-row" key={s.id}>
                  <div className="student-mini">
                    <span className="mini-avatar" style={{'--photo':s.photoColor}}>{initials(s.name)}</span>
                    <span><strong>{s.name}</strong><small>{s.admissionNo} · {s.department} · {s.city} · {s.stayType==='pg'?`PG: ${s.pgName||'—'}`:'Hostel'}</small></span>
                  </div>
                  <select value={s.roomId} onChange={(e) => allocate(s.id,e.target.value)}>
                    {rooms.map((r) => <option value={r.id} key={r.id}>{r.id} – {r.city} ({r.available} free)</option>)}
                  </select>
                  <button className={s.present?'presence in':'presence out'} onClick={() => updateStudent(s.id,{present:!s.present})}>{s.present?'Present':'Outside'}</button>
                  <button className="btn ghost compact" onClick={() => updateStudent(s.id,{verified:!s.verified})}>{s.verified?'✓ Verified':'Verify'}</button>
                </div>
              ))}
            </div>
          </div>
          <div className="portal-card wide" style={{marginTop:14}}>
            <p className="module-title"><Home size={16}/> PG occupancy</p>
            <div className="pg-admin-grid">
              {pgs.map((pg) => { const occ=students.filter((s) => s.pgId===pg.id); return (
                <div key={pg.id} className="pg-admin-card">
                  <strong>{pg.name}</strong><small>{pg.city} · {pg.seats} seats left</small>
                  {occ.length>0 ? <div className="pg-occupants">{occ.map((s) => <span key={s.id}>{s.name}</span>)}</div> : <p className="empty-state" style={{fontSize:12}}>No students allocated</p>}
                </div>
              ); })}
            </div>
          </div>
          <div className="admin-columns" style={{marginTop:14}}>
            <div className="portal-card">
              <p className="module-title"><MessageSquareWarning size={16}/> Complaints</p>
              {complaints.length===0&&<p className="empty-state">No complaints.</p>}
              {complaints.map((item) => <AdminEditableItem key={item.id} title={item.issue} meta={`${item.id} · ${students.find((s) => s.id===item.studentId)?.name||'Student'} · ${item.owner}`} value={item.status} options={['Ticket Lodged','Assigned','In Progress','Resolved']} onChange={(v) => setComplaints((arr) => arr.map((e) => e.id===item.id?{...e,status:v}:e))}/>)}
            </div>
            <div className="portal-card">
              <p className="module-title"><CalendarCheck size={16}/> Leave approvals</p>
              {leaves.length===0&&<p className="empty-state">No leave requests.</p>}
              {leaves.map((item) => <AdminEditableItem key={item.id} title={item.reason} meta={`${item.id} · ${students.find((s) => s.id===item.studentId)?.name||'Student'} · ${item.from} → ${item.to}`} value={item.status} options={['Pending','Approved','Rejected']} onChange={(v) => setLeaves((arr) => arr.map((e) => e.id===item.id?{...e,status:v}:e))}/>)}
            </div>
            <div className="portal-card">
              <p className="module-title"><Users size={16}/> Visitor log</p>
              {visitors.length===0&&<p className="empty-state">No visitors.</p>}
              {visitors.map((item) => <AdminEditableItem key={item.id} title={`${item.name} (${item.relation})`} meta={`${item.id} · for ${students.find((s) => s.id===item.studentId)?.name||'Student'} · ${item.time}`} value={item.status} options={['Scheduled','Checked in','Checked out','Rejected']} onChange={(v) => setVisitors((arr) => arr.map((e) => e.id===item.id?{...e,status:v}:e))}/>)}
            </div>
          </div>
        </>
      )}

      {activeView==='documents' && (
        <>
          <SectionTitle kicker="Document verification" title="Student Document Status"/>
          <div className="portal-card wide">
            <p className="module-title"><FileCheck2 size={16}/> Document verification status</p>
            {students.map((s) => {
              const myDocs=documents[s.id]||{};
              const uploaded=REQUIRED_DOCS.filter((d) => myDocs[d.id]);
              const allDone=uploaded.length===REQUIRED_DOCS.length;
              return (
                <div key={s.id} className="admin-doc-row">
                  <div className="student-mini">
                    <span className="mini-avatar" style={{'--photo':s.photoColor}}>{initials(s.name)}</span>
                    <span><strong>{s.name}</strong><small>{s.admissionNo} · {uploaded.length}/{REQUIRED_DOCS.length} docs</small></span>
                  </div>
                  <div className="admin-doc-pills">
                    {REQUIRED_DOCS.map((req) => { const doc=myDocs[req.id]; return <span key={req.id} className={`admin-doc-pill ${doc?doc.status.toLowerCase().replace(' ','-'):'missing'}`} title={req.label}>{doc?(doc.status==='Verified'?'✅':doc.status==='Rejected'?'❌':'⏳'):'○'} {req.label.split(' ')[0]}</span>; })}
                  </div>
                  <span className={`doc-overall-badge ${allDone?'complete':'incomplete'}`}>{allDone?'✓ All submitted':`${REQUIRED_DOCS.length-uploaded.length} missing`}</span>
                </div>
              );
            })}
          </div>
        </>
      )}

      {activeView==='wardens' && <WardenView wardens={wardens} setWardens={setWardens} isAdmin={true}/>}

      {activeView==='notices' && (
        <>
          <SectionTitle kicker="Notices" title="Publish Notices"/>
          <div className="portal-card">
            <p className="module-title"><Bell size={16}/> Publish notice to all students</p>
            <form className="notice-publish-form" onSubmit={addNotice}>
              <input value={noticeTitle} onChange={(e) => setNoticeTitle(e.target.value)} placeholder="Notice title"/>
              <select value={noticeType} onChange={(e) => setNoticeType(e.target.value)}>{['Admin','Admissions','Safety','Mess','Transport','Exams'].map((t) => <option key={t}>{t}</option>)}</select>
              <input value={noticeBody} onChange={(e) => setNoticeBody(e.target.value)} placeholder="Body (optional)"/>
              <button className="btn primary compact" type="submit"><Plus size={15}/> Publish</button>
            </form>
            <StatusList items={notices.map((n) => ({title:n.title,meta:`${n.type} · ${n.date}`}))}/>
          </div>
        </>
      )}

      {activeView==='maintenance' && (
        <>
          <SectionTitle kicker="Maintenance" title="Hostel Arrangements"/>
          <div className="portal-card">
            <p className="module-title"><ClipboardCheck size={16}/> Maintenance tasks</p>
            <form className="inline-form" onSubmit={addTask}>
              <input value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} placeholder="New maintenance task"/>
              <button className="btn primary compact" type="submit"><Save size={15}/> Add</button>
            </form>
            {arrangements.map((item) => <AdminEditableItem key={item.id} title={item.title} meta={`${item.id} · ${item.owner}`} value={item.status} options={['Scheduled','In progress','Done']} onChange={(v) => setArrangements((arr) => arr.map((e) => e.id===item.id?{...e,status:v}:e))}/>)}
          </div>
        </>
      )}
    </section>
  );
}

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
function AdminEditableItem({ title, meta, value, options, onChange }) {
  return (
    <div className="editable-item">
      <span><strong>{title}</strong><small>{meta}</small></span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>{options.map((o) => <option key={o}>{o}</option>)}</select>
    </div>
  );
}
function StatusList({ items }) {
  if (!items.length) return <p className="empty-state">No records yet.</p>;
  return <div className="status-list">{items.map((item,i) => <div className="ticket" key={`${item.title}-${i}`}><span><strong>{item.title}</strong></span><small>{item.meta}</small></div>)}</div>;
}
function Metric({ icon, value, label }) {
  return <div className="metric"><span className="metric-icon">{icon}</span><strong>{value}</strong><small>{label}</small></div>;
}
function SectionTitle({ kicker, title, text }) {
  return (
    <div className="section-title reveal">
      <span className="eyebrow">{kicker}</span>
      <h2 dangerouslySetInnerHTML={{__html:title}}/>
      {text && <p>{text}</p>}
    </div>
  );
}

// Missing imports for AuthLanding — Sparkles is imported from lucide-react above

createRoot(document.getElementById('root')).render(<App/>);
