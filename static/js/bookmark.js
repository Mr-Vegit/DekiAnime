let UserName = document.getElementById("user").textContent.trim();
const userCardTemplate = document.querySelector('.recents-anime-template');
const userCardContainer = document.querySelector('#recents-anime-container');
// let proxy = 'https://cors.consumet.stream/';
let users = [];
let Movies = [];
if (UserName==="anonymous") {
    let x = JSON.parse(localStorage.getItem('MyAnimeData'))
    Movies = x.bookmark;
}else{
const response = await fetch('/user-data');
let x = await response.json();
Movies = x.bookmark;
}
users = Movies.slice(0).reverse().map(user => {
    const card = userCardTemplate.content.cloneNode(true).children[0];
    const AnimeTitle = card.querySelector(".recents-anime-title");
    const AnimeImg = card.querySelector('.recents-anime-img');
    const AnimeLink = card.querySelector('.recents-anime-link');
    const bookmarkDelete = card.querySelector('.bookmark-delete');
    AnimeTitle.textContent = user.title;
    AnimeImg.src = user.Image;
    AnimeLink.href = '/anime-details/' + user.animeId;
    bookmarkDelete.href = '/bookmark-delete?animeId=' + user.animeId;
    userCardContainer.append(card);
    return {element: card };
});