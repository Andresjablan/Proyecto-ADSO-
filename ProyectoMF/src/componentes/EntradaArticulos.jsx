import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './css/EntradaArticulos.module.css';

function EntradaArticulos() {
  const [articulos, setArticulos] = useState([]);
  const [entrada, setEntrada] = useState({
    id_articulo: '',
    nombre: '',
    precio_unitario: '',
    cantidad_entrada: '',
    precio_total_entrada: ''
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
      setEntrada({
        id_articulo: articulo.id_articulo,
        nombre: articulo.nombre,
        precio_unitario: articulo.precio_unitario,
        cantidad_entrada: '',
        precio_total_entrada: ''
      });
      setMensaje('');
    }
  };

  const handleCantidadChange = (e) => {
    const cantidad = parseInt(e.target.value) || 0;
    const precio_total = cantidad * parseFloat(entrada.precio_unitario || 0);
    setEntrada({
      ...entrada,
      cantidad_entrada: cantidad,
      precio_total_entrada: precio_total.toFixed(2)
    });
  };

  const handleRegistrarEntrada = async () => {
    const { id_articulo, cantidad_entrada } = entrada;
    if (!id_articulo || !cantidad_entrada || cantidad_entrada <= 0) {
      setMensaje('Selecciona un artículo e ingresa una cantidad válida.');
      return;
    }

    try {
      const articulo = articulos.find(a => a.id_articulo === id_articulo);
      const nuevoStock = parseInt(articulo.stock_actual) + parseInt(cantidad_entrada);

      await axios.put(`http://localhost:3001/articulos/${id_articulo}`, {
        ...articulo,
        stock_actual: nuevoStock
      });

      setMensaje(`Entrada registrada. Nuevo stock: ${nuevoStock}`);
      setEntrada({
        id_articulo: '',
        nombre: '',
        precio_unitario: '',
        cantidad_entrada: '',
        precio_total_entrada: ''
      });
      obtenerArticulos();
    } catch (error) {
      console.error('Error al registrar entrada:', error);
      setMensaje('Error al registrar la entrada.');
    }
  };

  return (
    <div className={styles.entradaContainer}>
      <h2>Entrada de Artículos</h2>
      {mensaje && <p className="mensaje">{mensaje}</p>}

      <div className={styles.formularioEntrada}>
        <label>Seleccionar artículo</label>
        <select value={entrada.id_articulo} onChange={handleSeleccionArticulo}>
          <option value="">-- Selecciona un artículo --</option>
          {articulos.map((a) => (
            <option key={a.id_articulo} value={a.id_articulo}>
              {a.id_articulo} - {a.nombre}
            </option>
          ))}
        </select>

        {entrada.id_articulo && (
          <>
            <p><strong>Nombre:</strong> {entrada.nombre}</p>
            <p><strong>Precio unitario:</strong> ${entrada.precio_unitario}</p>

            <label>Cantidad</label>
            <input
              type="number"
              min="1"
              value={entrada.cantidad_entrada}
              onChange={handleCantidadChange}
            />

            <p><strong>Total a ingresar:</strong> ${entrada.precio_total_entrada}</p>

            <button onClick={handleRegistrarEntrada}>Registrar Entrada</button>
          </>
        )}
      </div>

      <button className={styles.btnRegresar} onClick={() => navigate(-1)}>⬅️ Regresar</button>
    </div>
  );
}

export default EntradaArticulos;
