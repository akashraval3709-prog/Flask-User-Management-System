
export function showError(element, message) {
    element.textContent = message;
}


export function clearError(element) {
    element.textContent = "";
}


 export function isValidPhone(phone) {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone.trim());
}

