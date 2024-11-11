import { CHART_TYPES } from '~/config/constants';

export const useChartBar = ({ legendFormatter = null } = {}) => {
    const chartOptions = ref({
        credits: {
            enabled: false,
        },
        chart: {
            type: CHART_TYPES.COLUMN_CHART.value,
        },
        legend: {
            enabled: false, // Esto oculta la leyenda
        },
        title: {
            text: '',
        },
        xAxis: {
            categories: [],
        },
        yAxis: {
            title: {
                text: '',
            },
        },
        tooltip: {
            formatter() {
                return legendFormatter ? legendFormatter(this) : this.y;
            },
        },
        series: [],
    });

    function createChart({
        showLegend = true,
        xAxisCategories = [],
        series = [],
        yAxisTitle = '',
        titleChart = '',
    }) {
        chartOptions.value.legend.enabled = showLegend;
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
