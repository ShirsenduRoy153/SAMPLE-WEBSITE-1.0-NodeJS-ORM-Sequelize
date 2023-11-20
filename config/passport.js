const user = require('../models').u;
const { hashSync, compareSync } = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

module.exports = (passport) => {
    passport.use("local", new LocalStrategy({
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
    }, (req, email, password, done) => {
        const User = user.findOne({ raw: true, where: { email: email } }).then((User) => {
            if (User == null) {
                return done(null, false, { message: "wrong credentials" });
            } else if (compareSync(password, User.password)) {
                return done(null, User)
            } else {
                return done(null, false, { message: 'Wrong Password' });
            }

        })
    }))
    passport.serializeUser((User, done) => done(null, User.id));

    passport.deserializeUser(async(id, done) => {
        const fetchuser = (id) => user.findByPk(id);
        fetchuser(id).then((User) => {
            return done(null, User);
        })
    });
};