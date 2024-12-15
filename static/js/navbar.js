function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}
function openSearch() {
  let search = document.getElementById("Search-Catagories");
  if (search.classList.contains("Search-Active")) {
    search.classList.add("Search-Passive")
    search.classList.remove("Search-Active")
  } else {
    search.classList.add("Search-Active")
    search.classList.remove("Search-Passive")
  }
}
let search_Input = Array.from(document.querySelectorAll(".Search>input"))
search_Input.forEach(e => {
  e.onsearch = () => {
    console.log(search_Input.value);
    window.location.href = "/search?keyw=" + e.value;
    // search_link.href= "/search?keyw="+search_Input.value;
  };
})
let UserName = document.getElementById("user").textContent.trim();
if (UserName === "anonymous") {
  document.getElementById("Login_Logout_Btn").textContent = "Login"
} else {
  document.getElementById("Login_Logout_Btn").textContent = 'Logout'
}


