export const useChartLine = ({ legendFormatter = null } = {}) => {
    const chartOptions = ref({
        credits: {
            enabled: false,
        },
        title: {
            text: '',
            align: 'left',
        },

        subtitle: {
            text: '',
            align: 'left',
        },

        yAxis: {
            title: {
                text: '',
            },
            labels: {
                formatter() {
                    const valueInMillions = this.value / 1000000;

                    return `${valueInMillions.toFixed(1)}M`;
                },
            },
        },

        xAxis: {
            categories: null,
        },

        tooltip: {
            formatter() {
                return legendFormatter ? legendFormatter(this) : this.y;
            },
        },

        series: [],
    });

    function createChart({
        xAxisCategories = [],
        series = [],
        yAxisTitle = '',
        titleChart = '',
    }) {
        chartOptions.value.xAxis.categories = [...xAxisCategories];
        chartOptions.value.series = series;
        chartOptions.value.yAxis.title.text = yAxisTitle;
        chartOptions.value.title.text = titleChart;
    }

    return {
        chartOptions,
        createChart,
    };
};
