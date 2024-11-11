export default class GeneralProvider {
    async getInvoices({ startDate, endDate, conditions }) {
        const { data, error } = await useFetch('/api/general/invoice-data-inquiry', {
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

    async getBookingsByInvoice({ invoiceId }) {
        const { data, error } = await useFetch('/api/general/booking-by-invoice', {
            method: 'GET',
            query: {
                invoiceId,
            },
        });

        if (error.value) {
            useUtils().errorHandler('Opps! something has occurred.');
            return null;
        }

        return data.value;
    }

    async getBookingAgents({ bookingId }) {
        const { data, error } = await useFetch('/api/general/booking-agents', {
            method: 'GET',
            query: {
                bookingId,
            },
        });

        if (error.value) {
            useUtils().errorHandler('Opps! something has occurred.');
            return null;
        }

        return data.value;
    }

    async getBookings({ startDate, endDate, conditions }) {
        const { data, error } = await useFetch('/api/general/booking-data-inquiry', {
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

    async getTravelSubTypes() {
        const { data, error } = await useFetch('/api/general/travel-sub-types', {
            method: 'GET',
        });

        if (error.value) {
            useUtils().errorHandler('Opps! something has occurred.');
            return null;
        }

        return data.value;
    }

    async getReportType({ searchable }) {
        const { data, error } = await useFetch('/api/general/type-report', {
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

    async execQueryReport({
        startDate, endDate, conditions, reportQuery,
    }) {
        try {
            const { data, error } = await useFetch('/api/general/exec-report-type', {
                method: 'POST',
                body: {
                    startDate,
                    endDate,
                    conditions,
                    reportQuery,
                },
            });

            if (error.value) {
                useUtils().errorHandler('Opps! something has occurred.');
                return null;
            }

            return data.value;
        } catch (err) {
            console.error(err);
            useUtils().errorHandler(err);
            return null;
        }
    }
}
