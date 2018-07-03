const addToFavsBtn = document.getElementById("addToFavsBtn"),
    favNavigation = document.getElementById("favNavigation"),
    favoritesList = document.getElementById("favoritesList"),
    blockBtn = document.getElementById("blockBtn"),
    blockList = document.getElementById("blockedList");

let listArr;

if (typeof myProfileData.myFavorites === "undefined") myProfileData.myFavorites = [];
if (typeof myProfileData.myBlockList === "undefined") myProfileData.myBlockList = [];

blockBtn.addEventListener("click", addOrRemoveFromList);
blockList.addEventListener("click", openProfile);
addToFavsBtn.addEventListener("click", addOrRemoveFromList);
favoritesList.addEventListener("click", openProfile);
favNavigation.addEventListener("click", refreshFavorites);

function openProfile(event) {
    if (event.target !== event.currentTarget) {
        let id = event.target.id.split("_")[0];
        if (id === "") {
            id = event.target.parentNode.id.split("_")[0]
        }
        let userInfo = convertUserInfoForProfileDraw(listArr[id]);
        drawProfile(userInfo);
    }
}

function addOrRemoveFromList(event) {
    event.stopPropagation();
    let favOrBlock = event.target.id === "blockBtn" ? myProfileData.myBlockList : myProfileData.myFavorites;
    let user = event.target.name;
    if (favOrBlock.indexOf(user) === -1) {
        favOrBlock.push(user);
        if (favOrBlock === myProfileData.myBlockList) {
            blockBtn.textContent = "Unblock";
        } else {
            addToFavsBtn.textContent = "Remove From Favorites";
        }
    } else {
        let index = favOrBlock.indexOf(user);
        favOrBlock.splice(index, 1);
        if (favOrBlock === myProfileData.myBlockList) {
            blockBtn.textContent = "Block";
            showMyBlockList();
        } else {
            addToFavsBtn.textContent = "Add To Favorites";
            showMyFavorites();
        }
    }
    updateInformationsInDatabase(userUid, myProfileData);
}

function drawList(appendToElement, arr, string) {
    appendToElement.innerHTML = "";
    if (arr.length === 0) appendToElement.innerHTML = "<h3 class='noUsersMsg'>Empty List</h3>";
    listArr = [];
    let div = document.createElement("div");
    div.classList.add(string + "List");
    div.classList.add("hideScrollbar");
    for (let index = 0; index < arr.length; index++) {
        listArr.push(arr[index]);
        let profileDiv = document.createElement("div"),
            photoDiv = document.createElement("div"),
            username = document.createElement("h3"),
            status = document.createElement("p");
        profileDiv.setAttribute("id", arr.indexOf(arr[index]) + "_id");
        profileDiv.classList.add(string + "Div");
        if (typeof arr[index].profilePhoto !== "undefined") {
            photoDiv.style.backgroundImage = "url('" + arr[index].profilePhoto + "')";
            photoDiv.style.backgroundSize = "cover";
        }
        photoDiv.classList.add(string + "Photo");
        username.innerText = arr[index].username;
        username.classList.add(string + "Username");
        status.innerText = arr[index].status;
        status.classList.add(string + "Status");
        status.style.color = "#ac2100";
        if (arr[index].status === "online") {
            status.style.color = "#08ac00";
        } else if (arr[index].status === "away") {
            status.style.color = "#9dab00";
        }
        profileDiv.appendChild(photoDiv);
        profileDiv.appendChild(username);
        profileDiv.appendChild(status);
        div.appendChild(profileDiv);
    }
    appendToElement.appendChild(div);
}

function refreshFavorites(event) {
    event.preventDefault();
    if (event.target !== event.currentTarget) {
        const allFavs = document.getElementById("aFavs"),
            onlineFavs = document.getElementById("oFavs"),
            darkColor = "rgba(0, 0, 0, 0.4)",
            whiteColor = "rgba(255, 255, 255, 0.1)";
        let favorites;
        if (event.target.id === "allFavs") {
            [allFavs.style.backgroundColor, onlineFavs.style.backgroundColor] = [darkColor, whiteColor];
            favorites = new Array(dovuciUsere("favs"));
        } else if (event.target.id === "onlineFavs") {
            [allFavs.style.backgroundColor, onlineFavs.style.backgroundColor] = [whiteColor, darkColor];
            favorites = new Array(dovuciUsere("favs", "", "online"));
        }
        show(loading);
        setTimeout(function () {
            drawList(favoritesList, favorites[0]);
            hide(loading);
        }, 500);
    }
}