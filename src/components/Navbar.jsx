import { useEffect, useRef } from 'react';

export default function Navbar() {
  const ref = useRef(null);

  useEffect(() => {
    const onScroll = () => ref.current?.classList.toggle('scrolled', window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className="navbar" ref={ref}>
      <a className="nav-logo" href="#home">Yousef <em>Ashraf</em></a>
      <ul className="nav-links">
        <li><a href="#home">About</a></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#work">Projects</a></li>
        <li><a href="#experience">Experience</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  );
}
