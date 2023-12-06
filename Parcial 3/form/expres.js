const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3200;

// Configuración de CORS
app.use(cors());

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'inventario2',
  port: 3306,
});

// Conexión a la base de datos
connection.connect(err => {
  if (err) {
    console.error('Error de conexión a la base de datos:', err);
    return;
  }
  console.log('Conexión a la base de datos establecida');
});

// Middleware para el manejo de datos en formato JSON
app.use(express.json());

// Rutas CRUD para la tabla de usuarios

// Obtener todos los usuarios
app.get('/usuarios', (req, res) => {
  connection.promise()
    .query('SELECT * FROM usuario')
    .then(([rows]) => {
      res.json(rows);
    })
    .catch(err => {
      console.error('Error al obtener usuarios:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    });
});

// Obtener un usuario por ID
app.get('/usuarios/:id', (req, res) => {
  const userId = req.params.id;
  connection.promise()
    .query('SELECT * FROM usuario WHERE usuario_id = ?', [userId])
    .then(([rows]) => {
      if (rows.length === 0) {
        res.status(404).json({ error: 'Usuario no encontrado' });
      } else {
        res.json(rows[0]);
      }
    })
    .catch(err => {
      console.error('Error al obtener usuario por ID:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    });
});

// Crear un nuevo usuario
app.post('/usuarios', (req, res) => {
  const nuevoUsuario = req.body;
  connection.promise()
    .query('INSERT INTO usuario SET ?', [nuevoUsuario])
    .then(result => {
      const usuarioId = result[0].insertId;
      res.status(201).json({ id: usuarioId, ...nuevoUsuario });
    })
    .catch(err => {
      console.error('Error al crear nuevo usuario:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    });
});

// Actualizar un usuario por ID
app.put('/usuarios/:id', (req, res) => {
  const userId = req.params.id;
  const datosActualizados = req.body;
  connection.promise()
    .query('UPDATE usuario SET ? WHERE usuario_id = ?', [datosActualizados, userId])
    .then(result => {
      if (result[0].affectedRows === 0) {
        res.status(404).json({ error: 'Usuario no encontrado' });
      } else {
        res.json({ id: userId, ...datosActualizados });
      }
    })
    .catch(err => {
      console.error('Error al actualizar usuario por ID:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    });
});

// Eliminar un usuario por ID
app.delete('/usuarios/:id', (req, res) => {
  const userId = req.params.id;
  connection.promise()
    .query('DELETE FROM usuario WHERE usuario_id = ?', [userId])
    .then(result => {
      if (result[0].affectedRows === 0) {
        res.status(404).json({ error: 'Usuario no encontrado' });
      } else {
        res.json({ mensaje: 'Usuario eliminado con éxito' });
      }
    })
    .catch(err => {
      console.error('Error al eliminar usuario por ID:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    });
});


// Obtener un usuario por nombre de usuario
app.get('/usuarios/usuario/:nombre', (req, res) => {
  const nombreUsuario = req.params.nombre;
  connection.promise()
    .query('SELECT * FROM usuario WHERE usuario_usuario = ?', [nombreUsuario])
    .then(([rows]) => {
      if (rows.length === 0) {
        res.status(404).json({ error: 'Usuario no encontrado' });
      } else {
        res.json(rows[0]);
      }
    })
    .catch(err => {
      console.error('Error al obtener usuario por nombre de usuario:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    });
});


const bcrypt = require('bcrypt');


// Crear un nuevo usuario
app.post('/insertarUsuario', async (req, res) => {
  const nuevoUsuario = req.body;

  try {
    // Generar el hash de la contraseña
    const saltRounds = 10;
    const hashContraseña = await bcrypt.hash(nuevoUsuario.usuario_clave, saltRounds);

    // Almacenar en la base de datos
    const resultado = await connection.promise()
      .query('INSERT INTO usuario (usuario_nombre, usuario_apellido, usuario_usuario, usuario_clave, usuario_email) VALUES (?, ?, ?, ?, ?)',
        [nuevoUsuario.usuario_nombre, nuevoUsuario.usuario_apellido, nuevoUsuario.usuario_usuario, hashContraseña, nuevoUsuario.usuario_email]);

    const usuarioId = resultado[0].insertId;
    res.status(201).json({ id: usuarioId, ...nuevoUsuario });
  } catch (error) {
    console.error('Error al crear nuevo usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
