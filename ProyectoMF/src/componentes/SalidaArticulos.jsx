import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './css/SalidaArticulos.module.css';

function SalidaArticulos() {
  const [articulos, setArticulos] = useState([]);
  const [salida, setSalida] = useState({
    id_articulo: '',
    nombre: '',
    precio_unitario: '',
    stock_actual: '',
    cantidad_salida: '',
    precio_total_salida: ''
  });
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    obtenerArticulos();
  }, []);

  const obtenerArticulos = async () => {
    try {
      const response = await axios.get('http://localhost:3001/articulos');
      setArticulos(response.data);
    } catch (error) {
      console.error('Error al obtener artículos:', error);
    }
  };

  const handleSeleccionArticulo = (e) => {
    const id = e.target.value;
    const articulo = articulos.find(a => a.id_articulo === parseInt(id));
    if (articulo) {
      setSalida({
        id_articulo: articulo.id_articulo,
        nombre: articulo.nombre,
        precio_unitario: articulo.precio_unitario,
        stock_actual: articulo.stock_actual,
        cantidad_salida: '',
        precio_total_salida: ''
      });
      setMensaje('');
    }
  };

  const handleCantidadChange = (e) => {
    const cantidad = parseInt(e.target.value) || 0;
    const precio_total = cantidad * parseFloat(salida.precio_unitario || 0);

    setSalida({
      ...salida,
      cantidad_salida: cantidad,
      precio_total_salida: precio_total.toFixed(2)
    });

    if (cantidad > parseInt(salida.stock_actual)) {
      setMensaje('La cantidad excede el stock disponible.');
    } else {
      setMensaje('');
    }
  };

  const handleRegistrarSalida = async () => {
    const { id_articulo, cantidad_salida, precio_unitario, stock_actual } = salida;

    if (!id_articulo || cantidad_salida <= 0) {
      setMensaje('Selecciona un artículo e ingresa una cantidad válida.');
      return;
    }

    if (cantidad_salida > stock_actual) {
      setMensaje('No hay suficiente stock disponible.');
      return;
    }

    try {
      await axios.post('http://localhost:3001/salidas', {
        usuario_id: 1, 
        articulos: [
          {
            id_articulo: id_articulo,
            cantidad: cantidad_salida,
            precio_unitario: parseFloat(precio_unitario)
          }
        ]
      });

      const nuevoStock = parseInt(stock_actual) - parseInt(cantidad_salida);

      setMensaje(`Salida registrada. Nuevo stock: ${nuevoStock}`);
      setSalida({
        id_articulo: '',
        nombre: '',
        precio_unitario: '',
        stock_actual: '',
        cantidad_salida: '',
        precio_total_salida: ''
      });
      obtenerArticulos();
    } catch (error) {
      console.error('Error al registrar la salida:', error);
      setMensaje('Error al registrar la salida.');
    }
  };

  return (
    <div className={styles.salidaContainer}>
      <h2>Salida de Artículos</h2>
      {mensaje && <p className="mensaje">{mensaje}</p>}

      <div className={styles.formularioEntrada}>
        <label>Seleccionar artículo</label>
        <select value={salida.id_articulo} onChange={handleSeleccionArticulo}>
          <option value="">-- Selecciona un artículo --</option>
          {articulos.map((a) => (
            <option key={a.id_articulo} value={a.id_articulo}>
              {a.id_articulo} - {a.nombre}
            </option>
          ))}
        </select>

        {salida.id_articulo && (
          <>
            <p><strong>Nombre:</strong> {salida.nombre}</p>
            <p><strong>Precio unitario:</strong> ${salida.precio_unitario}</p>
            <p><strong>Stock disponible:</strong> {salida.stock_actual}</p>

            <label>Cantidad</label>
            <input
              type="number"
              min="1"
              value={salida.cantidad_salida}
              onChange={handleCantidadChange}
            />

            <p><strong>Total a retirar:</strong> ${salida.precio_total_salida}</p>

            <button onClick={handleRegistrarSalida}>Registrar Salida</button>
          </>
        )}
      </div>

      <button className={styles.btnRegresar} onClick={() => navigate(-1)}>⬅️ Regresar</button>
    </div>
  );
}

export default SalidaArticulos;
