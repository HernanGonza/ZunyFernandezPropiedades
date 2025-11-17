// src/App.jsx
import { useState, useEffect } from 'react';                    // ← useEffect agregado
import { Routes, Route, useLocation } from 'react-router-dom';   // ← useLocation agregado
import Navbar from './components/Navbar';
import PropertyModal from './components/PropertyModal';
import Hero from './components/Hero';
import ValuationForm from './components/ValuationForm';
import Footer from './components/Footer';
import WhatsAppFloatingButton from './components/WhatsAppFloatingButton';

// Páginas
import VentaPage from './pages/VentaPage';
import AlquilerPage from './pages/AlquilerPage';
import AlquilerTemporarioPage from './pages/AlquilerTemporarioPage';
import PropertySection from './components/PropertySection';
import Admin from './components/Admin';

export default function App() {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const location = useLocation();   // ← necesario para el useEffect

  const openModal = (property) => setSelectedProperty(property);
  const closeModal = () => setSelectedProperty(null);

  // ←←← ESTE USEEFFECT HACE QUE TODAS LAS PÁGINAS CARGUEN ARRIBA
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <div className="app-container">
              <Hero />
              <div className="fixed-video-background">
                <video autoPlay muted loop playsInline preload="auto">
                  <source src="/assets/fondo/fondo-gradiente-animado.mp4" type="video/mp4" />
                </video>
              </div>
              <PropertySection sectionId="venta" title="Venta" propertyType="venta" onPropertyClick={openModal} />
              <PropertySection sectionId="alquiler" title="Alquiler" propertyType="alquiler" onPropertyClick={openModal} />
              <PropertySection sectionId="alquiler-temporario" title="Alquiler Temporario" propertyType="alquiler_temporario" onPropertyClick={openModal} />
              <ValuationForm />
              <Footer />
            </div>
          }
        />
        <Route path="/venta" element={<VentaPage />} />
        <Route path="/alquiler" element={<AlquilerPage />} />
        <Route path="/alquiler-temporario" element={<AlquilerTemporarioPage />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>

      {selectedProperty && <PropertyModal property={selectedProperty} onClose={closeModal} />}
      <WhatsAppFloatingButton />
    </>
  );
}