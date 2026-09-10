const express = require('express');

const router = express.Router();

const volunteerController = require('../controllers/volunteerController');
const authMiddleware = require('../middleware/authMiddleware');

// =================================
// PUBLIC
// =================================

// Submit volunteer application
router.post('/', volunteerController.createVolunteer);


// =================================
// ADMIN ONLY
// =================================

// Get all volunteer applications
router.get('/', authMiddleware, volunteerController.getVolunteers);

// Get volunteer by ID
router.get('/:id', authMiddleware, volunteerController.getVolunteerById);

// Delete volunteer application
router.delete('/:id', authMiddleware, volunteerController.deleteVolunteer);


module.exports = router;