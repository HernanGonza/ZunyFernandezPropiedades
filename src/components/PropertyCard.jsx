// src/components/PropertyCard.jsx — REDESIGN
import styles from './PropertyCard.module.css';
import { useState } from 'react';
import { PLACEHOLDER_IMAGE } from '/src/utils/constants';

const TIPO_LABEL = {
  venta: 'En Venta',
  alquiler: 'En Alquiler',
  alquiler_temporario: 'Temporario',
};

export default function PropertyCard({ property, onOpen }) {
  const images =
    property.imagenes && Array.isArray(property.imagenes) && property.imagenes.length > 0
      ? property.imagenes
      : [PLACEHOLDER_IMAGE];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleClick = () => { if (onOpen) onOpen(property); };

  const formatearOperacion = (op) => {
    if (!op) return '';
    const mapa = {
      venta: 'Venta',
      alquiler: 'Alquiler',
      alquiler_temporario: 'Alq. Temporario',
      temporario: 'Alq. Temporario',
    };
    return mapa[op.toLowerCase()] || op.charAt(0).toUpperCase() + op.slice(1).replace(/_/g, ' ');
  };

  const formatearPrecio = () => {
    const precio = property.precio;
    const moneda = property.moneda || 'ARS';
    if (!precio || precio === '' || precio == null) return 'Consultar';
    const numero = Number(precio);
    if (isNaN(numero)) return 'Consultar';
    const formateado = new Intl.NumberFormat('es-AR').format(numero);
    return moneda === 'USD' ? `USD ${formateado}` : `$ ${formateado}`;
  };

  const tipoLabel = TIPO_LABEL[property.tipo] || TIPO_LABEL[property.operacion] || '';

  return (
    <div className={styles.card} onClick={handleClick}>

      {/* Badge de estado (vendido/alquilado/reservado) */}
      {property.estado && property.estado !== 'disponible' && (
        <div className={styles.estadoBadge}>
          {property.estado === 'vendido' && 'Vendido'}
          {property.estado === 'alquilado' && 'Alquilado'}
          {property.estado === 'reservado' && 'Reservado'}
        </div>
      )}

      {/* Badge destacado */}
      {property.destacado && (
        <div className={styles.destacadoBadge}>Destacado</div>
      )}

      {/* Imagen con carrusel */}
      <div className={styles.imageContainer}>
        <img
          src={images[currentImageIndex] || PLACEHOLDER_IMAGE}
          alt={property.titulo || 'Propiedad'}
          className={styles.image}
          onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
        />

        {images.length > 1 && (
          <>
            <div className={styles.carouselArrows}>
              <button
                className={styles.arrow}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex((prev) => prev === 0 ? images.length - 1 : prev - 1);
                }}
              >‹</button>
              <button
                className={styles.arrow}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex((prev) => prev === images.length - 1 ? 0 : prev + 1);
                }}
              >›</button>
            </div>

            <div className={styles.carouselControls}>
              {images.map((_, idx) => (
                <span
                  key={idx}
                  className={`${styles.dot} ${idx === currentImageIndex ? styles.active : ''}`}
                  onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Contenido */}
      <div className={styles.content}>
        {tipoLabel && <p className={styles.typeLabel}>{tipoLabel}</p>}
        <h3 className={styles.title}>{property.titulo || 'Sin título'}</h3>
        <p className={styles.price}>{formatearPrecio()}</p>
        <p className={styles.info}>
          {property.habitaciones > 0 && <span>🛏 {property.habitaciones} hab</span>}
          {property.banos > 0 && <span>🚿 {property.banos} baños</span>}
          {property.m2 > 0 && <span>📐 {property.m2} m²</span>}
          {!property.habitaciones && !property.banos && !property.m2 && (
            <span>{formatearOperacion(property.operacion || property.tipo || '')}</span>
          )}
        </p>
      </div>
    </div>
  );
}