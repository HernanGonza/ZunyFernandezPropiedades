// src/components/Hero.jsx — REDESIGN
import { useEffect, useRef, useState } from "react";
import styles from "./Hero.module.css";
import { getPublicPath } from '../utils/publicPath';

export default function Hero() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animated, setAnimated] = useState(false);

  const heroRef = useRef(null);
  const slidesRef = useRef(null);
  const timeoutRef = useRef(null);

  const PAUSE_MS = 2500;
  const TRANSITION_MS = 3500;
  const indexRef = useRef(0);

  // Cargar fotos
  useEffect(() => {
    let mounted = true;
    async function loadPhotos() {
      try {
        const randomPage = Math.floor(Math.random() * 5) + 1;
        const res = await fetch(
          `https://api.pexels.com/v1/search?query=iguazu&per_page=10&orientation=landscape&people=none&page=${randomPage}`,
          {
            headers: {
              Authorization: "qSvRnBMJzAS1RxNKWWUzXXOCSqcrjIg8kRJNKuMHjYzAHdwZCEYhO7Og",
            },
          }
        );
        const data = await res.json();
        const urls = (data.photos || []).map((p) => p.src.landscape);
        if (mounted && urls.length > 0) {
          setPhotos(urls);
        } else if (mounted) {
          setPhotos([
            "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260",
            "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1260",
            "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260",
          ]);
        }
      } catch (err) {
        if (mounted) {
          setPhotos([
            "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260",
            "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1260",
          ]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadPhotos();
    return () => { mounted = false; };
  }, []);

  // Trigger animación
  useEffect(() => {
    if (!loading && photos.length > 0) {
      const t = setTimeout(() => setAnimated(true), 100);
      return () => clearTimeout(t);
    }
  }, [loading, photos]);

  // Auto-play slider
  useEffect(() => {
    if (photos.length === 0 || !animated) return;
    const total = photos.length;
    const slidesEl = slidesRef.current;
    let isStopped = false;

    const advance = () => {
      if (isStopped) return;
      indexRef.current += 1;
      Array.from(slidesEl.children).forEach(s => s.classList.remove(styles.zoom));
      slidesEl.style.transition = `transform ${TRANSITION_MS}ms cubic-bezier(0.45,0.05,0.1,1)`;
      slidesEl.style.transform = `translateX(-${indexRef.current * 100}%)`;
      timeoutRef.current = setTimeout(() => {
        if (indexRef.current === total) {
          slidesEl.style.transition = 'none';
          slidesEl.style.transform = 'translateX(0)';
          indexRef.current = 0;
        }
        const curr = slidesEl.children[indexRef.current];
        if (curr) curr.classList.add(styles.zoom);
        timeoutRef.current = setTimeout(advance, PAUSE_MS);
      }, TRANSITION_MS);
    };

    const firstSlide = slidesEl?.children[0];
    if (firstSlide) firstSlide.classList.add(styles.zoom);
    timeoutRef.current = setTimeout(advance, PAUSE_MS);
    return () => { isStopped = true; clearTimeout(timeoutRef.current); };
  }, [photos, animated]);

  return (
    <section id="hero" className={styles.hero} ref={heroRef}>
      {/* Slider */}
      <div className={styles.slider}>
        {loading ? (
          <div className={styles.loadingOverlay}>Cargando</div>
        ) : (
          <div className={styles.slides} ref={slidesRef}>
            {photos.map((url, i) => (
              <div key={i} className={styles.slide}>
                <img src={url} alt={`Propiedad ${i + 1}`} loading={i === 0 ? 'eager' : 'lazy'} />
              </div>
            ))}
            {/* Clon del primero para loop infinito */}
            {photos[0] && (
              <div className={styles.slide}>
                <img src={photos[0]} alt="loop" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Contenido centrado */}
      <div className={`${styles.content} ${animated ? styles.contentAnimated : ''}`}>
        <div className={styles.logoPart}>
          <img
            src={getPublicPath('/imagenes/logoTransparente.png')}
            alt="Zuny Fernandez Propiedades"
            className={styles.logoImage}
          />
        </div>
        <div className={styles.logoPart}>
          <img
            src={getPublicPath('/imagenes/logoLetras.png')}
            alt="Zuny Fernandez Propiedades"
            className={styles.logoImage}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>
        <p className={styles.heroTagline}>Posadas · Misiones · Argentina</p>
      </div>

      {/* Indicador de scroll */}
      {animated && (
        <div className={styles.scrollIndicator}>
          <div className={styles.scrollLine}></div>
          <span className={styles.scrollText}>Explorar</span>
        </div>
      )}
    </section>
  );
}