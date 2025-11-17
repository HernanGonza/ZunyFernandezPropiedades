// src/components/PropertyCard.jsx
import styles from './PropertyCard.module.css';
import { useState } from 'react';
import { PLACEHOLDER_IMAGE } from '/src/utils/constants';

export default function PropertyCard({ property, onOpen }) {
  // Imágenes
  const images = property.imagenes && Array.isArray(property.imagenes) && property.imagenes.length > 0
    ? property.imagenes
    : [PLACEHOLDER_IMAGE];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  const handleClick = () => {
    if (onOpen) onOpen(property);
  };

  // ← NUEVO: convierte alquiler_temporario → Alquiler Temporario, etc.
  const formatearOperacion = (op) => {
    if (!op) return '';
    const mapa = {
      venta: 'Venta',
      alquiler: 'Alquiler',
      alquiler_temporario: 'Alquiler Temporario',
      temporario: 'Alquiler Temporario',
    };
    return mapa[op.toLowerCase()] || op.charAt(0).toUpperCase() + op.slice(1).replace(/_/g, ' ');
  };

  // ← NUEVO: precio seguro + moneda correcta
  const formatearPrecio = () => {
    const precio = property.precio;
    const moneda = property.moneda || 'ARS'; // si no tiene moneda, asume pesos

    if (!precio || precio === '' || precio == null) {
      return 'Consultar';
    }

    const numero = Number(precio);
    if (isNaN(numero)) return 'Consultar';

    const formateado = new Intl.NumberFormat('es-AR').format(numero);
    return moneda === 'USD' ? `USD ${formateado}` : `$ ${formateado}`;
  };

  return (
    <div className={styles.card} onClick={handleClick}>
      
      {/* ←←← SOLO ESTO ES NUEVO: el cartel rojo */}
      {property.estado && property.estado !== 'disponible' && (
        <div className={styles.estadoBadge}>
          {property.estado === 'vendido' && 'VENDIDO'}
          {property.estado === 'alquilado' && (
            (property.operacion === 'alquiler_temporario' || property.tipo === 'alquiler_temporario')
              ? 'ALQUILADO TEMPORARIO'
              : 'ALQUILADO'
          )}
          {property.estado === 'reservado' && 'RESERVADO'}
        </div>
      )}

      <div className={styles.imageContainer}>
        <img
          src={images[currentImageIndex] || PLACEHOLDER_IMAGE}
          alt={property.titulo || 'Propiedad'}
          className={styles.image}
          onError={(e) => {
            e.target.src = PLACEHOLDER_IMAGE;
          }}
        />

        {images.length > 1 && (
          <>
            {/* FLECHAS 100% ORIGINALES */}
            <div className={styles.carouselArrows}>
              <button
                className={styles.arrow}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex((prev) =>
                    prev === 0 ? images.length - 1 : prev - 1
                  );
                }}
              >
                &lsaquo;
              </button>
              <button
                className={styles.arrow}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex((prev) =>
                    prev === images.length - 1 ? 0 : prev + 1
                  );
                }}
              >
                &rsaquo;
              </button>
            </div>

            <div className={styles.carouselControls}>
              {images.map((_, idx) => (
                <span
                  key={idx}
                  className={`${styles.dot} ${idx === currentImageIndex ? styles.active : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    goToImage(idx);
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{property.titulo || 'Sin título'}</h3>

        {/* PRECIO MEJORADO (maneja null + moneda) */}
        <p className={styles.price}>{formatearPrecio()}</p>

        {/* INFO MEJORADA (operación bonita + datos seguros) */}
        <p className={styles.info}>
          {formatearOperacion(property.operacion || property.tipo || '')}
          {' • '}
          {property.habitaciones || 0} hab
          {' • '}
          {property.m2 || 0} m²
        </p>
      </div>
    </div>
  );
}