const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'no_code',
  database: 'inktime_db',
});

db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base :', err.message);
  } else {
    console.log('Connecté à la base MySQL');
  }
});

module.exports = db;