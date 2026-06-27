const express = require('express');
const router = express.Router();

const { getDistance } = require('../services/maps.service');
const db = require('../config/database');



router.post('/distancia', async (req, res) => {

  try {

    const { origen, destino, tipoVehiculo } = req.body;

    if (!origen || !destino || !tipoVehiculo) {
      return res.status(400).json({
        error: 'Faltan datos'
      });
    }

    const data = await getDistance(
      origen,
      destino,
      tipoVehiculo
    );

    const conductor = {
      nombre: 'SIN_ASIGNAR',
      tipoVehiculo
    };

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

  const {
  origen,
  destino,
  precio,
  vehiculo,
  pasajero_id,
  lat_pasajero,
  lng_pasajero
} = req.body;

  db.get(
    `SELECT *
     FROM usuarios
     WHERE rol = 'conductor'
     LIMIT 1`,
    [],
    (err, conductor) => {

      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      if (!conductor) {
        return res.status(400).json({
          error: 'No hay conductores disponibles'
        });
      }

     db.run(
  `INSERT INTO viajes (
    origen,
    destino,
    precio,
    conductor,
    vehiculo,
    pasajero_id,
lat_pasajero,
lng_pasajero,
conductor_id,
    estado,
    fecha_aceptacion
  )
  VALUES (?, ?, ?, ?, ?, ?,?,?, NULL, 'pendiente', NULL)`,
  
  [
  origen,
  destino,
  precio,
  '',
  vehiculo,
  pasajero_id,
  lat_pasajero,
  lng_pasajero
],
        function(err) {

          if (err) {

    console.error("ERROR INSERT VIAJE:", err);

    return res.status(500).json({
        error: err.message
    });

}

          res.json({
            id: this.lastID,
            conductor_id: conductor.id,
            conductor: conductor.nombre,
            estado: 'aceptado'
          });

        }
      );

    }
  );

});



router.get('/viajes', (req, res) => {

  db.all(
    `SELECT * FROM viajes`,
    [],
    (err, rows) => {

      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      res.json(rows);

    }
  );

});




router.get('/historial/:usuarioId', (req, res) => {

  db.all(
    `SELECT * FROM viajes
     WHERE pasajero_id = ?
     ORDER BY id DESC`,
    [req.params.usuarioId],
    (err, rows) => {

      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      res.json(rows);

    }
  );

});




router.get('/historial-conductor/:conductorId', (req, res) => {

  db.all(
    `SELECT * FROM viajes
     WHERE conductor_id = ?
     ORDER BY id DESC`,
    [req.params.conductorId],
    (err, rows) => {

      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      res.json(rows);

    }
  );

});




router.post('/aceptar/:id', (req, res) => {

  const {
    conductor_id,
    conductor_nombre
  } = req.body;

  db.run(
    `UPDATE viajes
     SET estado = 'aceptado',
         conductor_id = ?,
         conductor = ?,
         fecha_aceptacion = datetime('now')
     WHERE id = ?`,
    [
      conductor_id,
      conductor_nombre,
      req.params.id
    ],
    function(err) {

      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      res.json({
        mensaje: 'Viaje aceptado'
      });

    }
  );

});




router.post('/recoger/:id', (req, res) => {

  db.run(
    `UPDATE viajes
     SET estado = 'recogido'
     WHERE id = ?`,
    [req.params.id],
    function(err) {

      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      res.json({
        mensaje: 'Pasajero recogido'
      });

    }
  );

});




router.post('/finalizar/:id', (req, res) => {

  db.run(
    `UPDATE viajes
     SET estado = 'finalizado',
         fecha_finalizacion = datetime('now')
     WHERE id = ?`,
    [req.params.id],
    function(err) {

      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      res.json({
        mensaje: 'Viaje finalizado'
      });

    }
  );

});




router.post('/oferta/:id', (req, res) => {

  const { oferta } = req.body;

  db.run(
    `UPDATE viajes
     SET oferta = ?
     WHERE id = ?`,
    [oferta, req.params.id],
    function(err) {

      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      res.json({
        mensaje: 'Oferta guardada'
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




router.post('/posicion/:id', (req, res) => {

  const { lat, lng } = req.body;

  db.run(
    `UPDATE viajes
     SET lat = ?, lng = ?
     WHERE id = ?`,
    [lat, lng, req.params.id],
    function(err) {
       console.log(
      "FILAS ACTUALIZADAS:",
      this.changes,
      "ID:",
      req.params.id
    );

      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      res.json({
        mensaje: 'Posición actualizada'
      });

    }
  );

});
router.post('/gps-conductor/:id', (req, res) => {

  console.log(
    "GPS RECIBIDO",
    req.params.id,
    req.body
  );

  const { lat, lng } = req.body;

  db.run(
    `UPDATE usuarios
     SET lat = ?, lng = ?
     WHERE id = ?`,
    [lat, lng, req.params.id],
    function(err) {

      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      res.json({
        mensaje: 'GPS conductor actualizado'
      });

    }
  );

});
router.get('/gps-conductor/:id', (req, res) => {

  db.get(
    `SELECT lat, lng
     FROM usuarios
     WHERE id = ?`,
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