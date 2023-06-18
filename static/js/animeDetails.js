let UserName = document.getElementById("user").textContent.trim();
let animeId = document.getElementById('animeName').textContent.trim();
let dub = document.getElementById('Dub').textContent.trim();
const recommendationsTemplate = document.querySelector('.recommendation-template');
const recommendationsContainer = document.querySelector('.my-slider');
const EpisodeTemplate = document.querySelector('.Episode-template');
const EpisodeContainer = document.querySelector('#Episode-Container');
let recomendation = [];
// let proxy = 'https://cors.consumet.stream/';
console.log(animeId);
const response = await fetch('/anilist/info/' + animeId + "?dub=" + dub);
const AnimeDetails_Data = await response.json();
console.log(AnimeDetails_Data);
let img = document.getElementById('anime-img');
img.src = AnimeDetails_Data.image;
Array.from(document.getElementsByClassName('anime-title')).forEach(element => {
    element.innerText = AnimeDetails_Data.title.romaji;
});
// Array.from(document.getElementsByClassName('anime-other-names')).forEach(element => {
//     element.innerText= AnimeDetails_Data.otherNames;
// });
document.getElementById('anime-total-episodes').innerText = AnimeDetails_Data.totalEpisodes;
document.getElementById('anime-type').innerText = AnimeDetails_Data.type;
document.getElementById('anime-Status').innerText = AnimeDetails_Data.status;
document.getElementById('anime-releaseDate').innerText = AnimeDetails_Data.releaseDate;
let description = AnimeDetails_Data.description;
let info = description.replace(/[^a-zA-Z0-9 ]/g, '\xA0');
document.getElementById('anime-description').innerText = info;
let genra = Array.from(document.getElementsByClassName('anime-genre-container'))
var count = Object.keys(AnimeDetails_Data.genres).length;
genra.forEach((element) => {
    for (let i = 0; i < count; i++) {
        let para = document.createElement("p");
        para.innerHTML = AnimeDetails_Data.genres[i];
        para.classList.add("genre-btn")
        element.appendChild(para);
    }
});

let episode_Container = document.getElementById('Episode-Container')
var Episode_number = parseInt(AnimeDetails_Data.totalEpisodes, 10);
recomendation = AnimeDetails_Data.recommendations.map((user, i) => {
    const card = recommendationsTemplate.content.cloneNode(true).children[0];
    const AnimeTitle = card.querySelector(".recommendation-cards-txt");
    const AnimeImg = card.querySelector('.recommendation-img');
    const AnimeLink = card.querySelector('.recommendation-cards-img-container');
    AnimeTitle.textContent = user.title.romaji;
    AnimeImg.src = user.image;
    AnimeLink.href = '/' + 'anime-details' + '/' + user.id;
    recommendationsContainer.append(card);
    return { element: card };
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
AnimeDetails_Data.episodes.forEach(user => {
    const card = EpisodeTemplate.content.cloneNode(true).children[0];
    const AnimeTitle = card.querySelector(".Episode-cards-txt");
    const AnimeImg = card.querySelector('.Episode-img');
    const AnimeLink = card.querySelector('.Episode-img-container');
    AnimeTitle.textContent = 'episode '+ user.number;
    AnimeImg.src = user.image;
    let x = user.id.replace("-episode-", '')
    let y = x.replace(user.number, '')
    AnimeLink.href = '/watch-delete-previous/' + y + '?' + "id=" + user.number + "&num=" + AnimeDetails_Data.id+"&img="+user.image;
    EpisodeContainer.append(card);
});

let dubbed = document.getElementById("type-Dub")
let sub = document.getElementById("type-Sub")
dubbed.href = "/anime-details/" + animeId + "?dub=true";
sub.href = "/anime-details/" + animeId;

// SAVE DATA IN BROWSER
document.getElementById('bookmark-link').addEventListener('click', (e) => {
    if (UserName==="anonymous") {
        let Current_data = JSON.parse(localStorage.getItem('MyAnimeData'));
        let new_data = {
            animeId: animeId ,
            title: AnimeDetails_Data.title.romaji,
            Image: AnimeDetails_Data.image,
        };
        let y = Current_data.bookmark.filter(e=>e.animeId!==animeId)
        Current_data.bookmark = y;
        Current_data.bookmark.push(new_data);
        localStorage.setItem('MyAnimeData', JSON.stringify(Current_data));
    }else{
    window.location.href = "/bookmark-save-delete?animeId="+animeId+"&animeTitle="+AnimeDetails_Data.title.romaji+"&img="+AnimeDetails_Data.image;
    }
});

