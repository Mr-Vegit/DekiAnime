const userCardTemplate = document.querySelector('.recents-anime-template');
const userCardContainer = document.querySelector('#recents-anime-container');
let users=[];
const params= {
    method: 'GET',
};
// let proxy = 'https://cors.consumet.stream/';
let page = document.getElementById("pagename").textContent.trim();
let pagename = "page="+page;
const response = await fetch('/anilist/trending?'+pagename+"&perPage=25",params);
const animeRecents = await response.json();
function limitWord(str, no_words) {
    return str.split(" ").splice(0,no_words).join(" ");
}

// ANIME CARD GENERATOR
console.log(animeRecents);
users = animeRecents.results.map(user => {
    const card = userCardTemplate.content.cloneNode(true).children[0];
    const AnimeTitle = card.querySelector(".recents-anime-title");
    const AnimeImg = card.querySelector('.recents-anime-img');
    const AnimeLink = card.querySelector('.recents-anime-link');
    AnimeTitle.textContent =limitWord(user.title.userPreferred,7) ;
    AnimeImg.src = user.image;
    AnimeLink.href = '/anime-details/'+user.id;
    userCardContainer.append(card); 
    return { name:user.id,element:card};
});

// PAGE GENERATOR
let pagenum=parseInt(page,10)
let pages_li = Array.from(document.getElementsByClassName('pages-a'))
if (pagenum<=2) {
    pagenum=2
    let object = [
        {id:pagenum,num:pagenum,link:"/Popular-Anime/"+pagenum},
        {id:pagenum++,num:pagenum,link:"/Popular-Anime/"+pagenum},
        {id:pagenum++,num:pagenum,link:"/Popular-Anime/"+pagenum},
        {id:pagenum++,num:pagenum,link:"/Popular-Anime/"+pagenum},
        {id:pagenum++,num:pagenum,link:"/Popular-Anime/"+pagenum},
    ]
    pages_li.forEach((element, i) => {
       element.innerHTML = object[i].num  
       element.href = object[i].link  
    });
}else if(pagenum>2){
    pagenum++;
    let object = [
        {id:pagenum,num:pagenum,link:"/Popular-Anime/"+pagenum},
        {id:pagenum++,num:pagenum,link:"/Popular-Anime/"+pagenum},
        {id:pagenum++,num:pagenum,link:"/Popular-Anime/"+pagenum},
        {id:pagenum++,num:pagenum,link:"/Popular-Anime/"+pagenum},
        {id:pagenum++,num:pagenum,link:"/Popular-Anime/"+pagenum},
    ]
    pages_li.forEach((element, i) => {
       element.innerHTML = object[i].num  
       element.href = object[i].link  
    });

}
else{
    pagenum=2
    let object = [
        {id:pagenum,num:pagenum,link:"/Popular-Anime/"+pagenum},
        {id:pagenum++,num:pagenum,link:"/Popular-Anime/"+pagenum},
        {id:pagenum++,num:pagenum,link:"/Popular-Anime/"+pagenum},
        {id:pagenum++,num:pagenum,link:"/Popular-Anime/"+pagenum},
        {id:pagenum++,num:pagenum,link:"/Popular-Anime/"+pagenum},
        {id:pagenum++,num:pagenum,link:"/Popular-Anime/"+pagenum},
    ]
    pages_li.forEach((element, i) => {
       element.innerHTML = object[i].num  
       element.href = object[i].link  
    });
}
// let search_season =Array.from(document.getElementById("Season-Options").getElementsByTagName("p"));
// search_season.forEach(element => {
//     element.addEventListener("click",()=>{
//         // let x= element.textContent.trim();
//         element.classList.add("Search-Active-Seasons")
//         element.style.backgroundColor="#3d3148";
//     })
// });
// https://api.consumet.org/meta/anilist/advanced-search
// WORKS
// var grades = { 'Jackie Davidson': 'A', 'Emil Erhardt': 'A-', 'Steve McKnight': 'C' };
// const searchParams = new URLSearchParams(grades)
// const queryString= searchParams.toString();
// console.log(queryString);
