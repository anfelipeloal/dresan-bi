export default class FinanceProvider {
    async getSalesCurrentMonth({ previusDayReportDates, monthReportDates, yearReportDates }) {
        const { data, error } = await useFetch('/api/finance/sales-current-month', {
            method: 'GET',
            query: {
                previusDayReportDates,
                monthReportDates,
                yearReportDates,
            },
        });

        if (error.value) {
            useUtils().errorHandler('Opps! something has occurred.');
            return null;
        }

        return data.value;
    }

    async getSalesCurrentMonthDetailed({ startDate, endDate, serviceSubTypeId }) {
        const { data, error } = await useFetch('/api/finance/current-month-sales-detailed', {
            method: 'GET',
            query: {
                startDate,
                endDate,
                serviceSubTypeId,
            },
        });

        if (error.value) {
            useUtils().errorHandler('Opps! something has occurred.');
            return null;
        }

        return data.value;
    }

    async getBusinessUnitEarningsAndCost({ startDate, endDate }) {
        const { data, error } = await useFetch('/api/finance/sales-report-business-unit-earnings-cost', {
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

    async getBusinessUnitEarningsAndCostDetailed({ startDate, endDate, serviceSubTypeId }) {
        const { data, error } = await useFetch('/api/finance/sales-report-business-unit-earnings-cost-detailed', {
            method: 'GET',
            query: {
                startDate,
                endDate,
                serviceSubTypeId,
            },
        });

        if (error.value) {
            useUtils().errorHandler('Opps! something has occurred.');
            return null;
        }

        return data.value;
    }

    async getClientPerformance({ businessUnit }) {
        const { data, error } = await useFetch('/api/finance/client-performance', {
            method: 'GET',
            query: {
                businessUnit,
            },
        });

        if (error.value) {
            useUtils().errorHandler('Opps! something has occurred.');
            return null;
        }

        return data.value;
    }

    async getTtoalSales({ startDate, endDate }) {
        const { data, error } = await useFetch('/api/finance/total-sales', {
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
