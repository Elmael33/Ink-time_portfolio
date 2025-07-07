const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const appointmentRoutes = require('./routes/appointments');
app.use('/api/appointments', appointmentRoutes);

app.use(express.static(path.join(__dirname, '../client')));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/calendar', require('./routes/calendar'));

