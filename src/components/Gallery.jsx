import { useState, useEffect, useRef } from 'react';
import { Code2, ExternalLink } from 'lucide-react';
import { getOptimizedUrl } from '../lib/cloudinary';

export default function Gallery({ projects, onDeleteProject }) {
  const isMobile = window.innerWidth < 768;

  return (
    <section className="flutter-projects-section" id="work">
      <div className="flutter-section-title-container">
        <h2 className="flutter-section-title">Actual Mobile Projects</h2>
        <div className="flutter-title-line"></div>
      </div>

      <div className="flutter-projects-grid">
        {projects.map((project, index) => (
          <div 
            key={project.public_id} 
            className="flutter-project-card animate-fade-in-up"
            style={{ animationDelay: `${0.2 * (index % 3)}s` }}
          >
            <div className="flutter-card-image-container">
              <img 
                src={getOptimizedUrl(project.url, { width: 600, height: 400, quality: 'auto' })} 
                alt={project.title} 
                className="flutter-card-image"
              />
              <div className="flutter-card-gradient"></div>
              
              <div className="flutter-card-overlay">
                <div className="flutter-card-actions">
                  <button className="flutter-btn outline small" onClick={() => window.open(project.github || '#', '_blank')}>
                    <Code2 size={16} /> GitHub
                  </button>
                  <button className="flutter-btn primary small" onClick={() => window.open(project.demo || '#', '_blank')}>
                    <ExternalLink size={16} /> Live Demo
                  </button>
                </div>
              </div>
            </div>

            <div className="flutter-card-info">
              <h3 className="flutter-card-title">{project.title}</h3>
              <p className="flutter-card-desc">{project.description}</p>
              
              <div className="flutter-card-tech">
                {['Flutter', 'Firebase', 'Dart'].map((tech) => (
                  <span key={tech} className="flutter-tech-pill">{tech}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
