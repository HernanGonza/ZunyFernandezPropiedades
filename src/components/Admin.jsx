import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import FormularioPropiedad from './FormularioPropiedad';
import Modal from './Modal';
import styles from './Admin.module.css';
import { toast } from 'sonner';

export default function Admin() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLogin, setShowLogin] = useState(false);

  // Estados para la navegación
  const [view, setView] = useState('menu'); // 'menu', 'nueva', 'editar', 'borrar'
  const [propiedades, setPropiedades] = useState([]);
  const [selectedProp, setSelectedProp] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);

  // Verificar si hay usuario al cargar
  useEffect(() => {
    async function checkUser() {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
        setShowLogin(false);
      } else {
        setShowLogin(true);
      }
      setLoading(false);
    }
    checkUser();
  }, []);

  // Cargar propiedades cuando entres a editar o borrar
  useEffect(() => {
    if (view === 'editar' || view === 'borrar') {
      async function cargar() {
        const { data } = await supabase.from('propiedades').select('*');
        setPropiedades(data || []);
      }
      cargar();
    }
  }, [view]);

  // Manejar login
  const handleLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast.error('❌ ' + error.message);
      return;
    }

    setUser(data.user);
    setShowLogin(false);
    setView('menu');
  };

  // Cerrar sesión
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setShowLogin(true);
    setView('menu');
    setEmail('');
    setPassword('');
  };

  // Seleccionar propiedad para editar o borrar
  const handleSelectPropiedad = async (prop) => {
    if (view === 'editar') {
      setSelectedProp(prop);
      setShowFormModal(true);
    } else if (view === 'borrar') {
      if (window.confirm(`¿Eliminar "${prop.titulo}"?`)) {
        const { error } = await supabase
          .from('propiedades')
          .delete()
          .eq('id', prop.id);

        if (error) {
          toast.error('❌ ' + error.message);
          return;
        }

        // Recargar propiedades después de borrar
        const { data } = await supabase.from('propiedades').select('*');
        setPropiedades(data || []);
        toast.success('✅ Propiedad eliminada');
      }
    }
  };

  // Función para manejar éxito del formulario (recargar propiedades si necesario)
  const handleFormSuccess = async () => {
    setShowFormModal(false);
    setSelectedProp(null);
    if (view === 'editar' || view === 'borrar') {
      const { data } = await supabase.from('propiedades').select('*');
      setPropiedades(data || []);
    }
    setView('menu');
  };

  if (loading) {
    return <div className={styles.loading}>Cargando...</div>;
  }

  // Pantalla de login
  if (showLogin && !user) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginForm}>
          <h2 className={styles.loginTitle}>Acceso Administrador</h2>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
            />
            <button type="submit" className={styles.button}>
              Iniciar sesión
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Panel principal
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Panel de Administración</h1>
        <p className={styles.email}>
          Logueado como: <strong>{user?.email}</strong>
        </p>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Cerrar sesión
        </button>

        {/* Menú principal */}
        {view === 'menu' && (
          <div className={styles.menu}>
            <button
              onClick={() => {
                setSelectedProp(null);
                setShowFormModal(true);
              }}
              className={styles.menuButton}
            >
              ➕ Nueva Propiedad
            </button>
            <button onClick={() => setView('editar')} className={styles.menuButton}>
              ✏️ Editar Propiedad
            </button>
            <button onClick={() => setView('borrar')} className={styles.menuButton}>
              ❌ Borrar Propiedad
            </button>
          </div>
        )}

        {/* Listado para Editar/Borrar */}
        {(view === 'editar' || view === 'borrar') && (
          <div>
            <button onClick={() => setView('menu')} className={styles.backButton}>
              ← Volver al menú
            </button>
            <h3 className={styles.listTitle}>
              {view === 'editar' ? 'Editar Propiedad' : 'Borrar Propiedad'}
            </h3>
            <div className={styles.propList}>
              {propiedades.length === 0 ? (
                <p>No hay propiedades cargadas.</p>
              ) : (
                propiedades.map((prop) => (
                  <div
                    key={prop.id}
                    className={styles.propItem}
                    onClick={() => handleSelectPropiedad(prop)}
                  >
                    <img
                      src={prop.imagenes?.[0] || 'https://via.placeholder.com/80'}
                      alt={prop.titulo}
                      className={styles.propImage}
                    />
                    <div>
                      <strong>{prop.titulo}</strong>
                      <p>
                        {prop.precio} {prop.moneda} • {prop.tipo}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Modal del formulario */}
        {showFormModal && (
          <Modal onClose={() => setShowFormModal(false)}>
            <FormularioPropiedad
              propiedad={selectedProp}
              onSuccess={handleFormSuccess}
            />
          </Modal>
        )}
      </div>
    </div>
  );
}