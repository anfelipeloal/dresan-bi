export const useChartGauge = () => {
    const chartOptions = ref({
        credits: {
            enabled: false,
        },
        chart: {
            type: 'solidgauge',
            height: '110%',
            /*  events: {
                render: renderIcons,
            }, */
        },

        colors: [
            '#000',
        ],

        title: {
            text: '',
            style: {
                fontSize: '24px',
            },
        },

        subtitle: {
            text: 'This is a Sample data',
            align: 'left',
        },

        tooltip: {
            borderWidth: 0,
            backgroundColor: 'none',
            shadow: false,
            style: {
                fontSize: '15px',
            },
            valueSuffix: '%',
            pointFormat: '{series.name}<br>'
                + '<span style="font-size: 2em; color: {point.color}; '
                + 'font-weight: bold">{point.y}</span>',
            positioner(labelWidth) {
                return {
                    x: (this.chart.chartWidth - labelWidth) / 2,
                    y: (this.chart.plotHeight / 2) + 15,
                };
            },
        },

        pane: {},

        yAxis: {
            min: 0,
            max: 100,
            lineWidth: 0,
            tickPositions: [],
        },

        plotOptions: {
            solidgauge: {
                dataLabels: {
                    enabled: false,
                },
                linecap: 'round',
                stickyTracking: false,
                rounded: true,
            },
        },

        series: [],
    });

    function createChart({
        series = [],
        titleChart = '',
        pane = {},
        subtitle,
    }) {
        chartOptions.value.series = series;
        chartOptions.value.pane = pane;
        chartOptions.value.title.text = titleChart;
        chartOptions.value.subtitle.text = subtitle;
    }

    return {
        chartOptions,
        createChart,
    };
};
