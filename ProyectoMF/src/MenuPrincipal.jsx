//Iportacion de librerias y estilos
import React from 'react';
import Sidebar from './componentes/sidebarMenu';
import styles from './css/MenuPrincipal.module.css';

// Componente principal del menú
function MenuPrincipal() {
  return (
    <div className={styles.menuPrincipal}>
      <Sidebar />

      {/* Logo arriba izquierda */}
      <div className={styles.logoTopLeft}>
        <img src="/imagenes/LogoMF.png" alt="Logo MF" className={styles.logoImg} />
      </div>

      {/* Logo abajo derecha */}
      <div className={styles.logoBottomRight}>
        <img src="/imagenes/LogoAI.png" alt="Logo AI" className={styles.logoImg} />
      </div>
    </div>
  );
}

export default MenuPrincipal;



