const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const appointmentRoutes = require('./routes/appointments');
app.use('/api/appointments', appointmentRoutes);

app.get('/', (req, res) => {
  res.send('InkTime backend API 🎨');
});

app.listen(port, () => {
  console.log(`Serveur lancé sur http://localhost:${port}`);
});
