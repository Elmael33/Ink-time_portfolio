const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const upload = require('../middlewares/upload'); // ← Ajouté ici

router.post('/', upload.single('image'), appointmentController.createAppointment); // ← Important

router.get('/', appointmentController.getAppointments);
router.post('/reserve', appointmentController.reserveAppointment);
router.delete('/:id', appointmentController.deleteAppointment);
router.get('/disponibilites', appointmentController.apiGetAvailableSlots);

module.exports = router;