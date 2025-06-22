const Appointment = require('../models/appointmentModel');
const { sendConfirmationEmail } = require('../utils/sendEmail');

exports.createAppointment = (req, res) => {
  const { nom, email, date, heure, description } = req.body;

  // vérification
  if (!nom || !email || !date || !heure || !description) {
    return res.status(400).json({ error: 'Tous les champs sont requis.' });
  }

  // enregistrement en base
  Appointment.create({ nom, email, date, heure, description }, (err, result) => {
    if (err) {
      console.error('Erreur création DB :', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    // envoi de l'email
    sendConfirmationEmail(email, { date, heure, description })
      .then(() => {
        console.log('Email envoyé');
      })
      .catch((err) => {
        console.error('Erreur email :', err);
      });

    // réponse client
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