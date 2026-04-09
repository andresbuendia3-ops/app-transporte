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
        error: "Faltan datos: origen, destino o tipoVehiculo"
      });
    }

    const data = await getDistance(origen, destino, tipoVehiculo);

    const [lat, lng] = origen.split(",").map(v => parseFloat(v.trim()));

    const conductor = encontrarConductor(lat, lng, tipoVehiculo);

    db.run(
      `INSERT INTO viajes (origen, destino, precio, conductor, vehiculo)
       VALUES (?, ?, ?, ?, ?)`,
      [
        origen,
        destino,
        data.precio_estimado,
        conductor.nombre,
        tipoVehiculo
      ]
    );

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
router.get('/viajes', (req, res) => {

  db.all(`SELECT * FROM viajes ORDER BY id DESC`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(rows);
  });

});
module.exports = router;