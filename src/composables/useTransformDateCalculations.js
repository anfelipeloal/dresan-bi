export const useTransformDateCalculations = () => {
    async function calculateMonthsBetweenDates({ startDate, endDate, method }) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const months = [];

        start.setUTCDate(1);
        end.setUTCDate(1);

        while (start <= end) {
            const year = start.getUTCFullYear();
            const month = start.getUTCMonth() + 1;
            const startDateOfMonth = new Date(year, month - 1, 1);
            const endDateOfMonth = new Date(year, month, 0);
            months.push({
                startDate: startDateOfMonth.toISOString().split('T')[0],
                endDate: endDateOfMonth.toISOString().split('T')[0],
            });
            start.setUTCMonth(start.getUTCMonth() + 1);
        }

        // we transform the dates to array of dates
        const comparativeMonths = months.map((month) => ({
            startDate: month.startDate,
            endDate: month.endDate,
        }));

        const dataSet = [];
        const monthsDataSet = [];

        // eslint-disable-next-line no-restricted-syntax
        for (const month of comparativeMonths) {
            // eslint-disable-next-line no-await-in-loop
            const responseData = await method.getAirlineProductionHistory({ startDate: month.startDate, endDate: month.endDate });

            const yearMonth = month.startDate.substring(0, 7);

            monthsDataSet.push(yearMonth);

            dataSet.push(...responseData);
        }

        // we return array of dates
        return comparativeMonths;
    }

    return {
        calculateMonthsBetweenDates,
    };
};
