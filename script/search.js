const searchDiv = document.getElementById("search"),
    searchBar = document.getElementById("searchBar"),
    searchForm = document.getElementById("searchForm"),
    showSearchBtn = document.getElementById("showSearchBtn");
let results;

showSearchBtn.addEventListener("click", event => {
    console.log(searchDiv.offsetHeight);
   if (searchDiv.offsetHeight===20){
       searchDiv.style.maxHeight= "620px";
   } else {
       searchDiv.style.maxHeight= "20px";
   }
});

searchForm.addEventListener("submit", event => {
    event.preventDefault();
    let string = getStringForSearch();
    searchInBase(string);
    show(loading);
    let interval = setInterval(()=>{
       if (results !== undefined)  {
           searchForm.reset();
           searchDiv.style.maxHeight= "20px";
           hide(loading);
           clearInterval(interval);
       }
    },1000);
});

function getStringForSearch() {
    const string = searchBar.value;
    if (string.length < 3) {
        alert("word length can not be less than 3");
        return;
    }
    return string;
}

function searchInBase(string) {
    results = [];
    firebase.database().ref('users/').once('value').then(function (snapshot) {
        snapshot.forEach(function (userSnapshot) {
            let  user = userSnapshot.val();
            if (user.username.includes(string)) {
                results.push(user);
            }
        });
        prikaziUsere(results);
    });
}