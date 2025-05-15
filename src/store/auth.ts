import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as null | {
            id: number,
            email: string,
            firstName: string,
            lastName: string,
        },
    }),
    actions: {
        login(userData: any) {
            this.user = userData
            localStorage.setItem('user', JSON.stringify(userData))
        },
        logout() {
            this.user = null
            localStorage.removeItem('user')
            localStorage.removeItem('userToken')
        },
    },
})
