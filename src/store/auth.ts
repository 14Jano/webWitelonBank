import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as null | {
            id: number
            email: string
            firstName: string
            lastName: string
        },
        token: localStorage.getItem('userToken') || null
    }),

    actions: {
        async login(credentials: { email: string; haslo: string }) {
            try {
                const response = await axios.post(
                    'https://witelonapi.host358482.xce.pl/api/login',
                    credentials
                )

                const tempToken = response.data.tempToken
                this.token = tempToken
                localStorage.setItem('tempToken', tempToken)

                const userResponse = await axios.get(
                    'https://witelonapi.host358482.xce.pl/api/user',
                    {
                        headers: {
                            Authorization: `Bearer ${tempToken}`
                        }
                    }
                )

                this.user = userResponse.data
                localStorage.setItem('user', JSON.stringify(this.user))
            } catch (error) {
                console.error('Błąd logowania:', error)
                throw error
            }
        },
        async verify2FA(code: string) {
            try {
                const response = await axios.post(
                    'https://witelonapi.host358482.xce.pl/api/2fa',
                    { code },
                    {
                        headers: {
                            Authorization: `Bearer ${this.token}`
                        }
                    }
                )

                const token = response.data.token
                this.token = token
                localStorage.setItem('userToken', token)
                localStorage.removeItem('tempToken') // czyść tymczasowy token

                const userResponse = await axios.get(
                    'https://witelonapi.host358482.xce.pl/api/user',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )

                this.user = userResponse.data
                localStorage.setItem('user', JSON.stringify(this.user))

                return true
            } catch (error) {
                console.error('Błąd 2FA:', error)
                throw error
            }
        },
        logout() {
            this.user = null
            this.token = null
            localStorage.removeItem('user')
            localStorage.removeItem('userToken')
        }
    }

})
