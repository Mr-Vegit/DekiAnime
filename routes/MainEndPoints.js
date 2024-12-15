const Users = require('../userSchema');
const home = (req, res) => {
    let PgNum = req.query.pageNum;
    let type = req.query.type;
    if (PgNum === '') {
        PgNum = 1;
    }
    if (type ==="") {
        type = "all";
    }
    let params={};
    if (req.isAuthenticated()) {
        params = { "pageNum": PgNum, "type": type,'user':req.user.name }
    }else{
        params = { "pageNum": PgNum, "type": type ,'user':'anonymous'}
    }
    res.status(200).render('index.pug', params)
}
const popular_Anime = (req, res) => {
    let PgNum = req.query.pageNum;
    if (PgNum === '') {
        PgNum = 1;
    }
    let params={};
    if (req.isAuthenticated()) {
        params = { "pageNum": PgNum,'user':req.user.name  }
    }else{
        params = { "pageNum": PgNum,'user':'anonymous'}
    }
    res.status(200).render('popularAnime.pug', params)
}

const bookmark = (req, res) => {
    let params={};
    if (req.isAuthenticated()) {
        params = { 'user':req.user.name }
    }else{
        params = { 'user':'anonymous'}
    }
    res.status(200).render('bookmark.pug',params)
}
const anime_details = (req, res) => {
    const anime = req.params.anime;
    const dub = req.query.dub;
    let params={};
    if (req.isAuthenticated()) {
        params = { "animeName": anime, "dub": dub ,'user':req.user.name }
    }else{
        params = { "animeName": anime, "dub": dub ,'user':'anonymous'}
    }
    res.status(200).render('animeDetails.pug', params)
}
const movies = (req, res) => {
    let PgNum = req.query.pageNum;
    if (PgNum === '') {
        PgNum = 1;
    }
    let params={};
    if (req.isAuthenticated()) {
        params = {"page": PgNum,'user':req.user.name  }
    }else{
        params = { "page": PgNum,'user':'anonymous'}
    }
    res.status(200).render('movies.pug', params)
}

const search = (req, res) => {
    const keys = req.query.keyw.trim();
    let page = req.query.pageNum;
    if (page === '') {
        page = 1;
    }
    let params={};
    if (req.isAuthenticated()) {
        params = {"key": keys, "page": page  ,'user':req.user.name  }
    }else{
        params = { "key": keys, "page": page ,'user':'anonymous'}
    }
    res.status(200).render('search.pug', params)
}
const delete_Session =  (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/security/login');
    });
}
const anime_watch = async(req, res) => {
    const id = req.query.id;
    const Animenum = req.query.num;
    const episode = req.params.episode;
    const Animeimg = req.query.img;
    let loremed = [];
    if (req.isAuthenticated()) {
        const UserId = req.user.id;
        const updateDoc = {
            $push: {
                recent: {
                    img: Animeimg,
                    episodeName: episode,
                    episodeNum: id,

                }
            }
        };
        const filter = { _id: UserId };
        let x = await Users.updateMany(filter, updateDoc);
        console.log(x);
        console.log('New video history uploaded');
        loremed = { "episodeName": episode, "episodeId": id, "AnimeId": Animenum, "img": req.query.img, 'user': req.user.name }
    } else {
        loremed = { "episodeName": episode, "episodeId": id, "AnimeId": Animenum, "img": req.query.img, 'user': 'anonymous' }
    }
    res.status(200).render('videoPlayer.pug', loremed)
};

module.exports = {home,popular_Anime,bookmark,anime_details,movies,search,delete_Session,anime_watch}