<template>
    <h1 class="text-xl">
        By Service Type
    </h1>
    <ReportsCorporateComparativeTravelType
        @data-updated="onDataUpdated"
        @is-loading="isLoading = $event"
    />

    <Loader
        class="mt-40"
        v-if="isLoading"
    />

    <ClientOnly v-else>

        <div class="grid grid-cols-2 space-y-8">

            <highcharts
                :options="chartOptionsChartTotalFare"
                :constructor-type="'chart'"
                v-if="data"
            />

            <highcharts
                :options="chartOptionsChartCommission"
                :constructor-type="'chart'"
                v-if="data"
            />

            <highcharts
                :options="chartOptionsChartMarkup"
                :constructor-type="'chart'"
                v-if="data"
            />

            <highcharts
                :options="chartOptionsChartBookings"
                :constructor-type="'chart'"
                v-if="data"
            />

        </div>

        <DataTable
            class="display compact nowrap"
            :columns="tableColumns"
            :data="data"
            :options="tableOptions"
            ref="tableRef"
            v-if="data"
        >
            <tfoot>
                <tr>
                    <td/>
                    <td/>
                    <td/>
                    <td/>
                    <td/>
                    <td/>
                </tr>
            </tfoot>
        </DataTable>
    </ClientOnly>
</template>

<script setup>
import { DataTable, DataTablesCore } from '~/config/dataTables';
import { TABLE_COLUMNS_FORMATS, COMPARATIVE_COLUMN_REPORTS } from '@/config/constants';
import { legendFormatterNumber } from '../../../utils/charts/legendsFormatters';

definePageMeta({
    auth: true,
});

const isLoading = ref(false);
const data = ref(null);

const {
    chartOptions: chartOptionsChartCommission,
    createChart: createChartCommission,
} = useChartPie({ legendFormatter: legendFormatterNumber() });

const {
    chartOptions: chartOptionsChartBookings,
    createChart: createChartBookings,
} = useChartPie({
    legendFormatter: legendFormatterNumber({
        decimals: 0,
        dollarSign: false,
    }),
});

const {
    chartOptions: chartOptionsChartMarkup,
    createChart: createChartMarkup,
} = useChartPie({ legendFormatter: legendFormatterNumber() });

const {
    chartOptions: chartOptionsChartTotalFare,
    createChart: createChartTotalFare,
} = useChartPie({ legendFormatter: legendFormatterNumber() });

const tableRef = ref();

const columnsDefinition = [
    {
        key: 'service_type',
        displayName: 'Travel Taype',
    }, {
        key: 'bookings',
        displayName: 'Bookings',
        format: {
            ...TABLE_COLUMNS_FORMATS.NUMBER_FORMAT,
        },
        totalize: true,
    }, {
        key: 'total_fare',
        format: {
            ...TABLE_COLUMNS_FORMATS.SALES_DOLLAR_FORMAT,
        },
        searchable: true,
        totalize: true,
    }, {
        key: 'base',
        format: {
            ...TABLE_COLUMNS_FORMATS.SALES_DOLLAR_FORMAT,
        },
        searchable: false,
        totalize: true,
    }, {
        key: 'commission',
        format: {
            ...TABLE_COLUMNS_FORMATS.SALES_DOLLAR_FORMAT,
        },
        searchable: false,
        totalize: true,
    }, {
        key: 'markup',
        format: {
            ...TABLE_COLUMNS_FORMATS.SALES_DOLLAR_FORMAT,
        },
        searchable: false,
        totalize: true,
    },
];

function generateSeriesData(dataSet, comparativeColumn) {
    const seriesData = [];

    dataSet.forEach((element) => {
        seriesData.push({
            name: element.service_type,
            y: parseFloat(element[comparativeColumn]),
            drilldown: element.service_type === 'Others' ? element.service_type : null,
        });
    });

    return seriesData;
}

function getPieChartSeries(dataSet, comparativeColumn) {
    const series = [];

    series.push({
        name: 'Percentage',
        colorByPoint: true,
        data: generateSeriesData(dataSet, comparativeColumn),
    });

    return series;
}

function getPieChartDrillDown(otherData, comparativeColumn) {
    const drilldownData = [];
    const otherDataDrill = otherData.map((newData) => [newData.service_type, parseFloat(newData[comparativeColumn])]);

    drilldownData.push({
        name: 'Others',
        id: 'Others',
        data: [...otherDataDrill],
    });

    return drilldownData;
}

const {
    createTable,
    tableColumns,
    tableOptions,
} = useTables(DataTablesCore, columnsDefinition, tableRef);

async function onDataUpdated(response) {
    data.value = response.dataSet;

    const seriesTotalFare = getPieChartSeries(response.dataSet, COMPARATIVE_COLUMN_REPORTS.TOTAL_FARE.value);
    const seriesCommission = getPieChartSeries(response.dataSet, COMPARATIVE_COLUMN_REPORTS.COMMISSION.value);
    const seriesBookings = getPieChartSeries(response.dataSet, COMPARATIVE_COLUMN_REPORTS.BOOKINGS.value);
    const seriesMarkup = getPieChartSeries(response.dataSet, COMPARATIVE_COLUMN_REPORTS.MARKUP.value);

    const drilldownTotalFare = getPieChartDrillDown(response.otherDataSet, COMPARATIVE_COLUMN_REPORTS.TOTAL_FARE.value);
    const drilldownCommission = getPieChartDrillDown(response.otherDataSet, COMPARATIVE_COLUMN_REPORTS.COMMISSION.value);
    const drilldownBookings = getPieChartDrillDown(response.otherDataSet, COMPARATIVE_COLUMN_REPORTS.BOOKINGS.value);
    const drilldownMarkup = getPieChartDrillDown(response.otherDataSet, COMPARATIVE_COLUMN_REPORTS.MARKUP.value);

    createChartCommission({
        series: seriesCommission, titleChart: COMPARATIVE_COLUMN_REPORTS.COMMISSION.label, drilldown: drilldownCommission,
    });
    createChartBookings({
        series: seriesBookings, titleChart: COMPARATIVE_COLUMN_REPORTS.BOOKINGS.label, drilldown: drilldownBookings,
    });
    createChartMarkup({
        series: seriesMarkup, titleChart: COMPARATIVE_COLUMN_REPORTS.MARKUP.label, drilldown: drilldownMarkup,
    });
    createChartTotalFare({
        series: seriesTotalFare, titleChart: COMPARATIVE_COLUMN_REPORTS.TOTAL_FARE.label, drilldown: drilldownTotalFare,
    });

    createTable();
}
</script>

<style>
@import 'datatables.net-dt';
@import 'datatables.net-buttons-dt';
</style>
