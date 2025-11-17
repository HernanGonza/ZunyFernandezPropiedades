// src/components/PropertySectionFull.jsx
import { useState, useEffect } from 'react'
import PropertyCard from './PropertyCard'
import { supabase } from '../utils/supabaseClient'

export default function PropertySectionFull({ propertyType, title, onPropertyClick }) {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('propiedades')
          .select('*')
          .eq('tipo', propertyType)
          .eq('activo', true)
          .order('destacado', { ascending: false })
          .order('created_at', { ascending: false })

        if (error) throw error
        setProperties(data || [])
      } catch (err) {
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [propertyType])

  return (
    <div style={{ padding: '2rem' }}>
      <h1>{title}</h1>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '2rem',
          marginTop: '1.5rem'
        }}>
          {properties.map(prop => (
            <PropertyCard
              key={prop.id}
              property={prop}
              onOpen={onPropertyClick} // 👈 pasa la función desde la página
            />
          ))}
        </div>
      )}
    </div>
  )
}