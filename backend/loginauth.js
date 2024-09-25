const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const multer=require('multer')
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/socialmedia')
    .then(() => console.log("Database connected"))
    .catch(err => console.log("Not Connected", err));

const model = require('./schemas/schema');

//login user
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    console.log(username+password);
    try {
        const user = await model.findOne({ username });
        console.log(user);
        if (user) {
            const isMatch = await bcryptjs.compare(password, user.password);
            if (isMatch) {
                res.status(200).json({
                    msg: "Login success",
                    user:user
                });
            } else {
                res.status(200).json({
                    msg: "Incorrect password"
                });
            }
        } else {
            res.status(200).json({
                msg: "User does not exist"
            });
        }
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

//signup user
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    console.log("signup " + JSON.stringify(req.body));
    try {
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
        const user = await model.create({
            username,
            email,
            password: hashedPassword
        });
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});


//uploading image
const Userpost=require('./schemas/postschema');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/upload', upload.single('image'), async (req, res) => {
    const { username, email,caption } = req.body;

    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    // Create a new user with the uploaded image
    const binary=req.file.buffer
    console.log(req.file);
    console.log(binary);

    try {
        const post = await Userpost.create({
            username,
            email,
            image: binary,
            caption // Store binary data
        });
        console.log(post)

        res.status(200).json({binaryImage:binary.toString('base64')});
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(3090, () => {
    console.log("Listening on port 3090");
});