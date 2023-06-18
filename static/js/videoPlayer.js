let UserName = document.getElementById("user").textContent.trim();
let episodeName = document.getElementById("video-name").textContent.trim();
let episodeNum = document.getElementById("video-num").textContent.trim();
let AnimeId = document.getElementById("video-id").textContent.trim();
let AnimeImg = document.getElementById("video-img").textContent.trim();
let episodeId = episodeName + "-episode-" + episodeNum;
let proxy = "";
var videoSrc = "";
let NumberOfAnime = 0;
let AnimeName = document.getElementById('animeLink')
const params = {
  method: 'GET',
};

// SAVE DATA IN BROWSER
if (UserName==="anonymous") {
  let MyAnimeData = localStorage.getItem('MyAnimeData');
  let Current_data = JSON.parse(MyAnimeData);
  let new_data = {
    episodeName: episodeName,
    animeId: AnimeId,
    img: AnimeImg,
    episodeNum: episodeNum,
  };
  let y = Current_data.WatchHistory.filter(e=>e.episodeName!==episodeName)
  Current_data.WatchHistory = y;
  Current_data.WatchHistory.push(new_data);
  localStorage.setItem('MyAnimeData', JSON.stringify(Current_data));
}


function playM3u8(video, url, art) {
  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(video);
    art.hls = hls;
    art.once('url', () => hls.destroy());
    art.once('destroy', () => hls.destroy());
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = url;
  } else {
    art.notice.show = 'Unsupported playback format: m3u8';
  }
}
async function Main_Video_Player() {//MAIN VIDEO PLAYER
  const response = await fetch("/anilist/watch/" + episodeId);
  // const response = await fetch("https://cors.dekianime.site/dekianime.site/anilist/watch/" + episodeId);
  const animePlayLinks = await response.json();
  console.log(animePlayLinks);
  let linkQuality = animePlayLinks.sources.map(user => ({
    html: user.quality, url: proxy + user.url
  }));
  const art = new Artplayer({
    container: '.artplayer-app',
    url: proxy + linkQuality[0].url,
    type: 'm3u8',
    // isLive: true,
    playbackRate: true,
    setting: true,
    hotkey: true,
    pip: true,
    autoOrientation: true,
    fastForward: true,
    lock: true,
    fullscreen: true,
    miniProgressBar: true,
    // fullscreenWeb: true,
    customType: {
      m3u8: playM3u8,
    },
    quality: linkQuality
  });
  let animeLinkDownload = animePlayLinks.download;
  let downloadLink = animeLinkDownload.replace("https://gogohd.net/", "https://anihdplay.com/")
  document.getElementById('animeDownloadLink').href = downloadLink;
}
async function VideoServers() {//SERVERS
  const Server_Search = await fetch('/anilist/server/' + episodeId);
  const Server_result = await Server_Search.json();
  console.log(Server_result);
}

async function AnimeDetail_Prev_Next() {//Anime Details and PREV NEXT
  let num = 0;
  if (isNaN(AnimeId)) {
    const info = await fetch('/anilist/search/' + episodeName + "?page=1&perPage=1");
    const search = await info.json();
    if (!info.ok) {
      throw new Error("bad response", {
        cause: { info }
      })
    }
    // console.log(search);
    num = +search.results[0].currentEpisodeCount;
    NumberOfAnime = +search.results[0].id;
    AnimeName.href = "/anime-details/" + NumberOfAnime;
  } else {
    NumberOfAnime = +AnimeId;
    AnimeName.href = "/anime-details/" + NumberOfAnime;
  }
  let episodeNumber = parseInt(episodeNum, 10)
  let prev = document.getElementById('prev')
  let next = document.getElementById('next')
  // console.log(num);
  // console.log(episodeNumber);
  if (num === episodeNumber) {
    prev.href = '/watch-delete-previous/' + episodeName + '?id=' + `${episodeNumber - 1}` + "&num=" + NumberOfAnime + "&img=" + AnimeImg;
    // color: slategray;
    // background-color: #0c004a;
    next.style.backgroundColor = '#0c004a';
    next.style.color = 'slategray';
  }
  else if (episodeNumber === 1) {
    prev.style.backgroundColor = '#0c004a';
    prev.style.color = 'slategray';
    // prev.style.backgroundColor = 'rgb(114, 20, 201)';
    next.href = '/watch-delete-previous/' + episodeName + '?id=' + `${episodeNumber + 1}` + "&num=" + NumberOfAnime + "&img=" + AnimeImg;
  }
  else {
    prev.href = '/watch-delete-previous/' + episodeName + '?id=' + `${episodeNumber - 1}` + "&num=" + NumberOfAnime + "&img=" + AnimeImg;
    next.href = '/watch-delete-previous/' + episodeName + '?id=' + `${episodeNumber + 1}` + "&num=" + NumberOfAnime + "&img=" + AnimeImg;
  }
}
Main_Video_Player();
VideoServers();
AnimeDetail_Prev_Next();
console.log('Read the last line of the file');