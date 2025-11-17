/* eslint-disable react-hooks/rules-of-hooks */
// src/components/PropertyModal.jsx
import styles from './PropertyModal.module.css'
import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { PLACEHOLDER_IMAGE } from '../utils/constants'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix del ícono del marker
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

export default function PropertyModal({ property, onClose }) {
  if (!property || Object.keys(property).length === 0) {
    return (
      <div className={styles.backdrop} onClick={onClose}>
        <div className={styles.modal} style={{ padding: '3rem', textAlign: 'center', color: 'white' }}>
          <p>Cargando propiedad...</p>
        </div>
      </div>
    )
  }

  const images = Array.isArray(property.imagenes) && property.imagenes.length > 0
    ? property.imagenes
    : [PLACEHOLDER_IMAGE]

  const [mainImage, setMainImage] = useState(images[0])
  const [position, setPosition] = useState([-27.3621, -55.9000]) // Centro de Posadas como fallback
  const [loadingMap, setLoadingMap] = useState(true)

  // MEJORAMOS LA BÚSQUEDA CON ESTRUCTURA + PARÁMETROS ÓPTIMOS
  const direccionCompleta = [
    property.direccion?.trim(),
    property.ciudad?.trim(),
    'Misiones',
    'Argentina'
  ].filter(Boolean).join(', ')

  useEffect(() => {
    if (!direccionCompleta || direccionCompleta === 'Misiones, Argentina') {
      setLoadingMap(false)
      return
    }

    // Query optimizada para Argentina + mayor precisión
    const query = encodeURIComponent(direccionCompleta)
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&countrycodes=ar&addressdetails=1&limit=1&bounded=1&viewbox=-73.99,-55.19,-53.64,-21.78`

    fetch(url, {
      headers: {
        'User-Agent': 'InmobiliariaApp/1.0' // Nominatim requiere User-Agent
      }
    })
      .then(r => r.json())
      .then(data => {
        console.log('Resultado Nominatim:', data) // Para que veas qué devuelve
        if (data?.[0]?.lat && data?.[0]?.lon) {
          setPosition([parseFloat(data[0].lat), parseFloat(data[0].lon)])
        }
        setLoadingMap(false)
      })
      .catch(err => {
        console.error('Error geocode:', err)
        setLoadingMap(false)
      })
  }, [direccionCompleta])

  function MapResize() {
    const map = useMap()
    useEffect(() => {
      setTimeout(() => map.invalidateSize(), 100)
    }, [map])
    return null
  }

  const formatearPrecio = () => {
    if (!property.precio || property.precio === 'Consultar') return 'Consultar precio'
    const numero = Number(property.precio)
    if (isNaN(numero)) return 'Consultar precio'
    const formateado = new Intl.NumberFormat('es-AR').format(numero)
    return property.moneda === 'USD' ? `USD ${formateado}` : `$ ${formateado}`
  }

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>×</button>

        <div className={styles.mainImageContainer}>
          <img src={mainImage} alt={property.titulo} className={styles.mainImage} />
          {images.length > 1 && (
            <div className={styles.modalArrows}>
              <button onClick={e => { e.stopPropagation(); const i = images.indexOf(mainImage); setMainImage(images[i === 0 ? images.length - 1 : i - 1]) }}>‹</button>
              <button onClick={e => { e.stopPropagation(); const i = images.indexOf(mainImage); setMainImage(images[i === images.length - 1 ? 0 : i + 1]) }}>›</button>
            </div>
          )}
        </div>

        <div className={styles.content}>
          <h2 className={styles.title}>{property.titulo || 'Sin título'}</h2>
          <p className={styles.price}>{formatearPrecio()}</p>
          <p className={styles.description}>{property.descripcion || 'Sin descripción disponible.'}</p>

          <div className={styles.detailsGrid}>
            {property.habitaciones != null && <div className={styles.detailItem}>Habitaciones: <strong>{property.habitaciones}</strong></div>}
            {property.banos != null && <div className={styles.detailItem}>Baños: <strong>{property.banos}</strong></div>}
            {property.m2 != null && <div className={styles.detailItem}>Superficie: <strong>{property.m2} m²</strong></div>}
            {property.cochera > 0 && <div className={styles.detailItem}>Cocheras: <strong>{property.cochera}</strong></div>}
            {property.ciudad && <div className={styles.detailItem}>Ciudad: <strong>{property.ciudad}</strong></div>}
            {property.direccion && <div className={styles.detailItem}>Dirección: <strong>{property.direccion}</strong></div>}
          </div>

          {(property.direccion || property.ciudad) && (
            <div className={styles.mapWrapper}>
              <h3 className={styles.mapTitle}>Ubicación aproximada</h3>
              {loadingMap ? (
                <div style={{ height: '420px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f0f0', borderRadius: '16px' }}>
                  <p>Buscando ubicación...</p>
                </div>
              ) : (
                <div style={{ height: '420px', width: '100%', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.6)' }}>
                  <MapContainer center={position} zoom={16} style={{ height: '100%', width: '100%' }} key={position.join(',')}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
                    <Marker position={position}>
                      <Popup>{direccionCompleta || 'Ubicación aproximada'}</Popup>
                    </Marker>
                    <MapResize />
                  </MapContainer>
                </div>
              )}
              <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem', fontStyle: 'italic' }}>
                Nota: En algunas zonas de Misiones la geolocalización es aproximada
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}