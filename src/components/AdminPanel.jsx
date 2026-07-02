import { useState, useRef } from 'react';
import { uploadToCloudinary } from '../lib/cloudinary';
import { CATEGORIES } from '../store/store';

/* ══════════════════════════════════════════
   Single upload row with progress
══════════════════════════════════════════ */
function UploadRow({ onDone }) {
  const [progress, setProgress] = useState(null);
  const [error,    setError]    = useState(null);
  const [category, setCategory] = useState('flutter');
  const [title,    setTitle]    = useState('');
  const inputRef = useRef(null);

  const handle = async (file) => {
    if (!file) return;
    setError(null); setProgress(0);
    try {
      const result = await uploadToCloudinary(file, setProgress);
      onDone({
        ...result,
        pf_category: category,
        pf_title: title || result.original_filename || 'Untitled',
        pf_type: file.type.startsWith('video') ? 'video' : 'image',
      });
      setProgress(null); setTitle('');
      if (inputRef.current) inputRef.current.value = '';
    } catch (e) {
      setError(e.message); setProgress(null);
    }
  };

  return (
    <div className="ap-upload-row">
      <div className="ap-row-fields">
        <input
          className="ap-input"
          placeholder="Title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select
          className="ap-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORIES.map(c => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
      </div>

      <label className={`ap-file-btn${progress !== null ? ' ap-uploading' : ''}`}>
        {progress !== null ? (
          <span className="ap-progress-wrap">
            <span className="ap-progress-bar" style={{ width: `${progress}%` }} />
            <span className="ap-progress-label">{progress}%</span>
          </span>
        ) : (
          <>
            <span className="ap-plus">+</span> Choose File
            <input
              ref={inputRef}
              type="file"
              accept="image/*,video/*"
              onChange={(e) => handle(e.target.files[0])}
            />
          </>
        )}
      </label>

      {error && <p className="ap-error">{error}</p>}
    </div>
  );
}

/* ══════════════════════════════════════════
   Admin Panel (slide-in drawer)
══════════════════════════════════════════ */
export default function AdminPanel({
  isOpen, onClose,
  profile, onProfileChange,
  projects, onAddProject, onDeleteProject,
  demos, onDemosChange,
}) {
  const [tab, setTab] = useState('profile');   // 'profile' | 'projects' | 'demos'
  const [photoProgress, setPhotoProgress] = useState(null);
  const [photoError,    setPhotoError]    = useState(null);

  /* Upload profile photo */
  const handlePhotoUpload = async (file) => {
    if (!file) return;
    setPhotoError(null); setPhotoProgress(0);
    try {
      const res = await uploadToCloudinary(file, setPhotoProgress);
      onProfileChange({ ...profile, photo: res.secure_url, photoId: res.public_id });
      setPhotoProgress(null);
    } catch (e) {
      setPhotoError(e.message); setPhotoProgress(null);
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && <div className="ap-backdrop" onClick={onClose} />}

      {/* Drawer */}
      <aside className={`admin-panel${isOpen ? ' open' : ''}`}>
        <div className="ap-header">
          <h2 className="ap-title">Dashboard</h2>
          <button className="ap-close" onClick={onClose}>✕</button>
        </div>

        {/* Tabs */}
        <div className="ap-tabs">
          <button className={`ap-tab${tab === 'profile'  ? ' active' : ''}`} onClick={() => setTab('profile')}>Profile</button>
          <button className={`ap-tab${tab === 'projects' ? ' active' : ''}`} onClick={() => setTab('projects')}>Portfolio ({projects.length})</button>
          <button className={`ap-tab${tab === 'demos'    ? ' active' : ''}`} onClick={() => setTab('demos')}>Modules</button>
        </div>

        {/* ── PROFILE TAB ── */}
        {tab === 'profile' && (
          <div className="ap-body">
            {/* Photo upload */}
            <div className="ap-section">
              <p className="ap-section-label">Profile Photo</p>
              <div className="ap-photo-area">
                {profile.photo ? (
                  <img src={profile.photo} alt="Profile" className="ap-photo-preview" />
                ) : (
                  <div className="ap-photo-placeholder">No photo</div>
                )}
                <div className="ap-photo-actions">
                  <label className={`ap-file-btn small${photoProgress !== null ? ' ap-uploading' : ''}`}>
                    {photoProgress !== null ? (
                      <span className="ap-progress-wrap">
                        <span className="ap-progress-bar" style={{ width: `${photoProgress}%` }} />
                        <span className="ap-progress-label">{photoProgress}%</span>
                      </span>
                    ) : (
                      <>
                        {profile.photo ? 'Change Photo' : 'Upload Photo'}
                        <input type="file" accept="image/*"
                               onChange={(e) => handlePhotoUpload(e.target.files[0])} />
                      </>
                    )}
                  </label>
                  {profile.photo && (
                    <button className="ap-remove-btn"
                            onClick={() => onProfileChange({ ...profile, photo: null, photoId: null })}>
                      Remove
                    </button>
                  )}
                </div>
                {photoError && <p className="ap-error">{photoError}</p>}
                <p className="ap-hint">Appears in the Hero section</p>
              </div>
            </div>

            {/* Name & Title */}
            <div className="ap-section">
              <p className="ap-section-label">Name</p>
              <input className="ap-input" value={profile.name}
                     onChange={(e) => onProfileChange({ ...profile, name: e.target.value })} />
            </div>
            <div className="ap-section">
              <p className="ap-section-label">Title / Role</p>
              <input className="ap-input" value={profile.title}
                     onChange={(e) => onProfileChange({ ...profile, title: e.target.value })} />
            </div>
            <div className="ap-section">
              <p className="ap-section-label">Location</p>
              <input className="ap-input" value={profile.location}
                     onChange={(e) => onProfileChange({ ...profile, location: e.target.value })} />
            </div>
            <div className="ap-section">
              <p className="ap-section-label">Bio</p>
              <textarea className="ap-input ap-textarea" rows={4} value={profile.bio}
                        onChange={(e) => onProfileChange({ ...profile, bio: e.target.value })} />
            </div>

            <p className="ap-hint" style={{ marginTop: '1rem' }}>Changes save automatically.</p>
          </div>
        )}

        {/* ── PROJECTS TAB ── */}
        {tab === 'projects' && (
          <div className="ap-body">
            <div className="ap-section">
              <p className="ap-section-label">Add New Item</p>
              <p className="ap-hint" style={{ marginBottom: '1rem' }}>
                Choose a category → pick your file → it appears in that section instantly.
              </p>
              <UploadRow onDone={onAddProject} />
            </div>

            {/* Existing projects list */}
            {projects.length > 0 && (
              <div className="ap-section">
                <p className="ap-section-label">Manage Items ({projects.length})</p>
                <div className="ap-items-list">
                  {projects.map((p) => (
                    <div key={p.public_id} className="ap-item">
                      <div className="ap-item-thumb">
                        {p.pf_type === 'video' ? (
                          <span className="ap-video-icon">▶</span>
                        ) : (
                          <img src={p.secure_url} alt={p.pf_title} />
                        )}
                      </div>
                      <div className="ap-item-info">
                        <span className="ap-item-title">{p.pf_title}</span>
                        <span className="ap-item-cat">
                          {CATEGORIES.find(c => c.id === p.pf_category)?.label || p.pf_category}
                        </span>
                      </div>
                      <button className="ap-item-del" onClick={() => onDeleteProject(p)}>✕</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── DEMOS TAB ── */}
        {tab === 'demos' && (
          <div className="ap-body">
            <div className="ap-section">
              <p className="ap-section-label">Interactive Modules</p>
              <p className="ap-hint" style={{ marginBottom: '1rem' }}>
                Enable and configure interactive modules (like the Wallpaper App mockup) to display on your site.
              </p>
            </div>

            <div className="ap-section">
              <p className="ap-section-label">Upload New Module (.html)</p>
              <label className="ap-file-btn">
                <span className="ap-plus">+</span> Upload HTML File
                <input
                  type="file"
                  accept=".html"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (evt) => {
                      const content = evt.target.result;
                      const newId = 'demo_' + Date.now();
                      const newDemo = {
                        moduleId: newId,
                        enabled: true,
                        title: file.name.replace('.html', '').replace(/[-_]/g, ' '),
                        description: 'A new interactive module uploaded to your portfolio.',
                        alignment: 'left',
                        htmlContent: content
                      };
                      onDemosChange([newDemo, ...demos]);
                    };
                    reader.readAsText(file);
                    e.target.value = ''; // reset
                  }}
                />
              </label>
            </div>

            <div className="ap-section" style={{ marginTop: '1rem' }}>
              <p className="ap-section-label">Manage Modules</p>
            </div>

            {demos.map(demo => {
              const isEnabled = demo.enabled;

              const updateDemo = (updates) => {
                const next = demos.map(d => d.moduleId === demo.moduleId ? { ...d, ...updates } : d);
                onDemosChange(next);
              };

              const deleteDemo = () => {
                if (confirm('Are you sure you want to remove this module?')) {
                  const next = demos.filter(d => d.moduleId !== demo.moduleId);
                  onDemosChange(next);
                }
              };

              return (
                <div key={demo.moduleId} className="ap-section" style={{ background: 'var(--c-elevated)', padding: '1rem', border: '1px solid var(--c-border)', clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <p style={{ color: 'var(--txt-1)', fontWeight: 600, fontSize: '0.9rem', textTransform: 'capitalize' }}>{demo.title}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                        <input type="checkbox" checked={isEnabled} onChange={(e) => updateDemo({ enabled: e.target.checked })} />
                        <span className="ap-hint">Enable</span>
                      </label>
                      <button className="ap-remove-btn" onClick={deleteDemo}>✕</button>
                    </div>
                  </div>

                  {isEnabled && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                      <div>
                        <p className="ap-hint" style={{ marginBottom: '4px' }}>Title</p>
                        <input className="ap-input" value={demo.title} onChange={(e) => updateDemo({ title: e.target.value })} />
                      </div>
                      <div>
                        <p className="ap-hint" style={{ marginBottom: '4px' }}>Description</p>
                        <textarea className="ap-input ap-textarea" value={demo.description} onChange={(e) => updateDemo({ description: e.target.value })} rows={3} />
                      </div>
                      <div>
                        <p className="ap-hint" style={{ marginBottom: '4px' }}>Layout Alignment</p>
                        <select className="ap-select" value={demo.alignment} onChange={(e) => updateDemo({ alignment: e.target.value })}>
                          <option value="left">Mockup on Left, Text on Right</option>
                          <option value="right">Mockup on Right, Text on Left</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </aside>
    </>
  );
}
