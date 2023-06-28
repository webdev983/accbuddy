class Input {
    constructor({ id = "", doc = document, validation = "" }) {
        this.element = doc.querySelector(`#${id}`)
        this.parent = this.element.parentElement
        this.error = this.parent.querySelector('.alart-text')
        this.validation = validation

        this.element.addEventListener('focus', () => this.cleanError())
        this.element.addEventListener('blur', () => this.handleInput())
    }

    get isValid() {
        return this.validation.test(this.element.value)
    }

    handleInput() {
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
        } else {
            this.cleanError()
        }
    }


    cleanError() {
        this.parent.classList.remove('warning')
        this.error.style.display = 'none'
    }
}

class ConfirmInput extends Input {
    constructor({ id = "", doc = document, elemId = "signup-password" }) {
        super({ id })
        this.elem2 = doc.querySelector(`#${elemId}`)
        this.element.addEventListener('focus', () => this.cleanError())
    }

    get isValid() {
        return this.element.value === this.elem2.value
    }
}

class CheckboxInput extends Input {
    constructor({ id = "", }) {
        super({ id })
        this.parent = this.parent.parentElement
        this.error = this.parent.querySelector('.alart-text')
        this.element.addEventListener('input', () => {
            if (this.isValid) {
                this.cleanError()
            } else {
                this.handleInput()
            }
        })
        this.element.addEventListener('blur', () => this.handleInput())
    }

    get isValid() {
        return this.element.checked
    }
}

const signupForm = {
    email: new Input({ id: 'signup-email', validation: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }),
    password: new Input({ id: 'signup-password', validation: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[a-zA-Z\d@$!%*#?&]{8,}$/ }),
    confirmPassword: new ConfirmInput({ id: 'signup-confirm-password', elemId: 'signup-password' }),
    checkbox: new CheckboxInput({ id: 'checkedRequered4' })
}

function handleSubmit() {

}