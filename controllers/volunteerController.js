const db = require('../config/db');


// ===============================
// CREATE VOLUNTEER APPLICATION
// ===============================

exports.createVolunteer = (req, res) => {

    const {
        name,
        email,
        phone,
        ngo,
        skills,
        message
    } = req.body;

    if (!name || !email) {
        return res.status(400).json({
            message: 'Name and email are required'
        });
    }

    const sql = `
        INSERT INTO volunteers
        (
            name,
            email,
            phone,
            ngo,
            skills,
            message
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
    `;

    db.query(
        sql,
        [
            name,
            email,
            phone || null,
            ngo || null,
            skills || null,
            message || null
        ],
        (err, result) => {

            if (err) {
                console.error('Error creating volunteer:', err);

                return res.status(500).json({
                    message: 'Failed to submit volunteer application'
                });
            }

            res.status(201).json({
                message: 'Volunteer application submitted successfully',
                id: result.rows[0].id
            });
        }
    );
};


// ===============================
// GET ALL VOLUNTEERS
// ===============================

exports.getVolunteers = (req, res) => {

    const sql = `
        SELECT *
        FROM volunteers
        ORDER BY created_at DESC
    `;

    db.query(sql, (err, result) => {

        if (err) {
            console.error('Error fetching volunteers:', err);

            return res.status(500).json({
                message: 'Failed to fetch volunteers'
            });
        }

        res.json(result.rows);
    });
};


// ===============================
// GET VOLUNTEER BY ID
// ===============================

exports.getVolunteerById = (req, res) => {

    const { id } = req.params;

    const sql = `
        SELECT *
        FROM volunteers
        WHERE id = $1
    `;

    db.query(sql, [id], (err, result) => {

        if (err) {
            console.error('Error fetching volunteer:', err);

            return res.status(500).json({
                message: 'Failed to fetch volunteer'
            });
        }

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Volunteer not found'
            });
        }

        res.json(result.rows[0]);
    });
};


// ===============================
// DELETE VOLUNTEER
// ===============================

exports.deleteVolunteer = (req, res) => {

    const { id } = req.params;

    const sql = `
        DELETE FROM volunteers
        WHERE id = $1
    `;

    db.query(sql, [id], (err, result) => {

        if (err) {
            console.error('Error deleting volunteer:', err);

            return res.status(500).json({
                message: 'Failed to delete volunteer'
            });
        }

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: 'Volunteer not found'
            });
        }

        res.json({
            message: 'Volunteer application deleted successfully'
        });
    });
};

// ===============================
// UPDATE VOLUNTEER STATUS
// ===============================

exports.updateVolunteerStatus = (req, res) => {

    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'accepted', 'rejected'].includes(status)) {
        return res.status(400).json({
            message: 'Invalid volunteer status'
        });
    }

    const sql = `
        UPDATE volunteers
        SET status = $1
        WHERE id = $2
        RETURNING *
    `;

    db.query(
        sql,
        [status, id],
        (err, result) => {

            if (err) {
                console.error('Error updating volunteer status:', err);

                return res.status(500).json({
                    message: 'Failed to update volunteer status'
                });
            }

            if (result.rows.length === 0) {
                return res.status(404).json({
                    message: 'Volunteer not found'
                });
            }

            res.json({
                message: `Volunteer ${status} successfully`,
                volunteer: result.rows[0]
            });
        }
    );
};