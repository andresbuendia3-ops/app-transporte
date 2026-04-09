const conductores = require('../data/conductores');

const calcularDistancia = (lat1, lng1, lat2, lng2) => {
  return Math.sqrt(
    Math.pow(lat2 - lat1, 2) + Math.pow(lng2 - lng1, 2)
  );
};

const encontrarConductor = (lat, lng, tipoVehiculo) => {
  let mejor = null;
  let menorDistancia = Infinity;

  conductores.forEach(c => {
    if (c.disponible && c.tipoVehiculo === tipoVehiculo) {
      const dist = calcularDistancia(lat, lng, c.lat, c.lng);

      if (dist < menorDistancia) {
        menorDistancia = dist;
        mejor = c;
      }
    }
  });

  if (mejor) {
  mejor.disponible = false;
}

return mejor;
};

module.exports = { encontrarConductor };