const userCardTemplate = document.querySelector('.recents-anime-template');
const userCardContainer = document.querySelector('#recents-anime-container');
const params= {method: 'GET'};
// let proxy = 'https://cors.consumet.stream/';
let key = document.getElementById("key").textContent.trim();
let page = document.getElementById("pagename").textContent.trim();
let pagename = "page="+page;
let users=[];
const response = await fetch('/api/search/'+key+'?'+pagename+"&perPage=25",params);
const search = await response.json();

// ERROR HANDLER & FUNCTIONS
if (!response.ok) {
    throw new Error ("bad response",{
        cause:{response}
    })
}
var count =Object.keys(search.results).length
if (count ===0) {
    document.getElementById("error").classList.remove("hide")
}
function limitWord(str, no_words) {
    return str.split(" ").splice(0,no_words).join(" ");
}

// ANIME CARD GENERATOR
users = search.results.map(user => {
    const card = userCardTemplate.content.cloneNode(true).children[0];
    const AnimeTitle = card.querySelector(".recents-anime-title");
    const AnimeImg = card.querySelector('.recents-anime-img');
    const AnimeLink = card.querySelector('.recents-anime-link');
    AnimeTitle.textContent = user.title.userPreferred;
    AnimeImg.src = user.image;
    // let x = encodeURI()
    // let y = user.title.userPreferred.replace(/\s+/g, '-').toLowerCase();
    AnimeLink.href = '/anime-details/' + user.id;
    userCardContainer.append(card);
    return { name: user.id, element: card };
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
    element.href = `/search?keyw=${key}&page=${pagenum-1}`
});