// src/components/Modal.jsx  → ESTE SÍ ES PARA EL ADMIN
import styles from './Modal.module.css'

export default function Modal({ children, onClose }) {
  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button 
          className={styles.closeButton} 
          onClick={onClose}
          style={{ 
            position: 'absolute', 
            top: '12px', 
            right: '12px', 
            width: '44px', 
            height: '44px', 
            background: '#333', 
            color: 'white', 
            border: 'none', 
            borderRadius: '50%', 
            fontSize: '28px', 
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          ×
        </button>
        <div style={{ padding: '2.5rem 2rem 2rem' }}>
          {children}
        </div>
      </div>
    </div>
  )
}