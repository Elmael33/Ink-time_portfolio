const db = require('../config/db');

function createAppointment(appointment, callback) {
    const sql = `
        INSERT INTO appointments (name, email, phone, date, time, message)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [
        appointment.name,
        appointment.email,
        appointment.phone,
        appointment.date,
        appointment.time,
        appointment.message
    ];
    db.query(sql, values, callback);
}