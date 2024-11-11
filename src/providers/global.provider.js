export default class GlobalProvider {
    async getClients({ searchable }) {
        const { data, error } = await useFetch('/api/global/clients', {
            method: 'GET',
            query: {
                searchable,
            },
        });

        if (error.value) {
            useUtils().errorHandler('Opps! something has occurred.');
            return null;
        }

        return data.value;
    }

    async getProfileData({ id }) {
        const { data, error } = await useFetch('/api/global/profile', {
            method: 'GET',
            query: {
                id,
            },
        });

        if (error.value) {
            useUtils().errorHandler('Opps! something has occurred.');
            return null;
        }

        return data.value;
    }

    async getVendors({ searchable }) {
        const { data, error } = await useFetch('/api/global/vendors', {
            method: 'GET',
            query: {
                searchable,
            },
        });

        if (error.value) {
            useUtils().errorHandler('Opps! something has occurred.');
            return null;
        }

        return data.value;
    }

    async getAgents({ searchable }) {
        const { data, error } = await useFetch('/api/global/agents', {
            method: 'GET',
            query: {
                searchable,
            },
        });

        if (error.value) {
            useUtils().errorHandler('Opps! something has occurred.');
            return null;
        }

        return data.value;
    }

    async get360ProductivityHistory({
        startDate, endDate, profileId, profileType = 1,
    }) {
        const { data, error } = await useFetch('/api/global/profile-productivity-history', {
            method: 'GET',
            query: {
                startDate,
                endDate,
                profileId,
                profileType,
            },
        });

        if (error.value) {
            useUtils().errorHandler('Opps! something has occurred.');
            return null;
        }

        return data.value;
    }
}
