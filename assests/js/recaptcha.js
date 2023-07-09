const getElemValuesByIds = (ids) => {
    return Array.from(ids).map(id => {
        const elem = document.getElementById(id)
        return elem.value
    })
}

function loadScriptOnce() {
    let isGrecaptachaLoaded = false

    // closure is utilized to implement boolean variable for loading once condition
    function loadScript() {
        // every focus of inputs will go check if it is loaded
        // because of closure, isGrecaptachaLoaded will be always tracked by loadscript function
        if (!isGrecaptachaLoaded) {
            const script = document.createElement('script');
            script.src = "https://www.google.com/recaptcha/api.js";
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
            isGrecaptachaLoaded = true;
        }
    }

    const form = document.querySelector('#footer-form');
    const inputs = [form.querySelector('#name'), form.querySelector('#email'), form.querySelector('#text'), form.querySelector('#checkedRequered')]

    inputs.forEach(function (input) {
        input.addEventListener('focus', loadScript);
    });
}
