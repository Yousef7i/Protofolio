import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicPortfolio from './pages/PublicPortfolio';
import AdminDashboard from './pages/AdminDashboard';
import { saveProfile, saveProjects, saveDemos, defaultProfile, subscribeToProfile, subscribeToProjects, subscribeToDemos } from './store/store';

export default function App() {
  const [profile,  setProfile]  = useState(defaultProfile);
  const [projects, setProjects] = useState([]);
  const [demos,    setDemos]    = useState([]);

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
    const unsubProfile = subscribeToProfile((data) => {
      setProfile({ ...defaultProfile, ...data });
    });

    const unsubProjects = subscribeToProjects((data) => {
      setProjects(data);
    });

    const unsubDemos = subscribeToDemos((data) => {
      setDemos(data);
    });

    return () => {
      unsubProfile();
      unsubProjects();
      unsubDemos();
    };
  }, []);

  /* Handlers for Admin Dashboard */
  const handleProfileChange = (updated) => {
    setProfile(updated);
    saveProfile(updated);
  };

  const handleAddProject = (item) => {
    const next = [item, ...projects];
    setProjects(next);
    saveProjects(next);
  };

  const handleDeleteProject = (item) => {
    const next = projects.filter(p => p.public_id !== item.public_id);
    setProjects(next);
    saveProjects(next);
  };

  const handleDemosChange = (updatedDemos) => {
    setDemos(updatedDemos);
    saveDemos(updatedDemos);
  };

  // The UI will now render instantly using default profile data
  // while Firebase loads the projects and updates in the background.

  return (
    <BrowserRouter>
      <div className="cursor-glow" />
      <Routes>
        <Route 
          path="/" 
          element={<PublicPortfolio profile={profile} projects={projects} demos={demos} />} 
        />
        <Route 
          path="/admin" 
          element={
            <AdminDashboard 
              profile={profile}
              onProfileChange={handleProfileChange}
              projects={projects}
              onAddProject={handleAddProject}
              onDeleteProject={handleDeleteProject}
              demos={demos}
              onDemosChange={handleDemosChange}
            />
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}
