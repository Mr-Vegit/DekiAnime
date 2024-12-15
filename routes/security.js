const passport = require("passport");
const bcrypt = require("bcrypt")
const Users = require('../userSchema')
const express = require("express");
const router = express.Router();
const app = express();
const flash = require("express-flash");
app.use(flash())

const login_Post = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/security/login',
    failureFlash: true,
});
const login_Get = (req, res) => {
    res.status(200).render('login.pug')
};
const register_Get =  (req, res) => {
    res.status(200).render('register.pug')
};
const register_Post = async (req, res) => {///Important
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        await Users.find({}).then( user => {
            if (user.find(users => users.email === req.body.email)) {
                req.flash('failure', 'Email already in use')
                res.redirect('/security/register')
            } else if (user.find(users => users.UserName === req.body.name)) {
                req.flash('failure', 'Username already in use')
                res.redirect('/security/register')
            }
            else{
                let name = req.body.name;
                let email = req.body.email;
                const newAcc = new Users({
                    name: name,
                    email: email,
                    password: hashedPassword,
                })
                newAcc.save().catch((err) => {
                    if (err) return console.error(err);
                });
                req.flash('success', 'Account created successfully');
                res.redirect('/security/login');
            }
        }).catch((err) => {
            if (err) return console.error(err);
        });
    } catch (err){
        if (err) return console.error(err);
        req.flash('failure', 'Error creating account')
        res.redirect('/security/register')
    }
}
router.route('/login').get(login_Get).post(login_Post)
router.route('/register').get(register_Get).post(register_Post)

module.exports = router;