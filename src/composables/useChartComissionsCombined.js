import { numberFormat } from '#imports';

export const useChartComissionsCombined = () => {
    const chartOptions = ref({
        credits: {
            enabled: false,
        },
        title: {
            text: '',
            align: 'left',
        },
        xAxis: {
            categories: ['January', 'February', 'March', 'April', 'May'],
        },
        yAxis: {
            title: {
                text: 'Commissions',
            },
        },
        tooltip: {
            formatter() {
                return `${this.x}<br><b>${this.series.name}:</b> ${numberFormat((this.y / 1000).toFixed(2))}K`;
            },
        },
        plotOptions: {
            column: {
                borderRadius: 5,
                pointWidth: 17, // Esto hace las barras más delgadas
                borderWidth: 0,
            },
        },
        series: [],
    });

    function createChart({
        categories, data, tierOne = null, tierTwo = null, goal = null,
    }) {
        chartOptions.value.xAxis.categories = categories || [];

        // Crear una serie para cada año
        const series = Object.keys(data).map((year) => ({
            type: 'column',
            name: year,
            data: data[year].commissions,
        }));

        chartOptions.value.series = series;

        if (tierOne && tierTwo) {
            const tierOneArray = [];
            const tierTwoArray = [];

            for (let i = 1; i <= categories.length; i += 1) {
                tierOneArray.push(tierOne);
                tierTwoArray.push(tierTwo);
            }

            chartOptions.value.series.push({
                type: 'line',
                step: 'center',
                name: 'Tier 1',
                color: '#3578f6',
                data: tierOneArray || [],
            });

            chartOptions.value.series.push({
                type: 'line',
                step: 'center',
                name: 'Tier 2',
                color: '#f0508f',
                data: tierTwoArray || [],
            });
        }

        if (goal) {
            const goalArray = [];

            for (let i = 1; i <= categories.length; i += 1) {
                goalArray.push(goal);
            }

            chartOptions.value.series.push({
                type: 'line',
                step: 'center',
                name: 'Goal',
                color: '#3578f6',
                data: goalArray || [],
            });
        }
    }

    return {
        chartOptions,
        createChart,
    };
};
