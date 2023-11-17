const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000; 

// Configuración de CORS
app.use(cors());

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Nombre de usuario predeterminado
  password: '', // Sin contraseña
  database: 'inventario2',
  port: 3306, // Puerto de MySQL
});

// Ruta para obtener datos de la base de datos
app.get('/datos', (req, res) => {
  // Realiza la consulta a la base de datos
  connection.query('SELECT * FROM usuario', (error, results, fields) => {
    if (error) {
      res.status(500).json({ error: 'Error al obtener datos de la base de datos' });
      return;
    }

    // Envia los resultados como respuesta
    res.json(results);
  });
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
