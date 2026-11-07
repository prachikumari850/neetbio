import { apiClient } from '@/services/apiClient'

export function toUser(apiUser) {
    return {
        name: apiUser.name.split(' ')[0],
        fullName: apiUser.name,
        email: apiUser.email,
        mobile: apiUser.mobile,
        joinedAt: apiUser.created_at,
    }
}

export async function getCurrentUser() {
    const { data } = await apiClient.get('/users/me')
    return toUser(data)
}

export async function updateProfile({ name, email, mobile }) {
    const { data } = await apiClient.patch('/users/me', { name, email, mobile })
    return toUser(data)
}