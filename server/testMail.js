const nodemailer = require("nodemailer");
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: "mael.salet33@gmail.com",
  subject: "Test Nodemailer",
  text: "Si tu lis ça, c’est que ça marche 🍾",
}, (err, info) => {
  if (err) {
    console.error("❌ Erreur:", err);
  } else {
    console.log("✅ Email envoyé:", info.response);
  }
});