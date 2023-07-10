class Input {
    static CAN_SUBMIT = {
        email: false,
        password: false,
        confirmPassword: false,
        checkbox: false,
    }

    static HAS_SUBMITTED = false

    constructor({ id = "", doc = document, name = undefined, validation = "" }) {
        this.element = doc.querySelector(`#${id}`)
        this.parent = this.element.parentElement
        this.error = this.parent.querySelector('.alart-text')
        this.validation = validation
        this.name = name

        this.element.addEventListener('focus', () => this.cleanError())
        this.element.addEventListener('blur', () => this.handleInput())
        this.element.addEventListener('input', () => {
            if (Input.HAS_SUBMITTED) {
                this.handleInput()
            }
        })
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
        return this.element.value === this.elem2.value
    }

    handleInput() {
        const isElem2Valid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[a-zA-Z\d@$!%*#?&]{8,}$/.test(this.elem2.value)

        if (this.element.value.length &&  isElem2Valid) {
            super.handleInput()
        } else {
            Input.CAN_SUBMIT.confirmPassword = false
        }
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
    Input.HAS_SUBMITTED = true

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
                        "username": signupForm.email.element.value,
                        "password": signupForm.password.element.value
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
            SIGNUP_FORM.reset()
        }
        console.log('normalized result', result)
        return result
    }

    SUBMIT_BUTTON.disabled = true
    SUBMIT_BUTTON.innerHTML = "sending"

    const result = await asyncSubmit()
    SUBMIT_BUTTON.innerHTML = "send"

    let plankSuccess = document.querySelector('#plank-success-id')
    let plankError = document.querySelector('#plank-error-id')

    if (result.errorMessage !== null) {
        plankError.classList.remove("hidden")
        plankSuccess.classList.add("hidden")

        const plankClose = plankError.querySelector("#plank-close")
        plankClose.addEventListener('click', () => {
            plankError.classList.add("hidden")
        })

        SUBMIT_BUTTON.disabled = true
    } else {
        plankSuccess.classList.remove("hidden")
        plankError.classList.add("hidden")

        const plankClose = plankSuccess.querySelector("#plank-close")
        plankClose.addEventListener('click', () => {
            plankSuccess.classList.add("hidden")
        })

        SUBMIT_BUTTON.disabled = false
    }


}