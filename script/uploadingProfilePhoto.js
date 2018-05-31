let editPhotoBtn = document.getElementById("editProfilePhoto"),
    uploadPhotoDiv = document.getElementById("uploadProfilePhoto"),
    uploadPhotoForm = document.getElementById("uploadPhoto"),
    closeUploadDiv = document.getElementById("closeUploadDiv"),
    noticeBackground = document.getElementById("noticeBackground"),
    uploadStatusInfo = document.getElementById("uploadStatus"),
    chooseFileBtn = document.getElementById("chooseFileBtn"),
    file = document.getElementById("profilePhotoFile");

let showProfilePhoto = setInterval(() => {
    let img = document.createElement("img");
    if (typeof myProfileData.profilePhoto !== "undefined") {
        img.setAttribute("src", myProfileData.profilePhoto);
        if (img.width > 0) {
            img.width < img.height ? img.style.width = "100%" : img.style.height = "100%";
            document.getElementById("pictureDiv").appendChild(img);
            clearInterval(showProfilePhoto);
        }
    }
}, 100);

editPhotoBtn.addEventListener("click", event => {
    event.preventDefault();
    show(uploadPhotoDiv, "block");
    show(noticeBackground);
});

chooseFileBtn.addEventListener("click", event => {
    event.preventDefault();
});

file.addEventListener("change", event => {
    uploadStatusInfo.innerHTML = `File ${file.files[0].name} added`;
});

uploadPhotoForm.addEventListener("submit", uploadProfilePhoto);

closeUploadDiv.addEventListener("click", event => {
    event.preventDefault();
    hide(uploadPhotoDiv);
    hide(noticeBackground);
});

function uploadProfilePhoto(event) {
    event.preventDefault();
    let uploading = firebase.storage().ref('profilePhotos/' + myProfileData.username + "/" + file.name).put(file.files[0]);
    uploading.on("state_changed", snapshot => {
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        uploadStatusInfo.innerHTML = `Upload is ${Math.round(progress)} % done`;
        if (progress === 100) {
            getImageUrl(uploading);
        }
    });
}

function getImageUrl(uploading) {
    uploading.snapshot.ref.getDownloadURL().then(downloadURL => {
        myProfileData["profilePhoto"] = downloadURL;
        updateInformationsInDatabase(userUid, myProfileData);
        setTimeout(() => {
            location.reload();
        }, 3e3);
    });
}