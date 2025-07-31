import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './css/GestionProveedores.module.css';
import { useNavigate } from 'react-router-dom';

function GestionProveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [formulario, setFormulario] = useState({
    nombre_empresa: '',
    contacto: '',
    telefono: '',
    direccion: '',
    email: ''
  });
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    obtenerProveedores();
  }, []);

  const obtenerProveedores = async () => {
    try {
      const res = await axios.get('http://localhost:3001/proveedores');
      setProveedores(res.data);
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleGuardar = async () => {
    const { nombre_empresa, contacto, telefono, direccion, email } = formulario;

    if (!nombre_empresa || !contacto || !telefono || !direccion || !email) {
      setMensaje('Todos los campos son obligatorios.');
      return;
    }

    try {
      if (editandoId) {
        await axios.put(`http://localhost:3001/proveedores/${editandoId}`, formulario);
        setMensaje('Proveedor actualizado con éxito.');
      } else {
        await axios.post('http://localhost:3001/proveedores', formulario);
        setMensaje('Proveedor registrado con éxito.');
      }
      setFormulario({
        nombre_empresa: '',
        contacto: '',
        telefono: '',
        direccion: '',
        email: ''
      });
      setEditandoId(null);
      obtenerProveedores();
    } catch (error) {
      console.error('Error al guardar proveedor:', error);
    }
  };

  const handleEditar = (proveedor) => {
    setFormulario(proveedor);
    setEditandoId(proveedor.id_proveedor);
    setMensaje('');
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Deseas eliminar este proveedor?')) {
      try {
        await axios.delete(`http://localhost:3001/proveedores/${id}`);
        setMensaje('Proveedor eliminado.');
        obtenerProveedores();
      } catch (error) {
        console.error('Error al eliminar proveedor:', error);
      }
    }
  };

  const handleCancelar = () => {
    setFormulario({
      nombre_empresa: '',
      contacto: '',
      telefono: '',
      direccion: '',
      email: ''
    });
    setEditandoId(null);
    setMensaje('');
  };

  return (
    <div className={styles.container}>
      <h2>Gestión de Proveedores</h2>
      {mensaje && <p className={styles.mensaje}>{mensaje}</p>}

      <div className={styles.formulario}>
        <input name="nombre_empresa" placeholder="Nombre empresa" value={formulario.nombre_empresa} onChange={handleInputChange} />
        <input name="contacto" placeholder="Contacto" value={formulario.contacto} onChange={handleInputChange} />
        <input name="telefono" placeholder="Teléfono" value={formulario.telefono} onChange={handleInputChange} />
        <input name="direccion" placeholder="Dirección" value={formulario.direccion} onChange={handleInputChange} />
        <input name="email" placeholder="Email" value={formulario.email} onChange={handleInputChange} />
        <div className={styles.botones}>
          <button onClick={handleGuardar}>{editandoId ? 'Actualizar' : 'Registrar'}</button>
          {editandoId && <button onClick={handleCancelar}>Cancelar</button>}
        </div>
      </div>

      <table className={styles.tabla}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Empresa</th>
            <th>Contacto</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {proveedores.map((p) => (
            <tr key={p.id_proveedor}>
              <td>{p.id_proveedor}</td>
              <td>{p.nombre_empresa}</td>
              <td>{p.contacto}</td>
              <td>{p.telefono}</td>
              <td>{p.direccion}</td>
              <td>{p.email}</td>
              <td>
                <button onClick={() => handleEditar(p)}>Editar</button>
                <button onClick={() => handleEliminar(p.id_proveedor)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className={styles.btnRegresar} onClick={() => navigate(-1)}>⬅️ Regresar</button>
    </div>
  );
}

export default GestionProveedores;
