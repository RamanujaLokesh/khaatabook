let is_password_seen = false
let eye_element1 = document.getElementById("login-passwordToggleIcon")
var x = document.getElementById("signup-password1");
var y = document.getElementById("signup-password2")
let signupCheckboxEl = document.getElementById("signupCheckbox")
let matchedStatusEl = document.getElementById("matchedStatus")

function chechMatchpassword() {
    if (x.value === "" && y.value === "") {
        matchedStatusEl.textContent = ""
        return
    }
    if (x.value === y.value) {
        matchedStatusEl.textContent = "Matched"
        matchedStatusEl.classList.add("matched-password-status")
        matchedStatusEl.classList.remove("not-matched-password-status")
    } else {
        matchedStatusEl.textContent = "Not matched"
        matchedStatusEl.classList.remove("matched-password-status")
        matchedStatusEl.classList.add("not-matched-password-status")
    }
}
x.onclick = function() {
    if (x.value === "") {
        matchedStatusEl.textContent = ""
    }
}
y.onkeyup = function() {
    chechMatchpassword()
}

function togglePassword1() {

    var x = document.getElementById("login-password");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
    if (!is_password_seen) {
        eye_element1.className = "fa-solid fa-eye-slash password-toggle-icon"
        is_password_seen = true
    } else {
        eye_element1.className = "fa-solid fa-eye password-toggle-icon"
        is_password_seen = false
    }
}
signupCheckboxEl.onclick = function() {
    if (x.type === "password") {
        x.type = "text"
        y.type = "text"
    } else {
        x.type = "password"
        y.type = "password"
    }
}



let loginContainer = document.getElementById("loginContainer")
let signUpContainer = document.getElementById("signUpContainer")
let initialpage = "loginpage"
let topLoginEl = document.getElementById("topLogin")
let topSignupEl = document.getElementById("topSignup")


function gotoSignup() {
    if (initialpage === "loginpage") {
        initialpage = "signuppage"
        loginContainer.classList.add("d-none")
        signUpContainer.classList.remove("d-none")
        topLoginEl.classList.toggle("opened-section")
        topSignupEl.classList.toggle("opened-section")
    }
}

function gotoLogin() {
    if (initialpage === "signuppage") {
        initialpage = "loginpage"
        loginContainer.classList.remove("d-none")
        signUpContainer.classList.add("d-none")
        topLoginEl.classList.toggle("opened-section")
        topSignupEl.classList.toggle("opened-section")
    }
}