import axios from 'axios'
import { useAuthStore } from '@/store/useAuthStore'

const DEFAULT_API_URL = 'http://localhost:8000/api/v1'
const REQUEST_TIMEOUT_MS = 10000

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_URL,
    timeout: REQUEST_TIMEOUT_MS,
})

apiClient.interceptors.request.use((config) => {
    const { token } = useAuthStore.getState()

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status

        if (status === 401 && useAuthStore.getState().token) {
            useAuthStore.getState().clearSession()
        }

        const apiError = error.response?.data?.error
        const fallbackMessage = error.response
            ? 'Something went wrong. Please try again.'
            : 'Cannot reach the server. Make sure the backend is running.'

        return Promise.reject(
            Object.assign(new Error(apiError?.message ?? fallbackMessage), {
                status,
                code: apiError?.code,
            }),
        )
    },
)