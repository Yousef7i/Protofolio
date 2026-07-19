import React from 'react';

export default function Contact({ profile }) {
  if (!profile) return null;

  const hasAnyLink = profile.linkedin || profile.whatsapp || profile.phone || profile.facebook;
  if (!hasAnyLink) return null;

  return (
    <section className="contact-section" id="contact">
      <div className="contact-container">
        <div className="contact-header">
          <h2 className="contact-title">Let's Connect</h2>
          <p className="contact-subtitle">Feel free to reach out for collaborations or just a friendly hello</p>
        </div>
        
        <div className="contact-grid">
          {profile.linkedin && (
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="contact-card linkedin-card">
              <div className="contact-icon-wrapper">
                <svg viewBox="0 0 24 24" fill="currentColor" className="contact-icon">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </div>
              <span className="contact-label">LinkedIn</span>
            </a>
          )}
          
          {profile.whatsapp && (
            <a href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="contact-card whatsapp-card">
              <div className="contact-icon-wrapper">
                <svg viewBox="0 0 24 24" fill="currentColor" className="contact-icon">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 1.835 6.368L.15 23.473l5.247-1.374A11.966 11.966 0 0 0 11.944 24a12 12 0 0 0 12-12 12 12 0 0 0-12-12zM19.16 16.5c-.34.96-1.954 1.776-2.678 1.902-.724.126-1.52.285-4.22-1.025-3.243-1.572-5.323-4.9-5.485-5.116-.16-.216-1.309-1.745-1.309-3.328 0-1.583.82-2.373 1.11-2.678.29-.305.626-.381.835-.381.21 0 .42 0 .6.01.196.01.458-.073.717.551.272.656.928 2.27 1.01 2.435.082.164.137.355.032.565-.104.21-.157.34-.316.526-.157.186-.33.407-.474.551-.157.157-.323.33-.146.635.177.305.787 1.3 1.688 2.107 1.162 1.042 2.148 1.365 2.453 1.512.304.146.483.125.666-.084.183-.21.787-.916.996-1.23.21-.314.417-.26.697-.156.28.104 1.77 .836 2.073.987.304.152.507.226.582.352.074.126.074.733-.266 1.693z"/>
                </svg>
              </div>
              <span className="contact-label">WhatsApp</span>
            </a>
          )}
          
          {profile.facebook && (
            <a href={profile.facebook} target="_blank" rel="noopener noreferrer" className="contact-card facebook-card">
              <div className="contact-icon-wrapper">
                <svg viewBox="0 0 24 24" fill="currentColor" className="contact-icon">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
              <span className="contact-label">Facebook</span>
            </a>
          )}
          
          {profile.phone && (
            <a href={`tel:${profile.phone}`} className="contact-card phone-card">
              <div className="contact-icon-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="contact-icon">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <span className="contact-label">Phone</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
