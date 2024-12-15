const express = require("express");
const router = express.Router();
const Users = require('../userSchema');

const watch_history_delete =async (req, res) => {
    const episode = req.params.episode;
    const UserId = req.user.id;
    const updateDoc = {
        $pull: {
            recent: {
                episodeName: episode,
            }
        }
    };
    const filter = { _id: UserId };
    let x = await Users.updateMany(filter, updateDoc);
    console.log(x);
    res.redirect('/')
};
const watch_delete_previous = async (req, res) => {
    const id = req.query.id;
    const Animenum = req.query.num;
    const episode = req.params.episode;
    const Animeimg = req.query.img;
    const urlWatchEpisode = '/anime-watch/' + episode + '?id=' + id + '&num=' + Animenum + '&img=' + Animeimg;
    if (req.isAuthenticated()) {
        const UserId = req.user.id;
        const PullDublicates = {
            $pull: {
                recent: {
                    episodeName: episode,
                }
            }
        };
        const filter = { _id: UserId };
        let x = await Users.updateMany(filter, PullDublicates)
        console.log(x);
        res.status(200).redirect(urlWatchEpisode)
    }
    res.status(200).redirect(urlWatchEpisode)
}

const bookmark_save_delete =  async (req, res) => {
    const animeId = req.query.animeId;
    const animeTitle = req.query.animeTitle;
    const animeImg = req.query.img;
    const UserId = req.user.id;
        const updateDoc = {
            $pull: {
                bookmark: {
                    animeId: animeId,
                }
            }
        };
        const filter = { _id: UserId };
        let x = await Users.updateMany(filter, updateDoc);
        console.log(x);
        console.log('Previous Bookmark deleted');
        res.redirect("/bookmark-save?animeId=" + animeId + "&animeTitle=" + animeTitle + "&img=" + animeImg);
}
const bookmark_save = async (req, res) => {
    console.log('hello');
    const animeId = req.query.animeId;
    const animeTitle = req.query.animeTitle;
    const animeImg = req.query.img;
    const UserId = req.user.id;
        const updateDoc = {
            $push: {
                bookmark: {
                    animeId: animeId,
                    Image: animeImg,
                    title: animeTitle
                }
            }
        };
        const filter = { _id: UserId };
        let x = await Users.updateMany(filter, updateDoc)
        console.log(x);
        console.log('New Bookmark ADDED');
        res.redirect(`/anime-Details/${animeId}`)
}
const bookmark_delete =  async(req, res) => {
    const animeId = req.query.animeId;
    const UserId = req.user.id;
        const updateDoc = {
            $pull: {
                bookmark: {
                    animeId: animeId,
                }
            }
        };
        const filter = { _id: UserId };
        let x = await Users.updateMany(filter, updateDoc)
        console.log(x);
        console.log('Bookmark deleted');
        res.redirect('/bookmark')
}
const user_data= async (req, res) => { //mongodb
    try {
        const UserId = req.user.id;
        const filter = { _id: UserId };
        let x = await Users.findOne(filter);
        res.status(200).json(x);
    } catch (err) {
        res.status(500).json({
            status: 500,
            error: 'Internal Error',
            message: err,
        });
    }
};

router.route('/user-data').get(user_data)
router.route('/watch-history-delete/:episode').get(watch_history_delete);
router.route('/watch-delete-previous/:episode').get(watch_delete_previous);
// router.route
router.route('/bookmark-save-delete').get(bookmark_save_delete);
router.route('/bookmark-save').get(bookmark_save);
router.route('/bookmark-delete').get(bookmark_delete);

module.exports = router;