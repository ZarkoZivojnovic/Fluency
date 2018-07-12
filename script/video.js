const configuration = {
    iceServers: [{
        urls: 'stun:stun.l.google.com:19302'
    }]
};
let videoStreamDiv = document.getElementById("videoStreamDiv"),
    yourVideo = document.getElementById("yourVideo"),
    friendsVideo = document.getElementById("friendsVideo"),
    pc,
    offerer = false;

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
        sendNotificationToReceiver(sender, "Accepted Video Call");
        startWebRTC(offerer);
        receiver = sender;
        openConversationWithThisUser(sender);
        show(videoStreamDiv);
    } else if (answer === "Rejected") {
        sendNotificationToReceiver(sender, "Rejected Video Call");
    }
    document.querySelector(".callModal").removeEventListener("click", selectAnswer);
    document.body.removeChild(document.getElementById("modalDiv"));
}

function createCallModal(sender) {
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

function videoCallDataExchage(message) {
    sendNotificationToReceiver(receiver, JSON.stringify(message));
}

function startWebRTC(offerer) {
    pc = new RTCPeerConnection(configuration);

    // 'onicecandidate' notifies us whenever an ICE agent needs to deliver a
    // message to the other peer through the signaling server
    pc.onicecandidate = event => {

        if (event.candidate) {
            videoCallDataExchage({'candidate': event.candidate});
            console.log("onicecand send candidate", event.candidate);
        }


    };

    // If user is offerer let the 'negotiationneeded' event create the offer
    if (offerer) {
        pc.onnegotiationneeded = () => {
            pc.createOffer().then(localDescCreated).catch((err) => {
                console.log(err)
            });
        }
    }

    // When a remote stream arrives display it in the #remoteVideo element
    pc.ontrack = event => {
        const stream = event.streams[0];
        if (!friendsVideo.srcObject || friendsVideo.srcObject.id !== stream.id) {
            friendsVideo.srcObject = stream;
        }
    };

    navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
    }).then(stream => {
        // Display your local video in #localVideo element
        yourVideo.srcObject = stream;
        // Add your stream to be sent to the conneting peer
        stream.getTracks().forEach(track => pc.addTrack(track, stream));
    }, (err) => {
        console.log(err)
    });
}

function videoCallMsg(msg, sender) {
    if (msg === "Video Call") {
        incomingVideoCall(sender);
    } else if (msg === "Accepted Video Call") {
        console.log(sender, msg);
        offerer = true;
        startWebRTC(offerer);
    } else if (msg === "Rejected Video Call") {
        console.log(sender, msg);
    } else {
        let dataObj = JSON.parse(msg);
        console.log("received obj", dataObj);
        videoInfoHandler(dataObj)
    }
}

function videoInfoHandler(message) {
    if (message.candidate) {
        console.log("msg.candidate", message.candidate);
        pc.addIceCandidate(new RTCIceCandidate(message.candidate)).catch((err) => {
            console.log("err addicecandidate", err);
        });
    } else if (message.sdp.type === "offer") {
        pc.setRemoteDescription(new RTCSessionDescription(message.sdp))
            .then(() => pc.createAnswer())
            .then(answer => pc.setLocalDescription(answer))
            .then(() => videoCallDataExchage({'sdp': pc.localDescription}));
    } else if (message.sdp.type === "answer") {
        pc.setRemoteDescription(new RTCSessionDescription(message.sdp));
    }
}

function localDescCreated(desc) {
    pc.setLocalDescription(
        desc,
        () => {
            videoCallDataExchage({'sdp': pc.localDescription})
        },
        (err) => {
            console.log("localDesc", err)
        }
    );
}
