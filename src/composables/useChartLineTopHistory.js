import { numberFormat } from '#imports';

export const useChartLineTopHistory = () => {
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
                text: 'Total Sales',
            },
            labels: {
                formatter() {
                    return numberFormat(this.value);
                },
            },
        },
        tooltip: {
            /* shared: true, */
            formatter() {
                return `
                    <b>${this.x}</b>
                    <br/>
                    <b>${this.series.name}:</b> ${numberFormat((this.y / 1000).toFixed(2))}K
                `;
            },
        },
        legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
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

        const series = data.map((item) => ({
            name: item.name,
            data: item.data || [],
        }));

        chartOptions.value.series = series;
    }

    return {
        chartOptions,
        createChart,
    };
};
