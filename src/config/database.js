const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./viajes.db');

db.serialize(() => {

  db.run(`
    CREATE TABLE IF NOT EXISTS viajes (
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

  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT,
      correo TEXT UNIQUE,
      password TEXT,
      rol TEXT
    )
  `);

  db.run(`ALTER TABLE viajes ADD COLUMN oferta INTEGER`, () => {});
  db.run(`ALTER TABLE viajes ADD COLUMN lat REAL`, () => {});
  db.run(`ALTER TABLE viajes ADD COLUMN lng REAL`, () => {});

});

module.exports = db;