const sendMessageForm = document.getElementById("sendMsgForm"),
    messageInput = document.getElementById("typeMsg"),
    messages = document.getElementById("messages"),
    chatContent = document.getElementById("chatContent"),
    listOfConversations = document.getElementById("conversations");

var odKogaImamPoruke = [];


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
    //proveri da li ima poruka
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

var myArray = [
    [1, 0],
    [1, 1],
    [1, 3],
    [2, 4]
];
var item = [1, 0];

console.log(isArrayInArray(myArray, item));

listOfConversations.addEventListener("click", event => {
    if (event.target !== event.currentTarget) {
        receiver = event.target.id;
        conversationKey = createConversationKey(myProfileData.username, receiver);
        openConversation(conversationKey);
    }
    markSelectedChat();
});

sendMessageForm.addEventListener("submit", event => {
    event.preventDefault();
    let message = messageInput.value;
    sendMessage(receiver, message);
    newMsgNotification(receiver, true);
    sendMessageForm.reset();
});

function markSelectedChat() {
    let allChats = document.querySelectorAll("input[name='selectedChat']");
    for (let chat = 0; chat < allChats.length; chat++) {
        let selectedChat = document.querySelector("label[for='" + allChats[chat].id + "']");
        if (allChats[chat].checked) {
            selectedChat.style.backgroundColor = fluencyColor;
            dovuciPoruke();
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
    document.getElementById(receiver).checked = true;
    markSelectedChat();
    openConversation(conversationKey);
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
    dovuciPoruke();
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


function openConversation(conversationKey) {
    messages.innerText = getChat(conversationKey); /// ispis chat-a
    chatContent.style.visibility = "visible";

}

function getChat(conversationKey) { //dovuci chat
    return "dfijljafldjlf jdlfjldjfldjlfjd fdjf dfjldj fldjfjdčfjdfj dfjdfja";
}

function proveriDaLiImaPoruka(username) {
    //console.log("USAO U FUNKCIJU");
    var putanja = "newMsgs/" + username;
    //console.log(putanja);
    var ref = firebase.database().ref(putanja);
    ref.once('value', function (snapshot) {
        snapshot.forEach(function (newMsgsSnapshot) {
            var userOdKogImamPoruke = [];
            userOdKogImamPoruke.push(newMsgsSnapshot.key);
            userOdKogImamPoruke.push(newMsgsSnapshot.val());
            //console.log("USER OD KOGA IMAM PORUKE", userOdKogImamPoruke, userOdKogImamPoruke.length);
            //console.log("CEO NIZ", odKogaImamPoruke);
            if (isArrayInArray(odKogaImamPoruke, userOdKogImamPoruke)) {
            } else {
                odKogaImamPoruke.push(userOdKogImamPoruke);
            }
        });
        //console.log("OD NJIH IMAM PORUKE", odKogaImamPoruke);
        napuniKonverzacije();
    });
}

function dovuciPoruke() {
    document.getElementById("messages").innerText = "";
    //console.log("POCINJE DOVLACENJE");
    var poruke = [];
    var poruka;

    var imeKonverzacije = createConversationKey(myProfileData.username, receiver);
    var ref = firebase.database().ref("messages/" + imeKonverzacije);
    ref.once('value', function (snapshot) {
        snapshot.forEach(function (messageSnapshot) {
            poruka = messageSnapshot.val();
            //console.log("PORUKA", poruka);
            poruke.push(poruka);

        });
        //console.log("PORUKE", poruke, poruke.length);
        for (element of poruke) {
            //console.log("BODI PORUKE", element.body);
            var divZaPoruku = document.createElement("div");
            var sadrzajDiv = document.createElement("div");
            var posiljalac = document.createElement("div");
            var vreme = document.createElement("div");
            divZaPoruku.className = element.sender === myProfileData.username ? "msgRight" : "msgLeft";
            posiljalac.className = element.sender === myProfileData.username ? "msgRight" : "msgLeft";
            vreme.className = element.sender === myProfileData.username ? "msgRight" : "msgLeft";
            sadrzajDiv.innerHTML = element.body;
            posiljalac.innerHTML = element.sender;
            vreme.innerHTML = element.date;
            document.getElementById("messages").appendChild(posiljalac);
            divZaPoruku.appendChild(sadrzajDiv);
            document.getElementById("messages").appendChild(divZaPoruku);
            document.getElementById("messages").appendChild(vreme);
            messages.scrollTop = messages.scrollHeight;
        }
    });
}

function napuniKonverzacije() {
    //console.log(odKogaImamPoruke);
    for (user of odKogaImamPoruke) {
        //console.log("ceo user od kog imam poruke", user);
        //console.log("OD OVOG IMAM PORUKE", user[0]);
        //console.log("MOJE KONVERZACIJE 1", myProfileData.myConversations);
        if (myProfileData.myConversations === undefined) myProfileData.myConversations = [];
        if (myProfileData.myConversations.indexOf(user[0]) === -1) {
            myProfileData.myConversations.push(user[0]);
            //console.log("MOJE KONVERZACIJE 2", myProfileData.myConversations);
            updateInformationsInDatabase(userUid, myProfileData, "new conversation created");
        }
    }
    drawListOfConversations(myProfileData.myConversations);
}

//trebalo bi da radi sad


/* if (myProfileData.myConversations.indexOf(user[0]) === -1) {
        myProfileData.myConversations.push(user[0]);
        updateInformationsInDatabase(userUid, myProfileData, "new conversation created");
        console.log("MOJE KONVERZACIJE", myProfileData.myConversations);
    } */

