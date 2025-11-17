// src/components/ValuationForm.jsx
import { useState } from 'react'
import styles from './ValuationForm.module.css'

export default function ValuationForm() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    barrio: '',
    ciudad: '',
    provincia: '',
    tipoPropiedad: '',
    superficie: '',
    piso: '',
    ambientes: '',
    banos: '',
    cochera: false,
    comentarios: '',
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.nombre || !formData.email || !formData.telefono || !formData.direccion || !formData.tipoPropiedad) {
      alert('Por favor, completá todos los campos obligatorios.')
      return
    }

    let detallesPropiedad = ''
    if (formData.tipoPropiedad === 'terreno') {
      detallesPropiedad = `Superficie: ${formData.superficie} m²`
    } else {
      detallesPropiedad = `
Tipo: ${formData.tipoPropiedad === 'casa' ? 'Casa' : 'Departamento'}
Superficie: ${formData.superficie} m²
Ambientes: ${formData.ambientes || 'No especificado'}
Baños: ${formData.banos || 'No especificado'}
Cochera: ${formData.cochera ? 'Sí' : 'No'}
`.trim()

      if (formData.tipoPropiedad === 'departamento') {
        detallesPropiedad += `\nPiso: ${formData.piso || 'No especificado'}`
      }
    }

    const cuerpoEmail = `
SOLICITUD DE TASACIÓN

DATOS DEL CLIENTE:
- Nombre: ${formData.nombre}
- Email: ${formData.email}
- Teléfono: ${formData.telefono}
- Dirección: ${formData.direccion}
- Barrio: ${formData.barrio || 'No especificado'}
- Ciudad: ${formData.ciudad || 'No especificado'}
- Provincia: ${formData.provincia || 'No especificado'}

DATOS DE LA PROPIEDAD:
${detallesPropiedad}

COMENTARIOS:
${formData.comentarios || 'Ninguno'}
`.trim()

    const asunto = `Solicitud de Tasación - ${formData.direccion}`
    const mailtoLink = `mailto:zunypropiedades@gmail.com?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpoEmail)}`

    window.location.href = mailtoLink
  }

  return (
    <section id="tasaciones" className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Tasaciones</h2>
        <p className={styles.subtitle}>
          Completá el formulario para una tasación estimada de tu propiedad. Nos pondremos en contacto a la brevedad.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Nombre */}
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="nombre">
              Nombre completo *
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              className={styles.input}
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email y Teléfono */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="email">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={styles.input}
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="telefono">
                Teléfono *
              </label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                className={styles.input}
                value={formData.telefono}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Dirección */}
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="direccion">
              Dirección de la propiedad *
            </label>
            <input
              type="text"
              id="direccion"
              name="direccion"
              className={styles.input}
              value={formData.direccion}
              onChange={handleChange}
              required
            />
          </div>

          {/* Barrio, Ciudad, Provincia */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="barrio">
                Barrio
              </label>
              <input
                type="text"
                id="barrio"
                name="barrio"
                className={styles.input}
                value={formData.barrio}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="ciudad">
                Ciudad
              </label>
              <input
                type="text"
                id="ciudad"
                name="ciudad"
                className={styles.input}
                value={formData.ciudad}
                onChange={handleChange}
                placeholder="Ej: Posadas, Oberá, Corrientes..."
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="provincia">
              Provincia
            </label>
            <input
              type="text"
              id="provincia"
              name="provincia"
              className={styles.input}
              value={formData.provincia}
              onChange={handleChange}
              placeholder="Ej: Misiones, Corrientes, Chaco..."
            />
          </div>

          {/* Tipo de propiedad */}
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="tipoPropiedad">
              Tipo de propiedad *
            </label>
            <select
              id="tipoPropiedad"
              name="tipoPropiedad"
              className={styles.select}
              value={formData.tipoPropiedad}
              onChange={handleChange}
              required
            >
              <option value="">Seleccioná una opción</option>
              <option value="casa">Casa</option>
              <option value="departamento">Departamento</option>
              <option value="terreno">Terreno</option>
            </select>
          </div>

          {/* Superficie */}
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="superficie">
              Superficie (m²) *
            </label>
            <input
              type="number"
              id="superficie"
              name="superficie"
              className={styles.input}
              value={formData.superficie}
              onChange={handleChange}
              required
              min="1"
            />
          </div>

          {/* Campos condicionales */}
          {formData.tipoPropiedad !== 'terreno' && (
            <>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="ambientes">
                  Cantidad de ambientes *
                </label>
                <input
                  type="number"
                  id="ambientes"
                  name="ambientes"
                  className={styles.input}
                  value={formData.ambientes}
                  onChange={handleChange}
                  required
                  min="1"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="banos">
                  Cantidad de baños *
                </label>
                <input
                  type="number"
                  id="banos"
                  name="banos"
                  className={styles.input}
                  value={formData.banos}
                  onChange={handleChange}
                  required
                  min="1"
                />
              </div>

              <div className={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  id="cochera"
                  name="cochera"
                  checked={formData.cochera}
                  onChange={handleChange}
                />
                <label htmlFor="cochera" className={styles.label}>
                  ¿Tiene cochera?
                </label>
              </div>

              {formData.tipoPropiedad === 'departamento' && (
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="piso">
                    Piso (ej: 2° B, PB, etc.)
                  </label>
                  <input
                    type="text"
                    id="piso"
                    name="piso"
                    className={styles.input}
                    value={formData.piso}
                    onChange={handleChange}
                    placeholder="Ej: 3° A"
                  />
                </div>
              )}
            </>
          )}

          {/* Comentarios */}
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="comentarios">
              Comentarios adicionales
            </label>
            <textarea
              id="comentarios"
              name="comentarios"
              className={styles.textarea}
              value={formData.comentarios}
              onChange={handleChange}
            />
          </div>

          {/* Botón */}
          <button type="submit" className={styles.button}>
            Solicitar Tasación
          </button>
        </form>
      </div>
    </section>
  )
}