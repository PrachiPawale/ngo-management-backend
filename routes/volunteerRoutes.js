const express = require('express');
const router = express.Router();

const volunteerController = require('../controllers/volunteerController');

// Submit volunteer application
router.post('/', volunteerController.createVolunteer);

// Get all volunteer applications
router.get('/', volunteerController.getVolunteers);

// Get volunteer by ID
router.get('/:id', volunteerController.getVolunteerById);

// Delete volunteer application
router.delete('/:id', volunteerController.deleteVolunteer);

module.exports = router;