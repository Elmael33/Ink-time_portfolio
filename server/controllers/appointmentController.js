const { createEvent, getAvailableSlots } = require('../utils/calendarService');
const Appointment = require('../models/appointmentModel');
const AppointmentModel = require('../models/appointmentModel');
/*const { sendConfirmationEmail } = require('../utils/sendEmail');$*/

exports.createAppointment = async (req, res) => {
  const { name, email, date, heure, message, phone } = req.body;
  if (!name || !email || !date || !heure || !message) {
    return res.status(400).json({ error: 'Tous les champs sont requis.' });
  }
  console.log("RDV reçu :", req.body);
  
  try {
    const result = await new Promise((resolve, reject) => {
      Appointment.create({ name, email, date, heure, message, phone, status: 'en_attente' }, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    res.status(201).json({
      message: 'Rendez-vous enregistré mis en attente',
      id: result.insertId,
      data: { name, email, date, heure, message }
    });

  } catch (err) {
    console.error('❌ Erreur complète Google Calendar :', err);
    res.status(500).json({ error: 'Erreur serveur (RDV)' });
  }
};

exports.getAppointments = (req, res) => {
  Appointment.getAll((err, results) => {
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
//Pas fonctionnel pour l'instant
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

exports.validateAppointment = async (req, res) => {
  const id = req.params.id;

  AppointmentModel.getById(id, async (err, appointment) => {
    if (err || !appointment) {
      return res.status(404).json({ error: "Rendez-vous introuvable" });
    }

    try {
      AppointmentModel.updateStatus(id, 'confirme', async (err) => {
        if (err) return res.status(500).json({ error: 'Erreur update status' });

        const dateStr = appointment.date.toISOString().split('T')[0]; // ex: '2025-07-21'
        const heure = appointment.heure.slice(0, 5); // ex: '10:00'
        const startDateTime = new Date(`${dateStr}T${heure}:00+02:00`).toISOString();

        const [h, m] = heure.split(':');
        const endHour = (parseInt(h) + 1).toString().padStart(2, '0');
        const endDateTime = new Date(`${dateStr}T${endHour}:${m}:00+02:00`).toISOString();

        const event = await createEvent({
          summary: `RDV Tattoo avec ${appointment.name}`,
          description: appointment.message,
          start: {
            dateTime: startDateTime,
            timeZone: 'Europe/Paris'
          },
          end: {
            dateTime: endDateTime,
            timeZone: 'Europe/Paris'
          }
        });

        // Test: Envoi d'un email de confirmation (commenté pour l'instant)
        /*
        await sendConfirmationEmail(appointment.email, {
          date: appointment.date,
          heure: appointment.heure,
          description: appointment.message
        });
        */

        res.status(200).json({ message: 'Rendez-vous validé', eventLink: event.htmlLink });
      });

    } catch (error) {
      console.error('Erreur validation :', error);
      res.status(500).json({ error: 'Erreur serveur validation' });
    }
  });
};