const backendUrl = `https://api.accbuddy.com/public`
let cart = getShoppingCart()


let product = fetchProductById(cart.itemID)
let customer
const token = getAccessToken()

let total = 0
function getShoppingCart() {
    let cart = localStorage.getItem('cart')
    if (cart) {
        return JSON.parse(cart)
    }
    return undefined
}
function getAccessToken() {
    let authenticationResult = localStorage.getItem('AuthenticationResult')
    if (authenticationResult) {
        return JSON.parse(authenticationResult).AccessToken
    }
    return undefined
}
async function fetchProductById(productID) {
    const payload = {
        fetchProductByID: {
            productID
        }

    }
    return fetch(backendUrl, {
        method: 'POST',
        body: JSON.stringify(payload)
    })
        .then(response => response.json())
        .then(data => data.result)

}
async function fetchCustomerByAccessToken(accessToken) {
    const payload = {
        fetchCustomer: true

    }
    let headers = new Headers();
    headers.set('Authorization', accessToken);
    return fetch(backendUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
    })
        .then(response => response.json())
        .then(data => data.result)

}

function generateUUID() {
    let d = new Date().getTime();
    let d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16;
        if (d > 0) {
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else {
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}


if (token) {
    customer = fetchCustomerByAccessToken(token)
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function openPopup() {
    product = await product;
    customer = await customer
    let payload = {
        ppCreateOrder: {
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: "USD",
                        value: (total).toString()
                    }
                }
            ]
        },
        shoppingCartData: {
            quantity: cart.quantity.toString(),
            itemID: cart.itemID.replace('productID-', ''),
            discount: customer?.customerDiscount?.toString() || "0",
            customerID: customer?.PK || `guest-${generateUUID()}`
        }
    }
    let headers = new Headers();
    headers.set('Authorization', token);
    const url = await fetch(backendUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
    })
        .then(response => response.json())
        .then(data => data.response)

    const popup = window.open(url, 'newwindow', 'width=600,height=600')
    while (!popup?.closed) {
        console.log('not closed')
        await sleep(1000)
    }
    const paypalId = url.split('?token=')[1]

    console.log(paypalId)
    payload = {
        createShopOrderId: paypalId
    }
    try {
        const response = await fetch(backendUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload)
        })
            .then(response => response.json())
            .then(data => data.response)
        window.location.href = "/payment-receved.html";
    }
    catch (e) {
        window.location.href = "/payment-failed.html";
    }

}

function showButton(selectedId) {
    console.log('clicked')
    //uncheck other inputs
    let checkboxes = document.getElementsByName('checkbox');
    checkboxes.forEach(function (checkbox) {
        if (checkbox.id !== selectedId) {
            checkbox.checked = false;
        }
    });

    const elements = document.getElementsByClassName('ab-order-details-popup-input-group')
    for (let i = 0; i < elements.length; i++) {
        if (selectedId === 'abPayment1') {
            elements[i].className += " select-merchant";
        }
        else{
            elements[i].className = elements[i].className.replace(' select-merchant','')
        }

    }
}
document.addEventListener("DOMContentLoaded", async function () {
    if (!await cart) {
        let marchantDetails = document.querySelector(".ab-order-title.ab-violate-color");
        marchantDetails.innerHTML = "Shopping card is empty";
    }
    // Modify logo
    const { productDescr, productImageUrl, productName, productImageText, productQty, productWarning } = await product



    let logo = document.querySelector('.ab-order-account-icons');

    if (logo) {
        logo.src = productImageUrl;
        logo.alt = productImageText;
    }
    // Modify "Gmail.com PVA"
    let title = document.querySelector('.ab-order-info-title.ab-violate-color');
    if (title) {
        title.innerHTML = productName;
    }

    // Modify the content of the <p> element
    let description = document.querySelector('.ab-order-info-desc');
    if (description) {
        description.innerHTML = productDescr;
    }
    let availableSpan = document.querySelector('.ab-available-quantity span');
    if (availableSpan) {
        availableSpan.innerHTML = productQty;
    }


    let noteDesc = document.querySelector('.ab-note-desc');
    if (noteDesc) {
        noteDesc.innerHTML = productWarning;
    }
    await calculateTotal()


})

async function calculateTotal() {

    let quantitySpan = document.querySelector('.ab-quantity-number');

    const { productPrice } = await product



    // Change price
    let priceSpan = document.querySelector('.ab-order-price');
    if (priceSpan) {
        priceSpan.innerHTML = `$${productPrice}`;
    }
    const discount = (await customer)?.customerDiscount || 0
    // Change your discount
    let discountSpan = document.querySelector('.ab-discount-title + .ab-order-price');
    if (discountSpan) {
        discountSpan.innerHTML = `-$${discount}`;
    }

    total = productPrice * parseInt(quantitySpan.value) * (1 - discount / 100)

    // Change amount due
    let amountDueSpan = document.querySelector('.ab-due-title + .ab-order-price');
    if (amountDueSpan) {
        amountDueSpan.innerHTML = `$${total}`;
    }
}