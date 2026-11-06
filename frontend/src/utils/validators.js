const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const MOBILE_PATTERN = /^[6-9]\d{9}$/
const PASSWORD_MIN_LENGTH = 8
const USERNAME_MIN_LENGTH = 3

export function getEmailError(value) {
    const email = value.trim()

    if (!email) {
        return 'Email address is required.'
    }

    if (!EMAIL_PATTERN.test(email)) {
        return 'Enter a valid email address.'
    }

    return ''
}

export function getMobileError(value) {
    return MOBILE_PATTERN.test(value.trim())
        ? ''
        : 'Enter a valid 10-digit mobile number.'
}

export function validateLogin({ identifier, password }) {
    const errors = {}
    const trimmedIdentifier = identifier.trim()

    if (!trimmedIdentifier) {
        errors.identifier = 'Email or username is required.'
    } else if (trimmedIdentifier.includes('@')) {
        const emailError = getEmailError(trimmedIdentifier)
        if (emailError) {
            errors.identifier = emailError
        }
    } else if (trimmedIdentifier.length < USERNAME_MIN_LENGTH) {
        errors.identifier = `Username must be at least ${USERNAME_MIN_LENGTH} characters.`
    }

    if (!password) {
        errors.password = 'Password is required.'
    }

    return errors
}

export function validateSignup({
    fullName,
    email,
    mobile,
    password,
    confirmPassword,
}) {
    const errors = {}

    if (fullName.trim().length < 2) {
        errors.fullName = 'Enter your full name.'
    }

    const emailError = getEmailError(email)
    if (emailError) {
        errors.email = emailError
    }

    const mobileError = getMobileError(mobile)
    if (mobileError) {
        errors.mobile = mobileError
    }

    if (password.length < PASSWORD_MIN_LENGTH) {
        errors.password = `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`
    } else if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
        errors.password = 'Use at least one letter and one number.'
    }

    if (!confirmPassword) {
        errors.confirmPassword = 'Confirm your password.'
    } else if (confirmPassword !== password) {
        errors.confirmPassword = 'Passwords do not match.'
    }

    return errors
}