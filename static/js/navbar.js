function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  }
  
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}
function openSearch(){
  let search = document.getElementById("Search-Catagories");
  if(search.classList.contains("Search-Active")){
      search.classList.add("Search-Passive")
      search.classList.remove("Search-Active")
  }else{
      search.classList.add("Search-Active")
      search.classList.remove("Search-Passive")
  }}
let search_Input = document.getElementById("Search-Input")
let search_link = document.getElementById("Search-link")
search_Input.addEventListener("input",()=> {
  // const value = e.target.value.toLowerCase() 
  search_link.href= "/search?keyw="+search_Input.value;
  });
let search_Side = document.getElementById("Search-Side")
let search_Side_Link = document.getElementById("Search-Side-link")
search_Side.addEventListener("input",()=> {
  // const value = e.target.value.toLowerCase() 
  search_Side_Link.href= "/search?keyw="+search_Side.value;
  });