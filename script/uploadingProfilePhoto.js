let editPhotoBtn = document.getElementById("editProfilePhoto"),
    uploadPhotoDiv = document.getElementById("uploadProfilePhoto"),
    uploadPhotoForm = document.getElementById("uploadPhoto");

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
    uploadPhotoDiv.style.display = "block";
});

uploadPhotoForm.addEventListener("submit", uploadProfilePhoto);

function uploadProfilePhoto(event) {
    event.preventDefault();
    let file = document.getElementById("profilePhotoFile"),
        uploading = firebase.storage().ref('profilePhotos/' + myProfileData.username + "/" + file.name).put(file.files[0]);
    uploading.on("state_changed", function (snapshot) {
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        document.getElementById("uploadStatus").innerHTML = `Upload is ${Math.round(progress)} % done`;
        if (progress === 100) {
            getImageUrl(uploading);
        }
    });
}

function getImageUrl(uploading) {
    uploading.snapshot.ref.getDownloadURL().then(function (downloadURL) {
        myProfileData["profilePhoto"] = downloadURL;
        updateInformationsInDatabase(userUid, myProfileData);
        setTimeout(()=>{location.reload();},3e3)
    });
}
