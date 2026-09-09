const express = require('express');
const router = express.Router();

const ngoController = require('../controllers/ngoController');

// Get all NGOs
router.get('/', ngoController.getNGOs);

// Get NGO by ID
router.get('/:id', ngoController.getNGOById);

// Create NGO
router.post('/', ngoController.createNGO);

// Update NGO
router.put('/:id', ngoController.updateNGO);

// Delete NGO
router.delete('/:id', ngoController.deleteNGO);

module.exports = router;