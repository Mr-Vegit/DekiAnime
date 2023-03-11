const userCardTemplate = document.querySelector('.recents-anime-template');
const userCardContainer = document.querySelector('#recents-anime-container');
const params= {method: 'GET'};
// let proxy = 'https://cors.consumet.stream/';
let page = document.getElementById("pagename").textContent.trim();
let pagename = "page="+page;
let users=[];
const response = await fetch('/anilist/anime-movies?'+pagename+"&perPage=25");
const Movies = await response.json();
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
let pagenum=parseInt(page,10)
let pages_li = Array.from(document.getElementsByClassName('pages-a'))
if (pagenum<=2) {
    pagenum=2
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
}else if(pagenum>2){
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