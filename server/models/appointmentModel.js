const db = require('../config/db');

const AppointmentModel = {
  create: (data, callback) => {
    const sql = `INSERT INTO appointments (name, email, date, heure, message, phone, status) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.query(sql, [
      data.name,
      data.email,
      data.date,
      data.heure,
      data.message,
      data.phone || null,
      data.status || 'en_attente'
    ], callback);
  },

  getConfirmedSlotsByDate: (date, callback) => {
  const sql = "SELECT heure FROM appointments WHERE date = ? AND status = 'confirme'";
  db.query(sql, [date], (err, results) => {
    if (err) return callback(err);
    callback(null, results.map(r => r.heure));
  });
  },

  getAll: (callback) => {
    db.query('SELECT * FROM appointments ORDER BY created_at DESC', callback);
  },

  updateStatus: (id, status, callback) => {
    const sql = 'UPDATE appointments SET status = ? WHERE id = ?';
    db.query(sql, [status, id], callback);
  },

  getById: (id, callback) => {
    const sql = 'SELECT * FROM appointments WHERE id = ?';
    db.query(sql, [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },
  
  delete: (id, callback) => {
    const sql = 'DELETE FROM appointments WHERE id = ?';
    db.query(sql, [id], callback);
  }
};

module.exports = AppointmentModel;