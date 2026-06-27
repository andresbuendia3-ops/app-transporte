const sqlite3 = require('sqlite3').verbose();

const path = require('path');
const db = new sqlite3.Database(
  path.join(__dirname, '../../viajes.db')
);
console.log(
  path.join(__dirname, '../../viajes.db')
);

db.serialize(() => {

 db.run("ALTER TABLE viajes ADD COLUMN lat_pasajero REAL", () => {});
db.run("ALTER TABLE viajes ADD COLUMN lng_pasajero REAL", () => {});

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

  db.run(`ALTER TABLE viajes ADD COLUMN pasajero_id INTEGER`, () => {});
db.run(`ALTER TABLE viajes ADD COLUMN conductor_id INTEGER`, () => {});
db.run(`ALTER TABLE viajes ADD COLUMN fecha_creacion TEXT`, () => {});
db.run(`ALTER TABLE viajes ADD COLUMN fecha_aceptacion TEXT`, () => {});
db.run(`ALTER TABLE viajes ADD COLUMN fecha_finalizacion TEXT`, () => {});
db.run(`ALTER TABLE usuarios ADD COLUMN lat REAL`, () => {});
db.run(`ALTER TABLE usuarios ADD COLUMN lng REAL`, () => {});
});

module.exports = db;