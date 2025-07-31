//Importaciones librerias y estilos
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './css/usuarios.module.css';

//Componente para gestionar usuarios
function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const obtenerUsuarios = async () => {
    try {
      const response = await axios.get('http://localhost:3001/usuarios');
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        await axios.delete(`http://localhost:3001/usuarios/${id}`);
        setMensaje('Usuario eliminado correctamente');
        obtenerUsuarios();
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
      }
    }
  };

  const handleEditar = (id) => {
    setEditandoId(id);
  };

  const handleCancelar = () => {
    setEditandoId(null);
    setMensaje('');
  };

  const handleGuardar = async (id) => {
    const usuarioEditado = usuarios.find(u => u.id_usuario === id);
    try {
      await axios.put(`http://localhost:3001/usuarios/${id}`, usuarioEditado);
      setMensaje('Usuario actualizado correctamente');
      setEditandoId(null);
      obtenerUsuarios();
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
    }
  };

  const handleInputChange = (e, id, campo) => {
    const nuevosUsuarios = usuarios.map(u => {
      if (u.id_usuario === id) {
        return { ...u, [campo]: e.target.value };
      }
      return u;
    });
    setUsuarios(nuevosUsuarios);
  };
 
  return (
    <div className={styles.gestionContainer}>
      <h2>Gestión de Usuarios</h2>
      {mensaje && <p className="mensaje">{mensaje}</p>}

      <table className="usuarios-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Documento</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Dirección</th>
            <th>Rol</th>
            <th>Contraseña</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id_usuario}>
              {editandoId === usuario.id_usuario ? (
                <>
                  <td>{usuario.id_usuario}</td>
                  <td><input value={usuario.nombre} onChange={(e) => handleInputChange(e, usuario.id_usuario, 'nombre')} /></td>
                  <td><input value={usuario.apellido} onChange={(e) => handleInputChange(e, usuario.id_usuario, 'apellido')} /></td>
                  <td><input value={usuario.num_documento} onChange={(e) => handleInputChange(e, usuario.id_usuario, 'num_documento')} /></td>
                  <td><input value={usuario.telefono} onChange={(e) => handleInputChange(e, usuario.id_usuario, 'telefono')} /></td>
                  <td><input value={usuario.email} onChange={(e) => handleInputChange(e, usuario.id_usuario, 'email')} /></td>
                  <td><input value={usuario.direccion} onChange={(e) => handleInputChange(e, usuario.id_usuario, 'direccion')} /></td>
                  <td>
                    <select value={usuario.rol} onChange={(e) => handleInputChange(e, usuario.id_usuario, 'rol')}>
                      <option value="Administrador">Administrador</option>
                      <option value="Vendedor">Vendedor</option>
                      <option value="usuario">Usuario</option>
                    </select>
                  </td>
                  <td><input type="password" value={usuario.contrasena} onChange={(e) => handleInputChange(e, usuario.id_usuario, 'contrasena')} /></td>
                  <td>
                    <button onClick={() => handleGuardar(usuario.id_usuario)}>Guardar</button>
                    <button onClick={handleCancelar}>Cancelar</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{usuario.id_usuario}</td>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.apellido}</td>
                  <td>{usuario.num_documento}</td>
                  <td>{usuario.telefono}</td>
                  <td>{usuario.email}</td>
                  <td>{usuario.direccion}</td>
                  <td>{usuario.rol}</td>
                  <td>••••••</td>
                  <td>
                    <button onClick={() => handleEditar(usuario.id_usuario)}>Editar</button>
                    <button onClick={() => handleEliminar(usuario.id_usuario)}>Eliminar</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => navigate(-1)} className="btn-regresar">⬅️ Regresar</button>
    </div>
  );
}

export default GestionUsuarios;
