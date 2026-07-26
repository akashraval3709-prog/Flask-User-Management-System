const formElemet = document.querySelector('form')
const submitBtn = document.querySelector('.btn')

const emailInput = document.querySelector('#username')
const passwordInput = document.querySelector('#password')

const errorMsgE = document.querySelector('.email-error')
const errorMsgP = document.querySelector('.pass-error')
const validMsg = document.querySelector('.valid')

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

formElemet.addEventListener('submit', (e) => {

    const email = emailInput.value.trim();
    const pass = passwordInput.value.trim();
    let isValid = true;

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
    submitBtn.disabled = true

});


emailInput.addEventListener('input', () => {
    errorMsgE.textContent = ''
    
});

passwordInput.addEventListener('input', () => {
    errorMsgP.textContent = ''
});

emailInput.addEventListener('blur', (e) => {
    if (e.target.value.trim() == '') {
        errorMsgE.textContent = "This field is required"
    } else if (!isValidEmail(e.target.value)) {
        errorMsgE.textContent = "Please enter a valid email"
    }

});

passwordInput.addEventListener('blur', (e) => {
    if (e.target.value == '') {
        errorMsgP.textContent = "This field is required"
    }
});

