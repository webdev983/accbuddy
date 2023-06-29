const signUpForm = {
    email: "",
    password: "",
    confirmPassword: "",
    checkbox: false,
}

function showError(input, isValid) {
    const formControl = input.parentElement;
    console.log('isValid', isValid)
    const errorSpan = formControl.querySelector('.alart-text');
    if (isValid) {
        errorSpan.style.display = 'none';
        formControl.classList.remove('warning');
    } else {
        formControl.classList.add('warning');
        errorSpan.style.display = 'flex';
    }
}

function checkEmail(email) {
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email)
}

function handleEmailValue(inputElem) {
    let isValid;
    signUpForm['email'] = inputElem.value

    isValid = checkEmail(signUpForm['email'])
    showError(inputElem, isValid)
}

function checkPassword(password) {
    // Regular expression patterns for password validation
    var lengthPattern = /.{8,}/;                        // Minimum 8 characters
    var uppercasePattern = /[A-Z]/;                     // Uppercase letter
    var lowercasePattern = /[a-z]/;                     // Lowercase letter
    var specialCharacterPattern = /[!@#$%^&*()\-_=+{}[\]\\|;:'",.<>/?]/; // Special character
    // Test the password against the patterns
    return (
        lengthPattern.test(password) &&
        uppercasePattern.test(password) &&
        lowercasePattern.test(password) &&
        specialCharacterPattern.test(password)
    );
}

function handlePasswordValue(inputElem, message = "Please enter a valid password.") {
    let isValid;
    signUpForm['password'] = inputElem.value

    isValid = checkPassword(signUpForm['password'])
    showError(inputElem, isValid)
}

function handleConfirmPasswordValue(inputElem) {
    let isValid;
    signUpForm['confirmPassword'] = inputElem.value

    const {password, confirmPassword} = signUpForm
    isValid = password === confirmPassword
    console.log('pass`', password, isValid, confirmPassword)
    showError(inputElem, isValid)
}

function handleCheckbox(inputElem) {
    const formControl = inputElem.parentElement.parentElement;
    const isValid = inputElem.checked

    console.log('isValid', isValid)
    const errorSpan = formControl.querySelector('.alart-text');
    if (isValid) {
        errorSpan.style.display = 'none';
        formControl.classList.remove('warning');
    } else {
        formControl.classList.add('warning');
        errorSpan.style.display = 'flex';
    }
}