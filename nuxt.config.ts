// https://nuxt.com/docs/api/configuration/nuxt-config
if (!process.env.NUXT_AUTH_TOKEN) {
    console.warn('Security warning: NUXT_AUTH_TOKEN is not set. Using an example value. Please set it otherwise your session is unsecure!');
    process.env.NUXT_AUTH_TOKEN = 'secretsecretsecretsecretsecretsecretsecret';
}

export default defineNuxtConfig({
    colorMode: {
        preference: 'light',
    },
    devtools: {
        enabled: true,
    },
    modules: [
        '@nuxt/ui',
    ],
    runtimeConfig: {
        // Config for RedShift
        // The private keys which are only available server-side, the value will be override from .env
        rsUser: process.env.NUXT_RS_USER,
        rsHost: process.env.NUXT_RS_HOST,
        rsDatabase: process.env.NUXT_RS_DATABASE,
        rsPassword: process.env.NUXT_RS_PASSWORD,
        rsPort: process.env.NUXT_RS_PORT,

        auth: {
            name: 'nuxt-session',
            maxAge: (60 * 60 * 24 * 2),
            password: process.env.NUXT_AUTH_TOKEN,
        },

        // Keys within public are also exposed client-side
        public: {
            apiBase: '/api',
        },
    },
    ssr: false,
    srcDir: 'src/',
    ui: {
        icons: ['mdi', 'svg-spinners'],
    },
});
