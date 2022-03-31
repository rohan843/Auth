require('dotenv').config();
const express = require('express');
const parser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

mongoose.connect('mongodb://localhost:27017/authDB');

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = mongoose.model('User', userSchema);

const app = express();
app.set('view engine', 'ejs');
app.use(parser.urlencoded({ extended: true }));
app.use("*/css", express.static("public/css"));
app.use("*/img", express.static("public/img"));
app.use("*/js", express.static("public/js"));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        if (err) {
            res.send(err);
        } else {
            const newUser = new User({
                email: req.body.username,
                password: hash
            });
            newUser.save((err) => {
                if (err) {
                    res.send(err);
                }
                else {
                    res.render('secrets');
                }
            });
        }
    });
});

app.post('/login', (req, res) => {
    const un = req.body.username;
    const pw = req.body.password;
    User.findOne({ email: un }, (err, user) => {
        if (err) {
            console.log(err);
            res.send(err);
        } else if (!user) {
            res.send("No user found");
        } else {
            bcrypt.compare(pw, user.password, (err, result) => {
                if (err) {
                    res.send(err);
                } else {
                    if (result) {
                        res.render('secrets');
                    } else {
                        res.send('invalid login');
                    }
                }
            });
        }
    });
});

app.listen(3000, () => {
    console.log("Server set up to listen on port 3000.");
});