const sendMessageForm = document.getElementById("sendMsgForm"),
    messageInput = document.getElementById("typeMsg"),
    messages = document.getElementById("messages"),
    chatContent = document.getElementById("chatContent"),
    listOfConversations = document.getElementById("conversations");

let receiver,
    conversationKey,
    odKogaImamPoruke = [],
    novePoruke;

waitingForNewMsgs();

let waitForInfo = setInterval(() => {
    if (typeof myProfileData !== "undefined") {
        odKogaImamPoruke = proveriDaLiImaPoruka(myProfileData.username);
        setTimeout(() => {
            novePoruke = countNewMessages();
            newMessageNotification(novePoruke[1]);
        }, 500);
    }
}, 1000);

document.getElementById("trash").addEventListener("click", event => {
    console.log(myProfileData.myConversations);
    var indeks = myProfileData.myConversations.indexOf(receiver);
    myProfileData.myConversations.splice(indeks, 1);
    console.log(myProfileData.myConversations);
    updateInformationsInDatabase(userUid, myProfileData,"");
    document.getElementById("trash").style.visibility = "hidden";
    drawListOfConversations(myProfileData.myConversations);

});



listOfConversations.addEventListener("click", event => {
    if (event.target !== event.currentTarget && event.target.nodeName === "INPUT") {
        receiver = event.target.id;
        conversationKey = createConversationKey(myProfileData.username, receiver);
        let interval = setInterval(() => {
            if (receiver !== "") {
                const poruke = dovuciPoruke(conversationKey);
                console.log(poruke);
                clearInterval(interval);
                markSelectedChat();
                show(loading);
                setTimeout(() => {
                    drawChatContent(poruke, conversationKey);
                    showHideChatContent("visible");
                    hide(loading);
                }, 1200);
            }
            document.getElementById("trash").style.visibility = "visible";
        }, 500);
    }
});

sendMessageForm.addEventListener("submit", event => {
    event.preventDefault();
    let message = messageInput.value;
    if (message.length === 0 || message.length > 5000){
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

document.getElementById("zvezdice").addEventListener("click", event => {
    var ocena;
    if (event.target !==event.currentTarget){
    if (event.target.id == "jednaZvezdica") {
         console.log(event.target.id);
         ocena = 5;
    }
    if (event.target.id == "dveZvezdice") {
        console.log(event.target.id);
        ocena = 4;
    }
    if (event.target.id == "triZvezdice") {
        console.log(event.target.id);
        ocena = 3;
    }
    if (event.target.id == "cetiriZvezdice") {
        console.log(event.target.id);
        ocena = 2;
    }
    if (event.target.id == "petZvezdica") {
        console.log(event.target.id);
        ocena = 1;
    }
    console.log(ocena);
    firebase.database().ref(`ratings/${receiver}`).update({[myProfileData.username]: ocena});
    document.getElementById("zvezdicePoruka").textContent = "Thanks for your rating!";
    document.getElementById("zvezdice").style.display = "none";
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
            document.getElementById("zvezdice").style.display = "flex";
            document.getElementById("zvezdicePoruka").textContent = "Rate this user:";
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
    console.log(myProfileData.myConversations);
    if (myProfileData.myConversations != undefined) {
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
            console.log(sender);
            let poruka = poruke[element][0],
                brojPoruke = poruke[element][1],
                div;
            if (poruka.sender !== myProfileData.username && !poruka.seen) markMessageAsSeen(imeKonverzacije, brojPoruke);
            if (sender === poruka.sender) {
                console.log("sender === poruka.sender", sender === poruka.sender);
                div = drawMessage(poruka, brojPoruke, "");
            } else {
                console.log("else", sender === poruka.sender);
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
    console.log("draw msg sender", sender);
    let messageDivClass = message.sender === myProfileData.username ? "msgRight divZaPoruku" : "msgLeft divZaPoruku",
        time = typeof message.date !== "undefined" ? formatTime(message.date) : "",
        msgSender = message.sender === myProfileData.username ? "me:" : message.sender + ":",
        msgStatus = message.seen ? " seen" : " sent";
    if (message.receiver === myProfileData.username) msgStatus = "";
    let print = `<div id="${msgNumber}" class="${messageDivClass}">`;
    if (sender!=="") {
        print += `<span>${msgSender}</span>`
    }
    print += `<div class="msgBody">${message.body}</div><span class="time">${time + msgStatus}</span></div>`;
    return print;
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

function napuniKonverzacije(user) {
    if (myProfileData.myConversations === undefined) myProfileData["myConversations"] = [];
    if (myProfileData.myConversations.indexOf(user) === -1) {
        myProfileData.myConversations.unshift(user);
    } else {
        sortMyConvesations(user)
    }
    updateInformationsInDatabase(userUid, myProfileData);
    if (myMsgsDiv.style.display !== "none") {
        drawListOfConversations(myProfileData.myConversations);
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
        console.log("snapshot ne treba");
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

function waitingForNewMsgs() {
    firebase.database().ref("newMsgs/" + myProfileData.username).on("child_changed", snapshot => {
        let user = snapshot.key,
            value = snapshot.val();
        if (value) {
            napuniKonverzacije(user);
        }
        let tempArr = [];
        for (let korisnik of odKogaImamPoruke) {
            tempArr.push(korisnik[0]);
            if (korisnik[0] === user && korisnik[1] !== value) {
                korisnik[1] = value;
            }
        }
        if (tempArr.indexOf(user) === -1) {
            odKogaImamPoruke.push([user, value]);
        }
        updateNotifications();
    });
}

function updateNotifications() {
    setTimeout(() => {
        novePoruke = countNewMessages();
        newMessageNotification(novePoruke[1]);
        for (let user of novePoruke[0]) {
            newMsgInChat(user, true);
        }
    }, 1000);
}

function newMessageNotification(number) {
    setTimeout(() => {
        document.querySelector(".newMessageNum").innerText = number === 0 ? "" : number;
    }, 1000);
}

function countNewMessages() {
    let newMsgs = odKogaImamPoruke.filter((value, index) => value[1]);
    let arr = [];
    for (let index in newMsgs) {
        arr.push(newMsgs[index][0]);
    }
    return [arr, arr.length];
}

function sortMyConvesations(user) {
    console.log(user);
    let indexOfUser = myProfileData.myConversations.indexOf(user);
    myProfileData.myConversations.splice(indexOfUser, 1);
    myProfileData.myConversations.unshift(user);
}

function newMsgInChat(user, value) {
    if (document.getElementById(user + "_new") !== null) document.getElementById(user + "_new").innerText = value ? "new" : "";
}

function removeElem(tag,atr,vl)
{
    var els = document.getElementsByTagName(tag);
    vl=vl.toLowercase();
    for (var i = 0; i<els.length; i++) {
    var elem=els[i];
    if(elem.getAttribute(atr)){
    if ( elem.getAttribute(atr).toString().toLowercase()==vl){
    elem.remove();
    return;
    }
    }
    }
}