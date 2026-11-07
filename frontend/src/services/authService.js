import { apiClient } from '@/services/apiClient'
import { toUser } from '@/services/userService'
import { useAuthStore } from '@/store/useAuthStore'

const SIMULATED_DELAY_MS = 700

function startSession({ access_token: token, user }) {
    useAuthStore.getState().setToken(token)
    return toUser(user)
}

export async function login({ identifier, password }) {
    const { data } = await apiClient.post('/auth/login', {
        identifier: identifier.trim(),
        password,
    })
    return startSession(data)
}

export async function signup({ fullName, email, mobile, password }) {
    const { data } = await apiClient.post('/auth/signup', {
        full_name: fullName,
        email: email.trim(),
        mobile: mobile.trim(),
        password,
    })
    return startSession(data)
}

export async function logout() {
    try {
        await apiClient.post('/auth/logout')
    } finally {
        useAuthStore.getState().clearSession()
    }
}

// Password reset needs an email service, so it stays simulated for now.
export async function requestPasswordReset() {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS))
}