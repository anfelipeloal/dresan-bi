// eslint-disable-next-line import/no-extraneous-dependencies
import { $fetch } from 'ofetch';

export default class AuthProvider {
    useAuth() {
        return useNuxtApp().$auth;
    }

    async login({ email, password }) {
        await $fetch('/api/auth/login', {
            method: 'POST',
            body: {
                email,
                password,
            },
        });

        await this.useAuth().updateSession();
        await navigateTo(this.useAuth().redirectTo.value || '/');
    }

    async register({ email, name, password }) {
        const { data, error } = await useFetch('/api/auth/register', {
            method: 'POST',
            body: {
                email,
                name,
                password,
            },
        });

        if (error.value) {
            if (error.value.statusCode === 409) {
                useUtils().errorHandler(error.value.data.message);
            } else {
                useUtils().errorHandler('Opps! something has occurred.');
            }

            return null;
        }

        useUtils().showMessage(data.value.message);

        return await this.login({ email, password });
    }

    async logout() {
        await $fetch('/api/auth/logout', {
            method: 'POST',
        });

        await this.useAuth().updateSession();
        await this.useAuth().updateUser();
        await navigateTo('/login');
    }
}
