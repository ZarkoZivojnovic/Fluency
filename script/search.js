const searchDiv = document.getElementById("search"),
    searchBar = document.getElementById("searchBar"),
    searchForm = document.getElementById("searchForm"),
    showSearchBtn = document.getElementById("showSearchBtn"),
    background = document.getElementById("noticeBackground");

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
    let string = getStringForSearch().toLowerCase();
    let matchArr = new Array(dovuciUsere("search", string));
    if (!string) {
        return;
    }
    show(loading);
    setTimeout(() => {
        searchTransform("small");
        if (string === "all") {
            showChannels();
        } else {
            prikaziUsere(matchArr[0]);
        }
        searchForm.reset();
        hide(loading);
    }, 1000);
});

function searchTransform(property) {
    if (property === "small") {
        searchDiv.style.transform = "scale(1,1)";
        setTimeout(() => {
            searchDiv.style.maxHeight = "20px";
            hide(background);
            background.removeEventListener("click", hideSearchBarHandler);
        }, 500)
    } else if (property === "big") {
        searchDiv.style.maxHeight = "300px";
        setTimeout(() => {
            searchDiv.style.transform = "scale(1.2,1.2)";
            show(background);
            background.addEventListener("click", hideSearchBarHandler);
        }, 500)
    }
}

function getStringForSearch() {
    const string = searchBar.value;
    if (string.length === 0) {
        alert("all online users");
        return "all";
    }
    if (string.length < 3) {
        alert("word length can not be less than 3");
        return false;
    }
    return string;
}

function hideSearchBarHandler(event) {
    if (searchDiv.offsetHeight > 20) {
        event.preventDefault();
        searchTransform("small");
    }
}