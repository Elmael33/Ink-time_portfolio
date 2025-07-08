const cors = require('cors');
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// ⚠️ CORS bien configuré
app.use(cors({
  origin: 'http://localhost:8080', // ✅ autorise ton front
  credentials: true, // facultatif si tu utilises des cookies
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes API
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/calendar', require('./routes/calendar'));

// Dossier public
app.use(express.static(path.join(__dirname, '../client')));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});