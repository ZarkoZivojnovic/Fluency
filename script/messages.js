const sendMessageForm = document.getElementById("sendMsgForm"),
    messageInput = document.getElementById("typeMsg"),
    messages = document.getElementById("messages"),
    chatContent = document.getElementById("chatContent"),
    listOfConversations = document.getElementById("conversations");

let odKogaImamPoruke = [];

let waitForInfo = setInterval(() => {
    if (typeof myProfileData !== "undefined") {
        clearInterval(waitForInfo);
        setTimeout(() => {
            if (typeof myProfileData.myConversations !== "undefined") {
                drawListOfConversations(myProfileData.myConversations);
            }
        }, 1000);
    }
}, 200);


setInterval(() => {
    proveriDaLiImaPoruka(myProfileData.username);
}, 10000);

let receiver,
    conversationKey;

function isArrayInArray(arr, item) {
    var item_as_string = JSON.stringify(item);

    var contains = arr.some(function (ele) {
        return JSON.stringify(ele) === item_as_string;
    });
    return contains;
}

listOfConversations.addEventListener("click", event => {
    if (event.target !== event.currentTarget) {
        receiver = event.target.id;
        conversationKey = createConversationKey(myProfileData.username, receiver);
        openConversation(conversationKey);
    }
    markSelectedChat();
    show(loading);
    setTimeout(() => {
        dovuciPoruke(conversationKey);
        hide(loading);
    }, 500);
});

sendMessageForm.addEventListener("submit", event => {
    event.preventDefault();
    let message = messageInput.value;
    sendMessage(receiver, message);
    newMsgNotification(receiver, true);
    sendMessageForm.reset();
});

function markSelectedChat() {
    if (document.getElementById(receiver) === null)return;
    document.getElementById(receiver).checked = true;
    let allChats = document.querySelectorAll("input[name='selectedChat']");
    for (let chat = 0; chat < allChats.length; chat++) {
        let selectedChat = document.querySelector("label[for='" + allChats[chat].id + "']");
        if (allChats[chat].checked) {
            selectedChat.style.backgroundColor = fluencyColor;
        } else {
            selectedChat.style.backgroundColor = "transparent";
        }
    }
}

function openConversationWithThisUser(user) {
    receiver = user;
    conversationKey = createConversationKey(myProfileData.username, user);
    if (typeof myProfileData.myConversations === "undefined") myProfileData["myConversations"] = [];
    if (myProfileData.myConversations.indexOf(user) === -1) {
        myProfileData.myConversations.push(user);
        updateInformationsInDatabase(userUid, myProfileData, "new conversation created");
    }
    for (let div of mainDivs) {
        hide(div);
    }
    show(myMsgsDiv);
    drawListOfConversations(myProfileData.myConversations);
    openConversation(conversationKey);
    show(loading);
    setTimeout(() => {
        markSelectedChat();
        dovuciPoruke(conversationKey);
        hide(loading);
    }, 500);
}

function createConversationKey(myUsername, otherUsername) {
    let temp = [myUsername, otherUsername].sort();
    return temp[0] + temp[1];
}

function sendMessage(receiver, string) {
    let conversationKey = createConversationKey(myProfileData.username, receiver),
        message = {
            body: string,
            sender: myProfileData.username,
            receiver: receiver,
            date: new Date(),
            seen: false
        };
    firebase.database().ref('messages/' + conversationKey + "/" + new Date().getTime() + "/").update(message);
    dovuciPoruke(conversationKey);
}

function markMessageAsSeen(conversationKey, messageKey) {
    firebase.database().ref('messages/' + conversationKey + "/" + messageKey).update({"seen": true});
}

function newMsgNotification(receiver, newOrNot) { /// ("asdfasdf", "15132164641", true/false)
    firebase.database().ref('newMsgs/' + receiver).update({[myProfileData.username]: newOrNot});
}

function drawListOfConversations(arr) {
    listOfConversations.innerHTML = "";
    let div = document.createElement("div");
    div.setAttribute("id", "transparent");
    for (let index = 0; index < arr.length; index++) {
        let friend = document.createElement("input"),
            label = document.createElement("label");
        friend.setAttribute("type", "radio");
        friend.setAttribute("name", "selectedChat");
        friend.setAttribute("id", arr[index]);
        label.setAttribute("for", arr[index]);
        label.textContent = arr[index];
        div.appendChild(friend);
        div.appendChild(label);
    }
    listOfConversations.innerHTML = div.outerHTML;
}

function openConversation() {
    chatContent.style.visibility = "visible";
}

function proveriDaLiImaPoruka(username) {
    const ref = firebase.database().ref("newMsgs/" + username);
    ref.once('value', function (snapshot) {
        snapshot.forEach(function (newMsgsSnapshot) {
            let userOdKogImamPoruke = [];
            userOdKogImamPoruke.push(newMsgsSnapshot.key);
            userOdKogImamPoruke.push(newMsgsSnapshot.val());
            if (!isArrayInArray(odKogaImamPoruke, userOdKogImamPoruke)) {
            } else {
                odKogaImamPoruke.push(userOdKogImamPoruke);
            }
        });
        napuniKonverzacije();
    });
}

function dovuciPoruke(imeKonverzacije) {
    const ref = firebase.database().ref("messages/" + imeKonverzacije);
    let poruke = [];
    ref.once('value', function (snapshot) {
        snapshot.forEach(function (messageSnapshot) {
            let poruka = messageSnapshot.val();
            poruke.push(poruka);
        });
        drawChatContent(poruke);
    });
}

function drawChatContent(poruke) {
    messages.innerHTML = "";
    if (poruke.length === 0) {
        messages.innerHTML = "<div class='noContentMsg'><h2>no messages yet</h2></div>";
    } else {
        for (element of poruke) {
            let divZaPoruku = document.createElement("div"),
                sadrzajDiv = document.createElement("div"),
                posiljalac = document.createElement("span"),
                vreme = document.createElement("span"),
                time = formatTime(element.date);
            divZaPoruku.className = element.sender === myProfileData.username ? "msgRight divZaPoruku" : "msgLeft divZaPoruku";
            sadrzajDiv.textContent = element.body;
            sadrzajDiv.className = "msgBody";
            posiljalac.textContent = element.sender === myProfileData.username ? "me:" : element.sender + ":";
            vreme.textContent = time;
            vreme.className = "time";
            divZaPoruku.appendChild(sadrzajDiv);
            sadrzajDiv.insertAdjacentHTML("beforebegin", posiljalac.outerHTML);
            sadrzajDiv.insertAdjacentHTML("afterend", vreme.outerHTML);
            document.getElementById("messages").appendChild(divZaPoruku);
            messages.scrollTop = messages.scrollHeight;
        }
    }
}

function formatTime(time) {
    let datum = new Date(time);
    return dodajNulu(datum.getHours())
        + ':' + dodajNulu(datum.getMinutes())
        + " " + dodajNulu(1 + datum.getDate())
        + '-' + dodajNulu(datum.getMonth())
        + "-" + datum.getFullYear();
}

function dodajNulu(broj) {
    return broj < 10 ? '0' + broj : broj;
}

function napuniKonverzacije() {
    for (user of odKogaImamPoruke) {
        if (myProfileData.myConversations === undefined) myProfileData.myConversations = [];
        if (myProfileData.myConversations.indexOf(user[0]) === -1) {
            myProfileData.myConversations.push(user[0]);
            updateInformationsInDatabase(userUid, myProfileData, "new conversation created");
        }
    }
    drawListOfConversations(myProfileData.myConversations);
    markSelectedChat();
}