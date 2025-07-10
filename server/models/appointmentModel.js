const db = require('../config/db');

const AppointmentModel = {
  create: (data, callback) => {
    const sql = `
      INSERT INTO appointments (name, email, date, heure, message)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.query(sql, [
      data.nom,
      data.email,
      data.date,
      data.heure,
      data.description
    ], callback);
  },

  getAll: (callback) => {
    db.query('SELECT * FROM appointments ORDER BY created_at DESC', callback);
  }
};

getAllAppointments: (callback) => {
  db.query('SELECT * FROM appointments ORDER BY created_at DESC', callback);
}

module.exports = AppointmentModel;