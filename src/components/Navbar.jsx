import { useEffect, useRef, useState } from 'react';

export default function Navbar({ onAdminOpen }) {
  const ref = useRef(null);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    const onScroll = () => ref.current?.classList.toggle('scrolled', window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSecretClick = (e) => {
    e.preventDefault();
    const newCount = clickCount + 1;
    setClickCount(newCount);
    
    if (newCount >= 5) {
      onAdminOpen();
      setClickCount(0); // reset
    }

    // Reset if they don't click 5 times quickly
    setTimeout(() => setClickCount(0), 3000);
  };

  return (
    <nav className="navbar" ref={ref}>
      <a className="nav-logo" href="#" onClick={handleSecretClick}>Port<em>folio</em></a>
      <ul className="nav-links">
        <li><a href="#work">Work</a></li>
        {/* The Dashboard button is now completely hidden from the UI for security */}
      </ul>
    </nav>
  );
}
