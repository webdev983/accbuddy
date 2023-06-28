class Input {
    static CAN_SUBMIT = {
        email: false,
        password: false,
        confirmPassword: false,
        checkbox: false,
    }

    constructor({ id = "", doc = document, name = undefined, validation = "" }) {
        this.element = doc.querySelector(`#${id}`)
        this.parent = this.element.parentElement
        this.error = this.parent.querySelector('.alart-text')
        this.validation = validation
        this.name = name

        this.element.addEventListener('focus', () => this.cleanError())
        this.element.addEventListener('input', () => this.handleInput())
        this.element.addEventListener('click', () => this.handleInput())
        this.element.addEventListener('blur', () => this.handleInput())
    }

    get isValid() {
        return this.validation.test(this.element.value)
    }

    set validInput(boolVal) {
        const name = this.name
        if (name) {
            Input.CAN_SUBMIT[name] = boolVal
        }
    }

    static get ALL_VALID() {
        let val = true
        for (let prop in Input.CAN_SUBMIT) {
            if (Input.CAN_SUBMIT[prop] === false) {
                val = false
                break
            }
        }
        return val
    }

    handleInput() {
        this.validInput = this.isValid
        // console.log('Input.ALL_VALID', Input.CAN_SUBMIT)
        if (Input.ALL_VALID) {
            SUBMIT_BUTTON.disabled = false
        } else {
            SUBMIT_BUTTON.disabled = true
        }

        if (false === this.isValid) {
            if (this.element.id === "signup-password") {
                const span = this.error.querySelector('span')
                let text = "Please enter a valid password."
                if (this.element.value.length > 0) {
                    text = "Password must be at least 8 characters in length and contain uppercase, lowercase letters, and special characters."
                }
                if (span) {
                    span.innerText = text
                }
            }

            this.parent.classList.add('warning')
            this.error.style.display = 'flex'
            this.validInput
        } else {
            this.validInput = true
            this.cleanError()
        }
    }

    cleanError() {
        this.parent.classList.remove('warning')
        this.error.style.display = 'none'
    }
}

class ConfirmInput extends Input {
    constructor({ id = "", doc = document, name = undefined, elemId = "signup-password" }) {
        super({ id, name })
        this.elem2 = doc.querySelector(`#${elemId}`)
        this.element.addEventListener('focus', () => this.cleanError())
    }

    get isValid() {
        return this.element.value.length > 0 && this.element.value === this.elem2.value
    }
}

class CheckboxInput extends Input {
    constructor({ id = "", name = undefined, }) {
        super({ id, name })
        this.parent = this.parent.parentElement
        this.error = this.parent.querySelector('.alart-text')
        this.element.addEventListener('input', () => {
            this.handleInput()
        })
    }

    get isValid() {
        return this.element.checked
    }
}

const signupForm = {
    email: new Input({ id: 'signup-email', name: 'email', validation: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }),
    password: new Input({ id: 'signup-password', name: 'password', validation: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[a-zA-Z\d@$!%*#?&]{8,}$/ }),
    confirmPassword: new ConfirmInput({ id: 'signup-confirm-password', name: 'confirmPassword', elemId: 'signup-password' }),
    checkbox: new CheckboxInput({ id: 'checkedRequered4', name: 'checkbox', }),
}

const SIGNUP_FORM = document.querySelector('#signup-form')
const SUBMIT_BUTTON = SIGNUP_FORM.querySelector('#signup-submit')
SUBMIT_BUTTON.onclick = handleSubmit

function toggleSubmitBtnDisable(submitBtn, boolVal) {
    if (boolVal === true && validateAll(signupForm)) {
        submitBtn.disabled = boolVal
    } else {
        submitBtn.disabled = false
    }
}

async function handleSubmit(e) {
    e.preventDefault()

    if (!Input.CAN_SUBMIT) {
        return
    }

    const asyncSubmit = async () => {
        const result = { message: "", errorMessage: null, status: null }

        const res = await fetch("https://api.accbuddy.com/public", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "signup": {
                    "token": "",
                    "user": {
                        "username": "test2wd@mailinator.com",
                        "password": "Portal1!"
                    }
                }
            })
        })
        const json = await res.json()
        if (!res.ok && res.status == 400) {
            console.log('json response', json)
            const ERROR = json.error
            result.status = res.status
            result.errorMessage = ERROR
        } else if (res.ok) {
            const MESSAGE = json.result
            result.message = MESSAGE
        }
        console.log('normalized result', result)
        return result
    }

    SUBMIT_BUTTON.disabled = true
    SUBMIT_BUTTON.innerHTML = "sending"

    const result = await asyncSubmit()
    SUBMIT_BUTTON.innerHTML = "send"

    const plank = document.querySelector("#plank-id")
    const plankMessageElem = plank.querySelector(".plank")
    const plankClose = plank.querySelector("#plank-close")
    plankClose.addEventListener('click', () => {
        plank.classList.add("hidden")
    })

    if (result.errorMessage !== null) {
        plank.classList.remove("hidden")
        plank.classList.remove("plank-green")
        plankMessageElem.innerHTML = result.errorMessage
        SUBMIT_BUTTON.disabled = true

    } else {
        plank.classList.remove("hidden")
        plank.classList.add("plank-green")
        plankMessageElem.innerHTML = result.message
        SUBMIT_BUTTON.disabled = false
    }
}