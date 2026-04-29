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
console.log("DISTANCIA RECIBIDA:", origen, destino, tipoVehiculo);
    const data = await getDistance(origen, destino, tipoVehiculo);

    const [lat, lng] = origen.split(",").map(v => parseFloat(v.trim()));

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

  if (!origen || !destino || !precio || !conductor || !vehiculo) {
    return res.status(400).json({
      error: "Datos incompletos"
    });
  }

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
        mensaje: "Viaje guardado",
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

  const id = req.params.id;

  db.run(
    `UPDATE viajes SET estado = 'aceptado' WHERE id = ?`,
    [id],
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

router.get('/estado/:id', (req, res) => {

  const id = req.params.id;

  db.get(
    `SELECT estado FROM viajes WHERE id = ?`,
    [id],
    (err, row) => {

      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      res.json(row || { estado: 'pendiente' });

    }
  );

});

router.post('/posicion/:id', (req, res) => {

  const id = req.params.id;
  const { lat, lng } = req.body;

  db.run(
    `UPDATE viajes SET lat = ?, lng = ? WHERE id = ?`,
    [lat, lng, id],
    function(err) {

      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      res.json({
        mensaje: "Posición actualizada"
      });

    }
  );

});

router.get('/viaje/:id', (req, res) => {

  const id = req.params.id;

  db.get(
    `SELECT * FROM viajes WHERE id = ?`,
    [id],
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

router.post('/oferta/:id', (req, res) => {

  const id = req.params.id;
  const { oferta } = req.body;

  db.run(
    `UPDATE viajes SET oferta = ? WHERE id = ?`,
    [oferta, id],
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
,router.post('/aceptar-oferta/:id', (req, res) => {

  const id = req.params.id;

  db.get(
    `SELECT oferta FROM viajes WHERE id = ?`,
    [id],
    (err, row) => {

      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      if (!row || !row.oferta) {
        return res.status(400).json({
          error: "No existe oferta"
        });
      }

      db.run(
        `UPDATE viajes
         SET precio = ?, estado = 'oferta aceptada'
         WHERE id = ?`,
        [row.oferta, id],
        function(err2) {

          if (err2) {
            return res.status(500).json({
              error: err2.message
            });
          }

          res.json({
            mensaje: "Oferta aceptada correctamente"
          });

        }
      );

    }
  );

}); (req, res) => {

  const id = req.params.id;

  db.get(
    `SELECT oferta FROM viajes WHERE id = ?`,
    [id],
    (err, row) => {

      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      if (!row || !row.oferta) {
        return res.status(400).json({
          error: "No existe oferta"
        });
      }

      db.run(
        `UPDATE viajes
         SET precio = ?, estado = 'oferta aceptada'
         WHERE id = ?`,
        [row.oferta, id],
        function(err2) {

          if (err2) {
            return res.status(500).json({
              error: err2.message
            });
          }

          res.json({
            mensaje: "Oferta aceptada correctamente"
          });

        }
      );

    }
  );

});
module.exports = router;