const express = require('express');

const router = express.Router();

const {
    createContact,
    getContacts,
    deleteContact
} = require('../controllers/contactController');

const authMiddleware = require('../middleware/authMiddleware');

router.post('/', createContact);

router.get('/', authMiddleware, getContacts);
router.delete('/:id', authMiddleware, deleteContact);

module.exports = router;