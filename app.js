// BASIC NODEJS RELATED 
const express = require("express");
const path = require('path');
const app = express();
const port = process.env.PORT || 80;

// AUTHENTICATION RELATED
const passport = require("passport");
const bcrypt = require("bcrypt")
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require('method-override')
const MemoryStore = require('memorystore')(session)

// CONSUMET - ANIME RELATED DATA RECEIVED
const { ANIME } = require("@consumet/extensions");
const { META } = require("@consumet/extensions");
const gogoanime = new ANIME.Gogoanime();
const zoro = new ANIME.Zoro();
const anilist = new META.Anilist();


// MONGODB RELATED
const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectId;
var MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://MrVegit:MRqLpmjilWGFlT3G@userinfo.pqsn00r.mongodb.net/DekiAnime?retryWrites=true&w=majority";


// Database
async function main() {
    await mongoose.connect(url);
}
main().catch((err) => console.log(err));
setInterval(() => {
    async function main() {
        await mongoose.connect(url);
    }
    main().catch((err) => console.log(err))
    // console.log("SetTimeout");
}, 5000);
// const recentSchema = new mongoose.Schema({
//     Anime:String,
//     img:String,
//     // episodeNum:Number,
// })
const UserSchema = new mongoose.Schema({
    name: String,
    // email: { type: String, required: true, unique: true},
    email: String,
    password: String,
    recent: Array,
    bookmark: Array
});
// UserSchema.plugin(uniqueValidator)
const Users = mongoose.model("Users", UserSchema);



// SECURITY
const initializePassport = require("./passport-config");
// const userInfo = JSON.parse(fs.readFileSync('data.json'))
setInterval(() => {
    Users.find({}, (err, user) => {
        if (err) return console.error(err);
        initializePassport(
            passport,
            email => user.find(users => users.email === email),
            id => user.find(users => users.id === id)
        )
        // console.log(userInfo)
    })
}, 3000);
app.use(flash())
app.use(session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
    }),
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
function checkAuthenticatedUser(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect("/login")
}
function checkNotAuthenticatedUser(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/")
    }
    next()
}

// EXPRESS SPECIFIC STUFF
app.use('/static', express.static('static')); //For serving static files
app.use('/img', express.static(path.join(__dirname, 'static/img')));
app.use('/js', express.static(path.join(__dirname, 'static/js')));
app.use('/css', express.static(path.join(__dirname, 'static/css')));; //For serving static files
app.use(express.urlencoded({ extended: false }))



// PUG SPECIFIC STUFF
app.set('view engine', 'pug'); // set the template engine as pug
app.set('views', path.join(__dirname, 'templates')); //set the views directory



//END_POINTS
app.get('/', (req, res) => {
    let params={};
    if (req.isAuthenticated()) {
        params = { "type": "recent-release", "episodeId": '1','user':req.user.name }
    }else{
        params = { "type": "recent-release", "episodeId": '1','user':'anonymous'}
    }
    res.status(200).render('index.pug', params)
})
app.get('/recent-release/:id',(req, res) => {
    const id = req.params.id;
    const type = req.query.type;
    let params={};
    if (req.isAuthenticated()) {
        params = { "episodeId": id, "type": type,'user':req.user.name }
    }else{
        params = { "episodeId": id, "type": type ,'user':'anonymous'}
    }
    res.status(200).render('index.pug', params)
})
app.get('/Popular-Anime', (req, res) => {
    let params={};
    if (req.isAuthenticated()) {
        params = { "episodeId": "1",'user':req.user.name  }
    }else{
        params = { "episodeId": '1','user':'anonymous'}
    }
    res.status(200).render('popularAnime.pug', params)
})
app.get('/Popular-Anime/:id', (req, res) => {
    const id = req.params.id;
    let params={};
    if (req.isAuthenticated()) {
        params = { "episodeId": id ,'user':req.user.name  }
    }else{
        params = { "episodeId": id ,'user':'anonymous'}
    }
    res.status(200).render('popularAnime.pug', params)
})
app.get('/bookmark', (req, res) => {
    let params={};
    if (req.isAuthenticated()) {
        params = { 'user':req.user.name }
    }else{
        params = { 'user':'anonymous'}
    }
    res.status(200).render('bookmark.pug',params)
})
app.get('/anime-details/:anime', (req, res) => {
    const anime = req.params.anime;
    const dub = req.query.dub;
    let params={};
    if (req.isAuthenticated()) {
        params = { "animeName": anime, "dub": dub ,'user':req.user.name }
    }else{
        params = { "animeName": anime, "dub": dub ,'user':'anonymous'}
    }
    res.status(200).render('animeDetails.pug', params)
})
app.get('/movies', (req, res) => {
    let params={};
    if (req.isAuthenticated()) {
        params = {"page": "1" ,'user':req.user.name  }
    }else{
        params = { "page": "1",'user':'anonymous'}
    }
    res.status(200).render('movies.pug', params)
})
app.get('/movies/:id', (req, res) => {
    const id = req.params.id;
    let params={};
    if (req.isAuthenticated()) {
        params = {"page": id  ,'user':req.user.name  }
    }else{
        params = { "page": id ,'user':'anonymous'}
    }
    res.status(200).render('movies.pug', params)
})

app.get('/search', (req, res) => {
    const keys = req.query.keyw;
    let params={};
    if (req.isAuthenticated()) {
        params = {"key": keys, "page": '1'  ,'user':req.user.name  }
    }else{
        params = { "key": keys, "page": '1' ,'user':'anonymous'}
    }
    res.status(200).render('search.pug', params)
})
app.get('/search/:page', (req, res) => {
    const keys = req.query.keyw;
    const page = req.params.page;
    let params={};
    if (req.isAuthenticated()) {
        params = {"key": keys, "page": page  ,'user':req.user.name  }
    }else{
        params = { "key": keys, "page": page ,'user':'anonymous'}
    }
    res.status(200).render('search.pug', params)
})

// DATA TRANFERRED END POINTS
app.get('/watch-history-delete/:episode', (req, res) => {
    const episode = req.params.episode;
    const UserId = req.user.id;
    MongoClient.connect(url).then((db) => {
        var dbo = db.db('DekiAnime');
        // var query = { address: "Park Lane 38" };
        // dbo.collection("customers").find(query).toArray(function(err, result) {
        //   if (err) throw err;
        //   console.log(result);
        //   db.close();
        // });
        const updateDoc = {
            $pull: {
                recent: {
                    episodeName: episode,
                }
            }
        };
        const filter = { _id: new ObjectId(UserId) };
        dbo.collection('users').updateMany(filter, updateDoc).catch(err => {
            if (err) throw err;
        });
        console.log('History Deleted');
        res.redirect('/')
        // db.close();
    }).catch((err) => {
        if (err) throw err;

    })
})
app.get('/watch-delete-previous/:episode', (req, res) => {
    const id = req.query.id;
    const Animenum = req.query.num;
    const episode = req.params.episode;
    const Animeimg = req.query.img;
    const urlWatchEpisode = '/anime-watch/' + episode + '?id=' + id + '&num=' + Animenum + '&img=' + Animeimg;
    if (req.isAuthenticated()) {
        const UserId = req.user.id;
        MongoClient.connect(url).then((db) => {
            var dbo = db.db('DekiAnime');
            const PullDublicates = {
                $pull: {
                    recent: {
                        episodeName: episode,
                    }
                }
            };
            const filter = { _id: new ObjectId(UserId) };
            dbo.collection('users').updateMany(filter, PullDublicates).catch(err => {
                if (err) throw err;
            });
            console.log('Previous episode deleted');
            res.status(200).redirect(urlWatchEpisode)
        }).catch((err) => {
            if (err) throw err;
            
        })
    }
    res.status(200).redirect(urlWatchEpisode)
})
app.get('/anime-watch/:episode', (req, res) => {
    const id = req.query.id;
    const Animenum = req.query.num;
    const episode = req.params.episode;
    const Animeimg = req.query.img;
    let loremed=[];
    if (req.isAuthenticated()) {
        const UserId = req.user.id;
        MongoClient.connect(url).then((db) => {
        var dbo = db.db('DekiAnime');
        const updateDoc = {
            $push: {
                recent: {
                    img: Animeimg,
                    episodeName: episode,
                    episodeNum: id,

                }
            }
        };
        const filter = { _id: new ObjectId(UserId) };
        dbo.collection('users').updateMany(filter, updateDoc).catch(err => {
            if (err) throw err;
        });
        console.log('New video history uploaded');
    }).catch((err) => {
        if (err) throw err;

    })
     loremed = { "episodeName": episode, "episodeId": id, "AnimeId": Animenum, "img": req.query.img, 'user':req.user.name }
}else{
 loremed = { "episodeName": episode, "episodeId": id, "AnimeId": Animenum, "img": req.query.img ,'user':'anonymous'}
}
    res.status(200).render('videoPlayer.pug', loremed)
})
app.get('/bookmark-save-delete', (req, res) => {
    const animeId = req.query.animeId;
    const animeTitle = req.query.animeTitle;
    const animeImg = req.query.img;
    const UserId = req.user.id;
    // const bookmarkUrl ="/bookmark-save?animeId="+animeId+"&animeTitle="+animeTitle+"&img="+animeImg;
    MongoClient.connect(url).then((db) => {
        var dbo = db.db('DekiAnime');
        const updateDoc = {
            $pull: {
                bookmark: {
                    animeId: animeId,
                }
            }
        };
        const filter = { _id: new ObjectId(UserId) };
        dbo.collection('users').updateMany(filter, updateDoc).catch(err => {
            if (err) throw err;
        });
        console.log('Previous Bookmark deleted');
        res.redirect("/bookmark-save?animeId=" + animeId + "&animeTitle=" + animeTitle + "&img=" + animeImg);
    }).catch((err) => {
        if (err) throw err;
    })
})
app.get('/bookmark-save',  async (req, res) => {
    console.log('hello');
    const animeId = req.query.animeId;
    const animeTitle = req.query.animeTitle;
    const animeImg = req.query.img;
    const UserId = req.user.id;
    MongoClient.connect(url).then((db) => {
        var dbo = db.db('DekiAnime');
        const updateDoc = {
            $push: {
                bookmark: {
                    animeId: animeId,
                    Image: animeImg,
                    title: animeTitle
                }
            }
        };
        const filter = { _id: new ObjectId(UserId) };
        dbo.collection('users').updateMany(filter, updateDoc).catch(err => {
            if (err) throw err;
        });
        console.log('New Bookmark ADDED');
        res.redirect(`/anime-Details/${animeId}`)
    }).catch((err) => {
        if (err) throw err;
    })
})
app.get('/bookmark-delete', (req, res) => {
    const animeId = req.query.animeId;
    const UserId = req.user.id;
    MongoClient.connect(url).then((db) => {
        var dbo = db.db('DekiAnime');
        const updateDoc = {
            $pull: {
                bookmark: {
                    animeId: animeId,
                }
            }
        };
        const filter = { _id: new ObjectId(UserId) };
        dbo.collection('users').updateMany(filter, updateDoc).catch(err => {
            if (err) throw err;
        });
        console.log('Bookmark deleted');
        res.redirect('/bookmark')
    }).catch((err) => {
        if (err) throw err;
    })
})


// API INFO

app.get('/Gogoanime/recent-release', async (req, res) => {
    const type = +req.query.type
    const page = +req.query.page
    gogoanime.fetchRecentEpisodes(page, type).then(data => {
        // console.log(data);
        res.status(200).json(data)
    }).catch((err) => {
        res.status(500).json({
            status: 500,
            error: 'Internal Error',
            message: err,
        });
    })
})
app.get('/anilist/anime-movies', async (req, res) => {
    const perPage = +req.query.perPage
    const page = +req.query.page
    anilist.advancedSearch(undefined, 'ANIME', page, perPage, 'MOVIE', 'POPULARITY_DESC').then(data => {
        res.status(200).json(data)
    }).catch((err) => {
        res.status(500).json({
            status: 500,
            error: 'Internal Error',
            message: err,
        });
    })

})
app.get('/user-data',  async (req, res) => {
    try {
        const UserId = req.user.id;
        const filter = { _id: new ObjectId(UserId) };
        Users.findOne(filter, function (err, data) {
            if (err) throw err;
            res.status(200).json(data)
        });
    } catch (err) {
        res.status(500).json({
            status: 500,
            error: 'Internal Error',
            message: err,
        });
    }
})
app.get('/anilist/info/:id', async (req, res) => {
    const id = req.params.id;
    const dub = Boolean(req.query.dub);
    anilist.fetchAnimeInfo(id, dub).then(data => {
        res.status(200).json(data)
    }).catch((err) => {
        res.status(500).json({
            status: 500,
            error: 'Internal Error',
            message: err,
        });
    })
})
app.get('/anilist/search/:id', async (req, res) => {
    const query = req.params.id;
    const perPage = +req.query.perPage
    const page = +req.query.page
    anilist.search(`${query}`, page, 50).then(data => {
        res.status(200).json(data)
    }).catch((err) => {
        res.status(500).json({
            status: 500,
            error: 'Internal Error',
            message: err,
        });
    })
})
app.get('/anilist/advanced-search', async (req, res) => {
    const query = req.query.id;
    const format = req.query.format;
    const genre = req.query.genre;
    const status = req.query.status;
    const season = req.query.season;
    const page = +req.query.page
    anilist.advancedSearch(query, 'ANIME', page, 50, format, 'POPULARITY_DESC', genre, undefined, undefined, status, season).then(data => {
        res.status(200).json(data)
    }).catch((err) => {
        res.status(500).json({
            status: 500,
            error: 'Internal Error',
            message: err,
        });
    })
})
app.get('/anilist/trending', async (req, res) => {
    const perpage = +req.query.perPage
    const page = +req.query.page
    // const AnimeData=
    anilist.fetchTrendingAnime(page, perpage).then(data => {
        // console.log(data);
        res.status(200).json(data)
    }).catch((err) => {
        res.status(500).json({
            status: 500,
            error: 'Internal Error',
            message: err,
        });
    })
})
app.get('/anilist/watch/:id', async (req, res) => {
    const id = req.params.id;
    // anilist.fetchEpisodeSources('spy-x-family-17977$episode$89506$both').then(data => {
    gogoanime.fetchEpisodeSources(id).then(data => {
        res.status(200).json(data)
    }).catch((err) => {
        res.status(500).json({
            status: 500,
            error: 'Internal Error',
            message: err,
        });
    })
})
app.get('/anilist/server/:id', async (req, res) => {
    const id = req.params.id;
    anilist.fetchEpisodeServers(id).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(500).json({
            status: 500,
            error: 'Internal Error',
            message: err,
        });
    })
})


// SECURITY
app.get("/login", checkNotAuthenticatedUser, (req, res) => {
    res.status(200).render('login.pug')
})
app.post("/login", checkNotAuthenticatedUser, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
}))
app.get("/register", checkNotAuthenticatedUser, (req, res) => {
    res.status(200).render('register.pug')
})
app.post("/register", checkNotAuthenticatedUser, async (req, res) => {///Important
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        let name = req.body.name.toLowerCase();
        let email = req.body.email.toLowerCase();
        const newAcc = new Users({
            name: name,
            email: email,
            password: hashedPassword,
        },)
        newAcc.save(function (err) {
            if (err) return console.error(err);
        });
        res.redirect('/login')

    } catch {
        res.redirect('/register')
    }
    // console.log(userInfo);
})
app.delete('/logout', (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/login');
    });
});


// START THE SERVER
app.listen(port, () => {
    console.log(`The application has started successfully on port ${port}`);
});

