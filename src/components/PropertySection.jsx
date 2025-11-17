// src/components/PropertySection.jsx
import { useState, useEffect } from 'react';
import PropertyCard from './PropertyCard';
import { useNavigate } from 'react-router-dom';
import { supabase } from '/src/utils/supabaseClient';
import styles from './PropertySection.module.css';

const SECTION_CONFIG = {
  venta: { path: '/venta', label: 'venta' },
  alquiler: { path: '/alquiler', label: 'alquiler' },
  alquiler_temporario: { path: '/alquiler-temporario', label: 'alquiler temporario' }
};

export default function PropertySection({ sectionId, title, propertyType, onPropertyClick }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('propiedades')
          .select('*')
          .eq('tipo', propertyType)
          .eq('activo', true)
          .order('destacado', { ascending: false })
          .order('created_at', { ascending: false })
          .limit(4);

        if (error) throw error;
        setProperties(data || []);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [propertyType]);

  const handleVerTodas = () => {
    const config = SECTION_CONFIG[propertyType];
    if (config) navigate(config.path);
  };

  const verTodasLabel = SECTION_CONFIG[propertyType]?.label || 'propiedades';

  return (
    <section id={sectionId} className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <p>Cargando...</p>
        </div>
      ) : properties.length > 0 ? (
        <div className={styles.grid}>
          {properties.map(prop => (
            <PropertyCard key={prop.id} property={prop} onOpen={onPropertyClick} />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <p>No hay propiedades disponibles.</p>
        </div>
      )}

      {properties.length > 0 && (
        <div className={styles.buttonContainer}>
          <button onClick={handleVerTodas} className={styles.viewAllButton}>
            Ver todas las propiedades en {verTodasLabel}
          </button>
        </div>
      )}
    </section>
  );
}