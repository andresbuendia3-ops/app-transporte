const express = require('express');
const app = express();
require('dotenv').config();

const mapsRoutes = require('./routes/maps.routes');

app.use(express.json());

app.use(express.static('src/public'));

app.use('/api', mapsRoutes);

app.listen(3000, () => {
  console.log('Servidor corriendo en puerto 3000');
});