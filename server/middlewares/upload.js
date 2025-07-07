const multer = require('multer');
const upload = multer({ dest: 'server/uploads/' }); // ou un dossier de ton choix

module.exports = upload;