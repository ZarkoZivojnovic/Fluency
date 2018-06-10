const searchDiv = document.getElementById("search"),
    searchBar = document.getElementById("searchBar"),
    searchForm = document.getElementById("searchForm"),
    showSearchBtn = document.getElementById("showSearchBtn");

showSearchBtn.addEventListener("click", event => {
    event.preventDefault();
    if (searchDiv.offsetHeight === 20) {
        searchTransform("big");
    } else {
        searchTransform("small");
    }
});

searchForm.addEventListener("submit", event => {
    event.preventDefault();
    let string = getStringForSearch();
    dovuciUsere("searchByUsername", string);
    show(loading);
    let interval = setInterval(() => {
        if (listaUseraIzBaze !== undefined) {
            searchForm.reset();
            searchTransform("small");
            hide(loading);
            clearInterval(interval);
        }
    }, 1000);
});

function searchTransform(property) {
    if (property === "small"){
        searchDiv.style.transform = "scale(1,1)";
        setTimeout(() => {
            searchDiv.style.maxHeight = "20px";
        }, 500)
    } else if (property==="big"){
        searchDiv.style.maxHeight = "300px";
        setTimeout(() => {
            searchDiv.style.transform = "scale(1.2,1.2)";
        }, 500)
    }
}

function getStringForSearch() {
    const string = searchBar.value;
    if (string.length < 3) {
        alert("word length can not be less than 3");
        return;
    }
    return string;
}