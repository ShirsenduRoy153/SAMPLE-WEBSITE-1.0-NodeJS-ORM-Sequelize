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

app.use('/', indexRouter);

app.listen({ port: 5000 }, async() => {
    console.log('Server up on http://localhost:5000')
        //await sequelize.authenticate()
    console.log('Database Connected!')
})

module.exports = app