const backendUrl = `https://api.accbuddy.com/public`
let productCatalogUpdateTimestamp = 0
let productsQty = []
await loadCatalogData()
async function loadCatalogData() {
    loadFromLocalStorage();
    await fetchProductsPriceQty()
    insertDataToPage();
    updateLocalStorage();
}

function loadFromLocalStorage() {
    console.log('loading from local storage')
    let expiry = loadItemFromLocalStorage('productsQtyExpiry')
    if(!expiry){
        expiry = (new Date()).getTime() /1000 + 60*60*24*30
        localStorage.setItem('productsQtyExpiry', JSON.stringify(expiry))
        
    }
    else if((new Date()).getTime() /1000 < expiry){
        productsQty = loadItemFromLocalStorage('productsQty') || []
        productCatalogUpdateTimestamp = loadItemFromLocalStorage('productCatalogUpdateTimestamp') || 0
    }
};
function loadItemFromLocalStorage(item) {
    let storageItem = localStorage.getItem(item);
    if (storageItem) {
        return JSON.parse(storageItem)
    }
    return undefined
};


async function fetchProductsPriceQty() {
    console.log('fetching from backend')
    const payload = {
        fetchProductsPriceQty: {
            timestamp: productCatalogUpdateTimestamp
        }

    }
    return fetch(backendUrl, {
        method: 'POST',
        body: JSON.stringify(payload)
    })
        .then(response => response.json())
        .then(data => data.result)
        .then(responseProducts => {

            productsQty = [ ...responseProducts,...productsQty]
            const uniqueIds = [];
            productsQty = productsQty.filter(element => {
                const isDuplicate = uniqueIds.includes(element.PK);
              
                if (!isDuplicate) {
                  uniqueIds.push(element.PK);
              
                  return true;
                }
              
                return false;
              });

        })
}
function updateLocalStorage() {
    console.log('updating local storage')
    const timestamps = productsQty.map(product => product.productCatalogUpdateTimestamp)
    const timestamp = Math.max(...timestamps)
    localStorage.setItem('productsQty', JSON.stringify(productsQty))
    localStorage.setItem('productCatalogUpdateTimestamp', JSON.stringify(timestamp))
}
function insertDataToPage (){}