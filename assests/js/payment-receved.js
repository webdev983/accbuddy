document.addEventListener("DOMContentLoaded", async function () {
    // Get the query parameters from the URL
    let urlParams = new URLSearchParams(window.location.search);

    // Retrieve the email and order ID from the query parameters
    let email = urlParams.get('email');
    let orderId = urlParams.get('orderId');

    // Update the email and order ID in the HTML content
    let emailLink = document.getElementById('emailLink');
    let orderIdElement = document.getElementById('orderId');

    emailLink.textContent = email;
    emailLink.href = 'mailto:' + email;
    orderIdElement.textContent = orderId;
})