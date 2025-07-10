const { createEvent, getAvailableSlots } = require('../utils/calendarService');
const Appointment = require('../models/appointmentModel');
const { sendConfirmationEmail } = require('../utils/sendEmail');

exports.createAppointment = async (req, res) => {
  const { nom, email, date, heure, message } = req.body;
  if (!nom || !email || !date || !heure || !message) {
    return res.status(400).json({ error: 'Tous les champs sont requis.' });
  }

  try {
    const result = await new Promise((resolve, reject) => {
      Appointment.create({ nom, email, date, heure, message }, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    await sendConfirmationEmail(email, { date, heure, message });

    const start = `${date}T${heure}:00`;
    const endHour = parseInt(heure.split(':')[0]) + 1;
    const end = `${date}T${endHour.toString().padStart(2, '0')}:${heure.split(':')[1]}:00`;

    await createEvent({
      summary: `RDV Tattoo avec ${nom}`,
      description: message,
      start,
      end
    });

    res.status(201).json({
      message: 'Rendez-vous enregistré.',
      id: result.insertId,
      data: { nom, email, date, heure, message }
    });

  } catch (err) {
    console.error('❌ Erreur complète Google Calendar :', err);
    res.status(500).json({ error: 'Erreur serveur (RDV)' });
  }
};

exports.getAppointments = (req, res) => {
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
  const end = new Date(start.getTime() + 30 * 60000);

  try {
    const event = await createEvent({
      summary: 'Rendez-vous Ink-Time',
      description: message,
      start,
      end,
    });

    res.status(200).json({ message: 'Réservation confirmée', eventLink: event.htmlLink });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du rendez-vous' });
  }
};

exports.deleteAppointment = (req, res) => {
  const id = req.params.id;
  Appointment.delete(id, (err) => {
    if (err) return res.status(500).json({ error: 'Suppression échouée' });
    res.status(200).json({ message: 'RDV supprimé' });
  });
};

exports.apiGetAvailableSlots = async (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ error: 'Date manquante' });

  try {
    const slots = await getAvailableSlots(date);
    if (slots.length === 0) return res.status(204).send();
    res.status(200).json({ slots });
  } catch (err) {
    console.error('Erreur slots:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
