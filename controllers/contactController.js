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
        VALUES ($1, $2, $3)
        RETURNING id
    `;

    db.query(
        sql,
        [name, email, message],
        (err, result) => {

            if (err) {
                console.error('Error creating contact:', err);

                return res.status(500).json({
                    message: 'Database error'
                });
            }

            res.status(201).json({
                message: 'Message sent successfully',
                contactId: result.rows[0].id
            });
        }
    );
};

// Get all contact messages
const getContacts = (req, res) => {
    const sql = `
        SELECT *
        FROM contacts
        ORDER BY created_at DESC
    `;

    db.query(sql, (err, result) => {

        if (err) {
            console.error('Error fetching contacts:', err);

            return res.status(500).json({
                message: 'Database error'
            });
        }

        res.json(result.rows);
    });
};

// Delete contact message
const deleteContact = (req, res) => {
    const { id } = req.params;

    const sql = `
        DELETE FROM contacts
        WHERE id = $1
    `;

    db.query(sql, [id], (err, result) => {

        if (err) {
            console.error('Error deleting contact:', err);

            return res.status(500).json({
                message: 'Database error'
            });
        }

        if (result.rowCount === 0) {
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