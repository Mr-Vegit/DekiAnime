// const params = {
//     "page":"1","genres":["Action","Adventure"]
// };

// const response = await fetch("https://cors.consumet.stream/https://api.consumet.org/meta/anilist/advanced-search");
// const animeRecents = await response.json();
// console.log(animeRecents);
// let x= document.getElementById("key").textContent.trim()
// console.log(x);


const userCardTemplate = document.querySelector('.recents-anime-template');
const userCardContainer = document.querySelector('#recents-anime-container');
const params= {method: 'GET'};
let proxy = 'https://cors.consumet.stream/';
let key = document.getElementById("key").textContent.trim();
let page = document.getElementById("pagename").textContent.trim();
let pagename = "page="+page;
let users=[];
const response = await fetch(proxy+'https://gogoanime.consumet.stream/genre/'+key+'?'+pagename,params);
const search = await response.json();
function limitWord(str, no_words) {
    return str.split(" ").splice(0,no_words).join(" ");
}
console.log(search);
users = search.map(user => {
    const card = userCardTemplate.content.cloneNode(true).children[0];
    const AnimeTitle = card.querySelector(".recents-anime-title");
    const AnimeImg = card.querySelector('.recents-anime-img');
    const AnimeLink = card.querySelector('.recents-anime-link');
    AnimeTitle.textContent =limitWord(user.animeTitle,7) ;
    AnimeImg.src = `${user.animeImg}`;
    AnimeLink.href = '/anime-details/'+user.animeId;
    userCardContainer.append(card); 
    return { name:user.episodeId,element:card};
});

let pagenum=parseInt(page,10)
let pages_li = Array.from(document.getElementsByClassName('pages-a'))
let first_page = document.getElementById("first-page")
let last_page = document.getElementById("last-page")
first_page.href = "/anime-list/1"+"?"+"genre="+key;
last_page.href = "/anime-list/22"+"?"+"genre="+key;
if (pagenum<=2) {
    pagenum=2
    let object = [
        {id:pagenum,num:pagenum,link:"/anime-list/"+pagenum+"?"+"genre="+key},
        {id:pagenum++,num:pagenum,link:"/anime-list/"+pagenum+"?"+"genre="+key},
        {id:pagenum++,num:pagenum,link:"/anime-list/"+pagenum+"?"+"genre="+key},
        {id:pagenum++,num:pagenum,link:"/anime-list/"+pagenum+"?"+"genre="+key},
        {id:pagenum++,num:pagenum,link:"/anime-list/"+pagenum+"?"+"genre="+key},
    ]
    pages_li.forEach((element, i) => {
       element.innerHTML = object[i].num  
       element.href = object[i].link  
    });
}else if(pagenum>2){
    pagenum++;
    let object = [
        {id:pagenum,num:pagenum,link:"/anime-list/"+pagenum+"?"+"genre="+key},
        {id:pagenum++,num:pagenum,link:"/anime-list/"+pagenum+"?"+"genre="+key},
        {id:pagenum++,num:pagenum,link:"/anime-list/"+pagenum+"?"+"genre="+key},
        {id:pagenum++,num:pagenum,link:"/anime-list/"+pagenum+"?"+"genre="+key},
        {id:pagenum++,num:pagenum,link:"/anime-list/"+pagenum+"?"+"genre="+key},
    ]
    pages_li.forEach((element, i) => {
       element.innerHTML = object[i].num  
       element.href = object[i].link  
    });

}
// else if(pagenum == 500){
//     pages_li.forEach((element) => {
//         element.style.display="none"
//      });
// }
else{
    pagenum=2
    let object = [
        {id:pagenum,num:pagenum,link:"/anime-list/"+pagenum+"?"+"genre="+key},
        {id:pagenum++,num:pagenum,link:"/anime-list/"+pagenum+"?"+"genre="+key},
        {id:pagenum++,num:pagenum,link:"/anime-list/"+pagenum+"?"+"genre="+key},
        {id:pagenum++,num:pagenum,link:"/anime-list/"+pagenum+"?"+"genre="+key},
        {id:pagenum++,num:pagenum,link:"/anime-list/"+pagenum+"?"+"genre="+key},
    ]
    pages_li.forEach((element, i) => {
       element.innerHTML = object[i].num  
       element.href = object[i].link  
    });
}