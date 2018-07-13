let videoStreamDiv = document.getElementById("videoStreamDiv"),
    yourVideo = document.getElementById("yourVideo"),
    friendsVideo = document.getElementById("friendsVideo"),
    videoDatabase, yourId, pc,
    servers = {'iceServers': [{'urls': 'stun:stun.services.mozilla.com'}, {'urls': 'stun:stun.l.google.com:19302'}, {'urls': 'turn:numb.viagenie.ca','credential': 'beaver','username': 'webrtc.websitebeaver@gmail.com'}]};


function videoCallRequest(receiver) {
    let callRequest = "Video Call";
    sendNotificationToReceiver(receiver, callRequest);
}

function incomingVideoCall(sender) {
    createCallModal(sender);
    document.querySelector(".callModal").addEventListener("click", selectAnswer);
}

function selectAnswer(event) {
    event.stopPropagation();
    let sender = event.currentTarget.parentNode.className.split("_")[1];
    if (event.target !== event.currentTarget && event.target.nodeName === "BUTTON") {
        let answer = event.target.innerText + "ed";
        sendAnswerToSender(answer, sender)
    }
}

function sendAnswerToSender(answer, sender) {
    if (answer === "Accepted") {
        receiver = sender;
        sendNotificationToReceiver(sender, "Accepted Video Call");
        startWebRTC(sender);
        showMyFace();
        openConversationWithThisUser(sender);
        show(videoStreamDiv);
    } else if (answer === "Rejected") {
        sendNotificationToReceiver(sender, "Rejected Video Call");
    }
    document.querySelector(".callModal").removeEventListener("click", selectAnswer);
    document.body.removeChild(document.getElementById("modalDiv"));
}

function createCallModal(sender) {
    const receiver = myProfileData.username !== sender;
    let div = document.createElement("div"),
        modal = document.createElement("div"),
        accept = document.createElement("button"),
        reject = document.createElement("button"),
        text = document.createElement("h3");
    div.setAttribute("id", "modalDiv");
    div.className = "sender_" + sender;
    modal.className = "callModal";
    accept.className = "acceptCall";
    accept.innerText = "Accept";
    reject.className = "rejectCall";
    reject.innerHTML = "Reject";
    text.className = "modalText";
    text.innerHTML = "Video Call from<br><span>" + sender + "</span>";
    modal.appendChild(text);
    modal.appendChild(accept);
    modal.appendChild(reject);
    div.appendChild(modal);
    document.body.appendChild(div);
}

function callingModal() {
    
}

function videoCallMsg(msg, sender) {
    if (msg === "Video Call") {
        incomingVideoCall(sender);
    } else if (msg === "Accepted Video Call") {
        console.log(sender, msg);
        startWebRTC(sender);
        showMyFace();
        //showFriendsFace();
        openConversationWithThisUser(sender);
        show(videoStreamDiv);
    } else if (msg === "Rejected Video Call") {
        console.log(sender, msg);
    }
}

function startWebRTC(remoteUser) {
    conversationKey = createConversationKey(myProfileData.username, remoteUser);
    firebase.database().ref('calls/'+conversationKey).set({"call":"call"});
    videoDatabase = firebase.database().ref('calls/'+conversationKey);
    yourId = Math.floor(Math.random()*1000000000);
    pc = new RTCPeerConnection(servers);
    pc.onicecandidate = (event => event.candidate?sendVideoMessage(yourId, JSON.stringify({'ice': event.candidate})):console.log("Sent All Ice") );
    pc.onaddstream = (event => friendsVideo.srcObject = event.stream);
    videoDatabase.on('child_added', readMessage);
}

function sendVideoMessage(senderId, data) {
    let msg = videoDatabase.push({ sender: senderId, message: data });
    msg.remove();
}

function readMessage(data) {
    console.log("data", data);
    let string = data.val();
    if (string === "call")return;
    console.log("string", string);
    let msg = JSON.parse(string.message);
    console.log("json", data.val().message);
    console.log("msg", msg);
    let sender = data.val().sender;
    if (sender !== yourId) {
        if (msg.ice !== undefined)
            pc.addIceCandidate(new RTCIceCandidate(msg.ice));
        else if (msg.sdp.type === "offer")
            pc.setRemoteDescription(new RTCSessionDescription(msg.sdp))
                .then(() => pc.createAnswer())
                .then(answer => pc.setLocalDescription(answer))
                .then(() => sendVideoMessage(yourId, JSON.stringify({'sdp': pc.localDescription})));
        else if (msg.sdp.type === "answer")
            pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
    }
}

function showMyFace() {
    navigator.mediaDevices.getUserMedia({audio:true, video:true})
        .then(stream => yourVideo.srcObject = stream)
        .then(stream => pc.addStream(stream))
        .then(showFriendsFace);
}

function showFriendsFace() {
    pc.createOffer()
        .then(offer => pc.setLocalDescription(offer) )
        .then(() => sendVideoMessage(yourId, JSON.stringify({'sdp': pc.localDescription})) );
}