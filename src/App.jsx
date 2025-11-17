// src/App.jsx
import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import PropertyModal from './components/PropertyModal';
import Hero from './components/Hero';
import ValuationForm from './components/ValuationForm';
import Footer from './components/Footer';
import WhatsAppFloatingButton from './components/WhatsAppFloatingButton';
import { getPublicPath } from './utils/publicPath';

// Páginas
import VentaPage from './pages/VentaPage';
import AlquilerPage from './pages/AlquilerPage';
import AlquilerTemporarioPage from './pages/AlquilerTemporarioPage';
import PropertySection from './components/PropertySection';
import Admin from './components/Admin';

export default function App() {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const location = useLocation();

  const openModal = (property) => setSelectedProperty(property);
  const closeModal = () => setSelectedProperty(null);

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
                  <source src={getPublicPath('/fondo/fondo-gradiente-animado.mp4')} type="video/mp4" />
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