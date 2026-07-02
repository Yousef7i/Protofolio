import React, { useRef, useEffect } from 'react';

export default function FeaturedApp({ title, description, alignment = 'left', htmlContent }) {
  const iframeRef = useRef(null);

  // If we wanted to adjust the iframe size dynamically based on its content,
  // we could do it here, but since the mockups are typically fixed size (e.g. 340x720),
  // we'll rely on the CSS wrappers to handle it gracefully.

  if (!htmlContent) return null;

  return (
    <section className="featured-app-section reveal">
      <div className={`featured-app-container align-${alignment}`}>
        
        <div className="featured-text">
          <div className="sec-label">Live Demo</div>
          <h2 className="sec-title">
            {title.split(' ').map((word, i) => (
              <React.Fragment key={i}>
                {word} {i === 0 && <em>.</em>}
              </React.Fragment>
            ))}
          </h2>
          <p className="featured-desc">{description}</p>
          
          <div className="featured-actions">
            <span className="featured-hint">Interact with the device →</span>
          </div>
        </div>

        <div className="featured-demo-wrapper">
          {/* 
            Using srcDoc is the safest way to render raw HTML strings as it 
            isolates styles and scripts from the parent window.
            sandbox allows scripts to run within the iframe but restricts other behaviors.
          */}
          <iframe
            ref={iframeRef}
            srcDoc={htmlContent}
            title={title}
            sandbox="allow-scripts allow-same-origin"
            style={{
              width: '400px',
              height: '800px',
              border: 'none',
              background: 'transparent',
              overflow: 'hidden'
            }}
          />
        </div>

      </div>
    </section>
  );
}
