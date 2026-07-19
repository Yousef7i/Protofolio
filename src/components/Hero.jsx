import { useState, useEffect } from 'react';
import { getOptimizedUrl } from '../lib/cloudinary';
import { Rocket, FileText, Send, MessageCircle } from 'lucide-react';

export default function Hero({ profile, onScrollToWork }) {
  const { name, title, bio, location, photo, linkedin, whatsapp, facebook } = profile;
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < title.length) {
        setDisplayText(title.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);
    return () => clearInterval(typingInterval);
  }, [title]);

  const handleWhatsapp = () => {
    if (whatsapp) window.open(whatsapp, '_blank');
  };
  const handleContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="flutter-hero" id="home">
      <div className="flutter-hero-content">
        {/* Left side text */}
        <div className="flutter-hero-text">
          <p className="flutter-hello animate-fade-in-up" style={{ animationDelay: '0.1s' }}>Hello, I'm</p>
          <h1 className="flutter-name animate-fade-in-up" style={{ animationDelay: '0.2s' }}>{name}</h1>
          <h2 className="flutter-title animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <span className="typewriter">{displayText}</span><span className="cursor">|</span>
          </h2>
          <p className="flutter-bio animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            {bio}
          </p>
          
          <div className="flutter-buttons animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <button className="flutter-btn primary" onClick={onScrollToWork}>
              <Rocket size={20} /> View Projects
            </button>
            <button className="flutter-btn outline" onClick={() => window.open(linkedin, '_blank')}>
              <FileText size={20} /> View CV
            </button>
            <button className="flutter-btn outline" onClick={handleContact}>
              <Send size={20} /> Contact Me
            </button>
            <button className="flutter-btn outline" onClick={handleWhatsapp}>
              <MessageCircle size={20} /> WhatsApp
            </button>
          </div>
        </div>

        {/* Right side image */}
        <div className="flutter-hero-image-container animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="flutter-image-gradient">
             {photo ? (
                <img
                  src={getOptimizedUrl(photo, { width: 400, height: 400, quality: 'auto' })}
                  alt={name}
                  className="flutter-image"
                />
              ) : (
                <div className="flutter-image-placeholder"></div>
              )}
          </div>
        </div>
      </div>
    </section>
  );
}
