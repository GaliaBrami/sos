const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Dummy database for users
let users = [];

// Routes
app.post('/register', upload.fields([{ name: 'idCard' }, { name: 'selfie' }]), (req, res) => {
    const { name } = req.body;
    if (!name || !req.files['idCard'] || !req.files['selfie']) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    users.push({
        name,
        idCard: req.files['idCard'][0].filename,
        selfie: req.files['selfie'][0].filename
    });
    res.status(200).json({ message: 'User registered successfully' });
});

app.post('/send-alert', (req, res) => {
    const { latitude, longitude } = req.body;
    if (!latitude || !longitude) {
        return res.status(400).json({ message: 'Missing location data' });
    }
    res.status(200).json({ message: 'Alert sent successfully', location: { latitude, longitude } });
});

// Start server
app.listen(PORT, () => {
    // console.log(Server running on http://localhost:${PORT});
});

