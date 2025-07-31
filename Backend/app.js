  const express = require('express');
  const mysql = require('mysql2');
  const cors = require('cors');
  const app = express();
  app.use(cors());
  app.use(express.json());

  //conexión a MySQL
  const db = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Andres-0712',
      database: 'app_mi_familia',
      port: 3306
  });

  db.connect(err => {
      if (err) return console.error('Error de conexión: ', err);
      console.log('Conectado a MySQL');
  });

  // === Login ===
  app.post('/login', (req, res) => {
      const { user, pass } = req.body;

      const query = 'SELECT * FROM usuario WHERE nombre = ? AND contrasena = ?';
      db.query(query, [user, pass], (err, results) => {
          if (err) {
              console.error(err);
              return res.status(500).send('Error en la base de datos');
          }

          if (results.length > 0) {
              return res.status(200).json({ mensaje: 'Login exitoso', user: results[0] });
          } else {
              return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
          }
      });
  });

  // === Crear un nuevo usuario ===
  app.post('/usuarios', (req, res) => {
      const { nombre, apellido, num_documento, telefono, email, direccion, rol, contrasena } = req.body;
      const query = 'INSERT INTO usuario (nombre, apellido, num_documento, telefono, email, direccion, rol, contrasena) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
      db.query(query, [nombre, apellido, num_documento, telefono, email, direccion, rol, contrasena], (err, result) => {
          if (err) {
              console.error(err);
              return res.status(500).send('Error al registrar el usuario');
          }
          res.status(201).json({ mensaje: 'Usuario registrado exitosamente', id: result.insertId });
      });
  });
  // === Obtener todos los usuarios ===
  app.get('/usuarios', (req, res) => {
      const query = 'SELECT * FROM usuario';
      db.query(query, (err, results) => {
          if (err) return res.status(500).send('Error al obtener los usuarios');
          res.json(results);
      });
  });
  // === Eliminar un usuario ===
  app.delete('/usuarios/:id', (req, res) => {
      const { id } = req.params;
      const query = 'DELETE FROM usuario WHERE id_usuario = ?'; 

      db.query(query, [id], (err) => {
          if (err) {
              console.error('Error en DELETE /usuarios/:id:', err); 
              return res.status(500).send('Error al eliminar el usuario');
          }
          res.json({ mensaje: 'Usuario eliminado' });
      });
  });

  // === Actualizar un usuario (incluyendo contraseña) ===
  app.put('/usuarios/:id', (req, res) => {
      const { id } = req.params;
      const { nombre, apellido, num_documento, telefono, email, direccion, rol, contrasena } = req.body;

      const query = 'UPDATE usuario SET nombre = ?, apellido = ?, num_documento = ?, telefono = ?, email = ?, direccion = ?, rol = ?, contrasena = ? WHERE id_usuario = ?'; // CAMBIO AQUÍ
      const values = [nombre, apellido, num_documento, telefono, email, direccion, rol, contrasena, id];

      db.query(query, values, (err) => {
          if (err) return res.status(500).send('Error al actualizar el usuario');
          res.json({ mensaje: 'Usuario actualizado' });
      });
  });
  // === Gestion de Articulos ===
  // === Crear un nuevo articulo ===
  app.post('/articulos', (req, res) => {
      const { nombre, descripcion, precio_unitario, stock_actual, id_proveedor, categoria, precio } = req.body;
      const query = `
          INSERT INTO articulo (nombre, descripcion, precio_unitario, stock_actual, id_proveedor, categoria, precio)
          VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [nombre, descripcion, precio_unitario, stock_actual, id_proveedor, categoria, precio];

      db.query(query, values, (err, result) => {
          if (err) {
              console.error('Error al crear el artículo:', err);
              return res.status(500).send('Error al registrar el artículo');
          }
          res.status(201).json({ mensaje: 'Artículo registrado exitosamente', id: result.insertId });
      });
  });
  // === Obtener todos los articulos ===
  app.get('/articulos', (req, res) => {
      const query = 'SELECT * FROM articulo';
      db.query(query, (err, results) => {
          if (err) return res.status(500).send('Error al obtener los artículos');
          res.json(results);
      });
  })
  // Actualizar un articulo
  app.put('/articulos/:id', (req, res) => {
      const { id } = req.params;
      const { nombre, descripcion, precio_unitario, stock_actual, id_proveedor, categoria, precio } = req.body;

      const query = `
          UPDATE articulo 
          SET nombre = ?, descripcion = ?, precio_unitario = ?, stock_actual = ?, id_proveedor = ?, categoria = ?, precio = ?
          WHERE id_articulo = ?
      `;
      const values = [nombre, descripcion, precio_unitario, stock_actual, id_proveedor, categoria, precio, id];

      db.query(query, values, (err) => {
          if (err) {
              console.error('Error al actualizar el artículo:', err);
              return res.status(500).send('Error al actualizar el artículo');
          }
          res.json({ mensaje: 'Artículo actualizado' });
      });
  });
  // === Eliminar un articulo ===
  app.delete('/articulos/:id', (req, res) => {
      const { id } = req.params;
      const query = 'DELETE FROM articulo WHERE id_articulo = ?';

      db.query(query, [id], (err) => {
          if (err) {
              console.error('Error al eliminar el artículo:', err);
              return res.status(500).send('Error al eliminar el artículo');
          }
          res.json({ mensaje: 'Artículo eliminado' });
      });
  });

  // === Crear una nueva entrada  ===
  app.post('/entradas', async (req, res) => {
      const connection = db.promise();
      const { usuario_id, articulos } = req.body;

      try {
          // Iniciar transacción
          await connection.beginTransaction();

          // Insertar la entrada principal
          const [entradaResult] = await connection.query(
              'INSERT INTO entrada (usuario_id, total) VALUES (?, 0)',
              [usuario_id]
          );
          const id_entrada = entradaResult.insertId;
          let total = 0;

          // Insertar los detalles y actualizar el stock
          for (const item of articulos) {
              const { id_articulo, cantidad, precio_unitario } = item;
              const subtotal = cantidad * precio_unitario;
              total += subtotal;

              // Insertar detalle
              await connection.query(
                  'INSERT INTO entrada_detalle (id_entrada, id_articulo, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)',
                  [id_entrada, id_articulo, cantidad, precio_unitario, subtotal]
              );

              // Actualizar stock del artículo
              await connection.query(
                  'UPDATE articulo SET stock_actual = stock_actual + ? WHERE id_articulo = ?',
                  [cantidad, id_articulo]
              );
          }

          // Actualizar el total de la entrada
          await connection.query(
              'UPDATE entrada SET total = ? WHERE id_entrada = ?',
              [total, id_entrada]
          );

          await connection.commit();
          res.status(201).json({ mensaje: 'Entrada registrada con éxito', id_entrada });
      } catch (err) {
          await connection.rollback();
          console.error('Error al registrar entrada:', err);
          res.status(500).json({ error: 'Error al registrar la entrada' });
      }
  });
  // === Registrar una salida  ===
  app.post('/salidas', async (req, res) => {
    const connection = db.promise();
    const { usuario_id, articulos } = req.body;

    try {
      if (!usuario_id || !articulos || articulos.length === 0) {
        return res.status(400).json({ error: 'Datos incompletos para registrar la salida.' });
      }

      await connection.beginTransaction();

      // Insertar salida principal
      const [salidaResult] = await connection.query(
        'INSERT INTO salida (usuario_id, total) VALUES (?, 0)',
        [usuario_id]
      );
      const id_salida = salidaResult.insertId;
      let total = 0;

      for (const item of articulos) {
        const { id_articulo, cantidad, precio_unitario } = item;
        const subtotal = cantidad * precio_unitario;
        total += subtotal;

        // Obtener stock actual
        const [stockRows] = await connection.query(
          'SELECT stock_actual FROM articulo WHERE id_articulo = ?',
          [id_articulo]
        );

        if (stockRows.length === 0) {
          throw new Error(`Artículo con ID ${id_articulo} no encontrado.`);
        }

        const stock_actual = stockRows[0].stock_actual;

        if (stock_actual < cantidad) {
          throw new Error(`Stock insuficiente para el artículo ID ${id_articulo}. Disponible: ${stock_actual}`);
        }

        // Insertar detalle
        await connection.query(
          'INSERT INTO salida_detalle (id_salida, id_articulo, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)',
          [id_salida, id_articulo, cantidad, precio_unitario, subtotal]
        );

        // Actualizar stock
        await connection.query(
          'UPDATE articulo SET stock_actual = stock_actual - ? WHERE id_articulo = ?',
          [cantidad, id_articulo]
        );
      }

      // Actualizar total
      await connection.query(
        'UPDATE salida SET total = ? WHERE id_salida = ?',
        [total, id_salida]
      );

      await connection.commit();
      res.status(201).json({ mensaje: 'Salida registrada con éxito', id_salida });
    } catch (err) {
      await connection.rollback();
      console.error('❌ Error al registrar salida:', err);
      res.status(500).json({ error: 'Error al registrar la salida', detalle: err.message });
    }
  });
  // === Proveedores - CRUD ===
  // Obtener proveedores
  app.get('/proveedores', async (req, res) => {
    try {
      const [rows] = await db.promise().query('SELECT * FROM proveedor');
      res.json(rows);
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
      res.status(500).json({ error: 'Error al obtener proveedores' });
    }
  });
  // Crear un nuevo proveedor
  app.post('/proveedores', async (req, res) => {
    const { nombre_empresa, contacto, telefono, direccion, email } = req.body;

    if (!nombre_empresa || !contacto || !telefono || !direccion || !email) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
      await db.promise().query(
        'INSERT INTO proveedor (nombre_empresa, contacto, telefono, direccion, email) VALUES (?, ?, ?, ?, ?)',
        [nombre_empresa, contacto, telefono, direccion, email]
      );
      res.status(201).json({ mensaje: 'Proveedor registrado con éxito' });
    } catch (error) {
      console.error('Error al crear proveedor:', error);
      res.status(500).json({ error: 'Error al crear proveedor' });
    }
  });
  // Actualizar un proveedor  
  app.put('/proveedores/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre_empresa, contacto, telefono, direccion, email } = req.body;

    if (!nombre_empresa || !contacto || !telefono || !direccion || !email) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
      await db.promise().query(
        'UPDATE proveedor SET nombre_empresa = ?, contacto = ?, telefono = ?, direccion = ?, email = ? WHERE id_proveedor = ?',
        [nombre_empresa, contacto, telefono, direccion, email, id]
      );
      res.json({ mensaje: 'Proveedor actualizado correctamente' });
    } catch (error) {
      console.error('Error al actualizar proveedor:', error);
      res.status(500).json({ error: 'Error al actualizar proveedor' });
    }
  });
  // Eliminar un proveedor
  app.delete('/proveedores/:id', async (req, res) => {
    const { id } = req.params;

    try {
      await db.promise().query('DELETE FROM proveedor WHERE id_proveedor = ?', [id]);
      res.json({ mensaje: 'Proveedor eliminado' });
    } catch (error) {
      console.error('Error al eliminar proveedor:', error);
      res.status(500).json({ error: 'Error al eliminar proveedor' });
    }
  });


  // === Iniciar el servidor ===
  const PORT = 3001;
  app.listen(PORT, () => {
      console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
  });
