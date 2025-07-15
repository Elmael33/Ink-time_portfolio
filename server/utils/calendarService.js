const { google } = require('googleapis');
const dotenv = require('dotenv');
const db = require('../config/db');
dotenv.config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

oAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

async function createEvent({ summary, description, start, end }) {
  const event = {
    summary,
    description,
    start, 
    end     
  };

  const response = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: event,
  });

  console.log('✅ Événement ajouté à Google Calendar :', response.data);
  return response.data;
}

function generateTimeSlots() {
  const slots = [];
  for (let h = 8; h < 18; h++) {
    if (h === 12) continue; // pause dej
    slots.push(`${h.toString().padStart(2, '0')}:00`);
  }
  return slots;
}

async function getAvailableSlots(date) {
  try {
    const [rows] = await db.promise().query(
      'SELECT heure FROM appointments WHERE date = ?',
      [date]
    );
    const takenSlots = rows.map(r => r.heure.slice(0, 5));
    const allSlots = generateTimeSlots();
    const available = allSlots.filter(slot => !takenSlots.includes(slot));
    return available;
  } catch (err) {
    console.error('Erreur lors du calcul des créneaux:', err);
    throw err;
  }
}

module.exports = {
  createEvent,
  getAvailableSlots,
};
