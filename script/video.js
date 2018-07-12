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
    let callRequest = "https://appr.tc/r/778556878";
    sendNotificationToReceiver(receiver, callRequest);
}

function incomingVideoCall(sender, url) {
    createCallModal(sender, url);
    //document.querySelector(".callModal").addEventListener("click", selectAnswer);
}

function createCallModal(sender, url) {
    let div = document.createElement("div"),
        modal = document.createElement("div"),
        accept = document.createElement("a"),
        reject = document.createElement("button"),
        text = document.createElement("h3");
    div.setAttribute("id", "modalDiv");
    div.className = "sender_" + sender;
    modal.className = "callModal";
    accept.className = "acceptCall";
    accept.innerText = "Accept";
    accept.href = url;
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


function videoCallMsg(msg, sender) {
    if (msg === "Video Call") {
        //incomingVideoCall(sender);
    } else if (msg === "Accepted Video Call") {
        console.log(sender, msg);
        offerer = true;
        //startWebRTC(offerer);
    } else if (msg === "Rejected Video Call") {
        console.log(sender, msg);
    } else {

        let url = msg;
        incomingVideoCall(sender, url)
        /*let dataObj = JSON.parse(msg);
        console.log("received obj", dataObj);
        videoInfoHendler(dataObj)*/
    }
}