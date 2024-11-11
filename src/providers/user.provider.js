export default class UserProvider {
    async getUserData({ userId }) {
        const { data, error } = await useFetch('/api/user/data', {
            method: 'GET',
            query: {
                userId,
            },
        });

        if (error.value) {
            useUtils().errorHandler('Opps! something has occurred.');
            return null;
        }

        return data.value;
    }
}
