// const {Users, Messages} = require('../mongodb.js')
const { ANIME } = require("@consumet/extensions");
const { META } = require("@consumet/extensions");
const gogoanime = new ANIME.Gogoanime();
const zoro = new ANIME.Zoro();
const anilist = new META.Anilist();
const express = require("express");
const router = express.Router();
const Caches = require('../cacheSchema');

function SaveInfoToDataBase(data,Dbdata,filter) {
    let NewData = {
        animeData:data,
        filter:filter,
    }
    if (Dbdata === null) {
        Caches.insertMany(NewData);
    }else{
        Caches.replaceOne(filter,NewData);
    }
}
function ShowDataforErr(res,Dbdata,err) {
    if (Dbdata!=null) {
        res.status(500).json(Dbdata.animeData[0])
    }else{
        res.status(500).json({
            status: 500,
            error: 'Internal Error',
            message: err,
        });
    }
}
const recent_Release =  async (req, res) => {
    const type = +req.query.type
    const page = +req.query.page
    const filter = {recent:"recent-release",type,page} ;
    let Dbdata = await Caches.findOne(filter);
    // zoro.fetchRecentlyAdded(page).then(data=>{
    //     console.log(data);
    //     let NewData = {
    //         animeData:data,
    //         filter:filter,
    //     }
    //     if (Dbdata === null) {
    //         Caches.insertMany(NewData);
    //     }else{
    //         Caches.replaceOne(filter,NewData);
    //     }
    //     res.status(200).json(data)
    // }).catch((err) => {
    //     res.status(300).json(Dbdata)
    //     // res.status(500).json({
    //     //         status: 500,
    //     //     error: 'Internal Error',
    //     //     message: err,
    //     // });
    // })
    gogoanime.fetchRecentEpisodes(page, type).then(data => {
        // console.log(data);
        res.status(200).json(data);
        SaveInfoToDataBase(data,Dbdata,filter);
    }).catch((err) => {
        ShowDataforErr(res,Dbdata,err);
    })
};
const anime_movies = async (req, res) => {
    const perPage = +req.query.perPage
    const page = +req.query.page
    const filter = {name:"anime-movie",perPage,page} ;
    let Dbdata = await Caches.findOne(filter);
    anilist.advancedSearch(undefined, 'ANIME', page, perPage, 'MOVIE', 'POPULARITY_DESC').then(data => {
        res.status(200).json(data)
        SaveInfoToDataBase(data,Dbdata,filter);
    })
    .catch((err) => {
        ShowDataforErr(res,Dbdata,err);
    })

};

const info = async (req, res) => {
    const id = req.params.id;
    const dub = Boolean(req.query.dub);
    const filter = {name:"anime-info",id,dub} ;
    let Dbdata = await Caches.findOne(filter);
    anilist.fetchAnimeInfo(id, dub,"true").then(data => {
        // console.log(data);
        res.status(200).json(data)
        SaveInfoToDataBase(data,Dbdata,filter);
    }).catch((err) => {
        ShowDataforErr(res,Dbdata,err);
    })
}
const search =  async (req, res) => {
    const query = req.params.id;
    const perPage = +req.query.perPage
    const page = +req.query.page
    const filter = {name:"search",query,perPage} ;
    let Dbdata = await Caches.findOne(filter);
    anilist.search(`${query}`, page, 50).then(data => {
        // console.log(data);
        res.status(200).json(data)
        SaveInfoToDataBase(data,Dbdata,filter);
    }).catch((err) => {
        ShowDataforErr(res,Dbdata,err);
    })
};
const advanced_Search = async (req, res) => {
    const query = req.query.id;
    const page = +req.query.page
    const format = req.query.format;
    const genre  = req.query.genre;
    const status = req.query.status;
    const season = req.query.season;
    const filter = {name:"advanced-Search",query,page,format,genre, status,season} ;
    let Dbdata = await Caches.findOne(filter);
    anilist.advancedSearch(query, 'ANIME', page, 50, format, 'POPULARITY_DESC', genre, undefined, undefined, status, season).then(data => {
        res.status(200).json(data)
        SaveInfoToDataBase(data,Dbdata,filter);
    }).catch((err) => {
        ShowDataforErr(res,Dbdata,err);
    })
};
const trending = async (req, res) => {
    const perpage = +req.query.perPage
    const page = +req.query.page
    const filter = {name:"trending",perpage,page} ;
    let Dbdata = await Caches.findOne(filter);
    anilist.advancedSearch(undefined, 'ANIME', page, perpage, undefined, 'POPULARITY_DESC').then(data => {
        // console.log(data);
        res.status(200).json(data)
        SaveInfoToDataBase(data,Dbdata,filter);
    }).catch((err) => {
        ShowDataforErr(res,Dbdata,err);
    })
};
const watch = async (req, res) => {
    const id = req.params.id;
    const filter = {name:"anime-watch",id} ;
    let Dbdata = await Caches.findOne(filter);
    anilist.fetchEpisodeSources(id).then(data => {
        res.status(200).json(data)
        SaveInfoToDataBase(data,Dbdata,filter);
    }).catch((err) => {
        ShowDataforErr(res,Dbdata,err);
    })
}
const server =  async (req, res) => {
    const id = req.params.id;
    const filter = {name:"anime-server",id} ;
    let Dbdata = await Caches.findOne(filter);
    anilist.fetchEpisodeServers(id).then(data => {
        SaveInfoToDataBase(data,Dbdata,filter);
    }).catch(err => {
        ShowDataforErr(res,Dbdata,err);
    })
}

router.route('/recent-release').get(recent_Release)
router.route('/anime-movies').get(anime_movies)

router.route('/info/:id').get(info)
router.route('/search/:id').get(search)
router.route('/advanced-search').get(advanced_Search)
router.route('/trending').get(trending)
router.route('/watch/:id').get(watch)
router.route('/server/:id').get(server)

module.exports = router;