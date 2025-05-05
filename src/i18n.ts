import { createI18n } from 'vue-i18n'

const messages = {
    en: {
        welcome: 'Welcome to the bank',
        login: 'Login',
        register: 'Register',
        home: 'Home',
    },
    pl: {
        welcome: 'Witamy w banku',
        login: 'Zaloguj się',
        register: 'Zarejestruj się',
        home: 'Strona główna',
    },
    de: {
        welcome: 'Willkommen bei der Bank',
        login: 'Anmelden',
        register: 'Registrieren',
        home: 'Startseite',
    }
}

const i18n = createI18n({
    legacy: false,
    locale: 'pl', // domyślny język
    messages,
})

export default i18n
