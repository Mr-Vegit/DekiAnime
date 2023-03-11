let animeId = document.getElementById('animeName').textContent.trim();
let proxy = 'https://cors.consumet.stream/';
const response = await fetch(proxy+'https://gogoanime.consumet.stream/anime-details/'+animeId);
const data = await response.json();
let img = document.getElementById('anime-img');
img.src=`${proxy+data.animeImg}`
Array.from(document.getElementsByClassName('anime-title')).forEach(element => {
    element.innerText= data.animeTitle;
});
Array.from(document.getElementsByClassName('anime-other-names')).forEach(element => {
    element.innerText= data.otherNames;
});
Array.from(document.getElementsByClassName('anime-total-episodes')).forEach(element => {
    element.innerText= data.totalEpisodes;
});
Array.from(document.getElementsByClassName('anime-type')).forEach(element => {
    element.innerText= data.type;
});
Array.from(document.getElementsByClassName('anime-Status')).forEach(element => {
    element.innerText= data.status;
});
Array.from(document.getElementsByClassName('anime-Status')).forEach(element => {
    element.innerText=data.releasedDate
});
let description = data.synopsis;
let info = description.replace(/[^a-zA-Z0-9 ]/g, '\xA0');
document.getElementById('anime-description').innerText = info;
let genra=Array.from(document.getElementsByClassName('anime-genre-container'))
var count = Object.keys(data.genres).length;
genra.forEach((element) => {
    for (let i = 0; i < count; i++) {
        let para = document.createElement("p"); 
        para.innerHTML = data.genres[i];
        para.classList.add("genre-btn")
        element.appendChild(para);
    }
});

let episode_Container=document.getElementById('Episode-Container')
var Episode_number = parseInt(data.totalEpisodes,10);
for (let i = 0; i < Episode_number; i++) {
    let para = document.createElement("a"); 
    para.innerHTML = data.episodesList[i].episodeNum;
    para.href = '/'+'anime-watch'+'/'+animeId+'?'+"id="+data.episodesList[i].episodeNum;
    episode_Container.appendChild(para);
}
const Result_Dub = await fetch(proxy+'https://api.consumet.org/anime/animefox/info?id='+animeId+"-dub");
const InfoResult = await Result_Dub.json();
if (InfoResult.hasDub) {
        let dub = document.getElementById("type-Dub")
        dub.href = "/movie-details/"+animeId+"-dub";
}else{
    let sub = document.getElementById("type-Sub")
    let subbed =animeId.replace('-dub', '');
    sub.href = "/movie-details/"+subbed;
}