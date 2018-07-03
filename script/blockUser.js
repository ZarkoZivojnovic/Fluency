const blockBtn = document.getElementById("blockBtn"),
    blockList = document.getElementById("blockedList");
let blockListArr;

if (typeof myProfileData.myBlockList === "undefined") myProfileData.myBlockList = [];

blockBtn.addEventListener("click", addOrRemoveFromBlockList);
blockList.addEventListener("click", openProfileBlock);

function openProfileBlock(event) {
    if (event.target !== event.currentTarget) {
        let id = event.target.id.split("_")[0];
        if (id === "") {
            id = event.target.parentNode.id.split("_")[0]
        }
        let userInfo = convertUserInfoForProfileDraw(blockListArr[id]);
        drawProfile(userInfo);
    }
}

function addOrRemoveFromBlockList(event) {
    event.stopPropagation();
    let user = event.target.name;
    if (myProfileData.myBlockList.indexOf(user) === -1) {
        myProfileData.myBlockList.push(user);
        blockBtn.textContent = "Unblock";
    } else {
        let index = myProfileData.myBlockList.indexOf(user);
        myProfileData.myBlockList.splice(index, 1);
        blockBtn.textContent = "Block";
        showMyBlockList();
    }
    updateInformationsInDatabase(userUid, myProfileData);
}

function drawBlockList(appendToElement, arr) {
    appendToElement.innerHTML = "";
    if (arr.length === 0) appendToElement.innerHTML = "<h3 class='noBlockedUsersMsg'>You have no blocked users!</h3>";
    blockListArr = [];
    let div = document.createElement("div");
    div.classList.add("blockList");
    div.classList.add("hideScrollbar");
    for (let block = 0; block < arr.length; block++) {
        blockListArr.push(arr[block]);
        let blockDiv = document.createElement("div"),
            photoDiv = document.createElement("div"),
            username = document.createElement("h3"),
            status = document.createElement("p");
        blockDiv.setAttribute("id", arr.indexOf(arr[block]) + "_id");
        blockDiv.classList.add("blockDiv");
        if (typeof arr[block].profilePhoto !== "undefined") {
            photoDiv.style.backgroundImage = "url('" + arr[block].profilePhoto + "')";
            photoDiv.style.backgroundSize = "cover";
        }
        photoDiv.classList.add("blockPhoto");
        username.innerText = arr[block].username;
        username.classList.add("blockUsername");
        status.innerText = arr[block].status;
        status.classList.add("blockStatus");
        status.style.color = "#ac2100";
        if (arr[block].status === "online") {
            status.style.color = "#08ac00";
        } else if (arr[block].status === "away") {
            status.style.color = "#9dab00";
        }
        blockDiv.appendChild(photoDiv);
        blockDiv.appendChild(username);
        blockDiv.appendChild(status);
        div.appendChild(blockDiv);
    }
    appendToElement.appendChild(div);
}