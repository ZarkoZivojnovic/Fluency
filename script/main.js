let config = {
    apiKey: "AIzaSyCh43EY9Ehxt8tdtb9XNkqYgdDatmy6DnA",
    authDomain: "fluency-lang.firebaseapp.com",
    databaseURL: "https://fluency-lang.firebaseio.com",
    projectId: "fluency-lang",
    storageBucket: "fluency-lang.appspot.com",
    messagingSenderId: "365373726518"
};
firebase.initializeApp(config);

const loginForm = document.getElementById("loginForm"),
    registerForm = document.getElementById("registerForm");

let database = firebase.database(),
    user = firebase.auth().currentUser,
    userId;

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        userId = firebase.auth().currentUser.uid;
        localStorage.setItem("userId", userId);
        firebase.database().ref("users/" + localStorage.getItem("userId") + "/status").set("online");
    }
});

document.body.addEventListener("mousemove", setTimeOfLastEvent);
setInterval(amIHere, 15e3);

function setTimeOfLastEvent(event) {
    if (event) {
        let lastTimeEvent = new Date().getTime();
        localStorage.setItem("lastTime", lastTimeEvent);
    }
}

function amIHere() {
    let newTime = new Date().getTime(),
        oldTime = localStorage.getItem("lastTime");
    if (newTime - oldTime > 3e5) {
        setStatus("away", userId);
    } else {
        setStatus("online", userId);
    }
}

function goOnline(event) {
    let email = document.getElementById("email").value,
        password = document.getElementById("password").value;
    firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
        userId = firebase.auth().currentUser.uid;
        setStatus("online", userId);
        alert("You Are Online");
        setTimeout(() => {
            location.assign('./dashboard.html');
        }, 3e3);
    }).catch(function (error) {
        alert(error);
    });
    event.preventDefault();
}

function goOffline(event) {
    event.preventDefault();
    event.stopPropagation();
    setStatus("offline", userId);
    firebase.auth().signOut().then(() => {
        alert("You Are Offline");
        setTimeout(() => {
            location.assign('./login.html');
        }, 3e3);
    }).catch(function (error) {
        alert(error);
    });
}

function userRegistration(event) {
    let email = document.getElementById("email").value,
        password = document.getElementById("password").value,
        username = document.getElementById("username").value;
    firebase.auth().createUserWithEmailAndPassword(email, password).then(() => {
        writeUserDataOnRegistration(username, email);
        setStatus("online", userId);
        alert("Registration Successful");
        setTimeout(() => {
            location.assign('./dashboard.html');
        }, 3e3);
    }).catch(function (error) {
        alert(error.code);
    });
    event.preventDefault();
    registerForm.reset();
}

function setStatus(status, userId) {
    firebase.database().ref('users/' + userId).update({
        status: status
    });
}

function writeUserDataOnRegistration(name, email) {
    let userId = firebase.auth().currentUser.uid;
    firebase.database().ref('users/' + userId).set({
        username: name,
        email: email
    });
}

function alert(string) {
    let notice = document.getElementById("notice"),
        noticeBackground = document.getElementById("noticeBackground");
    notice.innerHTML = "<h1>" + string + "!</h1>";
    noticeBackground.style.display = "block";
    notice.style.top = "150px";
    setTimeout(() => {
        noticeBackground.style.display = "none";
        notice.style.top = "-300px"
    }, 2e3);
}

//predlog za strukturu baze
let userProfile = {
    username: {
        element:"input",
        type:"text"
    },
    "native language": {
        element: "select",
        options: ["English", "German", "French", "Spanish", "Serbian", "Russian"],
    },
    "other languages": {
        element: "input",
        type: "checkbox",
        options: ["English", "German", "French", "Spanish", "Serbian", "Russian"],
        level: ["elementary", "intermediate", "advanced"]
    },
    country: {
        element: "input",
        type: "text"
    },
    city: {
        element: "input",
        type: "text"
    },
    "birth date": {
        element: "input",
        type: "date"
    },
    gender: {
        element: "input",
        type: "radio",
        options: ["male", "female", "other"]
    },
    "about me": {
        element: "textarea"
    },
    interests: {
        element: "textarea"
    }
};


/*var ref = firebase.database().ref("users");
ref.orderByChild("status").on("child_added", function(snapshot) {
    console.log(snapshot.key + " was " + snapshot.val().status + " m tall");
});*/