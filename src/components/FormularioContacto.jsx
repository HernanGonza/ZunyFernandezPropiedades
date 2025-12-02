import { useState } from "react";
import styles from "./FormularioContacto.module.css";

export default function FormularioContacto() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Usa las variables de estado correctas
    const payload = {
      name: name,
      email: email,
      message: message,
      type: 'contacto'
    };

    try {
      const res = await fetch('https://iahqqebglgzfjskzidrs.supabase.co/functions/v1/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        alert('✅ ¡Mensaje enviado!');
        // Opcional: resetear el formulario
        setName("");
        setEmail("");
        setMessage("");
      } else {
        throw new Error(data.error || 'Error al enviar');
      }
    } catch (err) {
      console.error(err); // ← para ver el error real en consola
      alert('❌ Error: ' + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formulario}>
      <div className={styles.formGroup}>
        <input
          type="text"
          placeholder="Nombre *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <input
          type="email"
          placeholder="Email *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <textarea
          placeholder="Mensaje *"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          className={styles.textarea}
        />
      </div>

      <button type="submit" className={styles.button}>
        Enviar Mensaje
      </button>
    </form>
  );
}