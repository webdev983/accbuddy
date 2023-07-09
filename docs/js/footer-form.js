const FOOTER_FORM=document.querySelector("#footer-form"),validInputs={name:!1,email:!1,text:!1,checkbox:!1};var IS_SUBMIT=!1;const SUBMIT_BUTTON=FOOTER_FORM.querySelector("#submit");function isSubmit(){let e=!0;for(var t in validInputs)if(!1===validInputs[t]){e=!1;break}IS_SUBMIT=e}function setPropertyValid(e,t){validInputs[e]=t,isSubmit(),!0===t&&IS_SUBMIT&&(SUBMIT_BUTTON.disabled=!1)}function cleanInput(e){e=e.target.parentNode;e&&e.classList.remove("warning")}function toggleWarningClass(e,t){e?t.classList.remove("warning"):t.classList.add("warning")}function isValidName(){var e=FOOTER_FORM.querySelector("#name"),t=0<e.value.trim().length,e=e.parentNode;!t&&e?(e.classList.add("warning"),setPropertyValid("name",!1)):setPropertyValid("name",!0)}function isValidEmail(){var e=FOOTER_FORM.querySelector("#email"),t=e.value,t=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t),e=e.parentNode;!t&&e?(e.classList.add("warning"),setPropertyValid("email",!1)):setPropertyValid("email",!0)}function isValidText(){var e=FOOTER_FORM.querySelector("#text"),t=e.value.trim().length,e=e.parentNode;!(10<=t&&t<=1e3)&&e?(e.classList.add("warning"),setPropertyValid("text",!1)):setPropertyValid("text",!0)}function cleanCheckbox(){var e=FOOTER_FORM.querySelector("#checkbox-text"),t=FOOTER_FORM.querySelector(".ab-check-requred");t&&(t.classList.remove("warning"),e.innerText="I have read and agree to the Privacy Policy and Terms of Service")}function isValidCheckbox(){var e=FOOTER_FORM.querySelector(".ab-check-requred"),t=FOOTER_FORM.querySelector("#checkedRequered");setPropertyValid("checkbox",t.checked),!t.checked&&e?(e.classList.add("warning"),FOOTER_FORM.querySelector("#checkbox-text").innerText="In order to submit your message, you need to accept our privacy policy and terms of conditions"):(cleanCheckbox(),isSubmit())}function ch(e){console.log("e",e.target.value)}function listenForChanges(){var[e,t,r]=[FOOTER_FORM.querySelector("#name"),FOOTER_FORM.querySelector("#email"),FOOTER_FORM.querySelector("#text")];e.addEventListener("input",e=>{isValidName(),validInputs.name&&cleanInput(e)}),t.addEventListener("input",e=>{isValidEmail(),validInputs.email&&cleanInput(e)}),r.addEventListener("input",e=>{isValidText(),validInputs.text&&cleanInput(e)})}async function onSubmit(a){const[o,n,i]=getElemValuesByIds(["name","email","text"]),e=FOOTER_FORM.querySelector("#submit");e.innerHTML="sending",SUBMIT_BUTTON.disabled=!0;var t=await(async()=>{var e={message:"",errorMessage:null,status:null},t=await fetch("https://api.accbuddy.com/public",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sendMessage:{token:a,name:o,email:n,message:i}})}),r=await t.json();if(t.ok||400!=t.status){if(t.ok){const a=r.result;e.message=a}}else{const a=r.error;e.status=t.status,e.errorMessage=a}return e})();e.innerHTML="send",null!==t.errorMessage?handleFormFooterError(t.errorMessage):handleFormFooterResponse(t.message),SUBMIT_BUTTON.disabled=!1}function closeErrorPlank(){document.querySelector("#footer-error-plank").classList.add("hidden"),grecaptcha.reset()}function handleFormFooterError(e){var t=document.querySelector("#footer-error-plank"),r=t.querySelector(".plank");t.classList.remove("hidden"),r.innerHTML=e}function handleFormFooterResponse(e){document.querySelector("#footer-error-plank").classList.add("hidden");var t=FOOTER_FORM.querySelector(".ab-form-input-box"),r=document.createElement("div");r.className="ui-response",r.style="height: 141px; min-width: 100% !important; padding: 35px 44.91px;padding-top: 10.15px;padding-right: 10.1px; border: 1px solid var(--ab_violet)",r.innerHTML="<img onclick='handleCloseFormFooter()' style='display: block;margin-left: auto;' class='' src='./assests/image/footer-close.svg' alt='close_icon'><span style='font-family: var(--ab_primary-font);font-style:normal;font-weight: 800;font-size: 16px;line-height:20px;letter-spacing:-0.5px;color: var(--ab_violet);'><object data='./assests/image/checkmark.svg'></object> Thank you</span ><p class='p' style='margin-top: 18.58px; color: var(--ab_violet)'>"+e+"</p>",t.insertBefore(r,t.firstChild),t.classList.add("ab-form-input-box-success"),FOOTER_FORM.querySelector("#name").parentNode.style.display="none",FOOTER_FORM.querySelector("#email").parentNode.style.display="none",FOOTER_FORM.querySelector("#text").parentNode.style.display="none",FOOTER_FORM.querySelector("#label-checkbox").parentNode.style.visibility="hidden",FOOTER_FORM.querySelector("#submit").parentNode.style.visibility="hidden",FOOTER_FORM.querySelector("#checkedRequered").checked=!1}function handleCloseFormFooter(){var e=FOOTER_FORM.querySelector(".ab-form-input-box"),t=FOOTER_FORM.querySelector(".ui-response");e.classList.remove("ab-form-input-box-success"),e.removeChild(t),FOOTER_FORM.querySelector("#name").parentNode.style.display="block",FOOTER_FORM.querySelector("#name").value="",FOOTER_FORM.querySelector("#email").parentNode.style.display="block",FOOTER_FORM.querySelector("#email").value="",FOOTER_FORM.querySelector("#text").parentNode.style.display="block",FOOTER_FORM.querySelector("#text").value="",FOOTER_FORM.querySelector("#label-checkbox").parentNode.style.visibility="visible",FOOTER_FORM.querySelector("#submit").parentNode.style.visibility="visible",FOOTER_FORM.querySelector("#checkedRequered").checked=!1,grecaptcha.reset()}function handleErrorForm(){isValidName(),isValidEmail(),isValidText(),isValidCheckbox()}function validate(e){e.preventDefault(),isSubmit(),IS_SUBMIT?grecaptcha.execute():(listenForChanges(),handleErrorForm(),SUBMIT_BUTTON.disabled=!0)}function onload(){document.getElementById("submit").onclick=validate}