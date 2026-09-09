const db = require('../config/db');

// Get all projects
const getProjects = (req, res) => {
    const sql = 'SELECT * FROM projects ORDER BY created_at DESC';

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({
                message: 'Database error'
            });
        }

        res.json(results);
    });
};

// Get single project
const getProjectById = (req, res) => {
    const { id } = req.params;

    const sql = 'SELECT * FROM projects WHERE id = ?';

    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({
                message: 'Database error'
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: 'Project not found'
            });
        }

        res.json(results[0]);
    });
};

// Create project
const createProject = (req, res) => {
    const { title, description, image } = req.body;

    if (!title || !description) {
        return res.status(400).json({
            message: 'Title and description are required'
        });
    }

    const sql = `
        INSERT INTO projects (title, description, image)
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [title, description, image || null],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: 'Database error'
                });
            }

            res.status(201).json({
                message: 'Project created successfully',
                projectId: result.insertId
            });
        }
    );
};

// Update project
const updateProject = (req, res) => {
    const { id } = req.params;
    const { title, description, image } = req.body;

    const sql = `
        UPDATE projects
        SET title = ?, description = ?, image = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [title, description, image || null, id],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: 'Database error'
                });
            }

            if (result.affectedRows === 0) {
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

// Delete project
const deleteProject = (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM projects WHERE id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: 'Database error'
            });
        }

        if (result.affectedRows === 0) {
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