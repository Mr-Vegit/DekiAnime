let episodeName = document.getElementById("video-name").textContent.trim();
let episodeNum = document.getElementById("video-num").textContent.trim();
let AnimeId = document.getElementById("video-id").textContent.trim();
let AnimeImg = document.getElementById("video-img").textContent.trim();
let episodeId = episodeName + "-episode-" + episodeNum;
// let proxy = "113.160.209.113:19132/";
let proxy = "";
var videoSrc = "";
let NumberOfAnime = 0;
let AnimeName = document.getElementById('animeLink')

const params = {
  method: 'GET',
};

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
console.log(episodeId);
const response = await fetch("https://api.consumet.org/meta/anilist/watch/" + episodeId);
const animePlayLinks = await response.json();
console.log(animePlayLinks);
var count = Object.keys(animePlayLinks.sources).length;
let Qualitynum = 0;
for (let i = 0; i < count; i++) {
  if (animePlayLinks.sources[i].quality.includes("default")) {
    Qualitynum = i;
  }
}
let linkQuality = animePlayLinks.sources.map(user => ({
  html: user.quality, url: proxy+user.url
}));
const art = new Artplayer({
  container: '.artplayer-app',
  url: proxy+linkQuality[Qualitynum].url,
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
let num = 0;
if (isNaN(AnimeId)) {
  const info = await fetch('/anilist/search/' + episodeName+"?page=1&perPage=1");
  const search = await info.json();
  if (!info.ok) {
    throw new Error("bad response", {
      cause: { info }
    })
  }
  num = +search.results[0].totalEpisodes;
  NumberOfAnime = +search.results[0].id;
  AnimeName.href = "/anime-details/" + NumberOfAnime;
} else {
  NumberOfAnime = +AnimeId;
  AnimeName.href = "/anime-details/" + NumberOfAnime;
}
let episodeNumber = parseInt(episodeNum, 10)
let prev = document.getElementById('prev')
let next = document.getElementById('next')
if (num === episodeNumber) {
  prev.href = '/anime-watch/' + episodeName + '?id=' + `${episodeNumber - 1}` + "&num=" + NumberOfAnime+"&img="+AnimeImg;
  next.style.backgroundColor = 'rgb(114, 20, 201)';
}
else {
  prev.href = '/anime-watch/' + episodeName + '?id=' + `${episodeNumber - 1}` + "&num=" + NumberOfAnime+"&img="+AnimeImg;
  next.href = '/anime-watch/' + episodeName + '?id=' + `${episodeNumber + 1}` + "&num=" + NumberOfAnime+"&img="+AnimeImg;
}
