// BASIC NODEJS RELATED 
const express = require("express");
const path = require('path');
const app = express();
const port = process.env.PORT || 80;
require('dotenv').config()


// MONGODB RELATED
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const MongoDB_Url = process.env.MONGODB_URL;

mongoose
    .connect(MongoDB_Url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("DB Connetion Successfull");
    })
    .catch((err) => {
        console.log(err.message);
    });
const Users = require('./userSchema');

// AUTHENTICATION RELATED
const passport = require("passport");
const bcrypt = require("bcrypt")
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require('method-override')
const MemoryStore = require('memorystore')(session)
const initializePassport = require("./passport-config");
initializePassport(passport)
app.use(flash())
app.use(session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
    }),
    secret: process.env.SESSION_SECRET || "secret cat",
    resave: false,
    saveUninitialized: false
}))
app.use(function (req, res, next) {
    res.locals.message = req.flash();
    next();
});
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
function checkNotAuthenticatedUser(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/")
    }
    next()
}

// EXPRESS SPECIFIC STUFF
app.use('/static', express.static('static')); //For serving static files
app.use(express.urlencoded({ extended: false }))
// app.use('/img', express.static(path.join(__dirname, 'static/img')));
// app.use('/js', express.static(path.join(__dirname, 'static/js')));
// app.use('/css', express.static(path.join(__dirname, 'static/css')));; //For serving static files



// PUG SPECIFIC STUFF
app.set('view engine', 'pug'); // set the template engine as pug
app.set('views', path.join(__dirname, 'templates')); //set the views directory

// IMPORT ROUTES
const { home, popular_Anime, bookmark, anime_details, movies, search, delete_Session,anime_watch } = require('./routes/MainEndPoints');
const api = require('./routes/api');
const db = require('./routes/database');
const security = require('./routes/security')

//END POINTS
app.get('/', home)
app.get('/Popular-Anime', popular_Anime)
app.get('/bookmark', bookmark)
app.get('/anime-details/:anime', anime_details)
app.get('/movies', movies)
app.get('/search', search)
app.get('/anime-watch/:episode',anime_watch);
app.delete('/logout', delete_Session);
app.use('/api', api)
app.use('/db', db)
app.use('/security', checkNotAuthenticatedUser, security)


// START THE SERVER
app.listen(port, () => {
    console.log(`The application has started successfully on port ${port}`);
});

