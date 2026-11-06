const registeredUsers = [
    {
        name: 'Ashu',
        username: 'ashu',
        email: 'ashu@example.com',
        mobile: '9876543210',
        password: 'neetbio123',
    },
]

const SIMULATED_DELAY_MS = 700

function wait() {
    return new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS))
}

function toPublicUser({ name, email }) {
    return { name: name.split(' ')[0], email }
}

export async function login({ identifier, password }) {
    await wait()

    const key = identifier.trim().toLowerCase()
    const user = registeredUsers.find(
        (candidate) => candidate.email === key || candidate.username === key,
    )

    if (!user || user.password !== password) {
        throw new Error('Incorrect email/username or password.')
    }

    return toPublicUser(user)
}

export async function signup({ fullName, email, mobile, password }) {
    await wait()

    const normalizedEmail = email.trim().toLowerCase()
    const emailTaken = registeredUsers.some(
        (user) => user.email === normalizedEmail,
    )

    if (emailTaken) {
        throw new Error('An account with this email already exists.')
    }

    const newUser = {
        name: fullName.trim(),
        username: normalizedEmail.split('@')[0],
        email: normalizedEmail,
        mobile: mobile.trim(),
        password,
    }
    registeredUsers.push(newUser)

    return toPublicUser(newUser)
}

export async function requestPasswordReset() {
    await wait()
}