import { CHART_TYPES } from '~/config/constants';

export const useChartPie = ({ legendFormatter = null, disableInternalPercentage = false, showOutsidePercentage = false } = {}) => {
    const chartOptions = ref({
        credits: {
            enabled: false,
        },
        chart: {
            type: CHART_TYPES.PIE_CHART.value,
        },
        title: {
            text: '',
        },
        tooltip: {
            valueSuffix: '',
            formatter() {
                const extraInfo = new Intl.NumberFormat('en-US').format(this.point.y); // Aquí tomamos el valor que se muestra
                return `${this.point.name}</b><br>${this.series.name}: <b>${this.point.percentage.toFixed(1)}%<br>Value: $${extraInfo}`;
            },
        },
        subtitle: {
            text: '',
        },
        plotOptions: {
            series: {
                allowPointSelect: true,
                cursor: 'pointer',
                showInLegend: true,
                dataLabels: [{
                    enabled: true,
                    distance: 20,
                    formatter() {
                        if (showOutsidePercentage) {
                            return `${this.point.percentage.toFixed(1)}%`;
                        }
                        return legendFormatter ? legendFormatter(this) : this.y;
                    },
                }, {
                    enabled: !disableInternalPercentage,
                    distance: -40,
                    format: '{point.percentage:.1f}%',
                    style: {
                        fontSize: '1.1em',
                        textOutline: 'none',
                        opacity: 0.7,
                    },
                    filter: {
                        operator: '>',
                        property: 'percentage',
                        value: 10,
                    },
                }],
            },
        },
        series: [],
        drilldown: {
            series: [],
        },
    });

    function createChart({ series = [], titleChart = '', drilldown = [] }) {
        chartOptions.value.series = [...series];
        chartOptions.value.title.text = titleChart;
        chartOptions.value.drilldown.series = drilldown;
    }

    return {
        chartOptions,
        createChart,
    };
};
