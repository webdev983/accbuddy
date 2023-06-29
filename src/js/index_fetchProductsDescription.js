  // JavaScript code goes here
  document.addEventListener('DOMContentLoaded', function() {
    // Page is fully loaded
    let products = [];
    let timestamp = 0
    const backendUrl = https://api.accbuddy.com/public
    let data = localStorage.getItem('products');
    if(data){
        data = JSON.parse(data);
        timestamp = data.timestamp;
        products = data.products
    }
    const payload = {
        fetchProductsDescription:{
            timestamp
        }
    
    }
    const response = fetch(backendUrl, {
        method: 'POST',
        body: JSON.stringify(payload)
    })
        .then(response => response.json())
        .then(data=> data.result)
        .then(responseProducts=>{
            console.log(JSON.stringify(responseProducts))
            products = [...products,...responseProducts]
            console.log(JSON.stringify(products))
            timestamp = (new Date()).getTime()/1000
            console.log(timestamp)
            localStorage.setItem('products',JSON.stringify({timestamp,products}))
        })
    // Add event listener for mousemove
    document.addEventListener('mousemove', function() {
        // Mouse moved, do something
        console.log('Mouse moved');
        // Call your desired function or perform any actions you want
    });
    });
  