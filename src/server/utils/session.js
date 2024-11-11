const sessionConfig = useRuntimeConfig().auth || {};

export async function useAuthSession(event) {
    const session = await useSession(event, sessionConfig);

    return session;
}

export async function requireAuthSession(event) {
    const session = await useAuthSession(event);

    if (!session.data.email) {
        throw createError({
            message: 'Not Authorized',
            statusCode: 401,
        });
    }

    return session;
}
