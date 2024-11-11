import { numberFormat } from '#imports';

export const useChartLineAvg = () => {
    const chartOptions = ref({
        credits: {
            enabled: false,
        },
        title: {
            text: '',
            align: 'left',
        },
        xAxis: {
            categories: [],
            crosshair: true,
        },
        yAxis: {
            title: {
                text: 'Tickets',
            },
            labels: {
                formatter() {
                    return numberFormat(this.value);
                },
            },
        },
        tooltip: {
            formatter() {
                return `
                    <b>${this.x} - ${this.series.name.slice(0, 5)}</b><br/>
                    <b>${this.series.name.slice(7)}:</b> ${numberFormat(this.point.y.toFixed(2))}<br/>
                    <b>Max Fare:</b> ${numberFormat(this.point.max.toFixed(2))}
                `;
            },
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
        },
        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false,
                },
            },
        },
        series: [],
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500,
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom',
                    },
                },
            }],
        },
    });

    function createChart({ categories, data }) {
        chartOptions.value.xAxis.categories = categories || [];

        const series = Object.keys(data).map((year) => ({
            name: `${year} - Avg Tickets`,
            data: data[year].avg_tikets.map((value, index) => ({
                y: value,
                min: data[year].min_fares[index],
                max: data[year].max_fares[index],
            })),
        }));

        chartOptions.value.series = series;
    }

    return {
        chartOptions,
        createChart,
    };
};
