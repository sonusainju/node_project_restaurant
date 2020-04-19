if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const path = require("path");
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require('express-flash');
const session = require('express-session');
const mongoose = require('mongoose');

// Connection to mongoose
mongoose.connect( process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', error => console.log(error));
db.once('open', ()=> console.log('Connected to Mongoose'));

var dishModel = require("./models/dish.model");

// dishModel.insertMany([{name:"Classic Momo 3", desription:"lorem ipsum", unitPrice:12}]);

// const dishes = dishModel.find().exec(function (err, docs) {
//     if (err){
//         console.log(err)

//     }
//     docs.forEach(function(doc){
//         console.log(doc.name)
//     })
// });


const initializePassport = require('./passport-config')
initializePassport(
    passport,
    email => users.find(user=> user.email === email)
    );

const users = []

app.use("/assets", express.static('public'));
app.use(express.urlencoded({extended:false}));

app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized: false
}));

app.use(passport.initialize());

// To make our variables persistant across the entire session
app.use(passport.session())

// root
app.get("/", function(req, res) {
    res.status(200).sendFile(path.join(__dirname, "index.html"));
});

// Order page
app.get("/order", function(req, res) {
    res.status(200).sendFile(path.join(__dirname, "HTML/order.html"));
});

// login page
app.get("/login", function(req, res) {
    res.status(200).sendFile(path.join(__dirname, "HTML/login.html"));
});

// Register page
app.get("/register", function(req, res) {
    res.status(200).sendFile(path.join(__dirname, "HTML/register.html"));
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

app.post('/register', async(req,res)=> {

    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        users.push({
            id:Date.now().toString(),
            name:req.body.name,
            email:req.body.email,
            password:hashedPassword
        })
        res.redirect('/login');
    } catch{
        res.redirect('/register');
    }
    console.log(users);

});

const port = process.env.PORT;

app.listen(port, function() {
    console.log(`Example app listening on ${port}`);
  });