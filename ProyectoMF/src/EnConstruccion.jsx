// Inportando librerias y estilos CSS
import React from 'react';
import { Construction } from 'lucide-react'; 
import styles from './css/EnConstruccion.module.css'; 

const EnConstruccion = () => {
  return (
    <div className={styles.enConstruccionContainer}>
      <div className={styles.contentCenter}>
        <Construction size={80} className={styles.iconoConstruccion} />
        <h1 className={styles.titulo}>Página en construcción</h1>
        <p className={styles.descripcion}>
          Estamos trabajando en esta sección para ofrecerte una mejor experiencia. ¡Vuelve pronto!
        </p>
      </div>

      <div className={styles.logoInferiorDerecho}>
        <img src="/imagenes/LogoAI.png" alt="Logo AI" className={styles.logoImg} />
      </div>
    </div>
  );
};

export default EnConstruccion;

