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




