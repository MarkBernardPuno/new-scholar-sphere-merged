import { useState, useRef, useEffect } from 'react';
import { authAPI, lookupAPI } from '../services/api.js';

const _style = document.createElement('style');
_style.innerHTML = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { width: 100%; height: 100%; overflow: hidden; }
  input[type="file"] { display: none; }
  .sideBtn:hover  { background-color: #fdf3d8 !important; color: #b8860b !important; }
  .actionBtn:hover { opacity: 0.8; }
  .uploadArea:hover { border-color: #d4a017 !important; background: #fdf8ec !important; }
  tr:hover td { background-color: #fffcf2 !important; }
  select { -webkit-appearance: none; -moz-appearance: none; appearance: none; }
  .settingsBtn:hover { background-color: #f5f5f5 !important; }
  .overlay-panel { animation: slideIn 0.25s ease; }
  @keyframes slideIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
`;
document.head.appendChild(_style);

const loginBg = '/cover.png';
const signupBg = '/back.png';
const landingBg = '/backdesign.png';
const logo = '/tipLogo.png';
const F = 'Georgia, serif';

const MENU_ITEMS = [
  'Author', 'Campus', 'College', 'Department',
  'Research Output', 'Research', 'Role', 'School Year', 'Semester',
];

let _uid = 1;
const uid = () => _uid++;

// ── SVG Illustrations ──────────────────────────────────────────────

const LoginIllustration = () => (
  <div style={{
    width: '100%', height: '100%',
    backgroundImage: `url(${loginBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    overflow: 'hidden',
  }} />
);

const SignUpIllustration = () => (
  <div style={{
    width: '100%', height: '100%',
    backgroundImage: `url(${signupBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    overflow: 'hidden',
  }} />
);

// ── Shared Sub-components ──────────────────────────────────────────

const Header = ({ tipLogo: logoSrc }) => (
  <header style={S.topHeader}>
    <div style={S.headerInner}>
      <div style={S.logoBox}>
        <img src={logoSrc} alt="TIP Logo" style={S.logoImg} />
        <div style={S.headerTextGroup}>
          <span style={S.headerTitle}>Academic Research Unit</span>
          <span style={S.headerSubtitle}>Technological Institute of the Philippines</span>
        </div>
      </div>
    </div>
  </header>
);

const Footer = () => (
  <footer style={S.footer}>
    <span style={S.footerLink}>Terms and Conditions</span>
    <span style={S.footerLink}>Privacy Policy</span>
  </footer>
);

// ── Settings Icon SVG ──────────────────────────────────────────────
const GearIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

// ── Main App ───────────────────────────────────────────────────────

export default function Login() {
  const [view, setView]             = useState('landing'); // landing | login | signup | home | dashboard
  const [activeMenu, setActiveMenu] = useState('Author');
  const [showDashboard, setShowDashboard] = useState(false);

  // Auth
  const [loginEmail, setLoginEmail]       = useState('');
  const [loginPass, setLoginPass]         = useState('');
  const [authError, setAuthError]         = useState('');

  const [fullName, setFullName]           = useState('');
  const [dept, setDept]                   = useState('');
  const [college, setCollege]             = useState('');  // Changed from 'role' to 'college'
  const [campus, setCampus]               = useState('');
  const [signupEmail, setSignupEmail]     = useState('');
  const [signupPass, setSignupPass]       = useState('');
  const [repeatPass, setRepeatPass]       = useState('');
  const [signupError, setSignupError]     = useState('');

  // Dynamic dropdown data
  const [departments, setDepartments]     = useState([]);
  const [colleges, setColleges]           = useState([]);  // Will store objects with {id, name}
  const [campuses, setCampuses]           = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);  // Departments for selected college
  const [selectedCollegeId, setSelectedCollegeId] = useState('');  // Track selected college ID
  const [loading, setLoading]             = useState(true);
  const [dropdownError, setDropdownError] = useState('');
  const [loginLoading, setLoginLoading]   = useState(false);

  // Dashboard data
  const [attachments, setAttachments]     = useState({});
  const [records, setRecords]             = useState({});
  const [editingId, setEditingId]         = useState(null);
  const [editName, setEditName]           = useState('');
  const [editEmail, setEditEmail]         = useState('');
  const [showAddRow, setShowAddRow]       = useState(false);
  const [newName, setNewName]             = useState('');
  const [newRowEmail, setNewRowEmail]     = useState('');

  const fileInputRef = useRef();

  const mk  = activeMenu.replace(/\s/g, '');
  const att = attachments[mk] || [];
  const rec = records[mk]     || [];

  // Fetch dropdown data from API
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        setLoading(true);
        setDropdownError('');
        
        // Fetch data from lookup endpoints (colleges and campuses first)
        try {
          const [collegesData, campusesData] = await Promise.all([
            lookupAPI.getColleges(),
            lookupAPI.getCampuses(),
          ]);

          console.log('Colleges data received:', collegesData);
          console.log('Campuses data received:', campusesData);

          // Store full college objects with IDs for department filtering  
          setColleges(collegesData);
          setCampuses(campusesData.map(item => item.name || item.title || item));
          
        } catch (error) {
          console.error('Failed to fetch colleges and campuses:', error);
          setColleges([]);
          setCampuses([]);
        }
        
      } catch (error) {
        console.error('Failed to fetch dropdown data:', error);
        setDropdownError('Failed to load dropdown options. Please check your connection to the backend API.');
        
        // No fallback data - keep arrays empty if API fails
        setDepartments([]);
        setColleges([]);
        setCampuses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDropdownData();
  }, []);

  // Handle college selection and fetch corresponding departments
  const handleCollegeChange = async (collegeId) => {
    console.log('College selected:', collegeId);
    console.log('Available colleges:', colleges);
    
    setSelectedCollegeId(collegeId);
    setCollege(collegeId);
    setDept(''); // Clear department selection
    
    if (collegeId) {
      try {
        console.log('Fetching departments for college ID:', collegeId);
        const departmentsData = await lookupAPI.getDepartmentsByCollege(collegeId);
        console.log('Received departments data:', departmentsData);
        setFilteredDepartments(departmentsData.map(item => item.name || item.title || item));
      } catch (error) {
        console.error('Failed to fetch departments for college:', error);
        setFilteredDepartments([]);
      }
    } else {
      setFilteredDepartments([]);
    }
  };

  // Auth handlers
  const handleLogin = async () => {
    setAuthError('');
    setLoginLoading(true);
    
    if (!loginEmail.trim() || !loginPass.trim()) {
      setAuthError('Please fill in all fields.');
      setLoginLoading(false);
      return;
    }

    try {
      const response = await authAPI.login(loginEmail, loginPass);
      
      // Store the JWT token
      localStorage.setItem('authToken', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user || { email: loginEmail }));
      
      setView('home');
    } catch (error) {
      console.error('Login failed:', error);
      setAuthError(error.message || 'Invalid email or password.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignup = async () => {
    setSignupError('');
    
    // Check if dropdown data is available
    if (colleges.length === 0 || campuses.length === 0) {
      setSignupError('Required data is not available. Please ensure the backend API is running.');
      return;
    }
    
    // Check if college is selected and departments are loaded
    if (!college || filteredDepartments.length === 0) {
      setSignupError('Please select a college first, then select a department.');
      return;
    }
    
    if (!fullName.trim() || !signupEmail.trim() || !signupPass || !dept || !college || !campus) { 
      setSignupError('Please fill in all fields.'); 
      return; 
    }
    
    if (signupPass !== repeatPass) { 
      setSignupError('Passwords do not match!'); 
      return; 
    }

    try {
      const userData = {
        full_name: fullName,
        email: signupEmail,
        password: signupPass,
        department_name: dept,    // Changed field name to match API
        college_name: college,    // Changed from 'role' to 'college_name'
        campus_name: campus,      // Changed field name to match API
      };

      await authAPI.signup(userData);        // Changed from 'register' to 'signup'
      alert('Registration successful! You can now log in.');
      setView('login');
      
      // Clear form
      setFullName('');
      setSignupEmail('');
      setSignupPass('');
      setRepeatPass('');
      setDept('');
      setCollege('');     // Changed from 'setRole'
      setCampus('');
      
    } catch (error) {
      console.error('Registration failed:', error);
      setSignupError(error.message || 'Registration failed. Please try again.');
    }
  };

  const handleLogout = () => {
    setView('landing');
    setLoginPass('');
    setShowDashboard(false);
  };

  const goToLanding = () => {
    setView('landing');
    setShowDashboard(false);
  };

  // File handlers
  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const newAtt = files.map(f => ({ id: uid(), name: f.name, size: (f.size / 1024).toFixed(1) + ' KB', url: URL.createObjectURL(f) }));
    setAttachments(p => ({ ...p, [mk]: [...att, ...newAtt] }));
    e.target.value = '';
  };
  const removeAtt = (id) => setAttachments(p => ({ ...p, [mk]: att.filter(a => a.id !== id) }));

  const addRecord  = () => {
    if (!newName.trim()) return;
    setRecords(p => ({ ...p, [mk]: [...rec, { id: uid(), name: newName.trim(), email: newRowEmail.trim() || '—' }] }));
    setNewName(''); setNewRowEmail(''); setShowAddRow(false);
  };
  const startEdit  = (row) => { setEditingId(row.id); setEditName(row.name); setEditEmail(row.email); };
  const saveEdit   = (id)  => {
    setRecords(p => ({ ...p, [mk]: rec.map(r => r.id === id ? { ...r, name: editName, email: editEmail } : r) }));
    setEditingId(null);
  };
  const deleteRow  = (id)  => setRecords(p => ({ ...p, [mk]: rec.filter(r => r.id !== id) }));

  // ── LANDING PAGE ────────────────────────────────────────────────
  if (view === 'landing') return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', fontFamily: F }}>
      <Header tipLogo={logo} />
      <div style={{ ...S.landingBg, backgroundImage: `url(${landingBg})` }}>
        <div style={S.landingFade}>
          <div style={S.rightPanel}>
            <div style={S.landingContent}>
              <div style={S.logoBadge}>ScholarSphere</div>
              <h1 style={S.heroText}>Elevating TIP's Research Landscape</h1>
              <p style={S.heroSubtext}>
                Dive into the heart of academic exploration with the Academic Research Unit (ARU) at
                Technological Institute of the Philippines. Uncover, share, and incentivize groundbreaking
                research at ScholarSphere.
              </p>
              <button onClick={() => setView('login')} style={S.primaryBtn}>Login or Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ── LOGIN PAGE ───────────────────────────────────────────────────
  if (view === 'login') return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', fontFamily: F }}>
      <Header tipLogo={logo} />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div style={S.authFormPanel}>
          <div style={S.authFormInner}>
            <h2 style={S.authHeading}>Log In</h2>
            {authError && <div style={S.errorBox}>{authError}</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input style={S.inp} type="email" placeholder="Enter email"
                value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
              <input style={S.inp} type="password" placeholder="Password"
                value={loginPass} onChange={e => setLoginPass(e.target.value)} />
              <button 
                style={{ 
                  ...S.submitBtn,
                  opacity: loginLoading ? 0.6 : 1,
                  cursor: loginLoading ? 'not-allowed' : 'pointer'
                }} 
                onClick={handleLogin}
                disabled={loginLoading}
              >
                {loginLoading ? 'Logging in...' : 'Login'}
              </button>
              <p style={S.switchText}>
                Don't have an account?{' '}
                <span onClick={() => { setAuthError(''); setView('signup'); }} style={S.switchLink}>Sign Up</span>
              </p>
            </div>
          </div>
        </div>
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <LoginIllustration />
          <div style={{ ...S.quoteBox, top: '60px', left: '48px', right: '48px', textAlign: 'left' }}>
            <p style={S.quoteText}>
              Research is formalized{' '}
              <span style={{ color: '#d4a017' }}>curiosity</span>
              {'. It is poking and'}
              <br />{'prying with a '}
              <span style={{ color: '#d4a017' }}>purpose</span>.
            </p>
            <p style={{ ...S.quoteAuthor, textAlign: 'right', marginTop: '12px' }}>-Zora Neale Hurston</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );

  // ── SIGN UP PAGE ─────────────────────────────────────────────────
  if (view === 'signup') return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', fontFamily: F }}>
      <Header tipLogo={logo} />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <SignUpIllustration />
          <div style={{ ...S.quoteBox, top: '55px', left: '48px', right: '48px', textAlign: 'center' }}>
            <p style={S.quoteText}>
              No research without{' '}
              <span style={{ color: '#d4a017' }}>action</span>
              {', no'}
              <br />{'action without '}
              <span style={{ color: '#d4a017' }}>research</span>.
            </p>
            <p style={{ ...S.quoteAuthor, textAlign: 'right', marginTop: '12px' }}>-Kurt Lewin</p>
          </div>
        </div>
        <div style={S.authFormPanel}>
          <div style={{ ...S.authFormInner, maxWidth: '460px' }}>
            <h2 style={S.authHeading}>Sign Up</h2>
            {signupError && <div style={S.errorBox}>{signupError}</div>}
            {dropdownError && <div style={{ ...S.errorBox, backgroundColor: '#fef3cd', color: '#856404', borderColor: '#ffeaa7' }}>{dropdownError}</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input style={S.inp} type="text" placeholder="Full Name"
                value={fullName} onChange={e => setFullName(e.target.value)} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <select 
                  style={{ ...S.inp, ...S.sel, flex: 1 }} 
                  value={college} 
                  onChange={e => handleCollegeChange(e.target.value)}
                  disabled={loading || colleges.length === 0}
                >
                  <option value="">
                    {loading ? 'Loading colleges...' : 
                     colleges.length === 0 ? 'No colleges available' : 
                     'Select College'}
                  </option>
                  {colleges.map(c => <option key={c.id || c} value={c.id || c}>{c.name || c}</option>)}
                </select>
                <select 
                  style={{ ...S.inp, ...S.sel, flex: 1 }} 
                  value={dept} 
                  onChange={e => setDept(e.target.value)}
                  disabled={!college || filteredDepartments.length === 0}
                >
                  <option value="">
                    {!college ? 'First select college' : 
                     filteredDepartments.length === 0 ? 'No departments available' : 
                     'Select Department'}
                  </option>
                  {filteredDepartments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <select 
                style={{ ...S.inp, ...S.sel }} 
                value={campus} 
                onChange={e => setCampus(e.target.value)}
                disabled={loading || campuses.length === 0}
              >
                <option value="">
                  {loading ? 'Loading campuses...' : 
                   campuses.length === 0 ? 'No campuses available' : 
                   'Select Campus'}
                </option>
                {campuses.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input style={S.inp} type="email" placeholder="Your email"
                value={signupEmail} onChange={e => setSignupEmail(e.target.value)} />
              <input style={S.inp} type="password" placeholder="Password"
                value={signupPass} onChange={e => setSignupPass(e.target.value)} />
              <input style={S.inp} type="password" placeholder="Repeat Password"
                value={repeatPass} onChange={e => setRepeatPass(e.target.value)} />
              <button 
                style={{ 
                  ...S.submitBtn, 
                  opacity: (loading || colleges.length === 0 || campuses.length === 0) ? 0.6 : 1,
                  cursor: (loading || colleges.length === 0 || campuses.length === 0) ? 'not-allowed' : 'pointer'
                }} 
                onClick={handleSignup}
                disabled={loading || colleges.length === 0 || campuses.length === 0}
              >
                {loading ? 'Loading...' : 
                 (colleges.length === 0 || campuses.length === 0) ? 'Backend Required' : 
                 'Sign Up'}
              </button>
              <p style={{ ...S.switchText, textAlign: 'center' }}>
                Already have an account?{' '}
                <span onClick={() => { setSignupError(''); setView('login'); }} style={S.switchLink}>Log In</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );

  // ── HOME PAGE (plain white with settings button) ─────────────────
  if (view === 'home') return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', fontFamily: F, backgroundColor: '#ffffff' }}>

      {/* Top bar */}
      <div style={S.homeTopBar}>
        <div style={S.logoBox}>
          <img src={logo} alt="TIP Logo" style={S.logoImg} />
          <div style={S.headerTextGroup}>
            <span style={{ ...S.headerTitle, color: '#1a1a1a' }}>Academic Research Unit</span>
            <span style={{ ...S.headerSubtitle, color: '#666' }}>Technological Institute of the Philippines</span>
          </div>
        </div>

        {/* Settings button + dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            className="settingsBtn"
            onClick={() => setShowDashboard(v => !v)}
            style={S.settingsBtn}
          >
            <GearIcon />
            <span style={{ fontSize: '14px', fontWeight: '600', fontFamily: F }}>Settings</span>
          </button>

          {/* Dashboard dropdown panel */}
          {showDashboard && (
            <div className="overlay-panel" style={S.overlayPanel}>
              {/* Panel header */}
              <div style={S.panelHeader}>
                <span style={S.panelTitle}>⚙ Settings & Dashboard</span>
                <button onClick={() => setShowDashboard(false)} style={S.closeBtn}>✕</button>
              </div>

              <div style={{ display: 'flex', height: 'calc(100% - 52px)', overflow: 'hidden' }}>
                {/* Sidebar */}
                <aside style={S.panelSidebar}>
                  <div style={S.sideTitle}>● Settings</div>
                  {MENU_ITEMS.map(item => (
                    <button key={item} className="sideBtn"
                      onClick={() => { setActiveMenu(item); setEditingId(null); setShowAddRow(false); }}
                      style={{
                        ...S.sideBtn,
                        backgroundColor: item === activeMenu ? '#fdf3d8' : 'transparent',
                        color:            item === activeMenu ? '#b8860b' : '#2a2a2a',
                        border:           item === activeMenu ? '1px solid #d4a017' : '1px solid transparent',
                      }}>{item}</button>
                  ))}
                  <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #e8e2d4' }}>
                    <button onClick={handleLogout} style={S.panelLogoutBtn}>Log out</button>
                  </div>
                </aside>

                {/* Main content */}
                <main style={S.panelMain}>
                  <div style={S.panelCardHeadingRow}>
                    <h2 style={S.cardHeading}>{activeMenu.toUpperCase()} INFORMATION</h2>
                    <button style={S.sysViewBtn}>System View</button>
                  </div>

                  {/* ATTACHMENTS */}
                  <div style={S.block}>
                    <div style={S.blockHeader}>
                      <span style={S.blockLabel}>Attachments</span>
                      <button style={S.uploadBtn} onClick={() => fileInputRef.current.click()}>+ Upload File</button>
                      <input ref={fileInputRef} type="file" multiple onChange={handleFiles} />
                    </div>
                    {att.length === 0 ? (
                      <div className="uploadArea" style={S.dropZone} onClick={() => fileInputRef.current.click()}>
                        <div style={{ fontSize: '28px', marginBottom: '8px' }}>📂</div>
                        <p style={{ color: '#aaa', fontSize: '13px', fontFamily: F }}>Click to attach files, or drag &amp; drop here</p>
                      </div>
                    ) : (
                      <div style={S.fileList}>
                        {att.map(f => (
                          <div key={f.id} style={S.fileChip}>
                            <span style={{ fontSize: '14px' }}>📄</span>
                            <a href={f.url} download={f.name} style={S.fileLink}>{f.name}</a>
                            <span style={S.fileSize}>{f.size}</span>
                            <button className="actionBtn" style={S.removeBtn} onClick={() => removeAtt(f.id)}>✕</button>
                          </div>
                        ))}
                        <button style={{ ...S.uploadBtn, marginTop: '8px', display: 'inline-block' }}
                          onClick={() => fileInputRef.current.click()}>+ Add More</button>
                      </div>
                    )}
                  </div>

                  {/* RECORDS TABLE */}
                  <div style={S.block}>
                    <div style={{ ...S.blockHeader, marginBottom: '12px' }}>
                      <span style={S.blockLabel}>Records</span>
                      <button style={S.uploadBtn} onClick={() => setShowAddRow(v => !v)}>
                        {showAddRow ? '✕ Cancel' : '+ Add Record'}
                      </button>
                    </div>

                    {showAddRow && (
                      <div style={S.addRowForm}>
                        <input style={{ ...S.inp, flex: 1 }} placeholder="Full name" value={newName} onChange={e => setNewName(e.target.value)} />
                        <input style={{ ...S.inp, flex: 2 }} type="email" placeholder="Email address" value={newRowEmail} onChange={e => setNewRowEmail(e.target.value)} />
                        <button style={S.saveBtn} onClick={addRecord}>✔ Save</button>
                      </div>
                    )}

                    <div style={S.tableWrap}>
                      <table style={S.table}>
                        <thead>
                          <tr style={S.thead}>
                            <th style={{ ...S.th, width: '50px' }}>ID</th>
                            <th style={S.th}>Name</th>
                            <th style={S.th}>Email</th>
                            <th style={{ ...S.th, width: '180px', textAlign: 'center' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rec.length === 0 ? (
                            <tr><td colSpan={4} style={S.emptyCell}>No records yet. Click "+ Add Record" to get started.</td></tr>
                          ) : rec.map((row, i) => (
                            <tr key={row.id} style={{ backgroundColor: i % 2 === 0 ? '#fafaf8' : '#fff' }}>
                              <td style={S.td}>{i + 1}</td>
                              <td style={S.td}>
                                {editingId === row.id
                                  ? <input style={S.inlineInp} value={editName} onChange={e => setEditName(e.target.value)} />
                                  : row.name}
                              </td>
                              <td style={S.td}>
                                {editingId === row.id
                                  ? <input style={S.inlineInp} value={editEmail} onChange={e => setEditEmail(e.target.value)} />
                                  : row.email}
                              </td>
                              <td style={{ ...S.td, textAlign: 'center' }}>
                                {editingId === row.id ? (
                                  <>
                                    <button className="actionBtn" style={S.saveBtn}   onClick={() => saveEdit(row.id)}>✔ Save</button>
                                    <button className="actionBtn" style={S.cancelBtn} onClick={() => setEditingId(null)}>✕ Cancel</button>
                                  </>
                                ) : (
                                  <>
                                    <button className="actionBtn" style={S.renameBtn} onClick={() => startEdit(row)}>✏ Rename</button>
                                    <button className="actionBtn" style={S.deleteBtn} onClick={() => deleteRow(row.id)}>🗑 Delete</button>
                                  </>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </main>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return null;
}

// ── STYLES ─────────────────────────────────────────────────────────
const S = {
  // HEADER (dark — used in landing/login/signup)
  topHeader:      { width: '100%', backgroundColor: '#1a1a1a', borderBottom: '1px solid #333', flexShrink: 0, zIndex: 100 },
  headerInner:    { padding: '15px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  logoBox:        { display: 'flex', alignItems: 'center', gap: '17px' },
  logoImg:        { width: '55px', height: '55px', objectFit: 'contain', flexShrink: 0 },
  headerTextGroup:{ display: 'flex', flexDirection: 'column', gap: '3px', textAlign: 'left' },
  headerTitle:    { color: '#f0e8d0', fontFamily: 'Georgia, serif', fontSize: '17px', fontWeight: '700', letterSpacing: '0.3px' },
  headerSubtitle: { color: '#999', fontFamily: 'Georgia, serif', fontSize: '17px', fontWeight: '400' },

  // FOOTER
  footer:         { width: '100%', backgroundColor: '#d4a017', padding: '14px 28px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '24px', flexShrink: 0 },
  footerLink:     { fontSize: '12px', color: '#1a1a1a', fontFamily: 'Georgia, serif', cursor: 'pointer' },

  // LANDING
  landingBg:      { flex: 1, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', overflow: 'hidden' },
  landingFade:    { position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(255,255,255,0) 38%, rgba(255,255,255,0.92) 58%, rgba(255,255,255,0.97) 72%)', display: 'flex', alignItems: 'center' },
  rightPanel:     { marginLeft: 'auto', width: '48%', padding: '0 72px 0 48px' },
  landingContent: { width: '100%', textAlign: 'right' },
  logoBadge:      { display: 'inline-block', color: '#d4a017', fontWeight: '700', fontSize: '20px', letterSpacing: '3px', fontFamily: 'Georgia, serif', marginBottom: '10px' },
  heroText:       { fontSize: '35px', fontWeight: '900', color: '#1a1a1a', margin: '0 0 16px 0', lineHeight: '1.18', fontFamily: 'Georgia, serif' },
  heroSubtext:    { fontSize: '16px', color: '#444', marginBottom: '34px', lineHeight: '1.75', fontFamily: 'Georgia, serif', maxWidth: '600px', marginLeft: 'auto' },
  primaryBtn:     { padding: '12px 36px', background: '#d4a017', color: '#1a1a1a', border: 'none', borderRadius: '6px', fontWeight: '800', cursor: 'pointer', fontSize: '14px', fontFamily: 'Georgia, serif', letterSpacing: '0.5px', boxShadow: '0 4px 18px rgba(212,160,23,.35)' },

  // AUTH SHARED
  authFormPanel:  { width: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', overflowY: 'auto', padding: '40px 20px' },
  authFormInner:  { width: '100%', maxWidth: '400px' },
  authHeading:    { fontSize: '22px', fontWeight: '700', color: '#2a2a2a', marginBottom: '24px', fontFamily: 'Georgia, serif' },
  inp:            { width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', fontFamily: 'Georgia, serif', color: '#2a2a2a', background: '#fff', outline: 'none', boxSizing: 'border-box' },
  sel:            { backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23666' strokeWidth='1.5' fill='none'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', cursor: 'pointer' },
  submitBtn:      { width: '100%', padding: '12px', background: '#3a5fc8', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: '700', cursor: 'pointer', fontSize: '15px', fontFamily: 'Georgia, serif', letterSpacing: '0.3px' },
  switchText:     { fontSize: '13px', color: '#555', fontFamily: 'Georgia, serif', margin: 0 },
  switchLink:     { color: '#3a5fc8', cursor: 'pointer', textDecoration: 'underline', fontWeight: '600' },
  errorBox:       { backgroundColor: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '6px', textAlign: 'center', fontSize: '13px', fontFamily: 'Georgia, serif', marginBottom: '8px' },

  // QUOTE
  quoteBox:       { position: 'absolute', top: '55px', left: '50px', right: '50px', fontFamily: 'Georgia, serif' },
  quoteText:      { fontSize: '25px', lineHeight: '1.45', color: '#2a2a2a', margin: 0, fontWeight: '400' },
  quoteAuthor:    { marginTop: '14px', color: '#666', fontSize: '15px', fontFamily: 'Georgia, serif' },

  // HOME PAGE
  homeTopBar:     { width: '100%', backgroundColor: '#ffffff', borderBottom: '1px solid #e8e8e8', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, position: 'relative', zIndex: 200 },
  homeBody:       { flex: 1, backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  homeWelcomeCard:{ textAlign: 'center', maxWidth: '600px', padding: '40px' },
  homeWelcomeTitle:{ fontSize: '30px', fontWeight: '800', color: '#1a1a1a', fontFamily: 'Georgia, serif', marginBottom: '16px' },
  homeWelcomeSubtext:{ fontSize: '16px', color: '#555', lineHeight: '1.7', fontFamily: 'Georgia, serif' },
  homeDivider:    { width: '60px', height: '3px', background: '#d4a017', margin: '28px auto' },
  homeStatsRow:   { display: 'flex', gap: '16px', justifyContent: 'center' },
  homeStatCard:   { display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#fafaf8', border: '1px solid #e8e2d4', borderRadius: '10px', padding: '18px 22px', minWidth: '120px' },
  homeStatNum:    { fontSize: '22px', fontWeight: '800', color: '#d4a017', fontFamily: 'Georgia, serif' },
  homeStatLabel:  { fontSize: '12px', color: '#888', fontFamily: 'Georgia, serif', marginTop: '4px' },

  // SETTINGS BUTTON
  settingsBtn:    { display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 18px', background: '#ffffff', color: '#1a1a1a', border: '1px solid #d4a017', borderRadius: '8px', cursor: 'pointer', fontFamily: 'Georgia, serif', transition: 'background 0.15s' },

  // OVERLAY PANEL
  overlayPanel:   { position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: '820px', height: '560px', background: '#fff', border: '1px solid #e0d8c8', borderRadius: '14px', boxShadow: '0 12px 40px rgba(0,0,0,0.18)', zIndex: 9999, overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  panelHeader:    { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', backgroundColor: '#1a1a1a', borderBottom: '1px solid #333', flexShrink: 0 },
  panelTitle:     { fontSize: '14px', fontWeight: '700', color: '#d4a017', fontFamily: 'Georgia, serif', letterSpacing: '0.4px' },
  closeBtn:       { background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: '16px', fontWeight: '700', lineHeight: 1, padding: '2px 6px' },
  panelSidebar:   { width: '180px', minWidth: '180px', background: 'rgba(255,255,255,1)', padding: '18px 10px', display: 'flex', flexDirection: 'column', gap: '4px', borderRight: '1px solid #e8e2d4', overflowY: 'auto' },
  panelMain:      { flex: 1, overflowY: 'auto', padding: '20px 24px' },
  panelCardHeadingRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' },
  panelLogoutBtn: { width: '100%', padding: '9px 13px', background: 'transparent', border: '1px solid #d4a017', borderRadius: '7px', cursor: 'pointer', color: '#b8860b', fontWeight: '700', fontSize: '12px', fontFamily: 'Georgia, serif', textAlign: 'center' },

  // DASHBOARD SHARED
  sideTitle:      { fontSize: '13px', fontWeight: '800', color: '#2a2a2a', marginBottom: '12px', fontFamily: 'Georgia, serif', letterSpacing: '0.4px' },
  sideBtn:        { textAlign: 'left', padding: '9px 11px', borderRadius: '7px', cursor: 'pointer', fontWeight: '600', fontSize: '12px', fontFamily: 'Georgia, serif', transition: 'all 0.18s' },
  cardHeading:    { fontSize: '13px', color: '#2a2a2a', fontWeight: '800', fontFamily: 'Georgia, serif', margin: 0, letterSpacing: '0.4px' },
  sysViewBtn:     { background: '#2a2a2a', color: '#d4a017', border: 'none', padding: '6px 16px', borderRadius: '20px', fontSize: '11px', cursor: 'pointer', fontFamily: 'Georgia, serif', fontWeight: '700', letterSpacing: '0.4px' },

  block:          { marginBottom: '22px' },
  blockHeader:    { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' },
  blockLabel:     { fontSize: '13px', fontWeight: '700', color: '#2a2a2a', fontFamily: 'Georgia, serif' },
  uploadBtn:      { padding: '6px 14px', background: '#d4a017', color: '#2a2a2a', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontFamily: 'Georgia, serif', fontWeight: '700' },
  dropZone:       { border: '2px dashed #d4c9a8', borderRadius: '10px', padding: '28px 16px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', background: '#fefcf5' },
  fileList:       { display: 'flex', flexDirection: 'column', gap: '6px' },
  fileChip:       { display: 'flex', alignItems: 'center', gap: '8px', background: '#fdf8ec', border: '1px solid #e8dfc0', borderRadius: '8px', padding: '8px 12px' },
  fileLink:       { flex: 1, fontSize: '12px', color: '#2a2a2a', fontFamily: 'Georgia, serif', textDecoration: 'none', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  fileSize:       { fontSize: '11px', color: '#999', fontFamily: 'Georgia, serif', whiteSpace: 'nowrap' },
  removeBtn:      { background: 'none', border: 'none', cursor: 'pointer', color: '#bbb', fontSize: '13px', fontWeight: '700', padding: '0 2px', lineHeight: 1 },

  addRowForm:     { display: 'flex', gap: '8px', marginBottom: '12px', alignItems: 'center', background: '#fffdf5', border: '1px solid #e8dfc0', borderRadius: '8px', padding: '10px 12px' },
  tableWrap:      { overflowX: 'auto', borderRadius: '10px', border: '1px solid #e8e2d4' },
  table:          { width: '100%', borderCollapse: 'collapse', fontFamily: 'Georgia, serif', fontSize: '12px' },
  thead:          { backgroundColor: '#2a2a2a' },
  th:             { padding: '10px 14px', textAlign: 'left', color: '#d4a017', fontWeight: '700', fontSize: '11px', letterSpacing: '0.6px', textTransform: 'uppercase', fontFamily: 'Georgia, serif' },
  td:             { padding: '9px 14px', color: '#2a2a2a', borderBottom: '1px solid #f0ece4', verticalAlign: 'middle' },
  emptyCell:      { padding: '32px 14px', textAlign: 'center', color: '#bbb', fontStyle: 'italic', fontFamily: 'Georgia, serif', fontSize: '13px' },
  inlineInp:      { width: '100%', padding: '5px 8px', border: '1px solid #d4a017', borderRadius: '5px', fontSize: '12px', fontFamily: 'Georgia, serif', color: '#2a2a2a', outline: 'none', background: '#fffdf5' },

  renameBtn:      { padding: '4px 10px', background: '#fdf3d8', color: '#b8860b', border: '1px solid #d4a017', borderRadius: '5px', cursor: 'pointer', fontSize: '11px', fontFamily: 'Georgia, serif', fontWeight: '700', marginRight: '5px' },
  deleteBtn:      { padding: '4px 10px', background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: '5px', cursor: 'pointer', fontSize: '11px', fontFamily: 'Georgia, serif', fontWeight: '700' },
  saveBtn:        { padding: '4px 10px', background: '#d1fae5', color: '#065f46', border: '1px solid #6ee7b7', borderRadius: '5px', cursor: 'pointer', fontSize: '11px', fontFamily: 'Georgia, serif', fontWeight: '700', marginRight: '5px' },
  cancelBtn:      { padding: '4px 10px', background: '#f3f4f6', color: '#4b5563', border: '1px solid #d1d5db', borderRadius: '5px', cursor: 'pointer', fontSize: '11px', fontFamily: 'Georgia, serif', fontWeight: '700' },
};
