const axios = require('axios');

const getDistance = async (origin, destination, tipoVehiculo) => {
  const apiKey = "AIzaSyAGjC1Eo3ldxv1wWBMDMdzkfqUZPL3TDM0";

  const url = "https://routes.googleapis.com/directions/v2:computeRoutes";

  const [lat1, lng1] = origin.split(",").map(v => parseFloat(v.trim()));
  const [lat2, lng2] = destination.split(",").map(v => parseFloat(v.trim()));

  const body = {
    origin: {
      location: {
        latLng: {
          latitude: lat1,
          longitude: lng1
        }
      }
    },
    destination: {
      location: {
        latLng: {
          latitude: lat2,
          longitude: lng2
        }
      }
    },
    travelMode: "DRIVE",
    routingPreference: "TRAFFIC_AWARE",
    computeAlternativeRoutes: false,
    routeModifiers: {
      avoidTolls: false,
      avoidHighways: false,
      avoidFerries: false
    },
    languageCode: "es-CO",
    units: "METRIC"
  };

  const response = await axios.post(url, body, {
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "routes.distanceMeters,routes.duration"
    }
  });

  if (!response.data.routes || response.data.routes.length === 0) {
    console.log(response.data);
    throw new Error("No se encontraron rutas");
  }

  const route = response.data.routes[0];

  const distancia_km = route.distanceMeters / 1000;
const duracion_min = parseInt(route.duration.replace("s", "")) / 60;

// 🔥 CONFIGURACIÓN (puedes cambiar esto luego)
let rendimiento_km_por_litro;
let precio_gasolina_litro = 4000;

switch (tipoVehiculo) {
  case "moto":
    rendimiento_km_por_litro = 35;
    break;
  case "carro":
    rendimiento_km_por_litro = 12;
    break;
  case "van":
    rendimiento_km_por_litro = 8;
    break;
  default:
    rendimiento_km_por_litro = 12;
}

// 💰 cálculo
const litros_usados = distancia_km / rendimiento_km_por_litro;
const costo_combustible = litros_usados * precio_gasolina_litro;

// 🧠 margen de ganancia (tipo Uber)
const margen = 1.4;

const precio_estimado = Math.round(costo_combustible * margen);

return {
  distancia_km,
  duracion_min,
  precio_estimado
};
};

module.exports = { getDistance };