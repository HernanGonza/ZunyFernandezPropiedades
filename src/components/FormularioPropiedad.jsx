// src/components/FormularioPropiedad.jsx
import { useState, useRef } from 'react'
import { supabase } from '../utils/supabaseClient'
import { toast } from 'sonner'
import styles from './FormularioPropiedad.module.css'

export default function FormularioPropiedad({ propiedad, onSuccess }) {
  const [form, setForm] = useState({
    titulo: propiedad?.titulo || '',
    descripcion: propiedad?.descripcion || '',
    tipo: propiedad?.tipo || 'venta',
    categoria: propiedad?.categoria || 'casa',
    precio: propiedad?.precio === 'Consultar' ? '' : (propiedad?.precio || ''),
    moneda: propiedad?.precio === 'Consultar' ? 'consultar' : (propiedad?.moneda || 'ARS'),
    habitaciones: propiedad?.habitaciones || '',
    banos: propiedad?.banos || '',
    m2: propiedad?.m2 || '',
    cochera: propiedad?.cochera || '',
    direccion: propiedad?.direccion || '',
    ciudad: propiedad?.ciudad || '',
    destacado: propiedad?.destacado || false,
    activo: propiedad?.activo ?? true,
    estado: propiedad?.estado || '',
  })

  const [imagenes, setImagenes] = useState(() => {
    if (propiedad?.imagenes && Array.isArray(propiedad.imagenes)) {
      return propiedad.imagenes.map(url => ({ url, file: null, isExisting: true }))
    }
    return []
  })

  const [subiendo, setSubiendo] = useState(false)
  const fileInputRef = useRef(null)

  const manejarCambio = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const manejarSubidaImagenes = (e) => {
    const files = Array.from(e.target.files)
    const nuevas = files.map(file => ({
      url: URL.createObjectURL(file),
      file,
      isExisting: false,
    }))
    setImagenes(prev => [...prev, ...nuevas])
  }

  const eliminarImagen = (index) => {
    setImagenes(prev => {
      const nueva = [...prev]
      if (!nueva[index].isExisting && nueva[index].url) {
        URL.revokeObjectURL(nueva[index].url)
      }
      nueva.splice(index, 1)
      return nueva
    })
  }

  const subirImagenes = async () => {
    const urlsFinales = []
    for (const img of imagenes) {
      if (img.isExisting) {
        urlsFinales.push(img.url)
      } else if (img.file) {
        const filePath = `propiedades/${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${img.file.name}`
        const { error } = await supabase.storage
          .from('propiedades')
          .upload(filePath, img.file, { upsert: true })
        if (error) throw error
        const { data } = supabase.storage.from('propiedades').getPublicUrl(filePath)
        urlsFinales.push(data.publicUrl)
      }
    }
    return urlsFinales
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubiendo(true)

    try {
      const imagenesUrls = await subirImagenes()

      // Construcción inteligente del precio
      let precioFinal = 'Consultar'
      let monedaFinal = null

      if (form.moneda === 'consultar') {
        precioFinal = 'Consultar'
      } else if (form.precio && !isNaN(form.precio) && Number(form.precio) > 0) {
        precioFinal = Number(form.precio)
        monedaFinal = form.moneda
      }

      const cleanValue = (value, isInt = false) => {
        if (value === '' || value == null) return null
        return isInt ? parseInt(value, 10) : parseFloat(value)
      }

      const payload = {
        titulo: form.titulo.trim(),
        descripcion: form.descripcion.trim() || null,
        precio: precioFinal,
        moneda: monedaFinal,
        tipo: form.tipo,
        categoria: form.categoria,
        habitaciones: cleanValue(form.habitaciones, true),
        banos: cleanValue(form.banos, true),
        m2: cleanValue(form.m2),
        cochera: cleanValue(form.cochera, true),
        direccion: form.direccion.trim() || null,
        ciudad: form.ciudad.trim() || null,
        destacado: form.destacado,
        activo: form.activo,
        estado: form.estado === '' ? null : form.estado,
        imagenes: imagenesUrls.length > 0 ? imagenesUrls : [],
      }

      let error
      if (propiedad?.id) {
        ;({ error } = await supabase.from('propiedades').update(payload).eq('id', propiedad.id))
      } else {
        ;({ error } = await supabase.from('propiedades').insert([payload]))
      }

      if (error) throw error

      toast.success(propiedad?.id ? 'Propiedad actualizada' : 'Propiedad creada')
      onSuccess()
    } catch (err) {
      console.error(err)
      toast.error('Error al guardar')
    } finally {
      setSubiendo(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h3 className={styles.title}>
        {propiedad?.id ? 'Editar' : 'Nueva'} Propiedad
      </h3>

      <input
        type="text"
        name="titulo"
        placeholder="Título *"
        value={form.titulo}
        onChange={manejarCambio}
        required
        className={styles.input}
      />

      <textarea
        name="descripcion"
        placeholder="Descripción"
        value={form.descripcion}
        onChange={manejarCambio}
        rows="4"
        className={styles.textarea}
      />

      {/* NUEVO: PRECIO + MONEDA */}
      <div className={styles.grid} style={{ marginBottom: '1.5rem' }}>
        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', alignItems: 'end' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Precio</label>
            <input
              type="number"
              name="precio"
              placeholder="Ej: 150000"
              value={form.precio}
              onChange={manejarCambio}
              className={styles.input}
              disabled={form.moneda === 'consultar'}
            />
          </div>

          <div style={{ width: '180px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Moneda</label>
            <select
              name="moneda"
              value={form.moneda}
              onChange={manejarCambio}
              className={styles.input}
            >
              <option value="ARS">Pesos Argentinos</option>
              <option value="USD">Dólares</option>
              <option value="consultar">Consultar precio</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        <select name="tipo" value={form.tipo} onChange={manejarCambio} className={styles.input}>
          <option value="venta">Venta</option>
          <option value="alquiler">Alquiler</option>
          <option value="alquiler_temporario">Alquiler Temporario</option>
        </select>

        <select name="categoria" value={form.categoria} onChange={manejarCambio} className={styles.input}>
          <option value="casa">Casa</option>
          <option value="departamento">Departamento</option>
          <option value="terreno">Terreno</option>
          <option value="local">Local</option>
          <option value="oficina">Oficina</option>
        </select>

        <input type="number" name="habitaciones" placeholder="Habitaciones" value={form.habitaciones} onChange={manejarCambio} className={styles.input} />
        <input type="number" name="banos" placeholder="Baños" value={form.banos} onChange={manejarCambio} className={styles.input} />
        <input type="number" name="m2" placeholder="m² totales" value={form.m2} onChange={manejarCambio} className={styles.input} />
        <input type="number" name="cochera" placeholder="Cocheras" value={form.cochera} onChange={manejarCambio} className={styles.input} />
        <input type="text" name="direccion" placeholder="Dirección" value={form.direccion} onChange={manejarCambio} className={styles.input} />
        <input type="text" name="ciudad" placeholder="Ciudad" value={form.ciudad} onChange={manejarCambio} className={styles.input} />
      </div>

      <div style={{ margin: '1.5rem 0' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
          Estado de la propiedad
        </label>
        <select name="estado" value={form.estado} onChange={manejarCambio} className={styles.input}>
          <option value="">Disponible</option>
          <option value="vendido">VENDIDO</option>
          <option value="alquilado">ALQUILADO</option>
          <option value="reservado">RESERVADO</option>
        </select>
      </div>

      <div className={styles.checkboxes}>
        <label>
          <input type="checkbox" name="destacado" checked={form.destacado} onChange={manejarCambio} />
          Destacado (aparece en portada)
        </label>
        <label>
          <input type="checkbox" name="activo" checked={form.activo} onChange={manejarCambio} />
          Publicada en el sitio
        </label>
      </div>

      <div className={styles.imagenesSection}>
        <h4>Imágenes ({imagenes.length})</h4>
        <input
          type="file"
          ref={fileInputRef}
          onChange={manejarSubidaImagenes}
          multiple
          accept="image/*"
          style={{ marginBottom: '1rem' }}
        />

        {imagenes.length > 0 && (
          <div className={styles.imagenesPreviews}>
            {imagenes.map((img, i) => (
              <div key={i} className={styles.imagenItem}>
                <img src={img.url} alt={`Imagen ${i + 1}`} />
                <button type="button" onClick={() => eliminarImagen(i)} className={styles.botonEliminar}>
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.save} disabled={subiendo}>
          {subiendo ? 'Guardando...' : 'Guardar Propiedad'}
        </button>
        <button type="button" onClick={onSuccess} className={styles.cancel} disabled={subiendo}>
          Cancelar
        </button>
      </div>
    </form>
  )
}