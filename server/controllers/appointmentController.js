const { createEvent, getAvailableSlots } = require('../utils/calendarService');
const Appointment = require('../models/appointmentModel');
const AppointmentModel = require('../models/appointmentModel');
const { sendConfirmationEmail } = require('../utils/sendEmail');
const db = require('../config/db');

exports.createAppointment = async (req, res) => {
  const { name, email, date, heure, message, phone } = req.body;
  
  if (!name || !email || !date || !heure) {
    return res.status(400).json({ error: 'Tous les champs sont requis.' });
  }
  
  console.log("RDV reçu :", req.body);
  
  try {
    // Vérification si le créneau est déjà pris
    const checkQuery = 'SELECT COUNT(*) as count FROM appointments WHERE date = ? AND heure = ?';
    const isBooked = await new Promise((resolve, reject) => {
      db.query(checkQuery, [date, heure], (err, result) => {
        if (err) reject(err);
        else resolve(result[0].count > 0);
      });
    });

    if (isBooked) {
      return res.status(409).json({ error: 'Ce créneau est déjà réservé' });
    }

    // Insertion du RDV
    const result = await new Promise((resolve, reject) => {
      Appointment.create({ name, email, date, heure, message, phone, status: 'en_attente' }, (err, result) => {
        if (err) {
          // Si erreur de contrainte unique, on gère proprement
          if (err.code === 'ER_DUP_ENTRY') {
            return reject(new Error('SLOT_TAKEN'));
          }
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    res.status(201).json({
      message: 'Rendez-vous enregistré mis en attente',
      id: result.insertId,
      data: { name, email, date, heure, message }
    });

  } catch (err) {
    console.error('❌ Erreur création RDV :', err);
    
    if (err.message === 'SLOT_TAKEN') {
      return res.status(409).json({ error: 'Ce créneau est déjà réservé' });
    }
    
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

      // ✅ Ici on crée les vrais objets Date
      const start = new Date(appointment.date);
      const end = new Date(start.getTime() + 60 * 60 * 1000);

      if (isNaN(start) || isNaN(end)) {
        console.error("⛔ Mauvais format de date ou heure :", appointment.date, appointment.heure);
        return res.status(500).json({ error: 'Format date/heure invalide' });
      }

      const event = await createEvent({
        summary: `RDV Tattoo avec ${appointment.name}`,
        description: appointment.message,
        start: {
          dateTime: start.toISOString(),
          timeZone: 'Europe/Paris'
        },
        end: {
          dateTime: end.toISOString(),
          timeZone: 'Europe/Paris'
        }
      });

        // Test: Envoi d'un email de confirmation (commenté pour l'instant)
        await sendConfirmationEmail(appointment.email, {
          date: appointment.date,
          heure: appointment.heure,
          description: appointment.message
        });

        res.status(200).json({ message: 'Rendez-vous validé', eventLink: event.htmlLink });
      });

    } catch (error) {
      console.error('Erreur validation :', error);
      res.status(500).json({ error: 'Erreur serveur validation' });
    }
  });
};

exports.getReservedSlots = (req, res) => {
  const date = req.params.date;

  if (!date) {
    return res.status(400).json({ error: "Date manquante" });
  }

  const query = `
    SELECT heure FROM appointments
    WHERE date = ? AND status = "confirme"
  `;

  db.query(query, [date], (err, results) => {
    if (err) {
      console.error("Erreur DB créneaux réservés:", err);
      return res.status(500).json({ error: "Erreur serveur" });
    }

    // ✅ ICI tu peux mapper `results` car il existe dans ce scope
    const reserved = results.map(r => r.heure.slice(0, 5)); // supprime les secondes
    res.json(reserved);
  });
};
