const express = require("express");
const path = require('path');
const app = express();
const port = process.env.PORT || 80;
const { ANIME } = require("@consumet/extensions");
const { META } = require("@consumet/extensions");
const gogoanime = new ANIME.Gogoanime();
const anilist = new META.Anilist();
const fs = require('fs')
const user = JSON.parse(fs.readFileSync('data.json'))


// EXPRESS SPECIFIC STUFF
app.use('/static', express.static('static')); //For serving static files
app.use('/img', express.static(path.join(__dirname, 'static/img')));
app.use('/js', express.static(path.join(__dirname, 'static/js')));
app.use('/css', express.static(path.join(__dirname, 'static/css')));; //For serving static files
app.use(express.urlencoded({ extended: false }))

// PUG SPECIFIC STUFF
app.set('view engine', 'pug'); // set the template engine as pug
app.set('views', path.join(__dirname, 'templates')); //set the views directory


// Functions 
const removeByAttr = function (arr, attr, value) {
    var i = arr.length;
    while (i--) {
        if (arr[i]
            && arr[i].hasOwnProperty(attr)
            && (arguments.length > 2 && arr[i][attr] === value)) {

            arr.splice(i, 1);

        }
    }
    return arr;
}


//END_POINTS
app.get('/', (req, res) => {
    const params = { "type": "recent-release", "episodeId": '1' }
    res.status(200).render('index.pug', params)
})
app.get('/recent-release/:id', (req, res) => {
    const id = req.params.id;
    const type = req.query.type;
    const loremed = { "episodeId": id, "type": type }
    res.status(200).render('index.pug', loremed)
})
app.get('/Popular-Anime', (req, res) => {
    const params = { "episodeId": "1" }
    res.status(200).render('popularAnime.pug', params)
})
app.get('/bookmark', (req, res) => {
    res.status(200).render('bookmark.pug')
})
app.get('/Popular-Anime/:id', (req, res) => {
    const id = req.params.id;
    const loremed = { "episodeId": id }
    res.status(200).render('popularAnime.pug', loremed)
})
app.get('/watch-history-delete/:episode', (req, res) => {
    const episode = req.params.episode;
    removeByAttr(user[0].recent, 'episodeName', episode)//Delete the required episode
    res.redirect('/')
})
app.get('/anime-watch/:episode', async (req, res) => {
    const id = req.query.id;
    const Animenum = req.query.num;
    const episode = req.params.episode;
    const Animeimg = req.query.img;
    await removeByAttr(user[0].recent,'episodeName',episode)//It removes previous episode data stored under recents 
    await user[0].recent.push({//Uploads new episode data under recents
            img: Animeimg,
            episodeName: episode,
            episodeNum: id,
        })
    const loremed = { "episodeName": episode, "episodeId": id, "AnimeId": Animenum, "img": req.query.img }
    res.status(200).render('videoPlayer.pug', loremed)
})
app.get('/bookmark-save', async (req, res) => {
    const animeId = req.query.animeId;
    const animeTitle = req.query.animeTitle;
    const animeImg = req.query.img;
    await removeByAttr(user[0].bookmark,'animeId',animeId)//It removes previous anime data stored under bookmark
    await user[0].bookmark.push({//uploads new anime data under bookmark
                animeId: animeId,
                Image: animeImg,
                title: animeTitle
            })
    res.redirect(`/anime-Details/${animeId}`)
})
app.get('/bookmark-delete', (req, res) => {
    const animeId = req.query.animeId;
    removeByAttr(user[0].bookmark,'animeId',animeId)//deletes required anime data under bookmark
    res.redirect('/bookmark')
})
app.get('/anime-details/:anime', (req, res) => {
    const anime = req.params.anime;
    const dub = req.query.dub;
    const loremed = { "animeName": anime, "dub": dub }
    res.status(200).render('animeDetails.pug', loremed)
})
app.get('/movies', (req, res) => {
    const loremed = { "page": "1" }
    res.status(200).render('movies.pug', loremed)
})
app.get('/movies/:id', (req, res) => {
    const id = req.params.id;
    const loremed = { "page": id }
    res.status(200).render('movies.pug', loremed)
})

app.get('/search', (req, res) => {
    const keys = req.query.keyw;
    const loremed = { "key": keys, "page": '1' }
    res.status(200).render('search.pug', loremed)
})
app.get('/search/:page', (req, res) => {
    const keys = req.query.keyw;
    const page = req.params.page;
    const loremed = { "key": keys, "page": page }
    res.status(200).render('search.pug', loremed)
})
app.get("/anime-list", (req, res) => {
    const keys = req.query.genre;
    const loremed = { "genre": keys, "pagenum": "1" }
    res.status(200).render('anime-list.pug', loremed)
})
app.get("/anime-list/:page", (req, res) => {
    const keys = req.query.genre;
    const page = req.params.page;
    const loremed = { "genre": keys, "pagenum": page }
    res.status(200).render('anime-list.pug', loremed)
})

// USER DATA
app.get('/user-data', async (req, res) => {
    res.status(200).json(user)
})

// API INFO
app.get('/Gogoanime/recent-release', async (req, res) => {
    const type = +req.query.type
    const page = +req.query.page
    gogoanime.fetchRecentEpisodes(page, type).then(data => {
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
    anilist.search(`${query}`, page, perPage).then(data => {
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
    anilist.fetchTrendingAnime(page, perpage).then(data => {
        res.status(200).json(data)
    }).catch((err) => {
        res.status(500).json({
            status: 500,
            error: 'Internal Error',
            message: err,
        });
    })
})

// This end point only works while using vpn
// app.get('/anilist/watch/:id', async (req, res) => {
//     const id = req.params.id;
//     anilist.fetchEpisodeSources(id).then(data => {
//         res.status(200).json(data)
//     }).catch((err) => {
//         res.status(500).json({
//             status: 500,
//             error: 'Internal Error',
//             message: err,
//         });
//     })
// })

// Updating data of the user
setInterval(()=>{
    fs.writeFileSync('data.json', JSON.stringify(user, null, 2))
},60000)

// START THE SERVER
app.listen(port, () => {
    console.log(`The application has started successfully on port ${port}`);
});