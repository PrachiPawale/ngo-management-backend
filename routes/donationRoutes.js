const express = require('express');

const router = express.Router();

const {
    createDonation,
    getDonations,
    getDonationById,
    deleteDonation,
    updateDonationStatus,
    sendOTP,
    verifyEmailOTP
} = require('../controllers/donationController');

const authMiddleware = require('../middleware/authMiddleware');

// Public
router.post('/', createDonation);

// Admin only
router.get('/', authMiddleware, getDonations);
router.get('/:id', authMiddleware, getDonationById);
router.put('/:id/status', authMiddleware, updateDonationStatus);
router.delete('/:id', authMiddleware, deleteDonation);

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyEmailOTP);


module.exports = router;