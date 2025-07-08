const { createEvent } = require('../utils/calendarService');
const Appointment = require('../models/appointmentModel');
const { sendConfirmationEmail } = require('../utils/sendEmail');

exports.createAppointment = async (req, res) => {
  console.log('📥 Données reçues :', req.body);
  const { nom, email, date, heure, message } = req.body;

  if (!nom || !email || !date || !heure || !message) {
    return res.status(400).json({ error: 'Tous les champs sont requis.' });
  }

  try {
    // Enregistrement DB
    const result = await new Promise((resolve, reject) => {
      Appointment.create({ nom, email, date, heure, message }, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    // Envoi email
    await sendConfirmationEmail(email, { date, heure, message });

    // Création Google Calendar
    const start = `${date}T${heure}:00`;
    const endHour = parseInt(heure.split(':')[0]) + 1;
    const end = `${date}T${endHour.toString().padStart(2, '0')}:${heure.split(':')[1]}:00`;

    await createEvent({
      summary: `RDV Tattoo avec ${nom}`,
      message,
      start,
      end
    });

    res.status(201).json({
      message: 'Rendez-vous enregistré.',
      id: result.insertId,
      data: { nom, email, date, heure, message }
    });

  } catch (err) {
  console.error('Erreur complète Google Calendar :', err); // log complet
  res.status(500).json({ error: 'Erreur serveur (RDV)' });
  }
};

exports.getAppointments = (req, res) => {
  const Appointment = require('../models/appointmentModel');

  Appointment.getAllAppointments((err, results) => {
    if (err) {
      console.error('Erreur récupération des RDV :', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    res.status(200).json(results);
  });
};

exports.reserveAppointment = async (req, res) => {
  const { date, time, message } = req.body;

  const start = new Date(`${date}T${time}:00`);
  const end = new Date(start.getTime() + 30 * 60000); // +30min

  try {
    const event = await createEvent({
      summary: 'Rendez-vous Ink-Time',
      message,
      start,
      end,
    });

    res.status(200).json({ message: 'Réservation confirmée', eventLink: event.htmlLink });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du rendez-vous' });
  }
};
