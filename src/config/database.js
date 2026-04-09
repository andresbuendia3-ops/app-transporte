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
      vehiculo TEXT
    )
  `);
});

module.exports = db;