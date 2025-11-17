import { useState } from "react";
import styles from "./FormularioContacto.module.css";

export default function FormularioContacto() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Por ahora, abre el cliente de correo (como en Tasaciones)
    const subject = "Contacto desde el sitio web";
    const body = `Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`;
    window.location.href = `mailto:hernangozalez@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Resetear formulario
    setName("");
    setEmail("");
    setMessage("");
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