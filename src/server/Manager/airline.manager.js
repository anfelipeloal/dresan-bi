export default class AirlineManager {
    generateAirSalesReport(sales, totalSales, conditions) {
        const currentYear = new Date().getFullYear();
        const lastYear = currentYear - 1;
        const currentMonth = new Date().getMonth() + 1; // 0-indexed
        const lastMonth = new Date().getMonth(); // 0-indexed
        const today = new Date().getDate();

        const months = [
            'january', 'february', 'march', 'april', 'may', 'june',
            'july', 'august', 'september', 'october', 'november', 'december',
        ];

        function getDaysInMonth(month, year) {
            return new Date(year, month, 0).getDate();
        }

        function calculateYTD(yearData) {
            return months.slice(0, lastMonth).reduce((sum, month) => sum + parseFloat(yearData[month] || 0), 0);
        }

        function calculatePercentageOfTotal(monthValue, totalMonthValue) {
            if (!totalMonthValue) return 0;
            return ((parseFloat(monthValue) / parseFloat(totalMonthValue)) * 100).toFixed(2);
        }

        function calculateMonthProjection(monthValue, currentDay, totalDaysInMonth) {
            const dailyAverage = monthValue / currentDay;
            return dailyAverage * totalDaysInMonth;
        }

        const currentYearData = sales.filter((item) => item.year === currentYear);
        const lastYearData = sales.filter((item) => item.year === lastYear);

        const currentYearTotalData = totalSales.filter((item) => item.year === currentYear);
        const lastYearTotalData = totalSales.filter((item) => item.year === lastYear);

        function calculateAverage(total, count) {
            return count > 0 ? total / count : 0;
        }

        const airlines = [...new Set(currentYearData.map((item) => item.airline))];

        const report = airlines.map((airline) => {
            const currentYearClientData = currentYearData.find((item) => item.airline === airline) || {};
            const lastYearClientData = lastYearData.find((item) => item.airline === airline) || {};

            const currentYearTotalAirlineData = currentYearTotalData.find((item) => item.airline === airline) || {};
            const lastYearTotalAirlineData = lastYearTotalData.find((item) => item.airline === airline) || {};

            const ytd = calculateYTD(currentYearClientData);
            const totalYtd = calculateYTD(currentYearTotalAirlineData);
            const lastYtd = calculateYTD(lastYearClientData);
            const totalLastYtd = calculateYTD(lastYearTotalAirlineData);
            const avgCurrentYear = calculateAverage(ytd, lastMonth);
            const avgLastYear = calculateAverage(lastYtd, lastMonth);

            const lastMonthName = months[currentMonth - 2];
            const currentMonthName = months[currentMonth - 1];

            const currentMonthValue = parseFloat(currentYearClientData[currentMonthName] || 0);
            const daysInCurrentMonth = getDaysInMonth(currentMonth, currentYear);
            const monthProjection = calculateMonthProjection(currentMonthValue, today, daysInCurrentMonth);

            const airlineReport = {
                airline,
                ytd: `${this.numberFormatWithoutSymbol((ytd / 1000).toFixed(0))} ${conditions !== '' ? `<span class="text-sm text-gray-500">(${calculatePercentageOfTotal(ytd, totalYtd)}%)</span>` : ''}`,
                lastYtd: `${this.numberFormatWithoutSymbol((lastYtd / 1000).toFixed(0))} ${conditions !== '' ? `<span class="text-sm text-gray-500">(${calculatePercentageOfTotal(lastYtd, totalLastYtd)}%)</span>` : ''}`,
                last_ytd_vs_current_ytd: lastYtd !== 0 ? (((ytd - lastYtd) / lastYtd) * 100) || 0 : 'New',
                avg_current_year: avgCurrentYear,
                avg_last_year: avgLastYear,
                last_month_vs_avg: (((parseFloat(currentYearClientData[lastMonthName]) - avgCurrentYear) / (avgCurrentYear || 1)) * 100) || 0,
                lm_last_year: parseFloat(lastYearClientData[lastMonthName]),
                lm_current_year_vs_lm_last_year: parseFloat(lastYearClientData[lastMonthName]) !== 0 ? (((parseFloat(currentYearClientData[lastMonthName]) - parseFloat(lastYearClientData[lastMonthName])) / parseFloat(lastYearClientData[lastMonthName])) * 100) || 0 : 'New',
                month_projection: monthProjection,
            };

            months.forEach((month) => {
                const monthValue = parseFloat(currentYearClientData[month] || 0);
                const totalMonthValue = parseFloat(currentYearTotalAirlineData[month] || 0);

                airlineReport[month] = `${this.numberFormatWithoutSymbol((monthValue / 1000).toFixed(0))} ${conditions !== '' ? `<span class="text-sm text-gray-500">(${calculatePercentageOfTotal(monthValue, totalMonthValue)}%)</span>` : ''}`;
                airlineReport[`${month}_percentage_of_total`] = calculatePercentageOfTotal(monthValue, totalMonthValue);
            });

            return airlineReport;
        });

        return report.filter((airline) => airline.ytd !== 0);
    }

    numberFormatWithoutSymbol(value) {
        return !Number.isNaN(Number(value))
            ? Intl.NumberFormat('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(value)
            : '0.00';
    }
}
