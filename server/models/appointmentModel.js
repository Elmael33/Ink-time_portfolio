const db = require('../config/db');

const AppointmentModel = {
  create: (data, callback) => {
    const sql = `
      INSERT INTO appointments (name, email, phone, date, time, message)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(sql, [
      data.name,
      data.email,
      data.phone,
      data.date,
      data.time,
      data.message
    ], callback);
  },

  getAll: (callback) => {
    db.query('SELECT * FROM appointments ORDER BY created_at DESC', callback);
  }
};

module.exports = AppointmentModel;