const db = require('../config/db');


// ===============================
// GET ALL PROJECTS
// ===============================

const getProjects = (req, res) => {

    const sql = `
        SELECT *
        FROM projects
        ORDER BY created_at DESC
    `;

    db.query(sql, (err, result) => {

        if (err) {
            console.error('Error fetching projects:', err);

            return res.status(500).json({
                message: 'Database error'
            });
        }

        res.json(result.rows);
    });
};


// ===============================
// GET SINGLE PROJECT
// ===============================

const getProjectById = (req, res) => {

    const { id } = req.params;

    const sql = `
        SELECT *
        FROM projects
        WHERE id = $1
    `;

    db.query(sql, [id], (err, result) => {

        if (err) {
            console.error('Error fetching project:', err);

            return res.status(500).json({
                message: 'Database error'
            });
        }

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Project not found'
            });
        }

        res.json(result.rows[0]);
    });
};


// ===============================
// CREATE PROJECT
// ===============================

const createProject = (req, res) => {

    const { title, description, image } = req.body;

    if (!title || !description) {
        return res.status(400).json({
            message: 'Title and description are required'
        });
    }

    const sql = `
        INSERT INTO projects
        (title, description, image)
        VALUES ($1, $2, $3)
        RETURNING id
    `;

    db.query(
        sql,
        [title, description, image || null],
        (err, result) => {

            if (err) {
                console.error('Error creating project:', err);

                return res.status(500).json({
                    message: 'Database error'
                });
            }

            res.status(201).json({
                message: 'Project created successfully',
                projectId: result.rows[0].id
            });
        }
    );
};


// ===============================
// UPDATE PROJECT
// ===============================

const updateProject = (req, res) => {

    const { id } = req.params;
    const { title, description, image } = req.body;

    const sql = `
        UPDATE projects
        SET
            title = $1,
            description = $2,
            image = $3
        WHERE id = $4
    `;

    db.query(
        sql,
        [
            title,
            description,
            image || null,
            id
        ],
        (err, result) => {

            if (err) {
                console.error('Error updating project:', err);

                return res.status(500).json({
                    message: 'Database error'
                });
            }

            if (result.rowCount === 0) {
                return res.status(404).json({
                    message: 'Project not found'
                });
            }

            res.json({
                message: 'Project updated successfully'
            });
        }
    );
};


// ===============================
// DELETE PROJECT
// ===============================

const deleteProject = (req, res) => {

    const { id } = req.params;

    const sql = `
        DELETE FROM projects
        WHERE id = $1
    `;

    db.query(sql, [id], (err, result) => {

        if (err) {
            console.error('Error deleting project:', err);

            return res.status(500).json({
                message: 'Database error'
            });
        }

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: 'Project not found'
            });
        }

        res.json({
            message: 'Project deleted successfully'
        });
    });
};


module.exports = {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
};