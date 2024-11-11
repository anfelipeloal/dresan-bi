import { numberFormat } from '#imports';

export const useChartBarSales = () => {
    const chartOptions = ref({
        chart: {
            type: 'xy',
        },
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
        yAxis: [{ // Primary yAxis
            labels: {
                format: '{value:,.0f}',
            },
            title: {
                text: 'Total Sales',
            },
        }, { // Secondary yAxis
            title: {
                text: 'Bookings',
            },
            labels: {
                format: '{value:,.0f}',
            },
            opposite: true,
        }],
        tooltip: {
            /* shared: true, */
            formatter() {
                if (this.series.name.slice(7) === 'Bookings') {
                    return `
                        <b>${this.x} - ${this.series.name.slice(0, 5)} - Bookings</b>
                        <br/>
                        <b>Count:</b> ${this.y}<br>
                        <b>AVG/day:</b> ${(this.y / getDaysInMonth(this.x)).toFixed(1)}
                    `;
                }
                return `
                     <b>${this.x} - ${this.series.name.slice(0, 5)} - Sales</b>
                    <br/>
                    <b>Total sales:</b> ${numberFormat((this.point.stackTotal / 1000).toFixed(2))}K
                    <br/>
                    <b>${this.series.name.slice(7)}:</b> ${numberFormat((this.y / 1000).toFixed(2))}K<br/>
                    <b>% of:</b> ${((this.y * 100) / this.point.stackTotal).toFixed(2)}%
                `;
            },
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                borderRadius: 5,
                pointWidth: 17,
                borderWidth: 0,
            },
        },
        series: [],
    });

    function createChart({ categories, data }) {
        chartOptions.value.xAxis.categories = categories || [];

        const series = [];
        Object.keys(data).forEach((year) => {
            series.push({
                name: `${year} - WithComm`,
                type: 'column',
                data: data[year].totalFareWithCommissions || [],
                stack: year,
            });
            series.push({
                name: `${year} - ZeroComm`,
                type: 'column',
                data: data[year].totalFareWithOutCommission || [],
                stack: year,
            });
            series.push({
                name: `${year} - Bookings`,
                type: 'spline',
                data: data[year].bookings || [],
                yAxis: 1,
            });
        });

        chartOptions.value.series = series;
    }

    function getDaysInMonth(month) {
        const months = {
            Jan: 31,
            Feb: 28,
            Mar: 31,
            Apr: 30,
            May: 31,
            Jun: 30,
            Jul: 31,
            Aug: 31,
            Sep: 30,
            Oct: 31,
            Nov: 30,
            Dec: 31,
        };

        if (!(month in months)) {
            throw new Error('Mes inválido. Use abreviaturas de tres letras en inglés (ej: "Jan", "Feb").');
        }

        const year = new Date().getFullYear();

        // Comprueba si es año bisiesto y ajusta febrero si es necesario
        if (month === 'Feb' && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)) {
            return 29;
        }

        return months[month];
    }

    return {
        chartOptions,
        createChart,
    };
};
