const userCardTemplate = document.querySelector('.recents-anime-template');
const userCardContainer = document.querySelector('#recents-anime-container');
const params= {method: 'GET'};
// let proxy = 'https://cors.consumet.stream/';
let key = document.getElementById("key").textContent.trim();
let page = document.getElementById("pagename").textContent.trim();
let pagename = "page="+page;
let users=[];

const response = await fetch('/anilist/search/'+key+'?'+pagename+"&perPage=25",params);
const search = await response.json();
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
console.log(search);
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


let pagenum=parseInt(page,10)
let pages_li = Array.from(document.getElementsByClassName('pages-a'))
if(pagenum>2){
    pagenum++;
    let object = [
        {id:pagenum,num:pagenum,link:"/movies/"+pagenum},
        {id:pagenum++,num:pagenum,link:"/movies/"+pagenum},
        {id:pagenum++,num:pagenum,link:"/movies/"+pagenum},
        {id:pagenum++,num:pagenum,link:"/movies/"+pagenum},
        {id:pagenum++,num:pagenum,link:"/movies/"+pagenum},
    ]
    pages_li.forEach((element, i) => {
       element.innerHTML = object[i].num  
       element.href = object[i].link  
    });

}
else{
    pagenum=2
    let object = [
        {id:pagenum,num:pagenum,link:"/movies/"+pagenum},
        {id:pagenum++,num:pagenum,link:"/movies/"+pagenum},
        {id:pagenum++,num:pagenum,link:"/movies/"+pagenum},
        {id:pagenum++,num:pagenum,link:"/movies/"+pagenum},
        {id:pagenum++,num:pagenum,link:"/movies/"+pagenum},
        {id:pagenum++,num:pagenum,link:"/movies/"+pagenum},
    ]
    pages_li.forEach((element, i) => {
       element.innerHTML = object[i].num  
       element.href = object[i].link  
    });
}