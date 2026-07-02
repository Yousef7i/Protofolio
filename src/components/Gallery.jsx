import { useState, useEffect, useRef } from 'react';
import { CATEGORIES } from '../store/store';

/* ── Single card ── */
function GCard({ item, index, onClick, onDelete }) {
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), (index % 3) * 90);
        obs.unobserve(e.target);
      }
    }, { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [index]);

  const isVideo = item.pf_type === 'video';
  const date = item.created_at
    ? new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : '';

  return (
    <div className="g-item" ref={ref}>
      {isVideo ? (
        <video
          src={item.secure_url}
          className="g-img"
          muted loop
          onMouseEnter={e => e.target.play()}
          onMouseLeave={e => { e.target.pause(); e.target.currentTime = 0; }}
          onClick={() => onClick(item)}
        />
      ) : (
        <img
          src={item.secure_url}
          alt={item.pf_title}
          className="g-img"
          loading="lazy"
          onClick={() => onClick(item)}
        />
      )}

      {isVideo && (
        <div className="g-video-badge">
          <span>▶</span>
        </div>
      )}

      <div className="g-overlay" onClick={() => onClick(item)}>
        <span className="g-tag">{date || 'Design'}</span>
        <h3 className="g-name">{item.pf_title}</h3>
      </div>

      <button className="g-delete" title="Remove"
              onClick={(e) => { e.stopPropagation(); onDelete(item); }}>✕</button>
    </div>
  );
}

/* ── Gallery ── */
export default function Gallery({ projects, onDelete }) {
  const [lightbox,    setLightbox]    = useState(null);
  const [activeTab,   setActiveTab]   = useState('all');

  // ESC key
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') setLightbox(null); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  // Reveal .reveal elements
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [projects, activeTab]);

  // Available tabs — only show categories that have items
  const usedCategories = CATEGORIES.filter(cat =>
    projects.some(p => p.pf_category === cat.id)
  );

  const filtered = activeTab === 'all'
    ? projects
    : projects.filter(p => p.pf_category === activeTab);

  return (
    <section className="gallery-section" id="work">
      <div className="sec-header reveal">
        <div>
          <p className="sec-label">Selected Work</p>
          <h2 className="sec-title">The <em>Archive</em></h2>
        </div>
        {projects.length > 0 && (
          <span className="sec-count">{String(projects.length).padStart(2, '0')} pieces</span>
        )}
      </div>

      {/* Category Filter Tabs */}
      {usedCategories.length > 0 && (
        <div className="gallery-tabs reveal">
          <button
            className={`g-tab-btn${activeTab === 'all' ? ' active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All ({projects.length})
          </button>
          {usedCategories.map(cat => (
            <button
              key={cat.id}
              className={`g-tab-btn${activeTab === cat.id ? ' active' : ''}`}
              onClick={() => setActiveTab(cat.id)}
            >
              {cat.label} ({projects.filter(p => p.pf_category === cat.id).length})
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="gallery-empty reveal">
          <h3>Your canvas awaits</h3>
          <p>Use the ⚙ dashboard to upload your first project.</p>
        </div>
      ) : (
        <div className="gallery-masonry">
          {filtered.map((item, i) => (
            <GCard
              key={item.public_id || i}
              item={item} index={i}
              onClick={setLightbox}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div className="lb-backdrop" onClick={() => setLightbox(null)}>
          <div className="lb-box" onClick={(e) => e.stopPropagation()}>
            <button className="lb-close" onClick={() => setLightbox(null)}>✕</button>
            {lightbox.pf_type === 'video' ? (
              <video src={lightbox.secure_url} className="lb-img" controls autoPlay />
            ) : (
              <img src={lightbox.secure_url} alt={lightbox.pf_title} className="lb-img" />
            )}
          </div>
        </div>
      )}
    </section>
  );
}
