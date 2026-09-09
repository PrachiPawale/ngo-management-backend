const db = require('../config/db');

// Submit contact message
const createContact = (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({
            message: 'Name, email and message are required'
        });
    }

    const sql = `
        INSERT INTO contacts (name, email, message)
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [name, email, message],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: 'Database error'
                });
            }

            res.status(201).json({
                message: 'Message sent successfully',
                contactId: result.insertId
            });
        }
    );
};

// Get all contact messages
const getContacts = (req, res) => {
    const sql = `
        SELECT * FROM contacts
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

// Delete contact message
const deleteContact = (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM contacts WHERE id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: 'Database error'
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Message not found'
            });
        }

        res.json({
            message: 'Message deleted successfully'
        });
    });
};

module.exports = {
    createContact,
    getContacts,
    deleteContact
};