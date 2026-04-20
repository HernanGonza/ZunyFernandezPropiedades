// src/components/PropertyListWithFilters.jsx — REDESIGN
import { useState, useEffect } from 'react';
import PropertyCard from './PropertyCard';
import { supabase } from '/src/utils/supabaseClient';
import styles from './PropertyListWithFilters.module.css';

export default function PropertyListWithFilters({ propertyType, title, onPropertyClick }) {
  const [allProperties, setAllProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    categoria: 'todos',
    ambientes: 'todos',
    cochera: 'todos',
    ciudad: 'todos',
    precioMin: '',
    precioMax: '',
    m2Min: '',
    m2Max: '',
  });

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
          .order('created_at', { ascending: false });
        if (error) throw error;
        setAllProperties(data || []);
        setFilteredProperties(data || []);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [propertyType]);

  useEffect(() => {
    let result = [...allProperties];
    if (filters.categoria !== 'todos') result = result.filter(p => p.categoria === filters.categoria);
    if (filters.ambientes !== 'todos') {
      if (filters.ambientes === '3+') result = result.filter(p => p.habitaciones >= 3);
      else result = result.filter(p => p.habitaciones === parseInt(filters.ambientes));
    }
    if (filters.cochera !== 'todos') result = result.filter(p => Boolean(p.cochera) === (filters.cochera === 'si'));
    if (filters.ciudad !== 'todos') result = result.filter(p => p.ciudad === filters.ciudad);
    if (filters.precioMin) result = result.filter(p => p.precio >= parseFloat(filters.precioMin));
    if (filters.precioMax) result = result.filter(p => p.precio <= parseFloat(filters.precioMax));
    if (filters.m2Min) result = result.filter(p => p.m2 >= parseFloat(filters.m2Min));
    if (filters.m2Max) result = result.filter(p => p.m2 <= parseFloat(filters.m2Max));
    setFilteredProperties(result);
  }, [filters, allProperties]);

  const handleFilterChange = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));

  const categorias = [...new Set(allProperties.map(p => p.categoria).filter(Boolean))];
  const ciudades   = [...new Set(allProperties.map(p => p.ciudad).filter(Boolean))];
  const ambientes  = [1, 2, '3+'];

  return (
    <div className={styles.container}>

      {/* Header */}
      <div className={styles.pageHeader}>
        <button onClick={() => window.history.back()} className={styles.backButton}>
          Volver
        </button>
        <h1 className={styles.title}>{title}</h1>
        {!loading && (
          <p className={styles.resultCount}>
            {filteredProperties.length} propiedad{filteredProperties.length !== 1 ? 'es' : ''} encontrada{filteredProperties.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Filtros sticky */}
      <div className={styles.filtersWrapper}>
        <div className={styles.filters}>

          {/* Tipo / categoría */}
          {categorias.length > 0 && (
            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Tipo</span>
              <div className={styles.filterOptions}>
                <button onClick={() => handleFilterChange('categoria', 'todos')} className={`${styles.filterButton} ${filters.categoria === 'todos' ? styles.active : ''}`}>Todos</button>
                {categorias.map(cat => (
                  <button key={cat} onClick={() => handleFilterChange('categoria', cat)} className={`${styles.filterButton} ${filters.categoria === cat ? styles.active : ''}`}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Ciudad */}
          {ciudades.length > 0 && (
            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Ciudad</span>
              <div className={styles.filterOptions}>
                <button onClick={() => handleFilterChange('ciudad', 'todos')} className={`${styles.filterButton} ${filters.ciudad === 'todos' ? styles.active : ''}`}>Todas</button>
                {ciudades.map(ciudad => (
                  <button key={ciudad} onClick={() => handleFilterChange('ciudad', ciudad)} className={`${styles.filterButton} ${filters.ciudad === ciudad ? styles.active : ''}`}>
                    {ciudad}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Ambientes */}
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Ambientes</span>
            <div className={styles.filterOptions}>
              <button onClick={() => handleFilterChange('ambientes', 'todos')} className={`${styles.filterButton} ${filters.ambientes === 'todos' ? styles.active : ''}`}>Todos</button>
              {ambientes.map(amb => (
                <button key={amb} onClick={() => handleFilterChange('ambientes', amb.toString())} className={`${styles.filterButton} ${filters.ambientes === amb.toString() ? styles.active : ''}`}>
                  {amb} amb
                </button>
              ))}
            </div>
          </div>

          {/* Cochera */}
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Cochera</span>
            <div className={styles.filterOptions}>
              <button onClick={() => handleFilterChange('cochera', 'todos')} className={`${styles.filterButton} ${filters.cochera === 'todos' ? styles.active : ''}`}>Todos</button>
              <button onClick={() => handleFilterChange('cochera', 'si')} className={`${styles.filterButton} ${filters.cochera === 'si' ? styles.active : ''}`}>Con</button>
              <button onClick={() => handleFilterChange('cochera', 'no')} className={`${styles.filterButton} ${filters.cochera === 'no' ? styles.active : ''}`}>Sin</button>
            </div>
          </div>

          {/* Precio */}
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Precio</span>
            <div className={styles.rangeInputs}>
              <input type="number" placeholder="Mín" className={styles.rangeInput} value={filters.precioMin} onChange={e => handleFilterChange('precioMin', e.target.value)} />
              <span className={styles.rangeSeparator}>—</span>
              <input type="number" placeholder="Máx" className={styles.rangeInput} value={filters.precioMax} onChange={e => handleFilterChange('precioMax', e.target.value)} />
            </div>
          </div>

          {/* m² */}
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Superficie (m²)</span>
            <div className={styles.rangeInputs}>
              <input type="number" placeholder="Mín" className={styles.rangeInput} value={filters.m2Min} onChange={e => handleFilterChange('m2Min', e.target.value)} />
              <span className={styles.rangeSeparator}>—</span>
              <input type="number" placeholder="Máx" className={styles.rangeInput} value={filters.m2Max} onChange={e => handleFilterChange('m2Max', e.target.value)} />
            </div>
          </div>

        </div>
      </div>

      {/* Resultados */}
      {loading ? (
        <div className={styles.loading}>Cargando propiedades</div>
      ) : filteredProperties.length === 0 ? (
        <p className={styles.message}>No hay propiedades con esos filtros.</p>
      ) : (
        <div className={styles.grid}>
          {filteredProperties.map(prop => (
            <PropertyCard key={prop.id} property={prop} onOpen={onPropertyClick} />
          ))}
        </div>
      )}

    </div>
  );
}