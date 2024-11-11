export default class HistoryManager {
    getTop5TotalFareIds(data) {
        const validData = data.filter((item) => item.id && !Number.isNaN(parseFloat(item.total_fare)));
        const sortedData = validData.sort((a, b) => parseFloat(b.total_fare) - parseFloat(a.total_fare));
        const top = sortedData.slice(0, 5);
        return top.map((item) => item.id);
    }

    processProductivityHistoryData(data) {
        const monthNames = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
        ];

        const latestYear = Math.max(...data.map((item) => parseInt(item.year, 10)));
        const latestMonth = Math.max(...data.filter((item) => item.year === latestYear).map((item) => parseInt(item.month, 10)));

        const categories = monthNames.slice(0, latestMonth);

        const yearsData = {};

        const years = [...new Set(data.map((item) => item.year))];

        years.forEach((year) => {
            yearsData[year] = {
                year,
                bookings: [],
                commissions: [],
                totalFareWithCommissions: [],
                totalFareWithOutCommission: [],
                totalCommissionSum: 0,
                totalFareSum: 0,
                totalBookingsSum: 0,
                zeroCommissionSum: 0,
            };
        });

        data.forEach((item) => {
            const { year } = item;
            const commission = parseFloat(item.commission);
            const bookings = parseInt(item.bookings, 10);
            const totalFare = parseFloat(item.total_fare);
            const withCommission = parseFloat(item.total_fare_with_commission);
            const zeroCommission = parseFloat(item.total_fare_without_commission);

            if (parseInt(item.month, 10) <= latestMonth) {
                yearsData[year].bookings.push(bookings);
                yearsData[year].commissions.push(commission);
                yearsData[year].totalFareWithCommissions.push(withCommission);
                yearsData[year].totalFareWithOutCommission.push(zeroCommission);
                yearsData[year].totalCommissionSum += commission;
                yearsData[year].totalFareSum += totalFare;
                yearsData[year].zeroCommissionSum += zeroCommission;
                yearsData[year].totalBookingsSum += bookings;
            }
        });

        years.forEach((year, index) => {
            if (index === 0) {
                yearsData[year].totalCommissionDifference = 0;
                yearsData[year].totalFareDifference = 0;
            } else {
                const prevYear = years[index - 1];
                const commissionDiff = ((yearsData[year].totalCommissionSum - yearsData[prevYear].totalCommissionSum) / yearsData[prevYear].totalCommissionSum) * 100;
                const fareDiff = ((yearsData[year].totalFareSum - yearsData[prevYear].totalFareSum) / yearsData[prevYear].totalFareSum) * 100;
                yearsData[year].totalCommissionDifference = parseFloat(commissionDiff.toFixed(2));
                yearsData[year].totalFareDifference = parseFloat(fareDiff.toFixed(2));
            }
        });

        years.forEach((year) => {
            if (!yearsData[year].commissions) {
                yearsData[year].commissions = [];
            }

            if (!yearsData[year].totalFares) {
                yearsData[year].totalFares = [];
            }

            while (yearsData[year].commissions.length < latestMonth) {
                yearsData[year].commissions.push(0);
                yearsData[year].totalFares.push(0);
            }
        });

        return {
            categories,
            data: yearsData,
            dataSet: data,
        };
    }

    processAgentHistoryDataAirline(data) {
        const monthNames = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
        ];

        const latestYear = Math.max(...data.map((item) => parseInt(item.year, 10)));
        const latestMonth = Math.max(...data.filter((item) => item.year === latestYear).map((item) => parseInt(item.month, 10)));

        const categories = monthNames.slice(0, latestMonth);

        const yearsData = {};

        const years = [...new Set(data.map((item) => item.year))];

        years.forEach((year) => {
            yearsData[year] = {
                year,
                avg_tikets: [],
                min_fares: [],
                max_fares: [],
            };
        });

        data.forEach((item) => {
            const { year } = item;
            const avgTikets = parseFloat(item.average_ticket);
            const minFares = parseFloat(item.min_fare);
            const maxFares = parseFloat(item.max_fare);

            if (parseInt(item.month, 10) <= latestMonth) {
                yearsData[year].avg_tikets.push(avgTikets);
                yearsData[year].min_fares.push(minFares);
                yearsData[year].max_fares.push(maxFares);
            }
        });

        return {
            categories,
            data: yearsData,
            dataSet: data,
        };
    }

    setDataPercentages(data) {
        const totalFare = data.reduce((sum, item) => sum + parseFloat(item.total_fare), 0);
        const totalCommission = data.reduce((sum, item) => sum + parseFloat(item.commission), 0);

        const dataSet = data.map((item) => ({
            ...item,
            fare_percentage: totalFare ? ((parseFloat(item.total_fare) / totalFare) * 100).toFixed(2) : 0,
            commission_percentage: totalCommission ? ((parseFloat(item.commission) / totalCommission) * 100).toFixed(2) : 0,
        })).sort((a, b) => b.fare_percentage - a.fare_percentage);

        return { dataSet, totalFare, totalCommission };
    }

    groupByYear(data) {
        const result = {};

        data.forEach((item) => {
            const year = item.issue_year.toString();
            if (!result[year]) {
                result[year] = [];
            }
            result[year].push(item);
        });

        return result;
    }

    processDataForTopHistory(data) {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth(); // 0-indexed

        data.sort((a, b) => a.year - b.year);

        const categories = [];
        const seriesData = {};

        data.forEach((item) => {
            const year = parseInt(item.year, 10);
            const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

            months.forEach((month, index) => {
                if (year === currentYear && index > currentMonth) return;

                const categoryLabel = year !== currentYear
                    ? `${month.slice(0, 3)}-${year.toString().slice(2)}`
                    : month.slice(0, 3);

                if (!categories.includes(categoryLabel)) {
                    categories.push(categoryLabel);
                }

                if (!seriesData[item.name]) {
                    seriesData[item.name] = new Array(categories.length).fill(null);
                }

                const value = parseFloat(item[month]);
                if (!Number.isNaN(value)) {
                    seriesData[item.name][categories.indexOf(categoryLabel)] = value;
                }
            });
        });

        const series = Object.entries(seriesData).map(([name, d]) => ({ name, data: d }));

        return { categories, series };
    }
}
