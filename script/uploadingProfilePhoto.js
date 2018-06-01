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
        if (img.width > 0 && img.height > 0) {
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
    resizeImage({
        file: file.files[0],
        maxSize: 500
    }).then(function (resizedImage) {
        let uploading = firebase.storage().ref('profilePhotos/' + myProfileData.username + "/" + file.name).put(resizedImage);
        uploading.on("state_changed", snapshot => {
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            uploadStatusInfo.innerHTML = `Upload is ${Math.round(progress)} % done`;
            if (progress === 100) {
                getImageUrl(uploading);
            }
        });
    }).catch(function (err) {
        console.error(err);
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

function resizeImage(settings) {
    const file = settings.file,
        maxSize = settings.maxSize;
    let reader = new FileReader(),
        image = new Image(),
        canvas = document.createElement('canvas');
    let dataURItoBlob = function (dataURI) {
        let bytes = dataURI.split(',')[0].indexOf('base64') >= 0 ?
            atob(dataURI.split(',')[1]) :
            unescape(dataURI.split(',')[1]);
        let mime = dataURI.split(',')[0].split(':')[1].split(';')[0];
        let max = bytes.length;
        let ia = new Uint8Array(max);
        for (let i = 0; i < max; i++)
            ia[i] = bytes.charCodeAt(i);
        return new Blob([ia], { type: mime });
    };
    let resize = function () {
        let width = image.width;
        let height = image.height;
        if (width > height) {
            if (width > maxSize) {
                height *= maxSize / width;
                width = maxSize;
            }
        } else {
            if (height > maxSize) {
                width *= maxSize / height;
                height = maxSize;
            }
        }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(image, 0, 0, width, height);
        let dataUrl = canvas.toDataURL('image/jpeg');
        return dataURItoBlob(dataUrl);
    };
    return new Promise(function (ok, no) {
        if (!file.type.match(/image.*/)) {
            no(new Error("Not an image"));
            return;
        }
        reader.onload = function (readerEvent) {
            image.onload = function () { return ok(resize()); };
            image.src = readerEvent.target.result;
        };
        reader.readAsDataURL(file);
    });
}