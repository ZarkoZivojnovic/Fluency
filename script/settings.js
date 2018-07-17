document.getElementById("forgotPassLink").addEventListener("click", openForgotPassModal);

function openForgotPassModal(event) {
    event.preventDefault();
    createForgotPassModal();
    document.getElementById("forgotPassForm").addEventListener("submit", forgotPassForm);
    document.getElementById("cancelPassReset").addEventListener("click", event => {
        document.body.removeChild(document.getElementById("modalDiv"));
    });
}

function forgotPassForm(event) {
    event.preventDefault();
    const auth = firebase.auth(),
        email = document.getElementById("forgotPassEmail").value;
    auth.sendPasswordResetEmail(email).then(() => {
        document.querySelector(".modalText").innerHTML = `Email sent to ${email}. <br> Check your email and follow instructions`;
        document.getElementById("submitBtnForm").setAttribute("disabled", "disabled");
    }).catch(error => {
        alert("Error "+ error.message +" try again");
    });
}

function createForgotPassModal() {
    let div = document.createElement("div"),
        modal = document.createElement("div"),
        text = document.createElement("h3"),
        form = createForgotPassForm(),
        cancel = document.createElement("button");
    div.setAttribute("id", "modalDiv");
    cancel.innerHTML = "X";
    cancel.setAttribute("id", "cancelPassReset");
    text.innerHTML = `Password reset form`;
    text.className = "modalText";
    modal.className = "modal";
    modal.appendChild(text);
    modal.appendChild(form);
    modal.appendChild(cancel);
    div.appendChild(modal);
    document.body.appendChild(div);
}

function createForgotPassForm() {
    let form = document.createElement("form"),
        input = document.createElement("input"),
        label = document.createElement("label"),
        submit = document.createElement("input");
    form.setAttribute("id", "forgotPassForm");
    input.setAttribute("type", "email");
    input.setAttribute("id", "forgotPassEmail");
    input.setAttribute("placeholder", "Email");
    label.setAttribute("for", "forgotPassEmail");
    label.innerText = "Email:";
    submit.setAttribute("type", "submit");
    submit.setAttribute("id", "submitBtnForm");
    submit.className = "submitBtn";
    form.appendChild(label);
    form.appendChild(input);
    form.appendChild(submit);
    return form;
}

/* kad je user ulogovan */
function changePassword() {
    const user = firebase.auth().currentUser,
        newPassword = document.getElementById("").value,
        newPassConfirm = document.getElementById("").value;
    if (newPassword.length < 6) {
        alert("Weak password");
        return;
    }
    if (newPassword === newPassConfirm) {
        user.updatePassword(newPassword).then(() => {
            alert("Your password has been changed successfully");
        }).catch(error => {
            alert("An error has occurred, try again later");
        });
    }
}

function deleteProfile(userId) {
    let user = firebase.auth().currentUser;
    firebase.database().ref('users/' + userId).remove();
    user.delete().then(() => {
        alert("deleted profile")
    }).catch(error => {
        alert(error)
    });
}

