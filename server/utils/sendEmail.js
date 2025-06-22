const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendConfirmationEmail = (to, appointment) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: 'Confirmation de votre rendez-vous',
    html: `
      <h2>Merci pour votre réservation !</h2>
      <p><strong>Date :</strong> ${appointment.date}</p>
      <p><strong>Heure :</strong> ${appointment.heure}</p>
      <p><strong>Description :</strong> ${appointment.description}</p>
    `,
  };

  return transporter.sendMail(mailOptions);
};