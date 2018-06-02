let addToFavsBtn = document.getElementById("addToFavsBtn"),
    favNavigation = document.getElementById("favNavigation"),
    favoritesList = document.getElementById("favoritesList"),
    favListArr;

if (typeof myProfileData.myFavorites === "undefined") myProfileData.myFavorites = [];

addToFavsBtn.addEventListener("click", addOrRemoveFromFavs);
favNavigation.addEventListener("click", refreshFavorites);
favoritesList.addEventListener("click", openProfile);

function openProfile(event) {
    if (event.target !== event.currentTarget) {
        let id = event.target.id.split("_")[0];
        if (id===""){
            id = event.target.parentNode.id.split("_")[0]
        }
        drawProfile(favListArr[id]);
    }
}

function refreshFavorites(event) {
    event.preventDefault();
    console.log(event.target.id);
    if (event.target !== event.currentTarget) {
        if (event.target.id === "allFavs") {
            document.getElementById("aFavs").style.backgroundColor = "rgba(0, 0, 0, 0.4)";
            document.getElementById("oFavs").style.backgroundColor = "rgba(255, 255, 255, 0.1)";
            showFavs(myProfileData.myFavorites);
        } else if (event.target.id === "onlineFavs") {
            document.getElementById("aFavs").style.backgroundColor = "rgba(255, 255, 255, 0.1)";
            document.getElementById("oFavs").style.backgroundColor = "rgba(0, 0, 0, 0.4)";
            showFavs(myProfileData.myFavorites, "online");
        }
    }
}

function addOrRemoveFromFavs(event) {
    event.stopPropagation();
    let user = event.target.name;
    if (user === myProfileData.username) return;
    if (myProfileData.myFavorites.indexOf(user) === -1) {
        myProfileData.myFavorites.push(user);
        addToFavsBtn.textContent = "Remove From Favorites";
    } else {
        let index = myProfileData.myFavorites.indexOf(myProfileData.myFavorites[user]);
        myProfileData.myFavorites.splice(index, 1);
        addToFavsBtn.textContent = "Add To Favorites";
    }
    updateInformationsInDatabase(userUid, myProfileData);
}

function drawFavsList(appendToElement, arr) {
    appendToElement.innerHTML = "";
    let div = document.createElement("div");
    div.classList.add("favsList");
    div.classList.add("hideScrollbar");
    for (let fav = 0; fav < arr.length; fav++) {
        let favDiv = document.createElement("div"),
            photoDiv = document.createElement("div"),
            username = document.createElement("h3"),
            status = document.createElement("p");
        favDiv.setAttribute("id", arr.indexOf(arr[fav]) + "_id");
        favDiv.classList.add("favDiv");
        photoDiv.style.backgroundImage = "url('" + arr[fav].profilePhoto + "')";
        photoDiv.style.backgroundSize = "cover";
        photoDiv.classList.add("favPhoto");
        username.innerText = arr[fav].username;
        username.classList.add("favUsername");
        status.innerText = arr[fav].status;
        status.classList.add("favStatus");
        status.style.color = "#ac2100";
        if (arr[fav].status === "online") {
            status.style.color = "#08ac00";
        } else if (arr[fav].status === "away") {
            status.style.color = "#9dab00";
        }
        favDiv.appendChild(photoDiv);
        favDiv.appendChild(username);
        favDiv.appendChild(status);
        div.appendChild(favDiv);
    }
    appendToElement.appendChild(div);
}

function showFavs(arr, extraCondition) {
    favListArr = [];
    firebase.database().ref('users/').once('value').then(snapshot => {
        snapshot.forEach(userSnapshot => {
            let userFromBase = userSnapshot.val();
            if (arr.indexOf(userFromBase.username) !== -1) {
                if (!extraCondition) {
                    favListArr.push(userFromBase);
                } else {
                    if (userFromBase.status === extraCondition) {
                        favListArr.push(userFromBase);
                    }
                }
            }
        });
        console.log(favListArr);
        drawFavsList(favoritesList, favListArr);
    });
}