const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const app = express();
const port = 3090;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/socialmedia')
    .then(() => console.log("Database connected"))
    .catch(err => console.log("Not Connected", err));

// Create a Mongoose schema and model
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    image: Buffer, // Store the image as a binary buffer
});

const User = mongoose.model('userposts', userSchema);

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware to parse JSON
app.use(express.json());

app.post('/upload', upload.single('image'), async (req, res) => {
    const { username, email } = req.body;

    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    // Create a new user with the uploaded image
    

    try {
        const post = await User.create({
            username,
            email,
            image: req.file.buffer, // Store binary data
        });
        res.send('User created successfully with uploaded image.');
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
