const navigation = document.getElementById("navigation"),
    settingsDeleteAcc = document.getElementById("settingsDeleteAcc"),
    settingsDiv = document.getElementById("settingsDiv"),
    changePassDiv = document.getElementById("changePassDiv"),
    signOutButton = document.getElementById("signOut"),
    channelsDiv = document.getElementById("channelsDiv"),
    myProfileDiv = document.getElementById("myProfileDiv"),
    myMsgsDiv = document.getElementById("myMessagesDiv"),
    myFavoritesDiv = document.getElementById("myFavoritesDiv"),
    myBlockListDiv = document.getElementById("myBlockListDiv"),
    profileForms = document.getElementById("profileForms"),
    personalInfoForm = document.getElementById("personalInfoForm"),
    aboutMeForm = document.getElementById("aboutMeForm"),
    languageForm = document.getElementById("languageInfoForm"),
    language = document.getElementById("lang"),
    interests = document.getElementById("interests"),
    userUid = localStorage.getItem("userId"),
    showHideSidebar = document.getElementById("showHideSidebar"),
    sidebar = document.getElementById("sidebar"),
    myProfileData = getExistingData(userUid),
    usersName = document.getElementById("usersName"),
    profileDiv = document.getElementById("profileDiv"),
    mainDivs = [myProfileDiv, channelsDiv, myMsgsDiv, myFavoritesDiv, myBlockListDiv, settingsDiv],
    loading = document.getElementById("loadingBackground"),
    listaUsera = document.getElementById("usersList"),
    backSaProfilaBtn = document.getElementById("backSaProfila"),
    chooseChannel = document.getElementById("chooseChannel"),
    glavniDiv = document.getElementById("usersList"),
    usersRating = document.getElementById("usersRating"),
    usersProfilePhoto = document.getElementById("profilePhoto"),
    trash = document.getElementById("trash"),
    zvezdice = document.getElementById("zvezdice"),
    zvezdicePoruka = document.getElementById("zvezdicePoruka"),
    editBtn = document.getElementById("editBtn"),
    settingsEditBtn = document.getElementById("settingsEditBtn"),
    settingsChangePass = document.getElementById("settingsChangePass"),
    backFromPassChange = document.getElementById("backFromPassChange"),
    updatePassBtn = document.getElementById("updatePassBtn"),
    channelsList = document.getElementById("channelsList"),
    conversationList = document.getElementById("conversationList"),
    fluencyColor = "rgb(81, 0, 172)";

let links = ["myProfile", "channels", "myMessages", "myFavorites", "myBlockList", "settings"],
    useriZaPrikaz = [];

onload();

//settingsDeleteAcc.addEventListener("click", deleteProfile(userId));
updatePassBtn.addEventListener("click", promenaSifre);
backFromPassChange.addEventListener("click", backSaPromeneSifre);
settingsChangePass.addEventListener("click", showPassChange);
settingsEditBtn.addEventListener("click", showMyProfile);
editBtn.addEventListener("click", showMyProfile);
signOutButton.addEventListener("click", goOffline);
backSaProfilaBtn.addEventListener('click', backSaProfila);
listaUsera.addEventListener('click', udjiNaProfil);
chooseChannel.addEventListener('submit', filtrirajPoJeziku);
profileDiv.addEventListener("click", hideProfileDiv);
navigation.addEventListener("click", mainNavigation);
showHideSidebar.addEventListener("click", event => {
    event.preventDefault();
    moveSidebar();
});

if (window.innerWidth<650){
    channelsList.addEventListener("click", event => {
        event.preventDefault();
        showOrHideListResponsive(channelsList);
    });
    conversationList.addEventListener("click", event => {
        event.preventDefault();
        showOrHideListResponsive(conversationList);
    });
}

function showOrHideListResponsive(list) {
    if (list.style.maxHeight === "100%"){
        list.style.maxHeight = "25px"
    } else {
        list.style.maxHeight = "100%";
    }  
}

function deleteProfile() {
    let user = firebase.auth().currentUser;
    firebase.database().ref('users/' + userId).remove();
    user.delete().then(() => {
        alert("deleted profile")
    }).catch(error => {
        alert(error)
    });
}

function promenaSifre(event) {
    event.preventDefault();
    var staraSifra = document.getElementById("oldPass").value;
    var novaSifra = document.getElementById("newPass").value;
    var novaSifraOpet = document.getElementById("newPassRepeat").value;
    console.log(novaSifra, novaSifraOpet);
    if (novaSifra == "" || novaSifraOpet == "" || staraSifra == "") {
        alert("You cannot leave fields blank!");
    } else {
        if (novaSifra != novaSifraOpet) {
            alert("Passwords do not match!");
        } else {
            updatePassword(novaSifra);
        }
    }
}

function updatePassword(novaSifra) {
    const user = firebase.auth().currentUser;
    if (novaSifra.length < 6) {
        alert("Password is too short!");
        return;
    } else {
        user.updatePassword(novaSifra).then(() => {
            alert("Your password has been changed successfully!");
        }).catch(error => {
            alert("An error has occurred, try again later!");
        });
    }
}

function showPassChange() {
    show(loading);
    hide(settingsDiv);
    setTimeout(() => {
        hide(loading);
        show(changePassDiv);
    }, 500);
}

function backSaPromeneSifre() {
    hide(changePassDiv);
    show(loading);
    setTimeout(() => {
        hide(loading);
        show(settingsDiv);
    }, 500);
}

function hideProfileDiv(event) {
    event.stopPropagation();
    if (event.target === event.currentTarget) {
        hide(profileDiv);
    }
}

function moveSidebar() {
    if (sidebar.style.right === "" || sidebar.style.right === "0px") {
        sidebar.style.right = "-300px";
        setUpSideBar("hiddenSidebar", "showingSidebar", "show ⇑");
    } else {
        sidebar.style.right = "0";
        setUpSideBar("showingSidebar", "hiddenSidebar", "hide ⇒");
    }
}

function mainNavigation(event) {
    if (event.target !== event.currentTarget) {
        if (event.target.nodeName === "A") {
            let id = event.target.id;
            if (id === "myProfile") {
                udjiNaMojProfil();
            } else if (id === "channels") {
                showChannels();
            } else if (id === "myFavorites") {
                showMyFavorites();
            } else if (id === "myMessages") {
                showMyMessages();
            } else if (id === "myBlockList") {
                showMyBlockList();
            } else if (id === "settings") {
                showSettings();
            }
            if (id !== "myProfile") markSelectedLink(id);
            if (screen.width < 1000) moveSidebar();
        }
    }
    event.preventDefault();
}

function markSelectedLink(id) {
    for (let link of links) {
        document.getElementById(link).style.backgroundColor = "inherit";
    }
    document.getElementById(id).style.backgroundColor = fluencyColor;
}

function showSettings() {
    show(loading);
    hide(myFavoritesDiv, myProfileDiv, channelsDiv, myMsgsDiv, myBlockListDiv);
    setTimeout(() => {
        hide(loading);
        show(settingsDiv);
    }, 500);
}

function showMyBlockList() {
    let blockedUsers = new Array(dovuciUsere("block"));
    show(loading);
    hide(myFavoritesDiv, myProfileDiv, channelsDiv, myMsgsDiv, settingsDiv);
    setTimeout(() => {
        drawList(blockList, blockedUsers[0], "block");
        hide(loading);
        show(myBlockListDiv);
    }, 500);
}

function showMyProfile() {
    let waitingForData = setInterval(() => {
        show(loading);
        if (typeof myProfileData.username !== "undefined") {
            clearInterval(waitingForData);
            showProfileEditForm();
            hide(channelsDiv, myFavoritesDiv, myMsgsDiv, myBlockListDiv, settingsDiv);
            setTimeout(() => {
        hide(loading);
        show(myProfileDiv);
    }, 500);
        }
    });
}

function showChannels() {
    let listaUsera = new Array(dovuciUsere());
    show(loading);
    hide(myProfileDiv, myFavoritesDiv, myMsgsDiv, myBlockListDiv, settingsDiv);
    setTimeout(() => {
        prikaziUsere(listaUsera[0]);
        show(channelsDiv);
        channelsDiv.addEventListener("click", selectLangChannel);
        hide(loading);
    }, 500);
}

function showMyFavorites() {
    let favorites = new Array(dovuciUsere("favs"));
    show(loading);
    hide(myProfileDiv, channelsDiv, myMsgsDiv, myBlockListDiv, settingsDiv);
    setTimeout(() => {
        drawList(favoritesList, favorites[0], "fav");
        hide(loading);
        show(myFavoritesDiv);
    }, 500);
}

function showMyMessages() {
    drawListOfConversations(myProfileData.myConversations);
    hide(myProfileDiv, channelsDiv, myFavoritesDiv, myBlockListDiv, settingsDiv);
    show(myMsgsDiv);
    trash.style.visibility = "hidden";
    zvezdice.style.display = "flex";
    zvezdicePoruka.textContent = "Rate this user:";
}

function onload() {
    addRadioInput();
    show(loading);
    firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
            location.assign("./login.html");
        } else {
            let getUsername = setInterval(() => {
                ifUser(getUsername)
            }, 100),
                currentUser = firebase.auth().currentUser;
            if (!currentUser.emailVerified) {
                verificationAlert(currentUser);
            }
        }
    });
    firebase.database().ref("users/" + userUid + "/status").onDisconnect().set("offline");
}

function ifUser(getUsername) {
    if (myProfileData.username !== undefined) {
        clearInterval(getUsername);
        usersName.innerText = myProfileData.username;
        hide(loading);
        showChannels();
        markSelectedLink("channels");
    }
}

function verificationAlert(currentUser) {
    createVerificationModal(currentUser.emailVerified, currentUser.email);
    document.getElementById("signOutLink").addEventListener("click", goOffline);
    document.getElementById("resendVerification").addEventListener("click", event => {
        event.preventDefault();
        currentUser.sendEmailVerification().then(() => {
            alert("Verification Email Sent")
        });
    });
}

function createVerificationModal(status, email) {
    let div = document.createElement("div"),
        modal = document.createElement("div"),
        text = document.createElement("h3"),
        resendLink = document.createElement("a"),
        signOutLink = document.createElement("a");
    signOutLink.innerHTML = `Sign Out`;
    signOutLink.className = "pointer";
    signOutLink.setAttribute("id", "signOutLink");
    resendLink.innerHTML = `Resend verification mail`;
    resendLink.className = "pointer";
    resendLink.setAttribute("id", "resendVerification");
    text.innerHTML = `Verification status: ${status} <br><br><span>We'll send an email to ${email}. Open it up to activate your account and refresh the page.</span>`;
    div.setAttribute("id", "modalDiv");
    modal.className = "modal";
    text.className = "modalText";
    modal.appendChild(text);
    modal.appendChild(resendLink);
    modal.appendChild(signOutLink);
    div.appendChild(modal);
    document.body.appendChild(div);
}

function setUpSideBar(addClass, removeClass, string) {
    showHideSidebar.classList.remove(removeClass);
    showHideSidebar.classList.add(addClass);
    showHideSidebar.innerText = string;
}

function selectLangChannel(event) {
    const radioInputs = document.querySelectorAll("input[type='radio']");
    let color;
    for (let element = 0; element < radioInputs.length; element++) {
        if (radioInputs[element].checked) {
            color = fluencyColor;
        } else {
            color = "inherit";
        }
        radioInputs[element].parentNode.style.backgroundColor = color;
    }
    event.stopPropagation();
}

function showProfileEditForm() {
    addExistingData(myProfileData);
    disableEnableFormElements(myProfileDiv, "enable");
    showHideFormButtons(myProfileDiv, "block");
    profileForms.addEventListener("click", showAndHideForms);
    personalInfoForm.addEventListener("submit", savePersonalInfo);
    aboutMeForm.addEventListener("submit", saveAboutMe);
    languageForm.addEventListener("submit", saveLangInfo);
    interests.addEventListener("click", selectInterest);
    language.addEventListener("click", selectLanguage);
}


function showHideFormButtons(parentDiv, property) {
    let buttons = document.querySelectorAll("input[type='submit']");
    for (let btn = 0; btn < buttons.length; btn++) {
        if (parentDiv.contains(buttons[btn])) {
            buttons[btn].style.display = property;
        }
    }
}

function disableEnableFormElements(parentDiv, property) {
    const inputsArr = document.querySelectorAll("input"),
        textareaArr = document.querySelectorAll("textarea"),
        selectArr = document.querySelectorAll("select");
    let allInputs = [...inputsArr, ...textareaArr, ...selectArr];
    for (let input = 0; input < allInputs.length; input++) {
        if (parentDiv.contains(allInputs[input])) {
            property === "enable" ? allInputs[input].removeAttribute("disabled") : allInputs[input].setAttribute("disabled", "disabled");
        }
    }
}

function addExistingData(object) {
    let inputsWithValue = ["name", "country", "city", "birthDate", "aboutMe", "nativeLanguage"],
        inputsWithChecked = ["gender", "interests", "otherLanguages"];
    for (let input = 0; input < inputsWithValue.length; input++) {
        let key = inputsWithValue[input];
        if (typeof object[key] !== "undefined") {
            document.getElementById(key).value = object[key];
        }
    }
    for (let index = 0; index < inputsWithChecked.length; index++) {
        let key = inputsWithChecked[index];
        if (typeof object[key] !== "undefined") {
            if (key === "gender") {
                document.getElementById(object[key]).checked = true;
            } else if (key === "interests") {
                for (let interest = 0; interest < object[key].length; interest++) {
                    let option = object[key][interest];
                    document.getElementById(option).checked = true;
                    document.querySelector("label[for='" + option + "']").style.color = fluencyColor;
                }
            } else if (key === "otherLanguages") {
                for (let data = 0; data < object[key].length; data++) {
                    let lang = object[key][data][0],
                        lvl = object[key][data][1];
                    document.getElementById(lang).checked = true;
                    document.getElementById(lvl + "_" + lang).checked = true;
                    document.querySelector("label[for='" + lang + "']").style.color = fluencyColor;
                    document.getElementById("language" + lang).style.display = "block";
                }
            }
        }
    }
}

function getExistingData(userId) {
    let profileData = {};
    firebase.database().ref('users/' + userId).on('child_added', data => {
        profileData[data.key] = data.val();
    });
    return profileData;
}

function saveLangInfo(event) {
    event.preventDefault();
    const checkboxArray = document.querySelectorAll("input[type='checkbox']");
    myProfileData["nativeLanguage"] = document.getElementById("nativeLanguage").value;
    myProfileData["otherLanguages"] = [];
    for (let element = 0; element < checkboxArray.length; element++) {
        let language = checkboxArray[element];
        if (language.checked === true) {
            let level = document.querySelectorAll('input[name="lvl' + language.name + '"]');
            for (let type = 0; type < level.length; type++) {
                if (level[type].checked === true) {
                    let lang = level[type].id.split("_")[1],
                        lvl = level[type].id.split("_")[0];
                    myProfileData["otherLanguages"].push([lang, lvl]);
                }
            }
        }
    }
    updateInformationsInDatabase(userUid, myProfileData, "Informations are Saved");
}

function saveAboutMe(event) {
    event.preventDefault();
    myProfileData.aboutMe = document.getElementById("aboutMe").value;
    myProfileData.interests = [];
    let checkboxArr = document.querySelectorAll("input[name='interests']");
    for (let index = 0; index < checkboxArr.length; index++) {
        if (checkboxArr[index].checked) myProfileData.interests.push(checkboxArr[index].value)
    }
    updateInformationsInDatabase(userUid, myProfileData, "Informations are Saved");
}

function savePersonalInfo(event) {
    event.preventDefault();
    const radioInput = document.querySelectorAll("input[name='gender']");
    myProfileData.name = document.getElementById("name").value;
    myProfileData.country = document.getElementById("country").value;
    myProfileData.city = document.getElementById("city").value;
    myProfileData.birthDate = document.getElementById("birthDate").value;
    myProfileData.gender = "";
    for (let element = 0; element < radioInput.length; element++) {
        if (radioInput[element].checked === true) myProfileData.gender = radioInput[element].id;
    }
    updateInformationsInDatabase(userUid, myProfileData, "Informations are Saved");
}

function updateInformationsInDatabase(uid, infoObj, notification) {
    firebase.database().ref('users/' + uid).update(infoObj);
    if (notification) {
        alert(notification);
    }
}

function showAndHideForms(event) {
    if (event.target.className.includes("editIcon")) {
        showProfileEditForm();
    }
    if (event.target !== event.currentTarget) {
        if (event.target.nodeName === "H2") {
            let contentArray = event.target.textContent.split(" ");
            contentArray[0] = contentArray[0].toLowerCase();
            let formId = contentArray.join("") + "Form";
            setDisplayToForm(formId);
        }
    }
}

function selectLanguage(event) {
    if (event.target !== event.currentTarget) {
        if (event.target.type !== "radio") {
            let levelsDiv = document.getElementById("language" + event.target.id),
                label = document.querySelector("label[for='" + event.target.id + "']");
            if (event.target.checked === true) {
                levelsDiv.style.display = "inherit";
                label.style.color = fluencyColor;
            } else if (event.target.checked === false) {
                levelsDiv.style.display = "none";
                label.style.color = "inherit";
            }
        }
    }
    event.stopPropagation();
}

function selectInterest(event) {
    if (countSelectedInterests() <= 5) {
        if (event.target !== event.currentTarget) {
            let label = document.querySelector("label[for='" + event.target.id + "']");
            if (event.target.checked === true) {
                label.style.color = fluencyColor;
            } else if (event.target.checked === false) {
                label.style.color = "inherit";
            }
        }
    } else {
        alert("max number of interests");
        event.target.checked = false;
    }
    event.stopPropagation();
}

function countSelectedInterests() {
    let counter = 0,
        interestsArr = document.querySelectorAll("input[name='interests']");
    for (let index = 0; index < interestsArr.length; index++) {
        if (interestsArr[index].checked) counter++
    }
    return counter;
}

function addRadioInput() {
    let elements = document.querySelectorAll("label");
    for (let index = 0; index < elements.length; index++) {
        let element = elements[index];
        if (element.parentElement.nodeName === "DIV") {
            const lang = element.getAttribute("for");
            let newDiv = document.createElement("div"),
                elementary = document.createElement("input"),
                elementaryLabel = document.createElement("label"),
                intermediate = document.createElement("input"),
                intermediateLabel = document.createElement("label"),
                advanced = document.createElement("input"),
                advancedLabel = document.createElement("label");
            newDiv.setAttribute("id", "language" + lang);
            newDiv.classList = "langLevel";
            addAttributesToElementAndLabel(elementary, elementaryLabel, "elementary", lang);
            addAttributesToElementAndLabel(intermediate, intermediateLabel, "intermediate", lang);
            addAttributesToElementAndLabel(advanced, advancedLabel, "advanced", lang);
            newDiv.appendChild(elementary);
            newDiv.appendChild(elementaryLabel);
            newDiv.appendChild(intermediate);
            newDiv.appendChild(intermediateLabel);
            newDiv.appendChild(advanced);
            newDiv.appendChild(advancedLabel);
            element.parentNode.insertBefore(newDiv, element.nextElementSibling);
        }
    }
}

function addAttributesToElementAndLabel(element, label, level, lang) {
    element.setAttribute("type", "radio");
    element.setAttribute("name", "lvl" + lang);
    element.setAttribute("id", level + "_" + lang);
    label.setAttribute("for", level + "_" + lang);
    label.innerText = level;
}

function setDisplayToForm(id) {
    personalInfoForm.style.display = id === "personalInfoForm" ? "inherit" : "none";
    aboutMeForm.style.display = id === "aboutMeForm" ? "inherit" : "none";
    languageForm.style.display = id === "languageInfoForm" ? "inherit" : "none";
    setTimeout(() => {
        document.getElementById("personalInfoFormDiv").style.height = id === "personalInfoForm" ? "500px" : "60px";
        document.getElementById("aboutMeFormDiv").style.height = id === "aboutMeForm" ? "500px" : "60px";
        document.getElementById("languageInfoFormDiv").style.height = id === "languageInfoForm" ? "500px" : "60px";
    }, 200);
}

function show(element, property = "inherit") {
    element.style.display = property;
}

function hide(...elements) {
    for (let element of elements) {
        element.style.display = "none";
    }
}

function dovuciUsere(uslov, string, dodatniUslov) {
    let tempArr = [];
    firebase.database().ref('users/').once('value').then(snapshot => {
        snapshot.forEach(userSnapshot => {
            let user = userSnapshot.val();
            if (!uslov) {
                if (user.status === "online") {
                    tempArr.push(user);
                }
            } else if (uslov === "search") {
                if (user.username.includes(string)) {
                    tempArr.push(user);
                }
            } else if (uslov === "favs") {
                if (myProfileData.myFavorites.indexOf(user.username) !== -1) {
                    if (!dodatniUslov) {
                        tempArr.push(user);
                    } else {
                        if (user.status === "online") {
                            tempArr.push(user);
                        }
                    }
                }
            } else if (uslov === "block") {
                if (myProfileData.myBlockList.indexOf(user.username) !== -1) {
                    tempArr.push(user)
                }
            }
        });
    });
    return tempArr;
}

function isUserOnline(user) {
    let arr = [];
    firebase.database().ref('users/').once('value').then(snapshot => {
        snapshot.forEach(userSnapshot => {
            if (user === userSnapshot.val().username) {
                if (userSnapshot.val().status === "online") {
                    arr.push(userSnapshot.val());
                }
            }
        });
    });
    return arr;
}

function prikaziUsere(nizUsera) {
    useriZaPrikaz = [];
    glavniDiv.innerHTML = "";
    if (nizUsera.length === 0) {
        glavniDiv.innerHTML = "<div class='noContentMsg'><h2>no matches</h2></div>";
        return;
    }
    for (let korisnik of nizUsera) {
        if (myProfileData.myBlockList.indexOf(korisnik.username) !== -1) continue;
        useriZaPrikaz.push(korisnik);
        let userDiv = document.createElement("div"),
            usersPhoto = document.createElement("div"),
            usernameAndStatus = document.createElement("div"),
            usernameP = document.createElement("h3"),
            statusP = document.createElement("p"),
            iconsDiv = document.createElement("div"),
            callIcon = document.createElement("div"),
            msgIcon = document.createElement("div");
        userDiv.id = nizUsera.indexOf(korisnik);
        userDiv.classList.add("userDiv");
        usersPhoto.classList.add("usersPhoto");
        if (korisnik.profilePhoto !== undefined && korisnik.profilePhoto !== "") {
            usersPhoto.style.backgroundImage = "url('" + korisnik.profilePhoto + "')";
            usersPhoto.style.backgroundSize = "cover";
        }
        usernameAndStatus.classList.add("usernameAndStatus");
        usernameP.classList.add("username");
        usernameP.innerHTML = korisnik.username;
        statusP.classList.add("status");
        statusP.innerHTML = korisnik.status;
        usernameAndStatus.appendChild(usernameP);
        usernameAndStatus.appendChild(statusP);
        iconsDiv.classList.add("icons");
        callIcon.classList.add("callIcon");
        msgIcon.classList.add("msgIcon");
        iconsDiv.appendChild(callIcon);
        iconsDiv.appendChild(msgIcon);
        userDiv.appendChild(usersPhoto);
        userDiv.appendChild(usernameAndStatus);
        userDiv.appendChild(iconsDiv);
        glavniDiv.appendChild(userDiv);
    }
}

function pronadjiPoklapanjaJezika(filterJezik, onlineUseri) {
    let filtriraniUseri = [];
    if (typeof filterJezik[1] === "undefined") {
        for (let korisnik of onlineUseri[0]) {
            if (korisnik.nativeLanguage !== "undefined" && korisnik.nativeLanguage === filterJezik[0]) {
                filtriraniUseri.push(korisnik);
            } else if (typeof korisnik.otherLanguages !== "undefined") {
                for (let jezik of korisnik.otherLanguages) {
                    if (filterJezik[0] === jezik[0]) {
                        filtriraniUseri.push(korisnik);
                    }
                }
            }
        }
    } else if (typeof filterJezik[1] !== "undefined" && filterJezik[1] === "native") {
        for (let korisnik of onlineUseri[0]) {
            if (korisnik.nativeLanguage !== "undefined" && korisnik.nativeLanguage === filterJezik[0]) {
                filtriraniUseri.push(korisnik);
            }
        }
    } else if (typeof filterJezik[1] !== "undefined") {
        for (let korisnik of onlineUseri[0]) {
            if (typeof korisnik.otherLanguages !== "undefined") {
                for (let korisnikJezik of korisnik.otherLanguages) {
                    if (korisnikJezik.toString().includes(filterJezik.toString())) {
                        filtriraniUseri.push(korisnik);
                    }
                }
            }
        }
    }
    return filtriraniUseri;
}

function filtrirajPoJeziku(event) {
    event.preventDefault();
    let onlineUseri = new Array(dovuciUsere()),
        filterJezik = [],
        filtriraniUseri = [],
        radioJezici = document.getElementById("langSelect").querySelectorAll("input[name='langChannel']"),
        radioNivoi = document.getElementById("levelSelect").querySelectorAll("input[name='level']");
    for (let jezik of radioJezici) {
        if (jezik.checked) {
            filterJezik.push(jezik.value);
        }
    }
    if (filterJezik.length === 0) {
        alert("jezik nije oznacen");
        return;
    }
    for (let nivo of radioNivoi) {
        if (nivo.checked) {
            filterJezik.push(nivo.id);
        }
    }
    show(loading);
    setTimeout(() => {
        filtriraniUseri = pronadjiPoklapanjaJezika(filterJezik, onlineUseri);
        prikaziUsere(filtriraniUseri);
        chooseChannel.reset();
        hide(loading);
    }, 1000)
}

function udjiNaProfil(event) {
    let indexOsobe;
    if (event.target !== event.currentTarget) {
        indexOsobe = event.target.parentNode.parentNode.id;
        let receiver = useriZaPrikaz[indexOsobe].username;
        if (event.target.className === "msgIcon") {
            openConversationWithThisUser(receiver);
        } else if (event.target.className === "callIcon") {
            videoCallRequest(receiver);
            createCallModal(receiver, false);
        } else {
            indexOsobe = event.target.id;
            if (indexOsobe === "") {
                indexOsobe = event.target.parentNode.id;
            }
            if (indexOsobe === "") {
                indexOsobe = event.target.parentNode.parentNode.id;
            }
            let userData = convertUserInfoForProfileDraw(useriZaPrikaz[indexOsobe]);
            drawProfile(userData);
        }
    }
}

function udjiNaMojProfil() {
    let userData = convertUserInfoForProfileDraw(myProfileData);
    drawProfile(userData);
}

function backSaProfila(event) {
    event.preventDefault();
    hide(profileDiv);
}

function convertUserInfoForProfileDraw(user) {
    let language = user.nativeLanguage,
        gender = "n/a",
        interests, birthDate;
    if (user.gender === "male") {
        gender = "♂";
    } else if (user.gender === "female") {
        gender = "♀";
    }
    if (typeof user.otherLanguages !== "undefined") {
        for (let lang of user.otherLanguages) {
            language += ", " + lang[0];
        }
    }
    if (typeof user.interests !== "undefined") {
        interests = user.interests.join(", ");
    }
    if (typeof user.birthDate !== "undefined") {
        birthDate = "🎂 " + user.birthDate;
    }
    return {
        username: user.username,
        gender: gender,
        aboutMe: user.aboutMe,
        birthDate: birthDate,
        country: user.country,
        city: user.city,
        profilePhoto: user.profilePhoto,
        interests: interests,
        language: language
    }
}

function clearData() {
    const data = ["usersGender", "usersBirthDate", "usersAboutMe", "usersCountry", "usersCity", "usersInterests", "usersLanguage"];
    for (let info of data) {
        document.getElementById(info).innerText = "no info";
    }
    usersProfilePhoto.style.backgroundImage = "inherit";
    usersRating.innerText = "Not Rated Yet";
    addToFavsBtn.innerText = "Add To Favorites";
    blockBtn.innerText = "Block";
}

function drawProfile(obj) {
    clearData();
    for (let data in obj) {
        if (obj.hasOwnProperty(data)) {
            if (typeof obj[data] !== "undefined" && obj[data] !== "") {
                if (data === "profilePhoto") {
                    document.getElementById(data).style.backgroundImage = "url('" + obj[data] + "')";
                    document.getElementById(data).style.backgroundSize = "cover";
                } else if (data !== "profilePhoto") {
                    let id = "users" + data.substring(0, 1).toUpperCase() + data.substring(1);
                    document.getElementById(id).textContent = obj[data];
                }
            }
        }
    }
    if (myProfileData.myFavorites.indexOf(obj.username) !== -1) {
        addToFavsBtn.innerText = "Remove From Favorites";
    }
    if (typeof myProfileData.myBlockList !== "undefined" && myProfileData.myBlockList.indexOf(obj.username) !== -1) {
        blockBtn.innerText = "Unblock";
    }
    if (myProfileData.username === obj.username) {
        editBtn.style.display = "block";
        blockBtn.style.display = "none";
    } else {
        blockBtn.style.display = "block";
        editBtn.style.display = "none";
        blockBtn.name = obj.username;
    }
    addToFavsBtn.name = obj.username;
    addToFavsBtn.style.display = obj.username === myProfileData.username ? "none" : "inherit";
    sracunajOcenu(obj.username);
    show(profileDiv);
}

function sracunajOcenu(korisnik) {
    let ocene = [],
        prosecnaOcena,
        sumaOcena;
    firebase.database().ref(`ratings/${korisnik}`).once('value').then(snapshot => {
        snapshot.forEach(ocenaSnapshot => {
            let ocena = ocenaSnapshot.val();
            ocene.push(ocena);
        });
        if (ocene.length > 0) {
            sumaOcena = ocene.reduce((a, b) => a + b, 0);
            prosecnaOcena = Math.round((sumaOcena / ocene.length) * 100) / 100;
            usersRating.textContent = prosecnaOcena + " based on " + ocene.length + " ratings";
        } else {
            usersRating.textContent = "Not Rated Yet";
        }
    });
}