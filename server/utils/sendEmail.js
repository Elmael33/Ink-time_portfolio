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
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: '✅ Confirmation de votre rendez-vous InkTime',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">InkTime</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Studio de tatouage</p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-top: 0;">Bonjour ${appointment.name},</h2>
          
          <p style="font-size: 16px; color: #555; line-height: 1.6;">
            Nous avons le plaisir de vous confirmer votre rendez-vous chez <strong>InkTime</strong>.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0;">
            <h3 style="color: #667eea; margin-top: 0;">Détails de votre rendez-vous</h3>
            <p><strong>📅 Date :</strong> ${formatDate(appointment.date)}</p>
            <p><strong>🕒 Heure :</strong> ${appointment.heure}</p>
            ${appointment.description ? `<p><strong>💬 Notes :</strong> ${appointment.description}</p>` : ''}
          </div>
          
          <div style="background: #e8f4f8; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #333; margin-top: 0;">📍 Informations pratiques</h4>
            <p style="margin: 5px 0;">• Merci d'arriver 10 minutes avant votre rendez-vous</p>
            <p style="margin: 5px 0;">• Pensez à apporter une pièce d'identité</p>
            <p style="margin: 5px 0;">• En cas d'empêchement, prévenez-nous 24h à l'avance</p>
          </div>
          
          <p style="font-size: 14px; color: #666; text-align: center; margin-top: 30px;">
            Pour toute question, n'hésitez pas à nous contacter.<br>
            <strong>InkTime Studio</strong><br>
            📧 ${process.env.EMAIL_USER} | 📞 **********
          </p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};