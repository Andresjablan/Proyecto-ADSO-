// Inportando el componente SidebarInv y los estilos CSS
import React from 'react';
import SidebarInv from './componentes/InventarioSidebar';
import styles from './css/Inventario.module.css';

// Componente principal de Inventario 
function Inventario() {
  return (
    <div className={styles.inventario}>
      <SidebarInv />

      {/* Logo inferior derecho */}
      <div className={styles.logoBottomRight}>
        <img src="/imagenes/LogoAI.png" alt="Logo AI" className={styles.logoImg} />
      </div>
    </div>
  );
}

export default Inventario;

