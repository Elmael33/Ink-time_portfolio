const Appointment = require('../models/appointmentModel');
const { createEvent } = require('../utils/calendarService');
const { sendConfirmationEmail } = require('../utils/sendEmail');

exports.createAppointment = async (req, res) => {
  const { nom, email, date, heure, description } = req.body;

  if (!nom || !email || !date || !heure || !description) {
    return res.status(400).json({ error: 'Tous les champs sont requis.' });
  }

  Appointment.create({ nom, email, date, heure, description }, async (err, result) => {
    if (err) {
      console.error('Erreur création DB :', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    try {
      // 1. Envoi Email
      await sendConfirmationEmail(email, { date, heure, description });
      console.log('Email envoyé');

      // 2. Ajout Google Calendar
      const start = `${date}T${heure}:00`;
      const endHour = parseInt(heure.split(':')[0]) + 1;
      const end = `${date}T${endHour.toString().padStart(2, '0')}:${heure.split(':')[1]}:00`;

      await createEvent({
        summary: `RDV Tattoo avec ${nom}`,
        description,
        start,
        end
      });
      console.log('Événement Google Calendar ajouté');

    } catch (e) {
      console.error('Erreur Email ou Google Calendar :', e.message);
    }

    // Réponse client
    res.status(201).json({
      message: 'Rendez-vous enregistré.',
      id: result.insertId,
      data: { nom, email, date, heure, description }
    });
  });
};

exports.getAppointments = (req, res) => {
  Appointment.getAll((err, results) => {
    if (err) {
      console.error('Erreur récupération RDV :', err);
      return res.status(500).json({ error: 'Erreur récupération RDV' });
    }
    res.json(results);
  });
};