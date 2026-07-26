import { showError, clearError } from "./errorMsg.js";

const formElemetEdit = document.querySelector('#product-edit')
const formElemetDelete = document.querySelector('#product-delete')

const editButtons = document.querySelectorAll('.edit-button');
const deleteButtons = document.querySelectorAll('.delete-button');
const editModal = document.querySelector('#editModal');
const deleteModal = document.querySelector('#deleteModal');




const tbody = document.querySelector('tbody')

let edit;
let Delete;

const cancelButton = document.querySelector('.cbtn')
const cancelDeleteBtn = document.querySelector('#cancelDeleteBtn')
const closeModalDelete = document.querySelector('#closeDeleteModal')
const updateButton = document.querySelector('.ubtn')
const closeEditModal = document.querySelector('#closeModal')
const deleteButton = document.querySelector('.dbtn')


const pcode = document.querySelector('#product-code');
const name = document.querySelector('#product-name');
const price = document.querySelector('#product-price');
const stock = document.querySelector('#product-stok');

const pCodeErrorMsg = document.querySelector('.ecode-err-msg')
const pNameErrorMsg = document.querySelector('.ename-err-msg')
const pPriceErrorMsg = document.querySelector('.eprice-err-msg')
const pStockErrorMsg = document.querySelector('.estock-err-msg')

// console.log(pCodeErrorMsg);
// console.log(pNameErrorMsg);
// console.log(pPriceErrorMsg);
// console.log(pStockErrorMsg);


window.addEventListener("DOMContentLoaded", () => {
    checkForm();
});

editButtons.forEach((editBtn) => {

    editBtn.addEventListener('click', (e) => {

        edit = editBtn

        editModal.classList.remove("hidden");

        e.preventDefault()

    });
});

deleteButtons.forEach((Delebtn) => {
    Delebtn.addEventListener('click', (e) => {
        Delete = Delebtn
        deleteModal.classList.remove('del-hidden')
        e.preventDefault()
    });


});

cancelButton.addEventListener('click', (e) => {
    editModal.classList.add('hidden')
    clearError(pNameErrorMsg)
    clearError(pCodeErrorMsg)
    clearError(pPriceErrorMsg)
    clearError(pStockErrorMsg)

});

cancelDeleteBtn.addEventListener('click' , ()=>{
     deleteModal.classList.add('del-hidden')
});

closeModalDelete.addEventListener('click',()=>{
    deleteModal.classList.add('del-hidden')
});


closeModalDelete.addEventListener('click' ,()=>{
    deleteModal.classList.add('del-hidden')
});


closeEditModal.addEventListener('click', () => {
    editModal.classList.add('hidden')
    clearError(pNameErrorMsg)
    clearError(pCodeErrorMsg)
    clearError(pPriceErrorMsg)
    clearError(pStockErrorMsg)

});




tbody.addEventListener('click', (e) => {
    if (e.target == edit) {
        const tr = edit.closest('tr');
        const td = tr.children;
        let id = td[0].innerText.trim()
        let code = td[1].innerText.trim();

        let productName = td[2].innerText.trim();

        let rawPrice = td[3].innerText.trim();
        let Price = rawPrice.replace('$', '');

        let rawStock = td[4].innerText.trim();
        let Stock = rawStock.replace(/[^0-9]/g, '');

        formElemetEdit.action = `/edit-product/${id}`
        pcode.value = code
        name.value = productName
        price.value = Price
        stock.value = Stock

      
    }


      if (e.target == Delete) {
            const tr = Delete.closest('tr');
            const td = tr.children;
            let id = td[0].innerText.trim()
            formElemetDelete.action=`/delete-product/${id}`

           
            
         
        }
});


// formElemetDelete.addEventListener('submit', (e)=>{

//     formElemetDelete.action=``

// });

formElemetEdit.addEventListener('submit', (e) => {

    let isValid = true
    if (pcode.value.trim() == '') {
        showError(pCodeErrorMsg, "Product code can't be empty")
        isValid = false

    }
    if (name.value.trim() == '') {
        showError(pNameErrorMsg, "Procut name can't be empty")
        isValid = false
    }

    if (price.value.trim() == '') {
        showError(pPriceErrorMsg, "Procut price can't be empty")
        isValid = false

    }

    if (stock.value.trim() == '') {

        showError(pStockErrorMsg, "Procut stock can't be empty")
        isValid = false
    }
    if (!isValid) {
        e.preventDefault()
        return
    }

})

pcode.addEventListener('blur', (e) => {

    if (e.target.value == '') {

        showError(pCodeErrorMsg, "This field is required")

    }

})

name.addEventListener('blur', (e) => {

    if (e.target.value == '') {

        showError(pNameErrorMsg, "This field is required")

    }

})

price.addEventListener('blur', (e) => {

    if (e.target.value == '') {

        showError(pPriceErrorMsg, "This field is required")

    }

})

stock.addEventListener('blur', (e) => {

    if (e.target.value == '') {

        showError(pStockErrorMsg, "This field is required")

    }

})

function checkForm() {
    if (pcode.value.trim() == '' || name.value.trim() == '' || (price.value.trim() <= 0 || price.value.trim() == '') || (stock.value.trim() <= 0 || stock.value.trim() == '')) {

        updateButton.disabled = true


    }

    if (pcode.value.trim() != '' && name.value.trim() != '' && (price.value.trim() != '' && price.value.trim() >= 0) && (stock.value.trim() != '' && stock.value.trim() >= 0))
        updateButton.disabled = false

}


pcode.addEventListener('input', () => {

    checkForm()
    clearError(pCodeErrorMsg)
})

name.addEventListener('input', () => {

    checkForm()
    clearError(pNameErrorMsg)
});

price.addEventListener('input', () => {

    checkForm()
    clearError(pPriceErrorMsg)

})

stock.addEventListener('input', () => {

    checkForm()

    clearError(pStockErrorMsg)
})







