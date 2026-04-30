const express = require('express');
const router = express.Router();

const { getDistance } = require('../services/maps.service');
const { encontrarConductor } = require('../services/conductores.service');
const db = require('../config/database');

router.post('/distancia', async (req, res) => {
  try {

    const { origen, destino, tipoVehiculo } = req.body;

    if (!origen || !destino || !tipoVehiculo) {
      return res.status(400).json({
        error: "Faltan datos"
      });
    }

    const data = await getDistance(origen, destino, tipoVehiculo);

    const [lat, lng] = origen.split(',').map(v => parseFloat(v.trim()));

    const conductor = encontrarConductor(lat, lng, tipoVehiculo);

    res.json({
      ...data,
      conductor
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
});

router.post('/viajes', (req, res) => {

  const { origen, destino, precio, conductor, vehiculo } = req.body;

  db.run(
    `INSERT INTO viajes (origen, destino, precio, conductor, vehiculo)
     VALUES (?, ?, ?, ?, ?)`,
    [origen, destino, precio, conductor, vehiculo],
    function(err) {

      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      res.json({
        id: this.lastID
      });

    }
  );

});

router.get('/viajes', (req, res) => {

  db.all(`SELECT * FROM viajes`, [], (err, rows) => {

    if (err) {
      return res.status(500).json({
        error: err.message
      });
    }

    res.json(rows);

  });

});

router.post('/aceptar/:id', (req, res) => {

  db.run(
    `UPDATE viajes SET estado = 'aceptado' WHERE id = ?`,
    [req.params.id],
    function(err) {

      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      res.json({
        mensaje: "Viaje aceptado"
      });

    }
  );

});

router.post('/oferta/:id', (req, res) => {

  const { oferta } = req.body;

  db.run(
    `UPDATE viajes SET oferta = ? WHERE id = ?`,
    [oferta, req.params.id],
    function(err) {

      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      res.json({
        mensaje: "Oferta guardada"
      });

    }
  );

});

router.get('/viaje/:id', (req, res) => {

  db.get(
    `SELECT * FROM viajes WHERE id = ?`,
    [req.params.id],
    (err, row) => {

      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      res.json(row);

    }
  );

});

module.exports = router;