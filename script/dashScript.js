const navigation = document.getElementById("navigation"),
    signOutButton = document.getElementById("signOut"),
    channelsDiv = document.getElementById("channelsDiv"),
    myProfileDiv = document.getElementById("myProfileDiv"),
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
    mainDivs = [myProfileDiv, channelsDiv],
    fluencyColor = "rgb(81, 0, 172)";

var listaUseraIzBaze = [];
var filtriraniUseri = [];
var useriZaPrikaz = [];
var glavniDiv = document.getElementById("usersList");

signOutButton.addEventListener("click", goOffline);

document.getElementById("backSaProfila").addEventListener('click', backSaProfila);
document.getElementById("usersList").addEventListener('click', udjiNaProfil);
document.getElementById("chooseChannel").addEventListener('submit', filtrirajPoJeziku);

addRadioInput(); // dok se ne nadje bolje mesto xD

firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
        location.assign("./login.html");
    } else {
        let getUsername = setInterval(() => {
            if (myProfileData.username !== undefined) {
                clearInterval(getUsername);
                usersName.innerText = myProfileData.username;
            }
        }, 100);
    }
});

firebase.database().ref("users/" + userUid + "/status").onDisconnect().set("offline");

showHideSidebar.addEventListener("click", event => {
    if (sidebar.style.right === "" || sidebar.style.right === "0px") {
        sidebar.style.right = "-300px";
        setUpSideBar("hiddenSidebar", "showingSidebar", "show ⇑");
    } else {
        sidebar.style.right = "0";
        setUpSideBar("showingSidebar", "hiddenSidebar", "hide ⇒");
    }
});

navigation.addEventListener("click", event => {
    if (event.target !== event.currentTarget) {
        if (event.target.nodeName === "A") {
            let divElement = document.getElementById(event.target.id + "Div");
            show(divElement);
            if (event.target.id === "myProfile") {
                let waitingForData = setInterval(() => {
                    if (typeof myProfileData.username !== "undefined") {
                        clearInterval(waitingForData);
                        showProfileEditForm("disable");
                        hide(channelsDiv);
                    }
                });
            } else if (event.target.id === "channels") {
                hide(myProfileDiv);
                dovuciUsere();
                channelsDiv.addEventListener("click", selectLangChannel);
            }
        }
    }
    event.preventDefault();
});

function setUpSideBar(addClass, removeClass, string) {
    showHideSidebar.classList.remove(removeClass);
    showHideSidebar.classList.add(addClass);
    showHideSidebar.innerText = string;
}

function selectLangChannel(event) {
    if (event.target.nodeName === "INPUT") console.log(event.target.value);
    const radioInputs = document.querySelectorAll("input[type='radio']");
    for (let element = 0; element < radioInputs.length; element++) {
        if (radioInputs[element].checked) {
            radioInputs[element].parentNode.style.backgroundColor = fluencyColor;
        } else {
            radioInputs[element].parentNode.style.backgroundColor = "inherit";
        }
    }
    event.stopPropagation();
}

function showProfileEditForm(disableEnable) {
    addExistingData(myProfileData);
    if (disableEnable === "disable") {
        disableEnableFormElements(myProfileDiv, "disable");
        showHideFormButtons(myProfileDiv, "none");
        showHideEditIcon("block");
    } else if (disableEnable === "enable") {
        disableEnableFormElements(myProfileDiv, "enable");
        showHideFormButtons(myProfileDiv, "block");
        showHideEditIcon("none");
    }
    profileForms.addEventListener("click", showAndHideForms);
    personalInfoForm.addEventListener("submit", savePersonalInfo);
    aboutMeForm.addEventListener("submit", saveAboutMe);
    languageForm.addEventListener("submit", saveLangInfo);
    interests.addEventListener("click", selectInterest);
    language.addEventListener("click", selectLanguage);
}

function showHideEditIcon(property) {
    let icons = document.querySelectorAll(".editIcon");
    for (let element = 0; element < icons.length; element++) {
        icons[element].style.display = property;
    }
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
    for (let input = 0; input<inputsWithValue.length; input++) {
        let key = inputsWithValue[input].replace(/([a-z]+)([A-Z])([a-z]+)/, /$1 $2$3/).replace("/", "").replace("/", "").toLowerCase();
        if (typeof object[key] !== "undefined") {
            document.getElementById(inputsWithValue[input]).value = object[key];
        }
    }
    for (let index = 0; index<inputsWithChecked.length; index++){
        let key = inputsWithChecked[index].replace(/([a-z]+)([A-Z])([a-z]+)/, /$1 $2$3/).replace("/", "").replace("/", "").toLowerCase();
        if (typeof object[key] !== "undefined") {
            if (inputsWithChecked[index] === "gender"){
                document.getElementById(object[key]).checked = true;
            } else if (inputsWithChecked[index] === "interests"){
                for (let interest = 0; interest < object[key].length; interest++) {
                    let option = object[key][interest];
                    document.getElementById(option).checked = true;
                    document.querySelector("label[for='" + option + "']").style.color = fluencyColor;
                }
            } else if (inputsWithChecked[index] === "otherLanguages"){
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
    firebase.database().ref('users/' + userId).on('child_added', function (data) {
        profileData[data.key] = data.val();
    });
    return profileData;
}

function saveLangInfo(event) {
    event.preventDefault();
    const checkboxArray = document.querySelectorAll("input[type='checkbox']");
    myProfileData["native language"] = document.getElementById("nativeLanguage").value;
    myProfileData["other languages"] = [];
    for (let element = 0; element < checkboxArray.length; element++) {
        let language = checkboxArray[element];
        if (language.checked === true) {
            let level = document.querySelectorAll('input[name="lvl' + language.name + '"]');
            for (let type = 0; type < level.length; type++) {
                if (level[type].checked === true) {
                    let lang = level[type].id.split("_")[1],
                        lvl = level[type].id.split("_")[0];
                    myProfileData["other languages"].push([lang, lvl]);
                }
            }
        }
    }
    updateInformationsInDatabase(userUid, myProfileData);
    showProfileEditForm("disable");
}

function saveAboutMe(event) {
    event.preventDefault();
    myProfileData["about me"] = document.getElementById("aboutMe").value;
    myProfileData.interests = [];
    let checkboxArr = document.querySelectorAll("input[name='interests']");
    for (let index = 0; index < checkboxArr.length; index++) {
        if (checkboxArr[index].checked) myProfileData.interests.push(checkboxArr[index].value)
    }
    updateInformationsInDatabase(userUid, myProfileData);
    showProfileEditForm("disable");
}

function savePersonalInfo(event) {
    event.preventDefault();
    const radioInput = document.querySelectorAll("input[name='gender']");
    myProfileData.name = document.getElementById("name").value;
    myProfileData.country = document.getElementById("country").value;
    myProfileData.city = document.getElementById("city").value;
    myProfileData["birth date"] = document.getElementById("birthDate").value;
    myProfileData.gender = "";
    for (let element = 0; element < radioInput.length; element++) {
        if (radioInput[element].checked === true) myProfileData.gender = radioInput[element].id;
    }
    updateInformationsInDatabase(userUid, myProfileData);
    showProfileEditForm("disable");
}

function updateInformationsInDatabase(uid, infoObj) {
    firebase.database().ref('users/' + uid).update(infoObj);
    alert("Informations are Saved");
}

function showAndHideForms(event) {
    if (event.target.className === "editIcon") {
        showProfileEditForm("enable");
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

function show(element, property="inherit") {
    element.style.display = property;
}

function hide(element) {
    element.style.display = "none";
}

function dovuciUsere() {
	listaUseraIzBaze = [];
firebase.database().ref('users/').once('value').then(function(snapshot) {
    snapshot.forEach(function(userSnapshot) {
        var userFromBase = userSnapshot.val();
        console.log(userFromBase);
        if (userFromBase.status == "online") {
        listaUseraIzBaze.push(userFromBase);
    }
    });
    console.log("USERI");
    console.log(listaUseraIzBaze);
    prikaziUsere(listaUseraIzBaze);
});}

function prikaziUsere(nizUsera) {
    useriZaPrikaz = [];
    console.log("prikazi");
    glavniDiv.innerHTML = "";
    for (korisnik of nizUsera) {
        useriZaPrikaz.push(korisnik);
       var userDiv = document.createElement("div");
       //userDiv.id = "useriZaPrikaz["+nizUsera.indexOf(korisnik)+"]";
       userDiv.id = nizUsera.indexOf(korisnik);
       console.log(userDiv.id);
       userDiv.classList.add("userDiv");

       var usersPhoto = document.createElement("div");
       usersPhoto.classList.add("usersPhoto");

       var usernameAndStatus = document.createElement("div");
       usernameAndStatus.classList.add("usernameAndStatus");

       var usernameP = document.createElement("h3");
       usernameP.classList.add("username");
       usernameP.innerHTML = korisnik.username;

       var statusP = document.createElement("p");
       statusP.classList.add("status");
       statusP.innerHTML = korisnik.status;

       usernameAndStatus.appendChild(usernameP);
       usernameAndStatus.appendChild(statusP);

       var iconsDiv = document.createElement("div");
       iconsDiv.classList.add("icons");

       var callIcon = document.createElement("div");
       callIcon.classList.add("callIcon");

       var msgIcon = document.createElement("div");
       msgIcon.classList.add("msgIcon");

       iconsDiv.appendChild(callIcon);
       iconsDiv.appendChild(msgIcon);

       userDiv.appendChild(usersPhoto);
       userDiv.appendChild(usernameAndStatus);
       userDiv.appendChild(iconsDiv);

       glavniDiv.appendChild(userDiv);
    }
}

function filtrirajPoJeziku(event) {
    event.preventDefault();
    var filterJezik = [];
    filtriraniUseri = [];
    var divUser = document.getElementsByClassName("userDiv");
    var radioJezici = document.getElementById("langSelect").querySelectorAll("input[name='langChannel']");
    var radioNivoi = document.getElementById("levelSelect").querySelectorAll("input[name='level']");
    for (jezik of radioJezici) {
        if (jezik.checked == true) {
           filterJezik.push(jezik.value);
        }
    }
    for (nivo of radioNivoi) {
        if (nivo.checked == true) {
           filterJezik.push(nivo.id);
        }
    }
    console.log(filterJezik);

    for (korisnik of listaUseraIzBaze) {
        for (korisnikJezik of korisnik["other languages"]) {
            if (korisnikJezik.toString() == filterJezik.toString()) {
                filtriraniUseri.push(korisnik);

            }
        }
    }
    console.log(filtriraniUseri);
    prikaziUsere(filtriraniUseri);
    
    
}

function udjiNaProfil(event) {
    var indexOsobe = event.target.id;
    let years = useriZaPrikaz[indexOsobe]["birth date"]=== "" ? "":new Date().getFullYear() - new Date(useriZaPrikaz[indexOsobe]["birth date"]).getFullYear()+"y/o";
    document.getElementById("profilePhoto").style.backgroundImage = "url('"+useriZaPrikaz[indexOsobe].profilePhoto+"')";
    document.getElementById("profilePhoto").style.backgroundSize = "cover";
    document.getElementById("usersUsername").textContent = useriZaPrikaz[indexOsobe].username;
    document.getElementById("usersGender").textContent = useriZaPrikaz[indexOsobe].gender;
    document.getElementById("usersYears").textContent = years;
    document.getElementById("usersAboutMe").textContent = useriZaPrikaz[indexOsobe]["about me"];
    document.getElementById("usersCountry").textContent = useriZaPrikaz[indexOsobe].country;
    document.getElementById("usersCity").textContent = useriZaPrikaz[indexOsobe].city;
    document.getElementById("usersInterests").textContent = useriZaPrikaz[indexOsobe].interests.join(", ");
    document.getElementById("usersLanguages").textContent = useriZaPrikaz[indexOsobe]["other languages"].join(", ");
    document.getElementById("contentsDiv").style.display = "none";
    document.getElementById("profileDiv").style.display = "block";
    show(noticeBackground);
        

}

function backSaProfila() {
    document.getElementById("profileDiv").style.display = "none";
    document.getElementById("contentsDiv").style.display = "block";
    hide(noticeBackground);
}

