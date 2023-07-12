
function saveCart(PK) {
    const cart = { itemID: PK, quantity: "1" }
    localStorage.setItem('cart', JSON.stringify(cart))
    window.location.href = "./shopping-cart.html";
}

