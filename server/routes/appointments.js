const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const upload = require('../middlewares/upload'); // ← Ajouté ici

router.post('/', upload.single('image'), appointmentController.createAppointment); // ← Important

router.get('/', appointmentController.getAppointments);
router.get('/reserve', appointmentController.reserveAppointment);

module.exports = router;