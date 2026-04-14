const axios = require('axios');

const getDistance = async (origin, destination, tipoVehiculo) => {

  const apiKey = "AIzaSyCziXvW69cBzTFvucaphEI8MhbtTjF5vq8";

  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

  try {

    const response = await axios.get(url);
    const data = response.data;

    console.log("GOOGLE RESPONSE:", data);

    if (!data.rows || data.rows.length === 0) {
      throw new Error("Google no devolvió filas");
    }

    if (!data.rows[0].elements || data.rows[0].elements.length === 0) {
      throw new Error("Google no devolvió elementos");
    }

    if (data.rows[0].elements[0].status !== "OK") {
      throw new Error("Google error: " + data.rows[0].elements[0].status);
    }

    const distancia_km = data.rows[0].elements[0].distance.value / 1000;
    const duracion_min = data.rows[0].elements[0].duration.value / 60;

    let costoKm = 0;

    if (tipoVehiculo === "carro") costoKm = 450;
    if (tipoVehiculo === "moto") costoKm = 300;
    if (tipoVehiculo === "van") costoKm = 650;

    const hora = new Date().getHours();

    let factorHora = 1;

    if ((hora >= 6 && hora <= 9) || (hora >= 17 && hora <= 20)) {
      factorHora = 1.25;
    }

    const precioBase = distancia_km * costoKm;
    const precioFinal = Math.round(precioBase * factorHora);

    return {
      distancia_km,
      duracion_min,
      precio_estimado: precioFinal
    };

  } catch (error) {

    console.log("ERROR DISTANCIA:", error.message);
    throw error;

  }

};

module.exports = { getDistance };