const conductores = [];

const tipos = ["carro", "moto", "van"];

for (let i = 1; i <= 1000; i++) {
  conductores.push({
    id: i,
    nombre: `Conductor_${i}`,
    lat: 4.5 + Math.random() * 0.8,
    lng: -74.3 + Math.random() * 0.5,
    tipoVehiculo: tipos[Math.floor(Math.random() * tipos.length)],
    disponible: true
  });
}

module.exports = conductores;