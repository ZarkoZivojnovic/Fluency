const sendMessageForm = document.getElementById("sendMsgForm"),
    messageInput = document.getElementById("typeMsg"),
    messages = document.getElementById("messages"),
    chatContent = document.getElementById("chatContent"),
    listOfConversations = document.getElementById("conversations");

let receiver,
    conversationKey,
    odKogaImamPoruke = [],
    novePoruke;

setInterval(() => {
    if (typeof myProfileData !== "undefined") {
        odKogaImamPoruke = proveriDaLiImaPoruka(myProfileData.username);
        setTimeout(() => {
            for (let user of odKogaImamPoruke) {
                if (user[1]) napuniKonverzacije(user[0]);
            }
            novePoruke = countNewMessages();
            newMessageNotification(novePoruke[1]);
        }, 500);
    }
}, 1500);

document.getElementById("videoCallBtn").addEventListener("click", event => {
    event.preventDefault();
    sendVideoCall(receiver);
});

document.getElementById("visitProfileBtn").addEventListener("click", event => {
    event.preventDefault();
    openUsersProfile(receiver);
});

trash.addEventListener("click", event => {
    event.preventDefault();
    let indeks = myProfileData.myConversations.indexOf(receiver);
    if (myProfileData.deletedConversations === undefined) {
        myProfileData["deletedConversations"] = {};
    }
    myProfileData.myConversations.splice(indeks, 1);
    myProfileData.deletedConversations[conversationKey] = myProfileData.msgKeys[conversationKey][myProfileData.msgKeys[conversationKey].length - 1];
    updateInformationsInDatabase(userUid, myProfileData, "");
    trash.style.visibility = "hidden";
    drawListOfConversations(myProfileData.myConversations);
});


listOfConversations.addEventListener("click", event => {
    if (event.target !== event.currentTarget && event.target.nodeName === "INPUT") {
        receiver = event.target.id;
        conversationKey = createConversationKey(myProfileData.username, receiver);
        let startMsg = findStartMsg(conversationKey),
            interval = setInterval(() => {
                if (receiver !== "") {
                    clearInterval(interval);
                    drawChat(conversationKey, startMsg);
                }
            }, 500);
    }
});

sendMessageForm.addEventListener("submit", event => {
    event.preventDefault();
    let message = messageInput.value;
    if (message.length === 0 || message.length > 5000) {
        alert(message.length === 0 ? "message is empty" : "message is too long");
        return;
    }
    sendMessage(receiver, message);
    sendNotificationToReceiver(receiver);
    sortMyConvesations(receiver);
    drawListOfConversations(myProfileData.myConversations);
    markSelectedChat();
    sendMessageForm.reset();
});

zvezdice.addEventListener("click", event => {
    if (event.target !== event.currentTarget) {
        let ocena = parseInt(event.target.id.split("_")[1]);
        firebase.database().ref(`ratings/${receiver}`).update({[myProfileData.username]: ocena});
        zvezdicePoruka.textContent = "Thanks for your rating!";
        zvezdice.style.display = "none";
    }
});

function sendVideoCall(receiver) {
    let isOnline = isUserOnline(receiver);
    setTimeout(() => {
        if (isOnline === 1) {
            videoCallRequest(receiver);
            createCallModal(receiver, false);
        } else {
            alert("User is not online");
        }
    }, 500);
}

function openUsersProfile(user) {
    firebase.database().ref('users/').once('value').then(function (snapshot) {
        snapshot.forEach(function (userSnapshot) {
            if (user === userSnapshot.val().username) {
                let userData = convertUserInfoForProfileDraw(userSnapshot.val());
                drawProfile(userData);
            }
        });
    });
}

function findStartMsg(key) {
    if (myProfileData.msgKeys === undefined) myProfileData["msgKeys"] = {};
    let messages = myProfileData.msgKeys[key],
        lengthOfConversation = messages === undefined ? 0 : messages.length;
    if (lengthOfConversation > 15) {
        return messages[lengthOfConversation - 15]
    }
    return 0;
}

function markSelectedChat() {
    if (document.getElementById(receiver) === null) return;
    document.getElementById(receiver).checked = true;
    let allChats = document.querySelectorAll("input[name='selectedChat']");
    for (let chat = 0; chat < allChats.length; chat++) {
        let selectedChat = document.querySelector("label[for='" + allChats[chat].id + "']");
        if (allChats[chat].checked) {
            selectedChat.style.backgroundColor = fluencyColor;
            zvezdice.style.display = "flex";
            zvezdicePoruka.textContent = "Rate this user:";
        } else {
            selectedChat.style.backgroundColor = "transparent";
        }
    }
}

function openConversationWithThisUser(user) {
    receiver = user;
    if (receiver === myProfileData.username) {
        alert("You can't send message to yourself, that's weird");
        return;
    }
    conversationKey = createConversationKey(myProfileData.username, user);
    let startMsg = findStartMsg(conversationKey);
    if (typeof myProfileData.myConversations === "undefined") myProfileData["myConversations"] = [];
    if (myProfileData.myConversations.indexOf(user) === -1) {
        myProfileData.myConversations.unshift(user);
        updateInformationsInDatabase(userUid, myProfileData, "new conversation created");
    }
    for (let div of mainDivs) {
        hide(div);
    }
    show(myMsgsDiv);
    drawListOfConversations(myProfileData.myConversations);
    drawChat(conversationKey, startMsg);
}

function drawChat(conversationKey, startMsg) {
    const poruke = dovuciPoruke(conversationKey, startMsg);
    show(loading);
    setTimeout(() => {
        markSelectedChat();
        drawChatContent(poruke, conversationKey);
        showHideChatContent("visible");
        hide(loading);
    }, 1200);
    trash.style.visibility = "visible";
}

function createConversationKey(myUsername, otherUsername) {
    let temp = [myUsername, otherUsername].sort();
    return temp[0] + temp[1];
}

function sendMessage(receiver, string) {
    if (myProfileData.myBlockList !== undefined && myProfileData.myBlockList.indexOf(receiver) !== -1) {
        alert("User is blocked");
        return;
    }
    let message = {
        body: string,
        sender: myProfileData.username,
        receiver: receiver,
        date: new Date(),
        seen: false
    };
    firebase.database().ref('messages/' + conversationKey + "/" + message.date.getTime() + "/").update(message);
}

function markMessageAsSeen(conversationKey, messageKey) {
    firebase.database().ref('messages/' + conversationKey + "/" + messageKey).update({"seen": true});
}

function sendNotificationToReceiver(receiver, msg = true) {
    firebase.database().ref('newMsgs/' + receiver).update({[myProfileData.username]: msg});
}

function markChatAsSeen(sender) {
    firebase.database().ref('newMsgs/' + myProfileData.username).update({[sender]: false});
}

function drawListOfConversations(arr) {
    if (typeof myProfileData.myConversations === "undefined") {
        listOfConversations.innerHTML = "<div><p style='text-align:center'>No conversations</p></div>";
        return;
    }
    listOfConversations.innerHTML = "";
    let div = document.createElement("div");
    div.setAttribute("id", "transparent");
    for (let index = 0; index < arr.length; index++) {
        if (arr[index] === myProfileData.username) continue;
        let friend = document.createElement("input"),
            label = document.createElement("label"),
            notificationBox = document.createElement("span");
        friend.setAttribute("type", "radio");
        friend.setAttribute("name", "selectedChat");
        friend.setAttribute("id", arr[index]);
        label.setAttribute("for", arr[index]);
        label.textContent = arr[index];
        label.className = "pointer";
        notificationBox.setAttribute("id", arr[index] + "_new");
        notificationBox.className = "newMsgInConversation";
        label.appendChild(notificationBox);
        div.appendChild(friend);
        div.appendChild(label);
    }
    listOfConversations.appendChild(div);
    for (let user of novePoruke[0]) {
        newMsgInChat(user, true);
    }
}

function showHideChatContent(property) {
    chatContent.style.visibility = property;
}

function proveriDaLiImaPoruka(username) {
    const ref = firebase.database().ref("newMsgs/" + username);
    let tempArr = [];
    ref.once('value', snapshot => {
        snapshot.forEach(newMsgsSnapshot => {
            let sender = newMsgsSnapshot.key,
                msg = newMsgsSnapshot.val();
            if (myProfileData.myBlockList.indexOf(sender) === -1) {
                if ((msg === true || msg === false) && sender !== myProfileData.username) {
                    tempArr.push([sender, msg]);
                } else {
                    videoCallMsg(msg, sender);
                    markChatAsSeen(sender)
                }
            } else if (msg === true) {
                markChatAsSeen(sender);
            }
        });
    });
    return tempArr;
}

function dovuciPoruke(imeKonverzacije, start) {
    const ref = firebase.database().ref("messages/" + imeKonverzacije),
        lastDeleted = findLastDeletedMsg(imeKonverzacije);
    let poruke = [];
    ref.once('value', function (snapshot) {
        snapshot.forEach(function (messageSnapshot) {
            let poruka = messageSnapshot.val(),
                broj = messageSnapshot.key;
            if (broj > lastDeleted && broj >= start) {
                poruke.push([poruka, broj]);
            }
        });
    });
    return poruke;
}

function findLastDeletedMsg(key) {
    if (myProfileData.deletedConversations === undefined || myProfileData.deletedConversations[key] === undefined) {
        return 0;
    }
    return myProfileData.deletedConversations[key];
}

function drawChatContent(poruke, imeKonverzacije) {
    let user = imeKonverzacije.split(myProfileData.username).join("");
    markChatAsSeen(user);
    messages.innerHTML = "";
    if (poruke.length === 0) {
        messages.innerHTML = "<div class='noContentMsg'><h2>no messages yet</h2></div>";
    } else {
        if (addBtnOrNot(imeKonverzacije, poruke)) {
            messages.innerHTML = "<a href='#' id='" + imeKonverzacije + "' class='wholeConversatonBtn pointer'>whole conversation</a>";
        }
        let sender = "";
        for (let element in poruke) {
            if (poruke.hasOwnProperty(element)) {
                let poruka = poruke[element][0],
                    brojPoruke = poruke[element][1],
                    div;
                saveMsgNumber(imeKonverzacije, brojPoruke);
                if (poruka.sender !== myProfileData.username && !poruka.seen) markMessageAsSeen(imeKonverzacije, brojPoruke);
                if (sender === poruka.sender) {
                    div = drawMessage(poruka, brojPoruke, "");
                } else {
                    div = drawMessage(poruka, brojPoruke, sender);
                    sender = poruka.sender;
                }
                messages.insertAdjacentHTML("beforeend", div);
            }
        }
        messages.scrollTop = messages.scrollHeight;
    }
    trackActiveConversation(imeKonverzacije);
    setTimeout(() => {
        newMsgInChat(user, false);
        updateInformationsInDatabase(userUid, myProfileData);
    }, 200);
}

function addBtnOrNot(conversationKey, msgArr) {
    let messageKeys = myProfileData.msgKeys;
    if (messageKeys === undefined) messageKeys = {};
    if (messageKeys[conversationKey] === undefined) messageKeys[conversationKey] = [];
    let lastDeletedMsg = findLastDeletedMsg(conversationKey),
        msgIndex = messageKeys[conversationKey].indexOf(lastDeletedMsg),
        nonDeletedChat = messageKeys[conversationKey].slice(msgIndex + 1, messageKeys[conversationKey].length);
    return messageKeys !== undefined && messageKeys[conversationKey] !== undefined && msgArr.length < nonDeletedChat.length;
}

function saveMsgNumber(conversationKey, msgNumber) {
    if (typeof myProfileData.msgKeys === "undefined") myProfileData["msgKeys"] = {};
    if (typeof myProfileData.msgKeys[conversationKey] === "undefined") myProfileData.msgKeys[conversationKey] = [];
    if (myProfileData.msgKeys[conversationKey].indexOf(msgNumber) === -1) {
        myProfileData.msgKeys[conversationKey].push(msgNumber);
    }
}

function drawMessage(message, msgNumber, sender) {
    let messageDivClass = message.sender === myProfileData.username ? "msgRight divZaPoruku" : "msgLeft divZaPoruku",
        time = typeof message.date !== "undefined" ? formatTime(message.date) : "",
        msgSender = message.sender === myProfileData.username ? "me:" : message.sender + ":",
        msgStatus = message.seen ? " seen" : " sent";
    if (message.receiver === myProfileData.username) msgStatus = "";
    let print = `<div id="${msgNumber}" class="${messageDivClass}">`;
    if (sender !== "") {
        print += `<span>${msgSender}</span>`
    }
    print += `<div class="msgBody">${message.body}</div><span class="time">${time + msgStatus}</span></div>`;
    return print;
}

function formatTime(time) {
    let datum = new Date(time);
    return dodajNulu(datum.getHours())
        + ':' + dodajNulu(datum.getMinutes())
        + " " + dodajNulu(datum.getDate())
        + '-' + dodajNulu(1 + datum.getMonth())
        + "-" + datum.getFullYear();
}

function dodajNulu(broj) {
    return broj < 10 ? '0' + broj : broj;
}

function napuniKonverzacije(user) {
    const conversationArr = myProfileData.myConversations;
    if (conversationArr === undefined) myProfileData["myConversations"] = [];
    if (conversationArr.indexOf(user) === -1 && user !== myProfileData.username) {
        conversationArr.unshift(user);
    } else {
        sortMyConvesations(user)
    }
    updateInformationsInDatabase(userUid, myProfileData);
    if (myMsgsDiv.style.display !== "none") {
        drawListOfConversations(conversationArr);
        markSelectedChat();
    }
}

function trackActiveConversation(conversationKey) {
    let databaseRef = firebase.database().ref("messages/" + conversationKey);
    databaseRef.on("child_changed", changeMsgStatus);
    databaseRef.on("child_added", addMessageToChat);
    if (document.getElementById(conversationKey) !== null) {
        document.getElementById(conversationKey).addEventListener("click", showWholeConversation)
    }
    let interval = setInterval(() => {
        const key = whichChatIsActive();
        if (myMsgsDiv.style.display === "none" || conversationKey !== key) {
            databaseRef.off("child_changed", changeMsgStatus);
            databaseRef.off("child_added", addMessageToChat);
            setTimeout(() => {
                showHideChatContent("hidden");
                clearInterval(interval);
            }, 100);
        }
    }, 1000);
}

function showWholeConversation(event) {
    event.preventDefault();
    let start = 0;
    drawChat(conversationKey, start);
}

function whichChatIsActive() {
    let allChats = document.querySelectorAll("input[name='selectedChat']");
    for (let chat of allChats) {
        if (chat.checked) {
            return createConversationKey(myProfileData.username, chat.id);
        }
    }
    return false;
}

function addMessageToChat(snapshot) {
    let msgNumber = snapshot.key,
        msgContent = snapshot.val(),
        scroll = messages.scrollHeight - messages.scrollTop,
        start = findStartMsg(conversationKey),
        lastDeleted = findLastDeletedMsg(conversationKey);
    setTimeout(() => {
        if (document.getElementById(msgNumber) !== null || msgNumber < start || msgNumber <= lastDeleted) return;
        let msg = drawMessage(msgContent, msgNumber, msgContent.sender);
        messages.insertAdjacentHTML("beforeend", msg);
        if (msgContent.receiver === myProfileData.username) {
            markChatAsSeen(msgContent.sender);
            newMsgInChat(msgContent.sender, false);
            markMessageAsSeen(conversationKey, msgNumber);
        }
        if (scroll < 800) messages.scrollTop = messages.scrollHeight;
    }, 300);
}

function changeMsgStatus(snapshot) {
    let msgNumber = snapshot.key,
        msgContent = snapshot.val(),
        element = document.getElementById(msgNumber);
    if (msgContent.sender === myProfileData.username && element !== null) {
        let status = element.lastChild.innerText.split(" ");
        status[status.length - 1] = "seen";
        element.lastChild.innerText = status.join(" ");
    }
}

function newMessageNotification(number) {
    setTimeout(() => {
        document.querySelector(".newMessageNum").innerText = number === 0 ? "" : number;
    }, 1000);
}

function countNewMessages() {
    let newMsgs = odKogaImamPoruke.filter((value, index) => value[1]),
        arr = [];
    for (let index in newMsgs) {
        if (newMsgs.hasOwnProperty(index)) {
            arr.push(newMsgs[index][0]);
        }
    }
    return [arr, arr.length];
}

function sortMyConvesations(user) {
    let indexOfUser = myProfileData.myConversations.indexOf(user);
    myProfileData.myConversations.splice(indexOfUser, 1);
    myProfileData.myConversations.unshift(user);
    updateInformationsInDatabase(userUid, myProfileData);
}

function newMsgInChat(user, value) {
    if (document.getElementById(user + "_new") !== null) document.getElementById(user + "_new").innerText = value ? "new" : "";
}