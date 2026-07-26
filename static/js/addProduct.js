const formElement = document.querySelector('form');
const addProductBtn = document.querySelector('.pbtn');

const product_code = document.querySelector('#product_code');
const product_name = document.querySelector('#product_name');
const price = document.querySelector('#price');
const stock = document.querySelector('#stock');

const pCodeErrorMsg = document.querySelector('.code-err-msg')
const pNameErrorMsg = document.querySelector('.name-err-msg')
const pPriceErrorMsg = document.querySelector('.price-err-msg')
const pStockErrorMsg = document.querySelector('.stock-err-msg')


export function showError(element, message) {
    element.textContent = message;
}


export function clearError(element) {
    element.textContent = "";
}

window.addEventListener("DOMContentLoaded", () => {
    checkForm();
});

formElement.addEventListener('submit', (e) => {

    let isValid = true;
    const productCode = product_code.value.trim();
    const productName = product_name.value.trim();
    const productPrice = price.value.trim();
    const productStock = stock.value.trim();

    if (productCode === '') {
        showError(pCodeErrorMsg, "Product code can't be empty")
        isValid = false
    }

    if (productName === '') {
        showError(pNameErrorMsg, "Procut name can't be empty")
        isValid = false
    }

    if (productPrice === '') {
        showError(pPriceErrorMsg, "Procut price can't be empty")
    }

    if (productStock === '') {
        showError(pStockErrorMsg, "Procut stock can't be empty")
    }
    if (!isValid) {
        e.preventDefault()
        return
    }

    addProductBtn.disabled = true

});

product_code.addEventListener('blur', (e) => {
    if (e.target.value == '') {

        showError(pCodeErrorMsg, "This field is required")

    }

});


product_name.addEventListener("blur", (e) => {
    if (e.target.value == '') {

        showError(pNameErrorMsg, "This field is required")
    }
})

price.addEventListener('blur', (e) => {
    if (e.target.value == '') {

        showError(pPriceErrorMsg, "This field is required")
    }
});

stock.addEventListener('blur', (e) => {
    if (e.target.value == '') {

        showError(pStockErrorMsg, "This field is required")
    }
});


product_code.addEventListener('input', () => {

    clearError(pCodeErrorMsg)
    checkForm()
});


product_name.addEventListener("input", () => {
    clearError(pNameErrorMsg)
     checkForm()
});

price.addEventListener('input', () => {
    clearError(pPriceErrorMsg)
     checkForm()
});

stock.addEventListener('input', () => {
    clearError(pStockErrorMsg)
     checkForm()
});





function checkForm() {
    if (product_code.value.trim() == '' || product_name.value.trim() == '' || (price.value.trim() <= 0 || price.value.trim() == '') || (stock.value.trim() <= 0 || stock.value.trim() == '')) {

        addProductBtn.disabled = true


    }

    if (product_code.value.trim() != '' && product_name.value.trim() != '' && (price.value.trim() != '' && price.value.trim() >= 0) && (stock.value.trim() != '' && stock.value.trim() >= 0))
        addProductBtn.disabled = false

}
