import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import * as store from './store/store';

export default function App() {
  const [profile, setProfile] = useState(store.defaultProfile);
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [experience, setExperience] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [stats, setStats] = useState([]);
  const [techStack, setTechStack] = useState([]);
  const [expertise, setExpertise] = useState([]);

  useEffect(() => {
    const unsubs = [
      store.subscribeToProfile(setProfile),
      store.subscribeToProjects(setProjects),
      store.subscribeToServices(setServices),
      store.subscribeToExperience(setExperience),
      store.subscribeToCertificates(setCertificates),
      store.subscribeToStats(setStats),
      store.subscribeToTechStack(setTechStack),
      store.subscribeToExpertise(setExpertise),
    ];
    return () => unsubs.forEach(u => u());
  }, []);

  return (
    <BrowserRouter basename="/admin">
      <div className="cursor-glow" />
      <Routes>
        <Route path="/" element={
          <AdminDashboard 
            profile={profile} onProfileChange={(d) => { setProfile(d); store.saveProfile(d); }}
            projects={projects} onProjectsChange={(d) => { setProjects(d); store.saveProjects(d); }}
            services={services} onServicesChange={(d) => { setServices(d); store.saveServices(d); }}
            experience={experience} onExperienceChange={(d) => { setExperience(d); store.saveExperience(d); }}
            certificates={certificates} onCertificatesChange={(d) => { setCertificates(d); store.saveCertificates(d); }}
            stats={stats} onStatsChange={(d) => { setStats(d); store.saveStats(d); }}
            techStack={techStack} onTechStackChange={(d) => { setTechStack(d); store.saveTechStack(d); }}
            expertise={expertise} onExpertiseChange={(d) => { setExpertise(d); store.saveExpertise(d); }}
          />
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
