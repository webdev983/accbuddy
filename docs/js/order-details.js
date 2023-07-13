const urlParams=new URLSearchParams(window.location.search),backendUrl="https://api.accbuddy.com/public",email=urlParams.get("email"),orderID="orderID-"+urlParams.get("orderId"),accessToken=getAccessToken();let order=fetchOrderById(),product=order.then(e=>fetchProductById("productID-"+e.orderProductID));const link=generateOrderLink();function formatDate(e){return new Date(1e3*e).toLocaleDateString(void 0,{year:"numeric",month:"long",day:"numeric"})}function getAccessToken(){var e=localStorage.getItem("AuthenticationResult");if(e)return JSON.parse(e).AccessToken}async function fetchOrderById(){var e={getOrder:{orderID:orderID,email:email}},t=new Headers;return accessToken&&t.set("Authorization",accessToken),fetch(backendUrl,{method:"POST",headers:t,body:JSON.stringify(e)}).then(e=>e.json()).then(e=>e.result)}async function generateOrderLink(){var e={generateOrderLink:{orderID:orderID,email:email}},t=new Headers;return accessToken&&t.set("Authorization",accessToken),fetch(backendUrl,{method:"POST",headers:t,body:JSON.stringify(e)}).then(e=>e.json()).then(e=>e.result)}async function fetchProductById(e){console.log(e);e={fetchProductByID:{productID:e}};return fetch(backendUrl,{method:"POST",body:JSON.stringify(e)}).then(e=>e.json()).then(e=>e.result)}document.addEventListener("DOMContentLoaded",async function(){order=await order,product=await product;var e=document.getElementById("productName"),t=document.getElementById("productImage"),r=document.getElementById("productDescription"),e=(e.textContent=product.productName,t.src=product.productImageUrl,r.textContent=product.productDescr,document.querySelector(".ab-quantity-number")),t=document.querySelector(".ab-order-price"),r=document.querySelector(".ab-note-desc"),n=document.getElementById("discount"),n=(document.getElementById("total").textContent="$"+order.totalPaid,n.textContent="-$"+order.orderDiscount,r.textContent=product.productWarning,e.textContent=order.productsOrdered,t.textContent="$"+product.productPrice,document.querySelector(".ab-order-info-desc")),r=n.parentElement.nextElementSibling.querySelector(".ab-order-info-desc"),e=r.parentElement.nextElementSibling.querySelector(".ab-order-info-desc"),t=(n.textContent="№ "+order.PK.replace("orderID-",""),r.textContent=formatDate(order.orderTimestamp),e.textContent=order.orderInternalStatus,document.querySelector(".ab-account-info-list").innerHTML=(await link).text,document.querySelector(".ab-preloader-screen"));t&&t.parentNode.removeChild(t)});