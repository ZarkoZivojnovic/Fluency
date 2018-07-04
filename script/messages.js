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

trash.addEventListener("click", event => {
    let indeks = myProfileData.myConversations.indexOf(receiver);
    myProfileData.myConversations.splice(indeks, 1);
    updateInformationsInDatabase(userUid, myProfileData, "");
    trash.style.visibility = "hidden";
    drawListOfConversations(myProfileData.myConversations);
});


listOfConversations.addEventListener("click", event => {
    if (event.target !== event.currentTarget && event.target.nodeName === "INPUT") {
        receiver = event.target.id;
        conversationKey = createConversationKey(myProfileData.username, receiver);
        let interval = setInterval(() => {
            if (receiver !== "") {
                const poruke = dovuciPoruke(conversationKey);
                clearInterval(interval);
                markSelectedChat();
                show(loading);
                setTimeout(() => {
                    drawChatContent(poruke, conversationKey);
                    showHideChatContent("visible");
                    hide(loading);
                }, 1200);
            }
            trash.style.visibility = "visible";
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
    conversationKey = createConversationKey(myProfileData.username, user);
    if (typeof myProfileData.myConversations === "undefined") myProfileData["myConversations"] = [];
    if (myProfileData.myConversations.indexOf(user) === -1) {
        myProfileData.myConversations.unshift(user);
        updateInformationsInDatabase(userUid, myProfileData, "new conversation created");
    }
    for (let div of mainDivs) {
        hide(div);
    }
    const poruke = dovuciPoruke(conversationKey);
    show(myMsgsDiv);
    show(loading);
    drawListOfConversations(myProfileData.myConversations);
    setTimeout(() => {
        markSelectedChat();
        drawChatContent(poruke, conversationKey);
        showHideChatContent("visible");
        hide(loading);
    }, 1000);
}

function createConversationKey(myUsername, otherUsername) {
    let temp = [myUsername, otherUsername].sort();
    return temp[0] + temp[1];
}

function sendMessage(receiver, string) {
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

function sendNotificationToReceiver(receiver) {
    firebase.database().ref('newMsgs/' + receiver).update({[myProfileData.username]: true});
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
            tempArr.push([newMsgsSnapshot.key, newMsgsSnapshot.val()]);
        });
    });
    return tempArr;
}

function dovuciPoruke(imeKonverzacije) {
    const ref = firebase.database().ref("messages/" + imeKonverzacije);
    let poruke = [];
    ref.once('value', function (snapshot) {
        snapshot.forEach(function (messageSnapshot) {
            let poruka = messageSnapshot.val();
            poruke.push([poruka, messageSnapshot.key]);
        });
    });
    return poruke;
}

function drawChatContent(poruke, imeKonverzacije) {
    let user = imeKonverzacije.split(myProfileData.username).join("");
    markChatAsSeen(user);
    trackActiveConversation(imeKonverzacije);
    messages.innerHTML = "";
    if (poruke.length === 0) {
        messages.innerHTML = "<div class='noContentMsg'><h2>no messages yet</h2></div>";
    } else {
        let sender = "";
        for (let element in poruke) {
            let poruka = poruke[element][0],
                brojPoruke = poruke[element][1],
                div;
            if (poruka.sender !== myProfileData.username && !poruka.seen) markMessageAsSeen(imeKonverzacije, brojPoruke);
            if (sender === poruka.sender) {
                div = drawMessage(poruka, brojPoruke, "");
            } else {
                div = drawMessage(poruka, brojPoruke, sender);
                sender = poruka.sender;
            }
            messages.insertAdjacentHTML("beforeend", div);
        }
        messages.scrollTop = messages.scrollHeight;
    }
    setTimeout(() => {
        newMsgInChat(user, false);
    }, 200);
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
    if (conversationArr.indexOf(user) === -1) {
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
        scroll = messages.scrollHeight - messages.scrollTop;
    setTimeout(() => {
        if (document.getElementById(msgNumber) !== null) return;
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
        arr.push(newMsgs[index][0]);
    }
    return [arr, arr.length];
}

function sortMyConvesations(user) {
    let indexOfUser = myProfileData.myConversations.indexOf(user);
    myProfileData.myConversations.splice(indexOfUser, 1);
    myProfileData.myConversations.unshift(user);
}

function newMsgInChat(user, value) {
    if (document.getElementById(user + "_new") !== null) document.getElementById(user + "_new").innerText = value ? "new" : "";
}