const backendUrl="https://api.accbuddy.com/public";let customer,cart=getShoppingCart(),product=fetchProductById(cart.itemID);const token=getAccessToken();let total=0;function getShoppingCart(){var e=localStorage.getItem("cart");if(e)return JSON.parse(e)}function getAccessToken(){var e=localStorage.getItem("AuthenticationResult");if(e)return JSON.parse(e).AccessToken}async function fetchProductById(e){e={fetchProductByID:{productID:e}};return fetch(backendUrl,{method:"POST",body:JSON.stringify(e)}).then(e=>e.json()).then(e=>e.result)}async function fetchCustomerByAccessToken(e){var t=new Headers;return t.set("Authorization",e),fetch(backendUrl,{method:"POST",headers:t,body:JSON.stringify({fetchCustomer:!0})}).then(e=>e.json()).then(e=>e.result)}function generateUUID(){let o=(new Date).getTime(),r="undefined"!=typeof performance&&performance.now&&1e3*performance.now()||0;return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(e){let t=16*Math.random();return 0<o?(t=(o+t)%16|0,o=Math.floor(o/16)):(t=(r+t)%16|0,r=Math.floor(r/16)),("x"===e?t:3&t|8).toString(16)})}function sleep(t){return new Promise(e=>setTimeout(e,t))}async function openPopup(){product=await product,customer=await customer;for(var e={ppCreateOrder:{intent:"CAPTURE",purchase_units:[{amount:{currency_code:"USD",value:total.toString()}}]},shoppingCartData:{quantity:cart.quantity.toString(),itemID:cart.itemID.replace("productID-",""),discount:customer?.customerDiscount?.toString()||"0",customerID:customer?.PK||"guest-"+generateUUID()}},t=new Headers,o=(t.set("Authorization",token),await fetch(backendUrl,{method:"POST",headers:t,body:JSON.stringify(e)}).then(e=>e.json()).then(e=>e.response)),r=window.open(o,"newwindow","width=600,height=600");!r?.closed;)console.log("not closed"),await sleep(1e3);o=o.split("?token=")[1];console.log(o),e={createShopOrderId:o};try{await fetch(backendUrl,{method:"POST",headers:t,body:JSON.stringify(e)}).then(e=>e.json()).then(e=>e.response),window.location.href="/payment-receved.html"}catch(e){window.location.href="/payment-failed.html"}}function showPaypalButton(){console.log("clicked");var t=document.getElementsByClassName("ab-order-details-popup-input-group");for(let e=0;e<t.length;e++)t[e].className+=" select-merchant"}async function calculateTotal(){var e=document.querySelector(".ab-quantity-number"),t=(await product)["productPrice"],o=document.querySelector(".ab-order-price"),o=(o&&(o.innerHTML="$"+t),(await customer)?.customerDiscount||0),r=document.querySelector(".ab-discount-title + .ab-order-price"),r=(r&&(r.innerHTML="-$"+o),total=t*parseInt(e.value)*(1-o/100),document.querySelector(".ab-due-title + .ab-order-price"));r&&(r.innerHTML="$"+total)}token&&(customer=fetchCustomerByAccessToken(token)),document.addEventListener("DOMContentLoaded",async function(){await cart||(document.querySelector(".ab-order-title.ab-violate-color").innerHTML="Shopping card is empty");var{productDescr:e,productImageUrl:t,productName:o,productImageText:r,productQty:n}=await product,c=document.querySelector(".ab-order-account-icons"),t=(c&&(c.src=t,c.alt=r),document.querySelector(".ab-order-info-title.ab-violate-color")),c=(t&&(t.innerHTML=o),document.querySelector(".ab-order-info-desc")),r=(c&&(c.innerHTML=e),document.querySelector(".ab-available-quantity span"));r&&(r.innerHTML=n),await calculateTotal()});