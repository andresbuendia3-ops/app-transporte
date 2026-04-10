const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.post('/registro', (req, res) => {

  const { nombre, correo, password, rol } = req.body;

  db.run(
    `INSERT INTO usuarios (nombre, correo, password, rol)
     VALUES (?, ?, ?, ?)`,
    [nombre, correo, password, rol],
    function(err) {

      if (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
      }

      res.json({
        mensaje: "Usuario registrado",
        id: this.lastID
      });

    }
  );

});

router.post('/login', (req, res) => {

  const { correo, password } = req.body;

  console.log("LOGIN:", correo, password);

  db.get(
    `SELECT * FROM usuarios WHERE correo = ? AND password = ?`,
    [correo, password],
    (err, row) => {

      if (err) {
        console.log("SQL ERROR:", err);
        return res.status(500).json({ error: err.message });
      }

      if (!row) {
        return res.status(401).json({
          error: "Usuario no encontrado"
        });
      }

      res.json({
        mensaje: "Login correcto",
        usuario: row
      });

    }
  );

});

router.get('/usuarios', (req, res) => {

  db.all(`SELECT * FROM usuarios`, [], (err, rows) => {

    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(rows);

  });

});

module.exports = router;