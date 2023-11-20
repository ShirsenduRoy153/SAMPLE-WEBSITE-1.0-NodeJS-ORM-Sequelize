const express = require('express')
const path = require('path')
const app = express()
var cookieParser = require('cookie-parser');

app.use(express.json())
const indexRouter = require('./routes/index')

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const passport = require('passport')
require("./config/passport")(passport)
const session = require("express-session");
const flash = require("express-flash");
app.use(passport.initialize())
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.session())
app.use('/', indexRouter);
app.use(flash());

app.listen({ port: 5000 }, async() => {
    console.log('Server up on http://localhost:5000')
    console.log('Database Connected!')
})

module.exports = app