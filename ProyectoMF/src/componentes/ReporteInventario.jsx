import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './css/ReporteInventario.module.css';
import { useNavigate } from 'react-router-dom';

function ReporteInventario() {
  const [articulos, setArticulos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    obtenerArticulos();
  }, []);

  const obtenerArticulos = async () => {
    try {
      const response = await axios.get('http://localhost:3001/articulos');
      setArticulos(response.data);
    } catch (error) {
      console.error('Error al obtener los artículos:', error);
    }
  };

  return (
    <div className={styles.reporteContainer}>
      <h2>Reporte de Inventario de Artículos</h2>
      <table className={styles.reporteTabla}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Categoría</th>
            <th>Precio Unitario</th>
            <th>Stock Actual</th>
            <th>Valor Total</th>
          </tr>
        </thead>
        <tbody>
          {articulos.map((articulo) => (
            <tr key={articulo.id_articulo}>
              <td>{articulo.id_articulo}</td>
              <td>{articulo.nombre}</td>
              <td>{articulo.descripcion}</td>
              <td>{articulo.categoria}</td>
              <td>${parseFloat(articulo.precio_unitario).toFixed(2)}</td>
              <td>{articulo.stock_actual}</td>
              <td>
                ${(
                  parseFloat(articulo.precio_unitario) * parseInt(articulo.stock_actual)
                ).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className={styles.btnRegresar} onClick={() => navigate(-1)}>
        ⬅️ Regresar
      </button>
    </div>
  );
}

export default ReporteInventario;
