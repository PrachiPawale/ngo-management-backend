require('dotenv').config();

const express = require('express');
const cors = require('cors');

const db = require('./config/db');

const adminRoutes = require('./routes/adminRoutes');
const projectRoutes = require('./routes/projectRoutes');
const contactRoutes = require('./routes/contactRoutes');
const donationRoutes = require('./routes/donationRoutes');
const ngoRoutes = require('./routes/ngoRoutes');
const volunteerRoutes = require('./routes/volunteerRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/admin', adminRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/ngos', ngoRoutes);
app.use('/api/volunteers', volunteerRoutes);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

const authMiddleware = require('./middleware/authMiddleware');


app.get('/api/admin/test', authMiddleware, (req, res) => {
    res.json({
        message: 'You are authorized',
        admin: req.admin
    });
});



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
