import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './css/sidebar.module.css'; 

const Sidebar = () => {
  const navigate = useNavigate();

  const handleNavigation = (view) => {
    navigate(`/${view}`);
  };

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.logo}>Inicio</h2>
      <nav>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <a onClick={() => handleNavigation('facturacion')} className={styles.menuButton}>
              <img src="/imagenes/compra.png" alt="Facturación" className={styles.menuIcon} />
              <span>Facturación</span>
            </a>
          </li>
          <li className={styles.navItem}>
            <a onClick={() => handleNavigation('compras')} className={styles.menuButton}>
              <img src="/imagenes/factu.png" alt="Compras" className={styles.menuIcon} />
              <span>Compras</span>
            </a>
          </li>
          <li className={styles.navItem}>
            <a onClick={() => handleNavigation('inventario')} className={styles.menuButton}>
              <img src="/imagenes/invent.png" alt="Inventario" className={styles.menuIcon} />
              <span>Inventario</span>
            </a>
          </li>
          <li className={styles.navItem}>
            <a onClick={() => handleNavigation('configuracion')} className={styles.menuButton}>
              <img src="/imagenes/config.png" alt="Configuración" className={styles.menuIcon} />
              <span>Configuración</span>
            </a>
          </li>
          <li className={styles.navItem}>
            <a onClick={() => navigate('/')} className={styles.menuButton}>
              <img src="/imagenes/salida.png" alt="Salir" className={styles.menuIcon} />
              <span>Salir</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
