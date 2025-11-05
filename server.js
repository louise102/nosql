const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

const MONGO_URI = 'mongodb+srv://bejuuuu:OBIDO01@cluster0.r6i7ise.mongodb.net/';

app.use(cors());
app.use(express.json());

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected Successfully!'))
    .catch(err => console.error('MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
});

const User = mongoose.model('User', userSchema);

app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find().select('-__v');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.post('/api/users', async (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({
            name,
            email
        });

        await user.save();

        res.status(201).json({
            name: user.name,
            email: user.email,
            message: 'User registered successfully'
        });

    } catch (err) {
        console.error(err.message);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).send('Server Error during registration');
    }
});

// CLASSIC CONCATENATION: *THIS FIXES THE SYNTAX ERROR*
app.listen(PORT, function () {
    console.log('Server started on port ' + PORT);
});