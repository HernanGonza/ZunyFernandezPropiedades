// src/components/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';
import logo from '/imagenes/logoTransparente.png';

export default function Navbar() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMenuOpen(false), [location.pathname]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const scrollToId = (id) => {
    const element = document.getElementById(id);
    if (!element) return;
    window.scrollTo({ top: element.offsetTop - 60, behavior: 'smooth' });
  };

  const handleLink = (e, id) => {
    e.preventDefault();
    setMenuOpen(false);

    if (isHomePage) scrollToId(id);
    else window.location.href = `/#${id}`;
  };

  const goToTop = () => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
        <Link to="/" onClick={() => { setMenuOpen(false); goToTop(); }} className={styles.logoLink}>
          <img src={logo} alt="logo" className={styles.logoImg} />
        </Link>

        {/* centered Menu text - always present */}
        <div className={styles.navCenter}>
          <span
  className={`${styles.menuTrigger} ${menuOpen ? styles.hidden : ''}`}
  onClick={() => setMenuOpen(true)}
>
  Menu
</span>
        </div>

        {/* Contacto - oculto cuando el menú está abierto */}
        {!menuOpen && (
          
          <span 
  onClick={() => {
    setMenuOpen(false);
    document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' });
  }} 
  className={styles.contactText}
>
  Contacto
</span>
        )}
      </nav>

      {/* fixed "Cerrar" that sits visually above Menu when menuOpen */}
      {menuOpen && (
        <span
          className={styles.closeFixed}
          onClick={() => setMenuOpen(false)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setMenuOpen(false); }}
        >
          Cerrar
        </span>
      )}

      {/* fullscreen menu */}
      <div className={`${styles.fullscreenMenu} ${menuOpen ? styles.open : ''}`} aria-hidden={!menuOpen}>
        <div className={styles.menuContent}>
          

          <a onClick={() => { setMenuOpen(false); goToTop(); }}>Arriba</a>

          {isHomePage ? (
            <>
              <a onClick={(e) => handleLink(e, 'venta')}>Venta</a>
              <a onClick={(e) => handleLink(e, 'alquiler')}>Alquiler</a>
              <a onClick={(e) => handleLink(e, 'alquiler-temporario')}>Alquiler temporario</a>
              <a onClick={(e) => handleLink(e, 'tasaciones')}>Tasaciones</a>
              <a className={styles.contactLink} onClick={(e) => handleLink(e, 'contacto')}>Contacto</a>
            </>
          ) : (
            <Link to="/" onClick={() => setMenuOpen(false)}>Volver a la página principal</Link>
          )}
        </div>
      </div>
    </>
  );
}
