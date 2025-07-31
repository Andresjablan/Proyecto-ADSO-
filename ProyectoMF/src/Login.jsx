// impotacion de librerias y estilos
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './css/Login.module.css';
import logoAI from './imagenes/LogoAI.png';
import logoMF from './imagenes/LogoMF.png';


// Componente de inicio de sesión
function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/login', {
        user: username,
        pass: password
      });
      console.log('Usuario autenticado:', response.data.user);
      setError('');
      navigate('/menu');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Usuario o contraseña incorrectos');
      } else {
        setError('Error en el servidor o en la conexión');
      }
    }
  };

  return (
    <div className={styles.loginWrapper}>
      {/* Logos en las esquinas */}
      <div className={styles.logoMF}>
        <img src={logoMF} alt="Logo MF" className={styles.logoImg} />
      </div>
      <div className={styles.logoAI}>
        <img src={logoAI} alt="Logo AI" className={styles.logoImg} />
      </div>

      {/* Contenido del login */}
      <div className={styles.container}>
        <h2 className={styles.title}>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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

        {error && <p className={styles.error}>{error}</p>}

        <button
          className={`${styles.button} ${styles.registro}`}
          onClick={() => navigate('/register')}
        >
          ¿No tienes cuenta? Regístrate aquí
        </button>
      </div>
    </div>
  );
}

export default Login;
