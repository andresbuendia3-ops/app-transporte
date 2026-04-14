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
      estado TEXT DEFAULT 'pendiente'
      oferta_negociada INTEGER,
      lat REAL,
      lng REAL
    )
  `);

  db.run(`ALTER TABLE viajes ADD COLUMN lat REAL`, () => {});
  db.run(`ALTER TABLE viajes ADD COLUMN lng REAL`, () => {});

  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT,
      correo TEXT UNIQUE,
      password TEXT,
      rol TEXT
    )
  `);

});

module.exports = db;