

import { showError } from "./errorMsg.js";
import { clearError } from "./errorMsg.js";
import { isValidPhone } from "./errorMsg.js";


const formElement = document.querySelector('form')
const passwordForm = document.querySelector('#passwordForm')
const saveBtn = document.querySelector('.sbtn')
const cencelBtn = document.querySelector('.cbtn')


const passwordModal = document.querySelector('#passwordModal')
const editProfileModal = document.querySelector('#editProfileModal')
const editProfileBtn = document.querySelector('#editProfilBtn')
const passwordChangeBtn = document.querySelector('#passwordChangeBtn')
const closeModal = document.querySelector('#closeModal')
const closePasswordModal = document.querySelector('#closePasswordModal')


const userFullName = document.querySelector('#fullname')
const userPhone = document.querySelector('#phone')
const userAddress = document.querySelector('#address')

const currentPass = document.querySelector('.current-pass')
const newPAss = document.querySelector('.new-pass')
const ConfirmPass = document.querySelector('.Confirm-pass')

const fNameErrMsg = document.querySelector('.FullName-err-msg')
const phoneErrMsg = document.querySelector('.phone-err-msg')
const phoneValidMsg = document.querySelector('.phone-valid-msg')
const currentPassMsg = document.querySelector('.current-passMsg')
const newPassMsg = document.querySelector('.new-passMsg')
const onfirmPassMsg = document.querySelector('.confirm-passMsg')



editProfileBtn.addEventListener('click', () => {
    editProfileModal.classList.remove('hidden')
})

passwordChangeBtn.addEventListener('click', () => {
    passwordModal.classList.remove('hidden')
})

closeModal.addEventListener('click', () => {
    editProfileModal.classList.add('hidden')
})

closePasswordModal.addEventListener('click', () => {
    passwordModal.classList.add('hidden')
})




window.addEventListener("DOMContentLoaded", () => {
    checkForm()
});


function checkForm() {
    if (userFullName.value.trim() == '') {

        saveBtn.disabled = true


    }

    if (userFullName.value.trim() != '')
        saveBtn.disabled = false

}



formElement.addEventListener('submit', (e) => {
    let isValid = true
    const userName = userFullName.value.trim();
    const phoneNum = userPhone.value.trim();
    const address = userAddress.value.trim();

    if (userName === '') {
        showError(fNameErrMsg, "User name can't be empty")
        isValid = false
    }


    if (!isValid) {
        e.preventDefault()

    }


});


passwordForm.addEventListener('submit', (e) => {



    let isValid = true
    const currentPssword = currentPass.value.trim()
    const newPassword = newPAss.value.trim()
    const ConfirmPassword = ConfirmPass.value.trim()

    if (currentPssword == '') {
        showError(currentPassMsg, "current Password can't emapty")
        isValid=false

    }

    
    
    if (newPassword == '') {
        showError(newPassMsg, "New Password can't emapty")
        isValid=false
    }
    if (ConfirmPassword == '') {
              showError(onfirmPassMsg, "New Password can't emapty")
              isValid=false
    }


    // if (!isValid) {
    //     e.preventDefault()
         
    // }
    // else{
    //     passwordModal.classList.remove('hidden')
    passwordChange()

    // }

});


async function passwordChange() {
    try{

        const response = await fetch('/change-password')
    }
    catch (err){ 
  console.log(err);
  
    }


    
}







userFullName.addEventListener('blur', (e) => {

    if (e.target.value.trim() == '') {

        showError(fNameErrMsg, "This field is required")

    }
});



userFullName.addEventListener('input', () => {
    let MIN_USER_NAME_LENGTH = 3
    let MAX_USER_NAME_LENGTH = 50
    const name = userFullName.value.trim();

    checkForm()
    if (name.length < MIN_USER_NAME_LENGTH) {
        showError(fNameErrMsg, "Please enter a valid full name (minimum 2 characters)")
    }


    else if (name.length >= MAX_USER_NAME_LENGTH) {
        showError(fNameErrMsg, "Full name cannot exceed 50 characters.")
    }

    else if (name.length > MIN_USER_NAME_LENGTH && name.length < MAX_USER_NAME_LENGTH) {
        clearError(fNameErrMsg)
    }



});


userPhone.addEventListener('input', () => {

    const phoneNUm = userPhone.value.trim();

    if (phoneNUm.length < 10 || phoneNUm > 10) {
        showError(phoneErrMsg, "Please enter a valid 10-digit phone number.")
    }
    if (!isValidPhone(phoneNUm)) {
        showError(phoneErrMsg, "Phone must start with 6, 7, 8, or 9");
    }

    if (phoneNUm.length == 10) {
        showError(phoneValidMsg, "Valid phone number.");
    }

    if (phoneNUm.length == 10) {
        clearError(phoneErrMsg)
    }

    if (phoneNUm.length !== 10) {
        clearError(phoneValidMsg);
    }


});

userAddress.addEventListener('input', () => {
    const address = userAddress.value.trim();
})

cencelBtn.addEventListener('click', () => {

    userFullName.value.trim();
    userPhone.value.trim();
    userAddress.value.trim();




})