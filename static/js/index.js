let UserName = document.getElementById("user").textContent.trim();
const userCardTemplate = document.querySelector('.recents-anime-template');
const userCardContainer = document.querySelector('#recents-anime-container');
const RecentlyWatchedTemplate = document.querySelector('.watch-history-template');
const RecentlyWatchedContainer = document.querySelector('.my-slider');
let users = [];
const params = { method: 'GET' };
let RecentlyWatched =[];


// SAVE DATA IN BROWSER
if (UserName==="anonymous") {
    // localStorage.clear();
    if(localStorage.getItem('MyAnimeData') ===null){
        let MyAnimeData = {
            WatchHistory: [],
            bookmark: [],
        }
        localStorage.setItem('MyAnimeData',JSON.stringify(MyAnimeData));
    }
    let x = JSON.parse(localStorage.getItem('MyAnimeData'))
    console.log(x);
    RecentlyWatched = x.WatchHistory;
}
else{
    const respond = await fetch('/db/user-data');
    let x = await respond.json();
    RecentlyWatched = x.recent;
}

// let proxy = 'https://cors.consumet.stream/';
let page = document.getElementById("pagename").textContent.trim();
let type = document.getElementById("type").textContent.trim();
let typecheck = ""
let correcttype = ""
if (type.includes("all")) {
    typecheck = "";
    type = ""
} else {
    typecheck = "&" + "type=" + type;
    correcttype = type
}
let subOrDub = ""
if (+type == 1) {
    subOrDub = "SUB"
} else if (+type == 2) {
    subOrDub = "DUB"
} else {
    subOrDub = "SUB"
}
let pagename = "page=" + page;
const response = await fetch('/api/recent-release?' + pagename + typecheck, params);
const animeRecents = await response.json();
function limitWord(str, no_words) {
    return str.split(" ").splice(0, no_words).join(" ");
}
console.log(animeRecents);
let RecentlyWatched_Data = RecentlyWatched.slice(0).reverse().map(user => {
    const card = RecentlyWatchedTemplate.content.cloneNode(true).children[0];
    const AnimeTitle = card.querySelector(".watch-history-title");
    const AnimeImg = card.querySelector('.watch-history-img');
    const AnimeLink = card.querySelector('.watch-history-link');
    const AnimeEpisode = card.querySelector('.watch-history-episode');
    const DeleteEpisode = card.querySelector('.watch-history-delete');
    let episodeName = user.episodeName
    let info = episodeName.replace(/[/-]/g, ' ');
    AnimeTitle.textContent = limitWord(info, 7);
    AnimeEpisode.textContent = "episode : " + user.episodeNum;
    AnimeImg.src = user.img;
    AnimeLink.href = '/db/watch-delete-previous/' + user.episodeName + '?' + "id=" + user.episodeNum + "&num=none&img=" + user.img;
    if (UserName==="anonymous") {//DELETE FROM BROWSER
        DeleteEpisode.onclick = ()=>{
            let x = JSON.parse(localStorage.getItem('MyAnimeData'))
            let y = x.WatchHistory.filter(e=>e.episodeName!==user.episodeName)
            console.log(y);
            x.WatchHistory = y;
            localStorage.setItem('MyAnimeData',JSON.stringify(x));
            window.location.reload();
        };
    }
    else{
        DeleteEpisode.href = '/db/watch-history-delete/' + user.episodeName;
    }
    RecentlyWatchedContainer.append(card);
    return { element: card };
});
console.log(RecentlyWatched);
const slider = tns({
    container: ".my-slider",
    "slideBy": 1,
    "speed": 400,
    "nav": false,
    loop: false,
    controlsContainer: "#controls",
    prevButton: ".previous",
    nextButton: ".next",
    mouseDrag: true,
    responsive: {
        1024: {
            items: 6,
            gutter: 20
        },
        750: {
            items: 5,
            gutter: 20
        },
        480: {
            items: 4,
            // gutter:20    
        },
        0: {
            items: 3
        }
    }
})
users = animeRecents.results.map(user => {
    const card = userCardTemplate.content.cloneNode(true).children[0];
    const AnimeTitle = card.querySelector(".recents-anime-title");
    const AnimeEpisode = card.querySelector(".recents-anime-episode");
    const AnimeImg = card.querySelector('.recents-anime-img');
    const AnimeLink = card.querySelector('.recents-anime-link');
    const AnimeSuborDub = card.querySelector('.recent-sub-or-dub');
    AnimeTitle.textContent = limitWord(user.title, 7);
    AnimeEpisode.textContent = 'episode ' + user.episodeNumber;
    AnimeSuborDub.textContent = subOrDub;
    AnimeImg.src = user.image;
    AnimeLink.href = '/db/watch-delete-previous/' + user.id + '?' + "id=" + user.episodeNumber + "&num=none&img=" + user.image;
    userCardContainer.append(card);
    return { name: user.episodeId, sub: subOrDub, elem: AnimeSuborDub, element: card };
});
users.forEach(user => {
    if (user.sub.toLowerCase().includes("dub")) {
        user.elem.style.backgroundColor = "rgb(0 135 199";
    } else {
        user.elem.style.backgroundColor = "red";
    }
});


// PAGE GENERATOR
let pagenum = +page;
let pages_li = Array.from(document.getElementsByClassName('pages-a'))
if (pagenum >= 20) {
    pagenum = 20;
} else if (pagenum <= 3) {
    pagenum = 3;
}
pagenum = pagenum - 2;
pages_li.forEach((element) => {
    element.innerHTML = pagenum++;
    element.href = `/?pageNum=${pagenum - 1}&type=${correcttype}`;
});
document.getElementById("first-page").href = "/?pageNum=1" +"&type=" + correcttype;
document.getElementById("last-page").href = "/?pageNum=22" +"&type=" + correcttype;
