const db = require('../config/db');


// ===============================
// GET ALL NGOs
// ===============================

const getNGOs = (req, res) => {

    const sql = `
        SELECT *
        FROM ngos
        ORDER BY created_at DESC
    `;

    db.query(sql, (err, result) => {

        if (err) {
            console.error('Error fetching NGOs:', err);

            return res.status(500).json({
                message: 'Database error'
            });
        }

        res.json(result.rows);
    });
};


// ===============================
// GET SINGLE NGO
// ===============================

const getNGOById = (req, res) => {

    const { id } = req.params;

    const sql = `
        SELECT *
        FROM ngos
        WHERE id = $1
    `;

    db.query(sql, [id], (err, result) => {

        if (err) {
            console.error('Error fetching NGO:', err);

            return res.status(500).json({
                message: 'Database error'
            });
        }

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'NGO not found'
            });
        }

        res.json(result.rows[0]);
    });
};


// ===============================
// CREATE NGO
// ===============================

const createNGO = (req, res) => {

    const {
        name,
        description,
        mission,
        location,
        email,
        phone,
        logo,
        category
    } = req.body;

    if (!name || !description) {
        return res.status(400).json({
            message: 'NGO name and description are required'
        });
    }

    const sql = `
        INSERT INTO ngos
        (
            name,
            description,
            mission,
            location,
            email,
            phone,
            logo,
            category
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id
    `;

    db.query(
        sql,
        [
            name,
            description,
            mission || null,
            location || null,
            email || null,
            phone || null,
            logo || null,
            category || null
        ],
        (err, result) => {

            if (err) {
                console.error('Error creating NGO:', err);

                return res.status(500).json({
                    message: 'Database error'
                });
            }

            res.status(201).json({
                message: 'NGO created successfully',
                ngoId: result.rows[0].id
            });
        }
    );
};


// ===============================
// UPDATE NGO
// ===============================

const updateNGO = (req, res) => {

    const { id } = req.params;

    const {
        name,
        description,
        mission,
        location,
        email,
        phone,
        logo,
        category
    } = req.body;

    const sql = `
        UPDATE ngos
        SET
            name = $1,
            description = $2,
            mission = $3,
            location = $4,
            email = $5,
            phone = $6,
            logo = $7,
            category = $8
        WHERE id = $9
    `;

    db.query(
        sql,
        [
            name,
            description,
            mission || null,
            location || null,
            email || null,
            phone || null,
            logo || null,
            category || null,
            id
        ],
        (err, result) => {

            if (err) {
                console.error('Error updating NGO:', err);

                return res.status(500).json({
                    message: 'Database error'
                });
            }

            if (result.rowCount === 0) {
                return res.status(404).json({
                    message: 'NGO not found'
                });
            }

            res.json({
                message: 'NGO updated successfully'
            });
        }
    );
};


// ===============================
// DELETE NGO
// ===============================

const deleteNGO = (req, res) => {

    const { id } = req.params;

    const sql = `
        DELETE FROM ngos
        WHERE id = $1
    `;

    db.query(sql, [id], (err, result) => {

        if (err) {
            console.error('Error deleting NGO:', err);

            return res.status(500).json({
                message: 'Database error'
            });
        }

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: 'NGO not found'
            });
        }

        res.json({
            message: 'NGO deleted successfully'
        });
    });
};


module.exports = {
    getNGOs,
    getNGOById,
    createNGO,
    updateNGO,
    deleteNGO
};