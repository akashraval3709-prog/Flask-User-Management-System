const formElemet = document.querySelector('form')
const submitBtn = document.querySelector('.btn')

const fullnameInput = document.querySelector('#fullname')
const emailInput = document.querySelector('#email')
const passwordInput = document.querySelector('#password')

const errorMsgF = document.querySelector('.name-error')
const errorMsgE = document.querySelector('.email-error')
const errorMsgP = document.querySelector('.pass-error')
const validMsg = document.querySelector('.valid')


window.addEventListener("DOMContentLoaded", () => {
  checkForm()
});


function checkForm() {
    if (fullnameInput.value.trim() == '' || emailInput.value.trim() == '' || passwordInput.value.trim() == '') {

        submitBtn.disabled = true


    }

    if (fullnameInput.value.trim() != '' && emailInput.value.trim() != '' && passwordInput.value.trim() != ''){
        submitBtn.disabled = false

}

}



function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

formElemet.addEventListener('submit', (e) => {

    const fullName = fullnameInput.value.trim();
    const email = emailInput.value.trim();
    const pass = passwordInput.value.trim();
    let isValid = true;

    if (fullName == '') {
        errorMsgF.textContent = "Name can't be empty"
        isValid = false
    }
    if (email == '') {
        errorMsgE.textContent = "Email can't be empty"
        isValid = false
    }
    if (pass == '') {
        errorMsgP.textContent = "Password can't be empty"
        isValid = false
    }


    if (!isValid) {
        e.preventDefault()
        return
    }
    submitBtn.textContent = 'Sending...'
    submitBtn.disabled = true

});


fullnameInput.addEventListener('input', () => {
    errorMsgF.textContent = ''
    checkForm()
});

emailInput.addEventListener('input', () => {
    errorMsgE.textContent = ''
    checkForm()
});

passwordInput.addEventListener('input', () => {
    const password = passwordInput.value.trim();
    const MIN_PASSWORD_LENGTH = 8;
    if (password.length >= MIN_PASSWORD_LENGTH) {
        validMsg.textContent = "Valid Password";
        errorMsgP.textContent = "";
    } else {
        validMsg.textContent = "";
        errorMsgP.textContent = "Password must be at least 8 characters long.";
    }
    checkForm()
});

fullnameInput.addEventListener('blur', (e) => {

    if (e.target.value.trim() == '') {

        errorMsgF.textContent = "This field is required"
    }

});

emailInput.addEventListener('blur', (e) => {
    if (e.target.value.trim() == '') {
        errorMsgE.textContent = "This field is required"
    } else if (!isValidEmail(e.target.value)) {
       errorMsgE.textContent= "Please enter a valid email"
    }

});

passwordInput.addEventListener('blur', (e) => {
    if (e.target.value == '') {
        errorMsgP.textContent = "This field is required"
    }
});

