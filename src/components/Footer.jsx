// src/components/Footer.jsx
import styles from './Footer.module.css';
import FormularioContacto from './FormularioContacto';
import { getPublicPath } from '../utils/publicPath';

export default function Footer() {
  return (
    <footer id="footer" className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          <div className={styles.content}>
            <h3>Zuny Fernandez Propiedades</h3>
            <p>Asesores inmobiliarios en Posadas, Misiones y alrededores.</p>

            <div className={styles.contactInfo}>
              <p><strong>Email:</strong> zunypropiedades@gmail.com</p>
              <p><strong>Teléfono:</strong> +54 376 469-8600</p>
              <p><strong>Dirección:</strong> Coronel López 2322, Posadas, Misiones</p>
            </div>

            <div className={styles.social}>
              <p>Seguinos en redes:</p>
              <div className={styles.socialLinks}>
                <a href="https://www.instagram.com/zunyfernandez/?hl=es" target="_blank" rel="noopener noreferrer">
                  <img src={getPublicPath('imagenes/redes/instagram.png')} alt="Instagram" />
                </a>
                <a href="https://www.facebook.com/zunynegociosinmobiliarios/?locale=es_LA" target="_blank" rel="noopener noreferrer">
                  <img src={getPublicPath('imagenes/redes/facebook.png')} alt="Facebook" />
                </a>
              </div>
            </div>
          </div>

          <div className={styles.form}>
            <h3>Contacto Rápido</h3>
            <FormularioContacto />
          </div>
        </div>

        <div className={styles.copyright}>
          &copy; {new Date().getFullYear()} Zuny Fernández Propiedades. Todos los derechos reservados.
        </div>
        <div className={styles.developer}>
          Desarrollado por{' '}
          <a href="https://www.paralelo.tech" target="_blank" rel="noopener noreferrer">
            <img src={getPublicPath('imagenes/logo-paralelo.png')} alt="Paralelo" className={styles.developerLogo} />
          </a>
        </div>
      </div>
    </footer>
  );
}