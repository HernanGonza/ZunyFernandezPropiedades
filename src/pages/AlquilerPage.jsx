// src/pages/AlquilerPage.jsx
import { useState, useEffect } from 'react'
import PropertyListWithFilters from '../components/PropertyListWithFilters'
import PropertyModal from '../components/PropertyModal'
import Footer from '../components/Footer'

export default function AlquilerPage() {
  const [selectedProperty, setSelectedProperty] = useState(null)

  const openModal = (property) => setSelectedProperty(property)
  const closeModal = () => setSelectedProperty(null)
    const videoPath = `${import.meta.env.BASE_URL}fondo/fondo-gradiente-animado.mp4`;

  return (
    <>
      {/* FONDO ANIMADO */}
      <div className="fixed-video-background">
        <video autoPlay muted loop playsInline preload="auto">
          <source src={videoPath} type="video/mp4" />
        </video>
      </div>

      <PropertyListWithFilters
        propertyType="alquiler"
        title="Propiedades en Alquiler"
        onPropertyClick={openModal}
      />

      {selectedProperty && (
        <PropertyModal property={selectedProperty} onClose={closeModal} />
      )}

      {/* ← FOOTER */}
      <Footer />
    <ScrollToTop />
    </>
  )
}
const ScrollToTop = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []); // ← depende de useLocation, así que asegurate de importarlo también

  return null;
};