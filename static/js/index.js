const userCardTemplate = document.querySelector('.recents-anime-template');
const userCardContainer = document.querySelector('#recents-anime-container');
const RecentlyWatchedTemplate = document.querySelector('.watch-history-template');
const RecentlyWatchedContainer = document.querySelector('.my-slider');
let users = [];
const params = { method: 'GET' };
// let proxy = 'https://cors.consumet.stream/';
let page = document.getElementById("pagename").textContent.trim();
let type = document.getElementById("type").textContent.trim();
let typecheck = ""
let correcttype = ""
if (type.includes("recent-release")) {
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
const response = await fetch('/Gogoanime/recent-release?' + pagename + typecheck, params);
const animeRecents = await response.json();
function limitWord(str, no_words) {
    return str.split(" ").splice(0, no_words).join(" ");
}
console.log(animeRecents);
let data = [];
const respond = await fetch('/user-data');
const RecentlyWatched = await respond.json();
console.log(RecentlyWatched);
data = RecentlyWatched[0].recent.slice(0).reverse().map(user => {
    const card = RecentlyWatchedTemplate.content.cloneNode(true).children[0];
    const AnimeTitle = card.querySelector(".watch-history-title");
    const AnimeImg = card.querySelector('.watch-history-img');
    const AnimeLink = card.querySelector('.watch-history-link');
    const AnimeEpisode = card.querySelector('.watch-history-episode');
    const DeleteEpisode = card.querySelector('.watch-history-delete');
    try {
        let episodeName = user.episodeName
        let info = episodeName.replace(/[/-]/g, ' ');
        AnimeTitle.textContent = limitWord(info, 7);
        AnimeEpisode.textContent = "episode : " + user.episodeNum;
        AnimeImg.src = user.img;
        AnimeLink.href = '/watch-delete-previous/' + user.episodeName + '?' + "id=" + user.episodeNum + "&num=none&img=" + user.img;
        DeleteEpisode.href = '/watch-history-delete/' + user.episodeName;
        RecentlyWatchedContainer.append(card);
        return { element: card };
    
} catch (error) {
    console.log(error);
}
});
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
    AnimeLink.href = '/anime-watch/' + user.id + '?' + "id=" + user.episodeNumber + "&num=none&img=" + user.image;
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
let pagenum = parseInt(page, 10)
let pages_li = Array.from(document.getElementsByClassName('pages-a'))
let first_page = document.getElementById("first-page")
let last_page = document.getElementById("last-page")
first_page.href = "/recent-release/1" + "?" + "type=" + correcttype;
last_page.href = "/recent-release/22" + "?" + "type=" + correcttype;
if (pagenum <= 2) {
    pagenum = 2
    let object = [
        { id: pagenum, num: pagenum, link: "/recent-release/" + pagenum + "?" + "type=" + correcttype },
        { id: pagenum++, num: pagenum, link: "/recent-release/" + pagenum + "?" + "type=" + correcttype },
        { id: pagenum++, num: pagenum, link: "/recent-release/" + pagenum + "?" + "type=" + correcttype },
        { id: pagenum++, num: pagenum, link: "/recent-release/" + pagenum + "?" + "type=" + correcttype },
        { id: pagenum++, num: pagenum, link: "/recent-release/" + pagenum + "?" + "type=" + correcttype },
    ]
    pages_li.forEach((element, i) => {
        element.innerHTML = object[i].num
        element.href = object[i].link
    });
} else if (pagenum > 2) {
    pagenum++;
    let object = [
        { id: pagenum, num: pagenum, link: "/recent-release/" + pagenum + "?" + "type=" + correcttype },
        { id: pagenum++, num: pagenum, link: "/recent-release/" + pagenum + "?" + "type=" + correcttype },
        { id: pagenum++, num: pagenum, link: "/recent-release/" + pagenum + "?" + "type=" + correcttype },
        { id: pagenum++, num: pagenum, link: "/recent-release/" + pagenum + "?" + "type=" + correcttype },
        { id: pagenum++, num: pagenum, link: "/recent-release/" + pagenum + "?" + "type=" + correcttype },
    ]
    pages_li.forEach((element, i) => {
        element.innerHTML = object[i].num
        element.href = object[i].link
    });

}
else {
    pagenum = 2
    let object = [
        { id: pagenum, num: pagenum, link: "/recent-release/" + pagenum + "?" + "type=" + correcttype },
        { id: pagenum++, num: pagenum, link: "/recent-release/" + pagenum + "?" + "type=" + correcttype },
        { id: pagenum++, num: pagenum, link: "/recent-release/" + pagenum + "?" + "type=" + correcttype },
        { id: pagenum++, num: pagenum, link: "/recent-release/" + pagenum + "?" + "type=" + correcttype },
        { id: pagenum++, num: pagenum, link: "/recent-release/" + pagenum + "?" + "type=" + correcttype },
    ]
    pages_li.forEach((element, i) => {
        element.innerHTML = object[i].num
        element.href = object[i].link
    });
}