const db = require('../config/db');


// Create Volunteer Application
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
        (name, email, phone, ngo, skills, message)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            name,
            email,
            phone,
            ngo,
            skills,
            message
        ],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: 'Failed to submit volunteer application'
                });
            }

            res.status(201).json({
                message: 'Volunteer application submitted successfully',
                id: result.insertId
            });
        }
    );
};


// Get All Volunteers
exports.getVolunteers = (req, res) => {

    const sql = `
        SELECT *
        FROM volunteers
        ORDER BY created_at DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: 'Failed to fetch volunteers'
            });
        }

        res.json(results);
    });
};


// Get Volunteer By ID
exports.getVolunteerById = (req, res) => {

    const { id } = req.params;

    const sql = `
        SELECT *
        FROM volunteers
        WHERE id = ?
    `;

    db.query(sql, [id], (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: 'Failed to fetch volunteer'
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: 'Volunteer not found'
            });
        }

        res.json(results[0]);
    });
};


// Delete Volunteer
exports.deleteVolunteer = (req, res) => {

    const { id } = req.params;

    const sql = `
        DELETE FROM volunteers
        WHERE id = ?
    `;

    db.query(sql, [id], (err) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: 'Failed to delete volunteer'
            });
        }

        res.json({
            message: 'Volunteer application deleted successfully'
        });
    });
};