import { useRef } from 'react';
import Navbar      from '../components/Navbar';
import Hero        from '../components/Hero';
import Gallery     from '../components/Gallery';
import FeaturedApp from '../components/FeaturedApp';
import Contact     from '../components/Contact';

export default function PublicPortfolio({ profile, projects, demos }) {
  const workRef = useRef(null);
  const scrollToWork = () => workRef.current?.scrollIntoView({ behavior: 'smooth' });

  return (
    <>
      <Navbar />

      <Hero
        profile={profile}
        onScrollToWork={scrollToWork}
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
          links={demo.links}
        />
      ))}

      <div ref={workRef}>
        <Gallery
          projects={projects}
          onDelete={() => {}} // Read-only on public portfolio
        />
      </div>

      <Contact profile={profile} />

      <footer className="footer">
        <span className="footer-logo">Port<em>folio</em></span>
        <span className="footer-copy">
          {profile.name} © {new Date().getFullYear()}
        </span>
      </footer>
    </>
  );
}
