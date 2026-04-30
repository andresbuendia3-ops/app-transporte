const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./viajes.db');

db.serialize(() => {

  db.run(`DROP TABLE IF EXISTS viajes`);

  db.run(`
    CREATE TABLE viajes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      origen TEXT,
      destino TEXT,
      precio INTEGER,
      conductor TEXT,
      vehiculo TEXT,
      estado TEXT DEFAULT 'pendiente',
      lat REAL,
      lng REAL,
      oferta INTEGER
    )
  `);

});

module.exports = db;