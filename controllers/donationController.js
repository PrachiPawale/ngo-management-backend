const db = require('../config/db');
const transporter = require('../config/mailer');

const {
  saveOTP,
  verifyOTP
} = require('../utils/otpStore');

const sendOTP = async (req, res) => {

  try {

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: 'Email is required'
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    saveOTP(email, otp);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'NGO Website - Email Verification OTP',
      text: `Your verification OTP is ${otp}. It will expire in 5 minutes.`
    });

    res.json({
      message: 'OTP sent successfully'
    });

  } catch (error) {

    console.error('OTP email error:', error);

    res.status(500).json({
      message: 'Failed to send OTP'
    });

  }

};

const verifyEmailOTP = (req, res) => {

  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      message: 'Email and OTP are required'
    });
  }

  const verified = verifyOTP(email, otp);

  if (!verified) {
    return res.status(400).json({
      message: 'Invalid or expired OTP'
    });
  }

  res.json({
    message: 'Email verified successfully',
    verified: true
  });

};

// Create donation
const createDonation = (req, res) => {
    const { name, email, amount } = req.body;

    if (!name || !email || !amount) {
        return res.status(400).json({
            message: 'Name, email and amount are required'
        });
    }

    const sql = `
        INSERT INTO donations (name, email, amount)
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [name, email, amount],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: 'Database error'
                });
            }

            res.status(201).json({
                message: 'Donation created successfully',
                donationId: result.insertId
            });
        }
    );
};

// Get all donations
const getDonations = (req, res) => {
    const sql = `
        SELECT * FROM donations
        ORDER BY created_at DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({
                message: 'Database error'
            });
        }

        res.json(results);
    });
};

// Get donation by ID
const getDonationById = (req, res) => {
    const { id } = req.params;

    const sql = 'SELECT * FROM donations WHERE id = ?';

    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({
                message: 'Database error'
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: 'Donation not found'
            });
        }

        res.json(results[0]);
    });
};

// Update donation status
const updateDonationStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({
            message: 'Status is required'
        });
    }

    const sql = `
        UPDATE donations
        SET status = ?
        WHERE id = ?
    `;

    db.query(sql, [status, id], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: 'Database error'
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Donation not found'
            });
        }

        res.json({
            message: 'Donation status updated successfully'
        });
    });
};

// Delete donation
const deleteDonation = (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM donations WHERE id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error deleting donation:', err);

            return res.status(500).json({
                message: 'Failed to delete donation'
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Donation not found'
            });
        }

        res.status(200).json({
            message: 'Donation deleted successfully'
        });
    });
};

module.exports = {
    createDonation,
    getDonations,
    getDonationById,
    updateDonationStatus,
    deleteDonation,
    sendOTP,
    verifyEmailOTP
};