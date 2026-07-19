import { useState, useRef, useEffect } from 'react';
import { uploadToCloudinary } from '../lib/cloudinary';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { Save, Plus, Trash2, Link as LinkIcon, LogOut, LayoutDashboard, Briefcase, FileText, Award, BarChart, Settings, User } from 'lucide-react';

export default function AdminDashboard({
  profile, onProfileChange,
  projects, onProjectsChange,
  services, onServicesChange,
  experience, onExperienceChange,
  certificates, onCertificatesChange,
  stats, onStatsChange,
  techStack, onTechStackChange,
  expertise, onExpertiseChange
}) {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [tab, setTab] = useState('profile');
  
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    try { await signInWithEmailAndPassword(auth, email, password); } 
    catch (err) { setAuthError('Invalid credentials'); }
  };

  const uploadFile = async (file, callback) => {
    if (!file) return;
    setIsUploading(true);
    try {
      const res = await uploadToCloudinary(file, () => {});
      callback(res.secure_url);
    } catch (e) {
      alert("Upload failed: " + e.message);
    }
    setIsUploading(false);
  };

  if (!user) {
    return (
      <div className="flutter-login-container">
        <div className="flutter-login-card">
          <div className="glow-circle" />
          <h2 style={{ color: 'white', textAlign: 'center', marginBottom: '2rem', fontSize: '24px', fontWeight: 'bold' }}>Admin Access</h2>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input type="email" placeholder="Email Address" className="flutter-input" value={email} onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" className="flutter-input" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="submit" className="flutter-btn primary" style={{ marginTop: '1rem' }}>Secure Login</button>
            {authError && <p style={{ color: '#ef4444', textAlign: 'center', marginTop: '10px' }}>{authError}</p>}
          </form>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'projects', icon: LayoutDashboard, label: 'Modules (Projects)' },
    { id: 'services', icon: Briefcase, label: 'Services' },
    { id: 'experience', icon: FileText, label: 'Experience' },
    { id: 'certificates', icon: Award, label: 'Certificates' },
    { id: 'techStack', icon: Settings, label: 'Tech Stack' },
    { id: 'stats', icon: BarChart, label: 'Stats' },
  ];

  return (
    <div className="flutter-admin-layout">
      {/* Sidebar */}
      <div className="flutter-sidebar">
        <div className="sidebar-header">
          <div className="avatar-mini">
            <img src={profile.photo || 'https://via.placeholder.com/150'} alt="Admin" />
          </div>
          <div>
            <h3 style={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}>Admin Panel</h3>
            <p style={{ color: '#94a3b8', fontSize: '12px' }}>Portfolio Manager</p>
          </div>
        </div>
        <div className="sidebar-nav">
          {tabs.map(t => (
            <button key={t.id} className={`nav-item ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
              <t.icon size={18} /> {t.label}
            </button>
          ))}
        </div>
        <button className="nav-item logout" onClick={() => signOut(auth)}>
          <LogOut size={18} /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flutter-main-content">
        <div className="content-header">
          <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>{tabs.find(t=>t.id===tab)?.label}</h2>
          <a href="/" target="_blank" rel="noreferrer" className="flutter-btn secondary">
            <LinkIcon size={16} /> View Site
          </a>
        </div>
        
        <div className="content-scroll">
          {/* PROFILE TAB */}
          {tab === 'profile' && (
            <div className="flutter-card">
              <div className="form-group">
                <label>Profile Image</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img src={profile.photo || 'https://via.placeholder.com/150'} style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '2px solid #0ea5e9' }} />
                  <label className="flutter-btn secondary">
                    {isUploading ? 'Uploading...' : 'Change Photo'}
                    <input type="file" hidden accept="image/*" onChange={e => uploadFile(e.target.files[0], url => onProfileChange({...profile, photo: url}))} />
                  </label>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Full Name</label><input className="flutter-input" value={profile.name} onChange={e => onProfileChange({...profile, name: e.target.value})} /></div>
                <div className="form-group"><label>Title / Role</label><input className="flutter-input" value={profile.title} onChange={e => onProfileChange({...profile, title: e.target.value})} /></div>
              </div>
              <div className="form-group">
                <label>Bio (About Me)</label>
                <textarea className="flutter-input" rows="4" value={profile.bio} onChange={e => onProfileChange({...profile, bio: e.target.value})} />
              </div>
              <h3 style={{ color: 'white', margin: '2rem 0 1rem', borderBottom: '1px solid #1e293b', paddingBottom: '0.5rem' }}>Social Links</h3>
              <div className="form-row">
                <div className="form-group"><label>LinkedIn</label><input className="flutter-input" value={profile.linkedin} onChange={e => onProfileChange({...profile, linkedin: e.target.value})} /></div>
                <div className="form-group"><label>WhatsApp</label><input className="flutter-input" value={profile.whatsapp} onChange={e => onProfileChange({...profile, whatsapp: e.target.value})} /></div>
              </div>
            </div>
          )}

          {/* PROJECTS TAB (Modules) */}
          {tab === 'projects' && (
            <div className="list-manager">
              <button className="flutter-btn primary" onClick={() => onProjectsChange([{ id: Date.now(), title: '', description: '', url: '', technologies: [], links: [] }, ...projects])}>
                <Plus size={16} /> Add New Module (Project)
              </button>
              
              {projects.map((proj, idx) => (
                <div key={proj.id || idx} className="flutter-card item-card">
                  <div className="item-header">
                    <h3 style={{ color: 'white' }}>{proj.title || 'Untitled Module'}</h3>
                    <button className="icon-btn danger" onClick={() => onProjectsChange(projects.filter((_, i) => i !== idx))}><Trash2 size={16} /></button>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group"><label>Title</label><input className="flutter-input" value={proj.title} onChange={e => {
                      const n = [...projects]; n[idx].title = e.target.value; onProjectsChange(n);
                    }} /></div>
                    <div className="form-group">
                      <label>Image</label>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        {proj.url && <img src={proj.url} style={{ height: 40, borderRadius: 4 }} />}
                        <label className="flutter-btn secondary small" style={{flex: 1, textAlign: 'center'}}>
                          {isUploading ? 'Uploading...' : 'Upload Image'}
                          <input type="file" hidden accept="image/*" onChange={e => uploadFile(e.target.files[0], url => {
                            const n = [...projects]; n[idx].url = url; onProjectsChange(n);
                          })} />
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Description</label>
                    <textarea className="flutter-input" rows="2" value={proj.description || ''} onChange={e => {
                      const n = [...projects]; n[idx].description = e.target.value; onProjectsChange(n);
                    }} />
                  </div>
                  
                  <div className="form-group">
                    <label>Technologies (Comma separated, e.g. Flutter, Firebase)</label>
                    <input className="flutter-input" value={(proj.technologies || []).join(', ')} onChange={e => {
                      const n = [...projects]; n[idx].technologies = e.target.value.split(',').map(s=>s.trim()).filter(Boolean); onProjectsChange(n);
                    }} />
                  </div>

                  <div className="dynamic-links-section" style={{ background: '#0f172a', padding: '15px', borderRadius: '8px', marginTop: '1rem', border: '1px solid #1e293b' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <label style={{ margin: 0, color: '#0ea5e9' }}>Dynamic Action Buttons (Links)</label>
                      <button className="flutter-btn secondary small" onClick={() => {
                        const n = [...projects];
                        if (!n[idx].links) n[idx].links = [];
                        n[idx].links.push({ label: 'GitHub', url: '' });
                        onProjectsChange(n);
                      }}><Plus size={14} /> Add Button</button>
                    </div>
                    
                    {(proj.links || []).map((link, lIdx) => (
                      <div key={lIdx} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        <input className="flutter-input" style={{flex: 1}} placeholder="Label (e.g. GitHub)" value={link.label} onChange={e => {
                          const n = [...projects]; n[idx].links[lIdx].label = e.target.value; onProjectsChange(n);
                        }} />
                        <input className="flutter-input" style={{flex: 2}} placeholder="https://..." value={link.url} onChange={e => {
                          const n = [...projects]; n[idx].links[lIdx].url = e.target.value; onProjectsChange(n);
                        }} />
                        <button className="icon-btn danger" onClick={() => {
                          const n = [...projects]; n[idx].links.splice(lIdx, 1); onProjectsChange(n);
                        }}><Trash2 size={16} /></button>
                      </div>
                    ))}
                    {!(proj.links && proj.links.length > 0) && <p style={{ color: '#64748b', fontSize: '12px' }}>No buttons added yet. Click "Add Button".</p>}
                  </div>

                  <div className="dynamic-modules-section" style={{ background: '#0f172a', padding: '15px', borderRadius: '8px', marginTop: '1rem', border: '1px solid #1e293b' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <label style={{ margin: 0, color: '#0ea5e9' }}>Course Modules (وحدات الدورة)</label>
                      <button className="flutter-btn secondary small" onClick={() => {
                        const n = [...projects];
                        if (!n[idx].modules) n[idx].modules = [];
                        n[idx].modules.push({ title: '', description: '' });
                        onProjectsChange(n);
                      }}><Plus size={14} /> Add Module</button>
                    </div>
                    
                    {(proj.modules || []).map((mod, mIdx) => (
                      <div key={mIdx} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '10px', background: '#1e293b', padding: '10px', borderRadius: '4px' }}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <input className="flutter-input" style={{flex: 1}} placeholder="Module Title" value={mod.title} onChange={e => {
                            const n = [...projects]; n[idx].modules[mIdx].title = e.target.value; onProjectsChange(n);
                          }} />
                          <button className="icon-btn danger" onClick={() => {
                            const n = [...projects]; n[idx].modules.splice(mIdx, 1); onProjectsChange(n);
                          }}><Trash2 size={16} /></button>
                        </div>
                        <textarea className="flutter-input" rows="2" placeholder="Module Description" value={mod.description} onChange={e => {
                          const n = [...projects]; n[idx].modules[mIdx].description = e.target.value; onProjectsChange(n);
                        }} />
                      </div>
                    ))}
                    {!(proj.modules && proj.modules.length > 0) && <p style={{ color: '#64748b', fontSize: '12px' }}>No modules added yet.</p>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* DYNAMIC LIST TEMPLATES (Services, Experience, Certificates, Tech Stack, Stats) */}
          {['services', 'experience', 'certificates', 'techStack', 'stats'].includes(tab) && (() => {
            const stateMap = {
              services: { data: services, setter: onServicesChange, fields: [{key: 'title', label: 'Title'}, {key: 'description', label: 'Description'}, {key: 'icon', label: 'Icon Name (e.g. code, mobileScreen)'}] },
              experience: { data: experience, setter: onExperienceChange, fields: [{key: 'title', label: 'Job Title'}, {key: 'company', label: 'Company'}, {key: 'period', label: 'Period (e.g. 2024 - Present)'}, {key: 'description', label: 'Description'}] },
              certificates: { data: certificates, setter: onCertificatesChange, fields: [{key: 'title', label: 'Certificate Name'}, {key: 'platform', label: 'Platform (e.g. Udemy)'}, {key: 'date', label: 'Date (Year)'}, {key: 'icon', label: 'Icon Name'}] },
              techStack: { data: techStack, setter: onTechStackChange, fields: [{key: 'title', label: 'Category Title'}, {key: 'icon', label: 'Icon'}, {key: 'skills', label: 'Skills (Comma separated)'}] },
              stats: { data: stats, setter: onStatsChange, fields: [{key: 'title', label: 'Number (e.g. 4+)'}, {key: 'subtitle', label: 'Subtitle'}, {key: 'icon', label: 'Icon'}] }
            };
            
            const current = stateMap[tab];
            
            return (
              <div className="list-manager">
                <button className="flutter-btn primary" onClick={() => current.setter([{ id: Date.now() }, ...current.data])}>
                  <Plus size={16} /> Add New Entry
                </button>
                {current.data.map((item, idx) => (
                  <div key={item.id || idx} className="flutter-card item-card" style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {current.fields.map(f => (
                        <div key={f.key}>
                          <label style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px', display: 'block' }}>{f.label}</label>
                          {f.key === 'description' ? (
                            <textarea className="flutter-input" rows="2" value={item[f.key] || ''} onChange={e => {
                              const n = [...current.data]; n[idx][f.key] = e.target.value; current.setter(n);
                            }} />
                          ) : (
                            <input className="flutter-input" value={f.key === 'skills' ? (item[f.key] || []).join(', ') : (item[f.key] || '')} onChange={e => {
                              const n = [...current.data]; 
                              n[idx][f.key] = f.key === 'skills' ? e.target.value.split(',').map(s=>s.trim()).filter(Boolean) : e.target.value;
                              current.setter(n);
                            }} />
                          )}
                        </div>
                      ))}
                    </div>
                    <button className="icon-btn danger" onClick={() => current.setter(current.data.filter((_, i) => i !== idx))}><Trash2 size={18} /></button>
                  </div>
                ))}
              </div>
            );
          })()}

        </div>
      </div>
    </div>
  );
}
