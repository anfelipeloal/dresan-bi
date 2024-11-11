/* eslint-disable consistent-return */
import UserProvider from '@/providers/user.provider';

export default defineNuxtPlugin(async (nuxtApp) => {
    // Skip plugin when rendering error page
    if (nuxtApp.payload.error) {
        return {};
    }

    const { data: session, refresh: updateSession } = await useFetch('/api/auth/session');
    const loggedIn = computed(() => !!session.value?.email);

    const userProvider = new UserProvider();
    const user = ref(null);

    const updateUser = async () => {
        user.value = null;
    };

    // Reference to know where to redirect the user when logged in
    const redirectTo = useState('authRedirect');

    addRouteMiddleware(
        'auth',
        async (to) => {
            if (to.meta.auth) {
                await updateSession();

                if (!loggedIn.value) {
                    redirectTo.value = to.path;
                    return '/login';
                }

                // Fetch user data only if logged in
                if (!user.value) {
                    user.value = await userProvider.getUserData({ userId: session.value.id });
                }
            }
        },
        {
            global: true,
        },
    );

    return {
        provide: {
            auth: {
                loggedIn,
                session,
                redirectTo,
                user,
                updateSession,
                updateUser,
            },
        },
    };
});
