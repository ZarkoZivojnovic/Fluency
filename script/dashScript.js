const navigation = document.getElementById("navigation"),
    signOutButton = document.getElementById("signOut"),
    profileForms = document.getElementById("profileForms"),
    personalInfoForm = document.getElementById("personalInfoForm"),
    aboutMeForm = document.getElementById("aboutMeForm"),
    languageForm = document.getElementById("languageInfoForm"),
    language = document.getElementById("lang"),
    interests = document.getElementById("interests"),
    userUid = localStorage.getItem("userId"),
    showHideSidebar = document.getElementById("showHideSidebar"),
    sidebar = document.getElementById("sidebar");
let myProfileData = getExistingData(userUid),
    usersName = document.getElementById("usersName");

addRadioInput(); // dok se ne nadje bolje mesto xD

window.load = () => {
    firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
            location.assign("./login.html");
        }
    });
};

let getUsername = setInterval(() => {
    if (myProfileData.username !== undefined) {
        clearInterval(getUsername);
        usersName.innerText = myProfileData.username;
    }
}, 100);

firebase.database().ref("users/" + userUid + "/status").onDisconnect().set("offline");

showHideSidebar.addEventListener("click", () => {
    if (sidebar.style.right === "" || sidebar.style.right === "0px") {
        sidebar.style.right = "-400px";
        showHideSidebar.classList.remove("showingSidebar");
        showHideSidebar.classList.add("hiddenSidebar");
        showHideSidebar.innerText = "show ⇑"
    } else {
        sidebar.style.right = "0";
        showHideSidebar.classList.remove("hiddenSidebar");
        showHideSidebar.classList.add("showingSidebar");
        showHideSidebar.innerText = "hide ⇒";
    }
});
navigation.addEventListener("click", event => {
    if (event.target !== event.currentTarget) {
        let divElement = document.getElementById(event.target.id + "Div");
        show(divElement);
        if (event.target.id === "myProfile") {
            showProfileEditForm("disable");
        }
    }
    event.preventDefault();
});

signOutButton.addEventListener("click", goOffline);

function showProfileEditForm(disable) {
    addExistingData(myProfileData);
    if (disable === "disable") {
        disableFormElements();
        showHideFormButtons("none");
        showHideEditIcon("block");
    } else if (disable === "enable") {
        enableFormElements();
        showHideFormButtons("block");
        showHideEditIcon("none");
    }
    show(profileForms);
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

function showHideFormButtons(property) {
    let buttons = document.querySelectorAll("input[type='submit']");
    for (let btn = 0; btn < buttons.length; btn++) {
        buttons[btn].style.display = property;
    }
}

function enableFormElements() {
    const inputsArr = document.querySelectorAll("input"),
        textareaArr = document.querySelectorAll("textarea"),
        selectArr = document.querySelectorAll("select");
    for (let input = 0; input < inputsArr.length; input++) {
        inputsArr[input].removeAttribute("disabled");
    }
    for (let textarea = 0; textarea < textareaArr.length; textarea++) {
        textareaArr[textarea].removeAttribute("disabled");
    }
    for (let select = 0; select < selectArr.length; select++) {
        selectArr[select].removeAttribute("disabled");
    }
}

function disableFormElements() {
    const inputsArr = document.querySelectorAll("input"),
        textareaArr = document.querySelectorAll("textarea"),
        selectArr = document.querySelectorAll("select");
    for (let input = 0; input < inputsArr.length; input++) {
        inputsArr[input].setAttribute("disabled", "disabled");
    }
    for (let textarea = 0; textarea < textareaArr.length; textarea++) {
        textareaArr[textarea].setAttribute("disabled", "disabled");
    }
    for (let select = 0; select < selectArr.length; select++) {
        selectArr[select].setAttribute("disabled", "disabled");
    }
}

function addExistingData(object) {
    /*delete object.status;
    delete object.email;
    delete object.username;
    for (let info in object) {
        let key = info,
            infoArray = info.split(" ");
        if (infoArray.length !== 1) {
            key = infoArray[0] + infoArray[1].substring(0, 1).toUpperCase() + infoArray[1].substring(1);
        }
        let element = document.getElementById(key);
        if (element.type === "text" || element.nodeName === "textarea" || element.nodeName === "select") {
            document.getElementById(key).value = object[key];
        } else if (element.type === "checkbox") {
            // ako je string i ako je niz ---napisati logiku
            for (let index = 0; index < object["other languages"].length; index++) {
                let lang = object["other languages"][index][0],
                    lvl = object["other languages"][index][1];
                document.getElementById(lang).checked = true;
                document.getElementById(lvl + "_" + lang).checked = true;
                document.querySelector("label[for='" + lang + "']").style.color = "rgb(81, 0, 172)";
                document.getElementById("language" + lang).style.display = "block";
            }
        } else if (element.type === "radio") {
            document.getElementById(key).checked = true;
        }

    }*/
    if (typeof object.name !== "undefined") document.getElementById("name").value = object.name;
    if (typeof object.country !== "undefined") document.getElementById("country").value = object.country;
    if (typeof object.city !== "undefined") document.getElementById("city").value = object.city;
    if (typeof object["birth date"] !== "undefined") document.getElementById("birthDate").value = object["birth date"];
    if (typeof object.gender !== "undefined") document.getElementById(object.gender).checked = true;

    if (typeof object["about me"] !== "undefined") document.getElementById("aboutMe").value = object["about me"];
    if (typeof object.interests !== "undefined") {
        for (let index = 0; index < object["interests"].length; index++) {
            let option = object["interests"][index];
            document.getElementById(option).checked = true;
            document.querySelector("label[for='" + option + "']").style.color = "rgb(81, 0, 172)";
        }
    }

    if (typeof object["native language"] !== "undefined") document.getElementById("nativeLang").value = object["native language"];
    if (typeof object["other languages"] !== "undefined") {
        for (let index = 0; index < object["other languages"].length; index++) {
            let lang = object["other languages"][index][0],
                lvl = object["other languages"][index][1];
            document.getElementById(lang).checked = true;
            document.getElementById(lvl + "_" + lang).checked = true;
            document.querySelector("label[for='" + lang + "']").style.color = "rgb(81, 0, 172)";
            document.getElementById("language" + lang).style.display = "block";
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
    myProfileData["native language"] = document.getElementById("nativeLang").value;
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
    firebase.database().ref('users/' + userUid).update(myProfileData);
    alert("Informations are Saved");
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
    firebase.database().ref('users/' + userUid).update(myProfileData);
    alert("Informations are Saved");
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
    firebase.database().ref('users/' + userUid).update(myProfileData);
    alert("Informations are Saved");
    showProfileEditForm("disable");
}

function showAndHideForms(event) {
    if (event.target.nodeName === "IMG") {
        showProfileEditForm("enable");
    }
    if (event.target !== event.currentTarget) {
        if (event.target.nodeName === "H2") {
            let contentArray = event.target.textContent.split(" ");
            contentArray[0] = contentArray[0].toLowerCase();
            let formId = contentArray.join("") + "Form";
            setDisplayToForm(formId);
        } else if (event.target.nodeName === "DIV") {
            let targetChilds = event.target.childNodes;
            for (let child = 0; child < targetChilds.length; child++) {
                if (targetChilds[child].nodeName === "FORM") {
                    let formId = targetChilds[child].id;
                    setDisplayToForm(formId);
                }
            }
        }
    }
}

function selectLanguage(event) {
    if (event.target !== event.currentTarget) {
        if (event.target.type !== "radio") {
            if (event.target.checked === true) {
                document.getElementById("language" + event.target.id).style.display = "block";
                document.querySelector("label[for='" + event.target.id + "']").style.color = "rgb(81, 0, 172)";
            } else if (event.target.checked === false) {
                document.getElementById("language" + event.target.id).style.display = "none";
                document.querySelector("label[for='" + event.target.id + "']").style.color = "black";
            }
        }
    }
    event.stopPropagation();
}

function selectInterest(event) {
    if (countSelectedInterests() <= 5){
        if (event.target !== event.currentTarget) {
            if (event.target.checked === true) {
                document.querySelector("label[for='" + event.target.id + "']").style.color = "rgb(81, 0, 172)";
            } else if (event.target.checked === false) {
                document.querySelector("label[for='" + event.target.id + "']").style.color = "black";
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
    for (let index = 0; index < interestsArr.length; index++){
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
    document.getElementById("personalInfoForm").style.display = id === "personalInfoForm" ? "block" : "none";
    document.getElementById("aboutMeForm").style.display = id === "aboutMeForm" ? "block" : "none";
    document.getElementById("languageInfoForm").style.display = id === "languageInfoForm" ? "block" : "none";
    setTimeout(() => {
        document.getElementById("personalInfoFormDiv").style.height = id === "personalInfoForm" ? "500px" : "60px";
        document.getElementById("aboutMeFormDiv").style.height = id === "aboutMeForm" ? "500px" : "60px";
        document.getElementById("languageInfoFormDiv").style.height = id === "languageInfoForm" ? "500px" : "60px";
    }, 200);
}

function show(element) {
    element.style.display = "block";
}

function hide(element) {
    element.style.display = "none";
}

