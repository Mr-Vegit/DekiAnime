const userCardTemplate = document.querySelector('.recents-anime-template');
const userCardContainer = document.querySelector('#recents-anime-container');
const params= {method: 'GET'};
// let proxy = 'https://cors.consumet.stream/';
let page = document.getElementById("pagename").textContent.trim();
let pagename = "page="+page;
let users=[];
const response = await fetch('/anilist/anime-movies?'+pagename+"&perPage=25");
const Movies = await response.json();

// ANIME CARD GENERATOR
users = Movies.results.map(user => {
    const card = userCardTemplate.content.cloneNode(true).children[0];
    const AnimeTitle = card.querySelector(".recents-anime-title");
    const AnimeImg = card.querySelector('.recents-anime-img');
    const AnimeLink = card.querySelector('.recents-anime-link');
    AnimeTitle.textContent =user.title.romaji ;
    AnimeImg.src = user.image;
    AnimeLink.href = '/anime-details/'+user.id;
    userCardContainer.append(card); 
    return { name:user.episodeId,element:card};
});


// PAGE GENERATOR
let pagenum = +page;
let pages_li = Array.from(document.getElementsByClassName('pages-a'))
if (pagenum >= 498) {
    pagenum = 498;
}else if(pagenum <=3){
    pagenum = 3;
}
pagenum =pagenum-2;
pages_li.forEach((element) => {
    element.innerHTML = pagenum++;
    element.href = `/movies/${pagenum-1}`
});