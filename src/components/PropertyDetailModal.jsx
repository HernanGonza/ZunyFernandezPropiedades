import styles from './PropertyModal.module.css';
import { useState, useEffect } from 'react';
import { PLACEHOLDER_IMAGE } from '../utils/constants';

export default function PropertyModal({ property, onClose }) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const images = property.imagenes && Array.isArray(property.imagenes) && property.imagenes.length > 0
    ? property.imagenes
    : [PLACEHOLDER_IMAGE];

  const [mainImage, setMainImage] = useState(PLACEHOLDER_IMAGE);
  const [loading, setLoading] = useState(true);

  // Cargar solo la imagen principal al inicio
  useEffect(() => {
    const img = new Image();
    img.src = images[0] || PLACEHOLDER_IMAGE;
    img.onload = () => {
      setMainImage(images[0] || PLACEHOLDER_IMAGE);
      setLoading(false);
    };
    img.onerror = () => {
      setMainImage(PLACEHOLDER_IMAGE);
      setLoading(false);
    };
  }, [images]);

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>

        {/* Imagen principal con estado de carga */}
        {loading ? (
          <div className={styles.imagePlaceholder}>Cargando...</div>
        ) : (
          <img
            src={mainImage}
            alt={property.titulo || 'Propiedad'}
            className={styles.mainImage}
            onError={(e) => e.target.src = PLACEHOLDER_IMAGE}
          />
        )}

        {/* Flechas */}
        {images.length > 1 && (
          <div className={styles.modalArrows}>
            <button
              className={styles.modalArrow}
              onClick={(e) => {
                e.stopPropagation();
                const currentIndex = images.indexOf(mainImage);
                const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
                setMainImage(images[prevIndex]);
                setLoading(true);
                const img = new Image();
                img.src = images[prevIndex];
                img.onload = () => setLoading(false);
                img.onerror = () => {
                  setLoading(false);
                  setMainImage(PLACEHOLDER_IMAGE);
                };
              }}
            >
              ‹
            </button>
            <button
              className={styles.modalArrow}
              onClick={(e) => {
                e.stopPropagation();
                const currentIndex = images.indexOf(mainImage);
                const nextIndex = (currentIndex + 1) % images.length;
                setMainImage(images[nextIndex]);
                setLoading(true);
                const img = new Image();
                img.src = images[nextIndex];
                img.onload = () => setLoading(false);
                img.onerror = () => {
                  setLoading(false);
                  setMainImage(PLACEHOLDER_IMAGE);
                };
              }}
            >
              ›
            </button>
          </div>
        )}

        <h2 className={styles.title}>{property.titulo || 'Sin título'}</h2>

        <p className={styles.price}>
          {property.moneda === 'ARS' ? '$' : 'USD '}
          {property.precio ? new Intl.NumberFormat('es-AR').format(property.precio) : 'Consultar'}
        </p>

        <p className={styles.description}>
          {property.descripcion || 'Sin descripción disponible.'}
        </p>

        {/* Detalles */}
        <div className={styles.detailsGrid}>
          {property.habitaciones !== null && (
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Habitaciones</div>
              <div className={styles.detailValue}>{property.habitaciones}</div>
            </div>
          )}
          {property.banos !== null && (
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Baños</div>
              <div className={styles.detailValue}>{property.banos}</div>
            </div>
          )}
          {property.m2 !== null && (
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>M²</div>
              <div className={styles.detailValue}>{property.m2}</div>
            </div>
          )}
          {property.cochera !== null && (
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Cocheras</div>
              <div className={styles.detailValue}>{property.cochera}</div>
            </div>
          )}
          {property.ciudad && (
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Ciudad</div>
              <div className={styles.detailValue}>{property.ciudad}</div>
            </div>
          )}
          {property.direccion && (
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Dirección</div>
              <div className={styles.detailValue}>{property.direccion}</div>
            </div>
          )}
        </div>

        {/* Miniaturas con lazy loading */}
        {images.length > 1 && (
          <div className={styles.imageCarousel}>
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img || PLACEHOLDER_IMAGE}
                alt={`Miniatura ${idx + 1}`}
                className={`${styles.thumbnail} ${mainImage === img ? styles.active : ''}`}
                onClick={() => {
                  setMainImage(img);
                  setLoading(true);
                  const newImg = new Image();
                  newImg.src = img;
                  newImg.onload = () => setLoading(false);
                  newImg.onerror = () => {
                    setLoading(false);
                    setMainImage(PLACEHOLDER_IMAGE);
                  };
                }}
                loading="lazy" // 👈 diferir carga
                onError={(e) => e.target.src = PLACEHOLDER_IMAGE}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}