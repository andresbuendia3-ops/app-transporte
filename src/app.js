const usersRoutes = require('./routes/users.routes');
const express = require('express');
const app = express();
require('dotenv').config();

const mapsRoutes = require('./routes/maps.routes');

app.use(express.json());

app.get('/', (req, res) => {
  res.redirect('/login.html');
});

app.use(express.static('src/public'));

app.use('/api', mapsRoutes);
app.use('/api', usersRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('Servidor corriendo en puerto ' + PORT);
});