const userCardTemplate = document.querySelector('.recents-anime-template');
const userCardContainer = document.querySelector('#recents-anime-container');
let Season_selector = document.getElementById('Season-Options');
let Query_Search_Input = document.getElementById('Query-Search-Input');
let format_selector = document.getElementById('Format-Options');
let Status_selector = document.getElementById('Status-Options');
let genre_options = Array.from(document.querySelectorAll('#Genres-Options>p'))
let Advanced_Search_link = document.getElementById('search_Url');
let Anilist_url = Advanced_Search_link.textContent.trim();
let users = [];
let type = 0;
const params = {
    method: 'GET',
};
// let proxy = 'https://cors.consumet.stream/';
let page = document.getElementById("pagename").textContent.trim();
let pagename = "page=" + page;
let Popular_url = '/anilist/trending?' + pagename + "&perPage=25";
const response = await fetch(Popular_url, params);
let animeRecents = await response.json();
function limitWord(str, no_words) {
    return str.split(" ").splice(0, no_words).join(" ");
}

// ANIME CARD GENERATOR
function card_generator(animeRecents, data) {
    data = animeRecents.results.map(user => {
        const card = userCardTemplate.content.cloneNode(true).children[0];
        const AnimeTitle = card.querySelector(".recents-anime-title");
        const AnimeImg = card.querySelector('.recents-anime-img');
        const AnimeLink = card.querySelector('.recents-anime-link');
        AnimeTitle.textContent = limitWord(user.title.userPreferred, 7);
        AnimeImg.src = user.image;
        AnimeLink.href = '/anime-details/' + user.id;
        userCardContainer.append(card);
        return { name: user.id, element: card };
    });
    return data;
}
users = card_generator(animeRecents, users);

// ADVANCED SEARCH FEATURE
document.getElementById('search-Anilist').addEventListener('click', async (e) => {
    let Advanced_Url = '/anilist/advanced-search?' + Advanced_Search_link.textContent;
    const response_for_Advance = await fetch(Advanced_Url, params);
    animeRecents = await response_for_Advance.json();
    users.forEach(user => {
        user.element.remove();
    })
    users = card_generator(animeRecents, users);
    type = 1;

})
Query_Search_Input.onsearch = () => {
    console.log(Query_Search_Input.value);
    Anilist_url = Anilist_url + '&query=' + Query_Search_Input.value;
    if (Query_Search_Input.value === '') {
        Anilist_url = '';
        Season_selector.selectedIndex = 0;
        format_selector.selectedIndex = 0;
        Status_selector.selectedIndex = 0;
        genre_options.forEach(e => {
            e.classList.remove('genre_active');
            e.classList.add('genre_Inactive');
        })
    }
    Advanced_Search_link.textContent = Anilist_url;
    let Anilist_url_Obj = JSON.parse(Anilist_url);
    console.log(Anilist_url_Obj);
}
Season_selector.onchange = (ev) => {
    // REFERENCE
    // https://www.educative.io/answers/how-to-get-the-selected-value-of-the-dropdown-list-in-javascript
    let Season_Index = Season_selector.selectedIndex;
    let selectedOption = Season_selector.options[Season_Index];
    let season_array = ['&season=WINTER', '&season=SPRING', '&season=SUMMER', '&season=FALL', '&season=undefined']
    for (let i = 0; i < 5; i++) {
        Anilist_url = Anilist_url.replace(season_array[i], '');
    }
    Anilist_url = Anilist_url + '&season=' + selectedOption.value;
    Advanced_Search_link.textContent = Anilist_url;
}
format_selector.onchange = (ev) => {
    let format_Index = format_selector.selectedIndex;
    let selectedOption = format_selector.options[format_Index];
    let format_array = ['&format=TV', '&format=TV_SHORT', '&format=MOVIE', '&format=SPECIAL', '&format=OVA', '&format=ONA', '&format=MUSIC', '&format=undefined']
    for (let i = 0; i < 5; i++) {
        Anilist_url = Anilist_url.replace(format_array[i], '');
    }
    Anilist_url = Anilist_url + '&format=' + selectedOption.value;
    Advanced_Search_link.textContent = Anilist_url;

}
Status_selector.onchange = (ev) => {
    let Status_Index = Status_selector.selectedIndex;
    let selectedOption = Status_selector.options[Status_Index];
    let status_array = ['&status=RELEASING', '&status=FINISHED', '&status=NOT_YET_RELEASED', '&status=FALL', '&status=CANCELLED', '&status=undefined']
    for (let i = 0; i < 5; i++) {
        Anilist_url = Anilist_url.replace(status_array[i], '');
    }
    Anilist_url = Anilist_url + '&status=' + selectedOption.value;
    Advanced_Search_link.textContent = Anilist_url;
}
genre_options.forEach(e => {
    e.addEventListener('click', () => {
        e.classList.toggle('genre_active');
        e.classList.toggle('genre_Inactive');
        let genre_selected = '&genre[]=' + e.textContent.trim();
        if (Anilist_url.includes(genre_selected)) {
            Anilist_url = Anilist_url.replace(genre_selected, '');
            Advanced_Search_link.textContent = Anilist_url;;
        }
        else {
            Anilist_url = Anilist_url + genre_selected;
            Advanced_Search_link.textContent = Anilist_url;
        }
    })
})

// PAGE GENERATOR
let pagenum = +page;
let pages_li = Array.from(document.getElementsByClassName('pages-a'))
if (pagenum >= 498) {
    pagenum = 498;
} else if (pagenum <= 3) {
    pagenum = 3;
}
pagenum = pagenum - 2;
pages_li.forEach((element) => {
    element.innerHTML = pagenum++;
    element.addEventListener('click', async () => {
        if (type === 0) {
            window.location.href = `/Popular-Anime/${element.innerHTML}`
        }
        else {
            users.forEach(user => {
                user.element.remove();
            })
            let Advanced_Url = `/anilist/advanced-search?${Advanced_Search_link.textContent}&page=${element.innerHTML}`;
            const response_for_Advance = await fetch(Advanced_Url);
            animeRecents = await response_for_Advance.json();
            users = card_generator(animeRecents, users);
            let x = +element.innerHTML;
            if (x >= 28) {
                x = 28;
            }
            x = x-2;
            pages_li.forEach((el) => {
                el.innerHTML = x++;
            })
        }
    });
});
let First_Page = document.getElementById('first-page');
let Last_Page = document.getElementById('last-page');
First_Page.addEventListener('click', async () => {
    if (type === 0) {
        window.location.href = `/Popular-Anime/1`
    }
    else {
        users.forEach(user => {
            user.element.remove();
        })
        let Advanced_Url = `/anilist/advanced-search?${Advanced_Search_link.textContent}&page=1`;
        const response_for_Advance = await fetch(Advanced_Url);
        animeRecents = await response_for_Advance.json();
        users = card_generator(animeRecents, users);
        let x = 1;
        pages_li.forEach((el) => {
            el.innerHTML = x++;
        })
    }
});
Last_Page.addEventListener('click', async () => {
    if (type === 0) {
        window.location.href = `/Popular-Anime/500`
    }
    else {
        users.forEach(user => {
            user.element.remove();
        })
        let Advanced_Url = `/anilist/advanced-search?${Advanced_Search_link.textContent}&page=30`;
        const response_for_Advance = await fetch(Advanced_Url);
        animeRecents = await response_for_Advance.json();
        users = card_generator(animeRecents, users);
        let x = 26;
        pages_li.forEach((el) => {
            el.innerHTML = x++;
        })
    }
});


// https://api.consumet.org/meta/anilist/advanced-search
// WORKS
// var grades = { 'Jackie Davidson': 'A', 'Emil Erhardt': 'A-', 'Steve McKnight': 'C' };
// const searchParams = new URLSearchParams(grades)
// const queryString= searchParams.toString();
// console.log(queryString);
