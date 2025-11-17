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

  // Config
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
            "https://placehold.co/600x400/4CAF50/FFFFFF?text=Foto+1",
            "https://placehold.co/600x400/2196F3/FFFFFF?text=Foto+2",
            "https://placehold.co/600x400/FF9800/FFFFFF?text=Foto+3",
          ]);
        }
      } catch (err) {
        console.error("Error cargando fotos Pexels:", err);
        if (mounted) {
          setPhotos([
            "https://placehold.co/600x400/4CAF50/FFFFFF?text=Foto+1",
            "https://placehold.co/600x400/2196F3/FFFFFF?text=Foto+2",
            "https://placehold.co/600x400/FF9800/FFFFFF?text=Foto+3",
          ]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadPhotos();
    return () => {
      mounted = false;
    };
  }, []);

  // Auto-play del slider
  useEffect(() => {
    if (photos.length === 0 || !animated) return;
    const total = photos.length;
    const slidesEl = slidesRef.current;
    let isStopped = false;

    const advance = () => {
      if (isStopped) return;
      indexRef.current += 1;

      Array.from(slidesEl.children).forEach((slide) =>
        slide.classList.remove(styles.zoom)
      );

      slidesEl.style.transition = `transform ${TRANSITION_MS}ms cubic-bezier(0.45,0.05,0.1,1)`;
      slidesEl.style.transform = `translateX(-${indexRef.current * 100}%)`;

      timeoutRef.current = setTimeout(() => {
        if (indexRef.current === total) {
          slidesEl.style.transition = "none";
          indexRef.current = 0;
          slidesEl.style.transform = `translateX(0%)`;
          slidesEl.offsetHeight;
        }

        const currentSlide = slidesEl.children[indexRef.current];
        if (currentSlide) {
          currentSlide.classList.add(styles.zoom);
        }

        timeoutRef.current = setTimeout(advance, PAUSE_MS);
      }, TRANSITION_MS);
    };

    slidesEl.style.transition = "none";
    slidesEl.style.transform = `translateX(0%)`;
    Array.from(slidesEl.children).forEach((s) => s.classList.remove(styles.zoom));
    const first = slidesEl.children[0];
    if (first) first.classList.add(styles.zoom);

    timeoutRef.current = setTimeout(advance, PAUSE_MS);

    return () => {
      isStopped = true;
      clearTimeout(timeoutRef.current);
    };
  }, [photos, PAUSE_MS, TRANSITION_MS, animated]);

  // Animación de entrada
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimated(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const extended = photos.length ? [...photos, photos[0]] : [];

  return (
    <section id="hero" className={styles.hero} ref={heroRef}>
      {/* Slider de fondo */}
      <div className={styles.slider}>
        <div className={styles.slides} ref={slidesRef}>
          {extended.map((src, i) => (
            <div className={styles.slide} key={i}>
              <img src={src} alt={`Foto ${i + 1}`} loading="lazy" />
            </div>
          ))}
        </div>
        {loading && <div className={styles.loadingOverlay}>Cargando...</div>}
      </div>

      {/* Contenido centrado encima */}
      <div className={`${styles.content} ${animated ? styles.contentAnimated : ''}`}>
        {/* Dibujo (entra desde la izquierda) */}
        <div className={styles.logoPart}>
          <img
            src={getPublicPath('/imagenes/dibujo-logo.png')}
            alt="Dibujo Zuni Fernández Propiedades"
            className={styles.logoImage}
          />
        </div>

        {/* Letras (entran desde la derecha) */}
        <div className={styles.logoPart}>
          <img
            src={getPublicPath('/imagenes/letras-logo.png')}
            alt="Letras Zuni Fernández Propiedades"
            className={styles.logoImage}
          />
        </div>
      </div>
    </section>
  );
}