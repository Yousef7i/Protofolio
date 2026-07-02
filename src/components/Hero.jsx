import { getOptimizedUrl } from '../lib/cloudinary';

export default function Hero({ profile, onScrollToWork }) {
  const { name, title, bio, location, photo } = profile;

  return (
    <section className="hero" id="home">
      <div className="hero-panel-left" />
      <div className="hero-accent-line" />

      {/* ─── LEFT: Text ─── */}
      <div className="hero-text">
        <div className="hero-tag">
          <span className="hero-tag-dot" />
          {location} · Portfolio
        </div>

        <h1 className="hero-title">
          {name.split(' ').map((word, i) => (
            i === 0
              ? <span key={i}>{word}<br /></span>
              : <strong key={i}>{word} <em>.</em></strong>
          ))}
        </h1>

        <p className="hero-role">{title}</p>

        <p className="hero-desc">{bio}</p>

        <div className="hero-actions">
          <button className="btn-primary" onClick={onScrollToWork}>
            View Work <span className="arrow">→</span>
          </button>
        </div>
      </div>

      {/* ─── RIGHT: Photo + Skills ─── */}
      <div className="hero-right">
        {/* Profile Photo */}
        <div className="hero-photo-wrap">
          {photo ? (
            <img
              src={getOptimizedUrl(photo, { width: 400, height: 400, quality: 'auto' })}
              alt={name}
              className="hero-photo"
            />
          ) : (
            <div className="hero-photo-placeholder">
              <span className="hero-photo-icon"></span>
            </div>
          )}
          <div className="hero-photo-ring" />
        </div>

        {/* Skill tags */}
        <div className="hero-skills">
          {['Flutter', 'Dart', 'Firebase', 'REST APIs', 'Clean Architecture', 'UI / UX'].map(s => (
            <span key={s} className="skill-tag">{s}</span>
          ))}
        </div>
      </div>

      <div className="scroll-hint">
        <div className="scroll-line" />
        <span>Scroll</span>
      </div>
    </section>
  );
}
