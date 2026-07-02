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
      <a className="nav-logo" href="#">Port<em>folio</em></a>
      <ul className="nav-links">
        <li><a href="#work">Work</a></li>
      </ul>
    </nav>
  );
}
