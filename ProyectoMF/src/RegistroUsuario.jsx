//Importacion de librerias necesarias y estilos
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './css/RegistroUsuario.module.css';
import logoAI from './imagenes/LogoAI.png';
import logoMF from './imagenes/LogoMF.png';

// Componente para el registro de usuarios
function RegistroUsuario() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [num_documento, setNumDocumento] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [direccion, setDireccion] = useState('');
  const [rol, setRol] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/usuarios', {
        nombre,
        apellido,
        num_documento,
        telefono,
        email,
        direccion,
        rol,
        contrasena,
      });
      console.log(response.data);
      

      setMensaje('Usuario registrado con éxito');
      setNombre('');
      setApellido('');
      setNumDocumento('');
      setTelefono('');
      setEmail('');
      setDireccion('');
      setRol('');
      setContrasena('');
    } catch (error) {
      console.error('Error al registrar:', error);
      setMensaje('Ocurrió un error al registrar el usuario');
    }
  };

  return (
      <div className={styles.pageBackground}>
      <div className={styles.logoTopLeft}>
        <img src={logoMF} alt="Logo MF" width="100" height="100" />
      </div>
      <div className={styles.logoBottomRight}>
        <img src={logoAI} alt="Logo AI" width="100" height="100" />
      </div>

      <div className={styles.registroContainer}>
        <h2>Registro de Usuario</h2>

        <form onSubmit={handleSubmit} className={styles.formScroll}>
          <div className={styles.formGrid}>
            <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            <input type="text" placeholder="Apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} required />
            <input type="text" placeholder="Num_documento" value={num_documento} onChange={(e) => setNumDocumento(e.target.value)} required />
            <input type="text" placeholder="Telefono" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="text" placeholder="Direccion" value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
            <select value={rol} onChange={(e) => setRol(e.target.value)} required>
              <option value="">Selecciona un rol</option>
              <option value="Administrador">Administrador</option>
              <option value="Vendedor">Vendedor</option>
              <option value="usuario">Usuario</option>
            </select>
            <input type="password" placeholder="Contraseña" value={contrasena} onChange={(e) => setContrasena(e.target.value)} required />
          </div>

          <div className={styles.buttonGroup}>
            <button type="submit">Registrar</button>
            <button type="button" onClick={() => navigate('/UserList')}>Gestion Usuarios</button>
            <button type="button" onClick={() => navigate('/')}>Volver</button>
          </div>

          {mensaje && <p className={styles.mensaje}>{mensaje}</p>}
        </form>
      </div>
    </div>
  );
}

export default RegistroUsuario;