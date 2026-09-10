const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('../config/db');

const login = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: 'Username and password are required'
        });
    }

    const sql = 'SELECT * FROM admin WHERE username = $1';

    db.query(sql, [username], async (err, result) => {
        if (err) {
            console.error('Admin login database error:', err);

            return res.status(500).json({
                message: 'Database error'
            });
        }

        const results = result.rows;

        if (results.length === 0) {
            return res.status(401).json({
                message: 'Invalid username or password'
            });
        }

        const admin = results[0];

        const isMatch = await bcrypt.compare(
            password,
            admin.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: 'Invalid username or password'
            });
        }

        const token = jwt.sign(
            {
                id: admin.id,
                username: admin.username
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1d'
            }
        );

        res.json({
            message: 'Login successful',
            token: token,
            admin: {
                id: admin.id,
                username: admin.username
            }
        });
    });
};

module.exports = {
    login
};