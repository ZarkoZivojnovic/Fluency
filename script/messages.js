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

let receiver,
    conversationKey;

listOfConversations.addEventListener("click", event => {
    if (event.target !== event.currentTarget) {
        receiver = event.target.getAttribute("for");
        conversationKey = createConversationKey(myProfileData.username, receiver);
        openConversation(conversationKey);
    }
    markSelectedChat();
    
});

sendMessageForm.addEventListener("submit", event => {
    event.preventDefault();
    let message = messageInput.value;
    sendMessage(receiver, message);
    newMsgNotification(receiver, conversationKey, true);
    sendMessageForm.reset();
});

function markSelectedChat() {
    let allChats = document.querySelectorAll("input[name='selectedChat']");
    for (let chat = 0; chat<allChats.length; chat++){
        let selectedChat = document.querySelector("label[for='"+allChats[chat].id+"']");
        if (allChats[chat].checked) {
            selectedChat.style.backgroundColor = fluencyColor;
        } else {
            selectedChat.style.backgroundColor = "inherit";
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
    div.classList.add("transparent");
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

