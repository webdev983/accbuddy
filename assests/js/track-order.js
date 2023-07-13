const backendUrl = `https://api.accbuddy.com/public`
async function findOrder() {
    const emailInput = document.getElementById('email');
    const orderNumberInput = document.getElementById('order-number');
    const internetErrorElement = document.getElementById('internet-error')
    //reset errors
    emailInput.nextElementSibling.style.display = 'none'
    orderNumberInput.nextElementSibling.style.display = 'none'
    internetErrorElement.style.display = 'none';

    const email = emailInput.value;
    const orderId = orderNumberInput.value.padStart(8, '0');
    const orderID = `orderID-${orderId}`;
    // Validate email
    if (!validateEmail(email)) {
        emailInput.nextElementSibling.style.display = 'block';
        return;
    }
    try {

        await fetchOrderById(orderID, email)
        window.location.href = `./order-details.html?email=${email}&orderId=${orderId}`;
    }
    catch (e) {
        
        if(e.message = "400" ){
            orderNumberInput.nextElementSibling.style.display = 'block'
            return 
        }
        internetErrorElement.style.display = 'block';
        
        
    }
}
async function fetchOrderById(orderID, email) {
    const payload = {
        getOrder: {
            orderID,
            email
        }

    }

    return fetch(backendUrl, {
        method: 'POST',
        body: JSON.stringify(payload)
    })
        .then(response => {
            if(!response.ok){
                throw new Error(response.status)
            }
            return response.json()})
        .then(data => data.result)

}
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}