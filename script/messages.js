const sendMessageForm = document.getElementById("sendMsgForm"),
    messageInput = document.getElementById("typeMsg"),
    messages = document.getElementById("messages"),
    chatContent = document.getElementById("chatContent"),
    listOfConversations = document.getElementById("conversations");

let waitForInfo = setInterval(() => {
    if (typeof myProfileData !== "undefined") {
        clearInterval(waitForInfo);
        setTimeout(()=>{
            if (typeof myProfileData.myConversations !== "undefined") {
                drawListOfConversations(myProfileData.myConversations);
            }
        },1000);
    }
}, 200);

function openConversationWithThisUser(user) {
    console.log(user, user.toString());
    //let conversationKey = createConversationKey(myProfileData.username, user);
    if (typeof myProfileData.myConversations === "undefined") myProfileData["myConversations"] = [];
    if (myProfileData.myConversations.indexOf(user) === -1) {
        myProfileData.myConversations.push(user);
        updateInformationsInDatabase(userUid, myProfileData, "new conversation created");
    }
    for (let div of mainDivs) {
        hide(div);
    }
    drawListOfConversations(myProfileData.myConversations);
    show(myMsgsDiv);
    //openConversation(conversationKey);
    runMsgListeners();
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
    firebase.database().ref('messsages/' + conversationKey + "/" + new Date().getTime() + "/").update(message);
}

function markMessageAsSeen(conversationKey, messageKey) {
    firebase.database().ref('messsages/' + conversationKey + "/" + messageKey).update({"seen": true});
}

function newMsgNotification(receiver, conversationKey, newOrNot) { /// ("asdfasdf", "15132164641", true/false)
    firebase.database().ref('newMsgs/' + receiver).update({[conversationKey]: newOrNot});
}

function drawListOfConversations(arr) {
    listOfConversations.innerHTML = "";
    let div = document.createElement("div");
    for (let index = 0; index < arr.length; index++) {
        let friend = document.createElement("h3");
        friend.setAttribute("id", arr[index]);
        friend.textContent = arr[index];
        div.appendChild(friend);
    }
    console.log(div);
    listOfConversations.innerHTML = div.outerHTML;
}

function runMsgListeners() {
    let receiver, conversationKey;
    listOfConversations.addEventListener("click", event => {
        if (event.target !== event.currentTarget) {
            receiver = event.target.id;
            conversationKey = createConversationKey(myProfileData.username, receiver);
            openConversation(conversationKey);
        }
    });
    sendMessageForm.addEventListener("submit", event => {
        event.preventDefault();
        let message = messageInput.value;
        sendMessage(receiver, message);
        newMsgNotification(receiver, conversationKey, true);
        sendMessageForm.reset();
    });
}

function openConversation(conversationKey) {
    messages.innerText = getChat(conversationKey); /// ispis chat-a
    chatContent.style.visibility = "visible";
}

function getChat(conversationKey) { //dovuci chat
    return "dfijljafldjlf jdlfjldjfldjlfjd fdjf dfjldj fldjfjdčfjdfj dfjdfja";
}

