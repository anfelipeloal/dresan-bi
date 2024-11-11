export default class CorporateProvider {
    async getTravelType({ startDate, endDate }) {
        const { data, error } = await useFetch('/api/corporate/travel-type', {
            method: 'GET',
            query: {
                startDate,
                endDate,
            },
        });

        if (error.value) {
            useUtils().errorHandler('Opps! something has occurred.');
            return null;
        }

        return data.value;
    }

    async getTravelTypeOther({ startDate, endDate, primaryTravelTypes }) {
        const { data, error } = await useFetch('/api/corporate/travel-type-other', {
            method: 'GET',
            query: {
                startDate,
                endDate,
                primaryTravelTypes,
            },
        });

        if (error.value) {
            useUtils().errorHandler('Opps! something has occurred.');
            return null;
        }

        return data.value;
    }

    async getTravelSubType({ startDate, endDate }) {
        const { data, error } = await useFetch('/api/corporate/travel-sub-type', {
            method: 'GET',
            query: {
                startDate,
                endDate,
            },
        });

        if (error.value) {
            useUtils().errorHandler('Opps! something has occurred.');
            return null;
        }

        return data.value;
    }

    async getTravelSubTypeOther({ startDate, endDate, primaryTravelTypes }) {
        const { data, error } = await useFetch('/api/corporate/travel-sub-type-other', {
            method: 'GET',
            query: {
                startDate,
                endDate,
                primaryTravelTypes,
            },
        });

        if (error.value) {
            useUtils().errorHandler('Opps! something has occurred.');
            return null;
        }

        return data.value;
    }

    async getSalesByBusinessUnit({ startDate, endDate }) {
        const { data, error } = await useFetch('/api/corporate/sales-report-business-unit', {
            method: 'GET',
            query: {
                startDate,
                endDate,
            },
        });

        if (error.value) {
            useUtils().errorHandler('Opps! something has occurred.');
            return null;
        }

        return data.value;
    }

    async getSalesByBusinessUnitHistory({ startDate, endDate }) {
        const { data, error } = await useFetch('/api/corporate/sales-report-business-unit-history', {
            method: 'GET',
            query: {
                startDate,
                endDate,
            },
        });

        if (error.value) {
            useUtils().errorHandler('Opps! something has occurred.');
            return null;
        }

        return data.value;
    }

    async getAirlineProduction({ startDate, endDate }) {
        const { data, error } = await useFetch('/api/corporate/airlines-production-report', {
            method: 'GET',
            query: {
                startDate,
                endDate,
            },
        });

        if (error.value) {
            useUtils().errorHandler('Opps! something has occurred.');
            return null;
        }

        return data.value;
    }

    async getAirlineProductionDetail({ startDate, endDate, profileId }) {
        const { data, error } = await useFetch('/api/corporate/airlines-production-detail-report', {
            method: 'GET',
            query: {
                startDate,
                endDate,
                profileId,
            },
        });

        if (error.value) {
            useUtils().errorHandler('Opps! something has occurred.');
            return null;
        }

        return data.value;
    }

    async getAirlineProductionHistory({ startDate, endDate }) {
        const { data, error } = await useFetch('/api/corporate/airline-prduction-history', {
            method: 'GET',
            query: {
                startDate,
                endDate,
            },
        });

        if (error.value) {
            useUtils().errorHandler('Opps! something has occurred.');
            return null;
        }

        return data.value;
    }

    async getTopCustomers({ startDate, endDate }) {
        const { data, error } = await useFetch('/api/corporate/top-customers', {
            method: 'GET',
            query: {
                startDate,
                endDate,
            },
        });

        if (error.value) {
            useUtils().errorHandler('Opps! something has occurred.');
            return null;
        }

        return data.value;
    }

    async getCorporateCustomers({ startDate, endDate }) {
        const { data, error } = await useFetch('/api/corporate/top-corporate-customers', {
            method: 'GET',
            query: {
                startDate,
                endDate,
            },
        });

        if (error.value) {
            useUtils().errorHandler('Opps! something has occurred.');
            return null;
        }
        return data.value;
    }

    async getTaboolaReport({ startDate, endDate }) {
        const { data, error } = await useFetch('/api/corporate/taboola-report', {
            method: 'GET',
            query: {
                startDate,
                endDate,
            },
        });

        if (error.value) {
            useUtils().errorHandler('Opps! something has occurred.');
            return null;
        }

        return data.value;
    }

    async getTravelTypeSumary({ startDate, endDate }) {
        const { data, error } = await useFetch('/api/corporate/travel-type-sumary', {
            method: 'GET',
            query: {
                startDate,
                endDate,
            },
        });

        if (error.value) {
            useUtils().errorHandler('Opps! something has occurred.');
            return null;
        }

        return data.value;
    }

    async getTravelSummaryReport({ startDate, endDate, clientId }) {
        const { data, error } = await useFetch('/api/corporate/travel-summary-report', {
            method: 'GET',
            query: {
                startDate,
                endDate,
                clientId,
            },
        });

        if (error.value) {
            useUtils().errorHandler('Opps! something has occurred.');
            return null;
        }

        return data.value;
    }

    async getTotalFare({ startDate, endDate }) {
        const { data, error } = await useFetch('/api/corporate/total-sales-report', {
            method: 'GET',
            query: {
                startDate,
                endDate,
            },
        });

        if (error.value) {
            useUtils().errorHandler('Opps! something has occurred.');
            return null;
        }

        return data.value;
    }
}
