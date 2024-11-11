export default class AirlineProvider {
    async getAirSalesAnalysis({ conditions }) {
        const { data, error } = await useFetch('/api/airline/air-sales-analysis', {
            method: 'GET',
            query: {
                conditions,
            },
        });

        if (error.value) {
            useUtils().errorHandler('Opps! something has occurred.');
            return null;
        }

        return data.value;
    }

    async getCityPairsAnalysis({ startDate, endDate, conditions }) {
        const { data, error } = await useFetch('/api/airline/city-pairs-analysis', {
            method: 'GET',
            query: {
                startDate,
                endDate,
                conditions,
            },
        });

        if (error.value) {
            useUtils().errorHandler('Opps! something has occurred.');
            return null;
        }

        return data.value;
    }

    async getCityPairsDetail({
        startDate, endDate, originCity, destinationCity,
    }) {
        const { data, error } = await useFetch('/api/airline/city-pair-detail', {
            method: 'GET',
            query: {
                startDate,
                endDate,
                originCity,
                destinationCity,
            },
        });

        if (error.value) {
            useUtils().errorHandler('Opps! something has occurred.');
            return null;
        }

        return data.value;
    }

    async getCityPairsClientAirlines({
        startDate, endDate, originCity, destinationCity, clientId,
    }) {
        const { data, error } = await useFetch('/api/airline/city-pair-client-airlines', {
            method: 'GET',
            query: {
                startDate,
                endDate,
                originCity,
                destinationCity,
                clientId,
            },
        });

        if (error.value) {
            useUtils().errorHandler('Opps! something has occurred.');
            return null;
        }

        return data.value;
    }
}
