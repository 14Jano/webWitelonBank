import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as null | {
            id: number
            email: string
            imie: string
            nazwisko: string,
            konta:
                {
                    id: number
                    nr_konta: string
                    saldo: number
                    waluta: string
                    typ: string
                    limit_przelewow: string
                    zablokowane: boolean
                }[],
        },
        token: localStorage.getItem('userToken') || localStorage.getItem('tempToken') || null,
        loginEmail: null as string | null,
    }),
    getters: {
        isLoggedIn: (state) => !!state.token && !!state.user

    },

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

                return true
            } catch (error) {
                console.error('Błąd logowania:', error)
                throw error
            }
        },

        async verify2FA(email: string, dwuetapowy_kod: string) {
            try {
                const response = await axios.post(
                    'https://witelonapi.host358482.xce.pl/api/2fa',
                    { email, dwuetapowy_kod },
                    {
                        headers: {
                            Authorization: `Bearer ${this.token}`
                        }
                    }
                )

                const token = response.data.token
                this.token = token
                localStorage.setItem('userToken', token)
                localStorage.removeItem('tempToken')

                const userResponse = await axios.get(
                    'https://witelonapi.host358482.xce.pl/api/user',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )

                const user = userResponse.data

                const kontaResponse = await axios.get(
                    'https://witelonapi.host358482.xce.pl/api/konta',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )

                user.konta = kontaResponse.data

                this.user = user
                localStorage.setItem('user', JSON.stringify(this.user))

                return true
            } catch (error) {
                console.error('Błąd 2FA:', error)
                throw error
            }
        },

        setTempToken(token: string) {
            this.token = token
            localStorage.setItem('tempToken', token)
        },

        setLoginEmail(email: string) {
            this.loginEmail = email
        },

        logout() {
            this.user = null
            this.token = null
            localStorage.removeItem('user')

            localStorage.removeItem('userToken')
            localStorage.removeItem('tempToken')
            window.location.href = '/login'
        }
    }
})
