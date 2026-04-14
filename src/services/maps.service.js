const axios = require('axios');

const getDistance = async (origin, destination, tipoVehiculo) => {

  const apiKey = "AIzaSyCziXvW69cBzTFvucaphEI8MhbtTjF5vq8";

  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

  const response = await axios.get(url);

  const data = response.data;

  if (!data.rows || data.rows.length === 0) {
    throw new Error("Google no devolvió filas");
  }

  if (!data.rows[0].elements || data.rows[0].elements.length === 0) {
    throw new Error("Google no devolvió elementos");
  }

  if (data.rows[0].elements[0].status !== "OK") {
    throw new Error("Error de Google: " + data.rows[0].elements[0].status);
  }

  const distancia_km = data.rows[0].elements[0].distance.value / 1000;
  const duracion_min = data.rows[0].elements[0].duration.value / 60;

  let costoKm = 0;

  if (tipoVehiculo === "carro") costoKm = 2200;
  if (tipoVehiculo === "moto") costoKm = 1500;
  if (tipoVehiculo === "van") costoKm = 3000;

  const hora = new Date().getHours();

  let factorHora = 1;

  if ((hora >= 6 && hora <= 9) || (hora >= 17 && hora <= 20)) {
    factorHora = 1.20;
  }

  if (hora >= 21 || hora <= 5) {
    factorHora = 1.15;
  }

  let precioBase = distancia_km * costoKm;
  let precioFinal = Math.round(precioBase * factorHora);

  if (precioFinal < 8000) {
    precioFinal = 8000;
  }

  let comision = 0;

  if (precioFinal <= 50000) {
    comision = Math.round(precioFinal * 0.15);
  } else {
    comision = 6000;
  }

  const pagoConductor = precioFinal - comision;

  return {
    distancia_km,
    duracion_min,
    precio_estimado: precioFinal,
    comision,
    pago_conductor: pagoConductor
  };

};

module.exports = { getDistance };