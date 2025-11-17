// src/pages/VentaPage.jsx
import { useState, useEffect } from 'react'
import PropertyListWithFilters from '/components/PropertyListWithFilters'
import PropertyModal from '/components/PropertyModal'
import Footer from '/components/Footer'           // ← NUEVO

export default function VentaPage() {
  const [selectedProperty, setSelectedProperty] = useState(null)

  const openModal = (property) => setSelectedProperty(property)
  const closeModal = () => setSelectedProperty(null)

  return (
    <>
      {/* FONDO ANIMADO */}
      <div className="fixed-video-background">
        <video autoPlay muted loop playsInline preload="auto">
          <source src="/fondo/fondo-gradiente-animado.mp4" type="video/mp4" />
        </video>
      </div>

      <PropertyListWithFilters
        propertyType="venta"
        title="Propiedades en Venta"
        onPropertyClick={openModal}
      />

      {selectedProperty && (
        <PropertyModal property={selectedProperty} onClose={closeModal} />
      )}

      {/* ← FOOTER AGREGADO */}
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