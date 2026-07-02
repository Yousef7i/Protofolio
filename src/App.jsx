import { useState, useEffect, useRef } from 'react';
import Navbar      from './components/Navbar';
import Hero        from './components/Hero';
import Gallery     from './components/Gallery';
import AdminPanel  from './components/AdminPanel';
import FeaturedApp from './components/FeaturedApp';
import { saveProfile, saveProjects, saveDemos, defaultProfile, subscribeToProfile, subscribeToProjects, subscribeToDemos } from './store/store';

export default function App() {
  const [profile,  setProfile]  = useState(defaultProfile);
  const [projects, setProjects] = useState([]);
  const [demos,    setDemos]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [adminOpen, setAdminOpen] = useState(false);
  const workRef = useRef(null);

  /* Cursor ambient glow */
  useEffect(() => {
    const glow = document.querySelector('.cursor-glow');
    if (!glow) return;
    const move = (e) => {
      glow.style.left = `${e.clientX}px`;
      glow.style.top  = `${e.clientY}px`;
    };
    window.addEventListener('mousemove', move, { passive: true });
    return () => window.removeEventListener('mousemove', move);
  }, []);

  /* Firebase Data Subscriptions */
  useEffect(() => {
    let loadedProfile = false;
    let loadedProjects = false;
    let loadedDemos = false;

    const checkLoading = () => {
      if (loadedProfile && loadedProjects && loadedDemos) {
        setLoading(false);
      }
    };

    const unsubProfile = subscribeToProfile((data) => {
      setProfile({ ...defaultProfile, ...data });
      loadedProfile = true;
      checkLoading();
    });

    const unsubProjects = subscribeToProjects((data) => {
      setProjects(data);
      loadedProjects = true;
      checkLoading();
    });

    const unsubDemos = subscribeToDemos((data) => {
      setDemos(data);
      loadedDemos = true;
      checkLoading();
    });

    return () => {
      unsubProfile();
      unsubProjects();
      unsubDemos();
    };
  }, []);

  /* Persist profile changes */
  const handleProfileChange = (updated) => {
    setProfile(updated);
    saveProfile(updated);
  };

  /* Add project */
  const handleAddProject = (item) => {
    setProjects(prev => {
      const next = [item, ...prev];
      saveProjects(next);
      return next;
    });
    setAdminOpen(false);
    setTimeout(() => workRef.current?.scrollIntoView({ behavior: 'smooth' }), 400);
  };

  /* Delete project */
  const handleDeleteProject = (item) => {
    setProjects(prev => {
      const next = prev.filter(p => p.public_id !== item.public_id);
      saveProjects(next);
      return next;
    });
  };

  /* Handle demos update */
  const handleDemosChange = (updatedDemos) => {
    setDemos(updatedDemos);
    saveDemos(updatedDemos);
  };

  const scrollToWork = () => workRef.current?.scrollIntoView({ behavior: 'smooth' });

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--gold-300)', fontFamily: 'DM Mono', letterSpacing: '2px' }}>LOADING DATA...</div>
      </div>
    );
  }

  return (
    <>
      <div className="cursor-glow" />

      <Navbar onAdminOpen={() => setAdminOpen(true)} />

      <Hero
        profile={profile}
        onScrollToWork={scrollToWork}
        onAdminOpen={() => setAdminOpen(true)}
      />

      {/* Render Enabled Demos */}
      {demos.filter(d => d.enabled).map(demo => (
        <FeaturedApp
          key={demo.moduleId}
          moduleId={demo.moduleId}
          title={demo.title}
          description={demo.description}
          alignment={demo.alignment}
          htmlContent={demo.htmlContent}
        />
      ))}

      <div ref={workRef}>
        <Gallery
          projects={projects}
          onDelete={handleDeleteProject}
        />
      </div>

      <footer className="footer">
        <span className="footer-logo">Port<em>folio</em></span>
        <span className="footer-copy">
          {profile.name} · {new Date().getFullYear()}
        </span>
      </footer>

      <AdminPanel
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        profile={profile}
        onProfileChange={handleProfileChange}
        projects={projects}
        onAddProject={handleAddProject}
        onDeleteProject={handleDeleteProject}
        demos={demos}
        onDemosChange={handleDemosChange}
      />
    </>
  );
}
