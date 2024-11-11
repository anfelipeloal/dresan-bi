<template>
    <h1 class="text-xl">
        Airline Production History
    </h1>
    <ReportsCorporateAirlineProductionHistory
        :column-report="'total_fare'"
        @data-updated="onDataUpdated"
        @is-loading="isLoading = $event"
    />

    <Loader
        class="mt-40"
        v-if="isLoading"
    />

    <ClientOnly v-else>
        <highcharts
                :options="lineChartOptions"
                :constructor-type="'chart'"
                v-if="data"
        />

        <highcharts
            :options="barChartOptions"
            :constructor-type="'chart'"
            v-if="data"
        />

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
import { TABLE_COLUMNS_FORMATS, COMPARATIVE_COLUMN_REPORTS } from '@/config/constants';
import { DataTable, DataTablesCore } from '~/config/dataTables';
import { legendFormatterNumber } from '../../../utils/charts/legendsFormatters';

definePageMeta({
    auth: true,
});

const isLoading = ref(false);
const data = ref(null);

const {
    chartOptions: barChartOptions,
    createChart: createChartMarkup,
} = useChartBar({
    legendFormatter: legendFormatterNumber({
        decimals: 2,
        dollarSign: true,
    }),
});

const {
    chartOptions: lineChartOptions,
    createChart: createLineChart,
} = useChartLine({
    legendFormatter: legendFormatterNumber({
        decimals: 2,
        dollarSign: true,
    }),
});

const tableRef = ref();

const columnsDefinition = [
    {
        key: 'vendor_name',
        displayName: 'Vendor',
    }, {
        key: 'bookings',
        displayName: 'Bookings',
        format: {
            ...TABLE_COLUMNS_FORMATS.NUMBER_FORMAT,
        },
        totalize: false,
    }, {
        key: 'total_fare',
        format: {
            ...TABLE_COLUMNS_FORMATS.SALES_DOLLAR_FORMAT,
        },
        searchable: false,
        totalize: false,
    }, {
        key: 'base',
        format: {
            ...TABLE_COLUMNS_FORMATS.SALES_DOLLAR_FORMAT,
        },
        searchable: false,
        totalize: false,
    }, {
        key: 'commission',
        format: {
            ...TABLE_COLUMNS_FORMATS.SALES_DOLLAR_FORMAT,
        },
        searchable: false,
        totalize: false,
    }, {
        key: 'markup',
        format: {
            ...TABLE_COLUMNS_FORMATS.SALES_DOLLAR_FORMAT,
        },
        searchable: false,
        totalize: false,
    },
];

const {
    createTable,
    tableColumns,
    tableOptions,
} = useTables(DataTablesCore, columnsDefinition, tableRef);

async function onDataUpdated(response) {
    const yTitleChart = 'Values in USD';
    const titleChart = `Airline Production - (${COMPARATIVE_COLUMN_REPORTS.TOTAL_FARE.label})`;

    createLineChart({
        xAxisCategories: response.categories, series: response.dataSet, yAxisTitle: yTitleChart, titleChart,
    });

    createChartMarkup({
        xAxisCategories: response.categories, series: response.dataSet, yAxisTitle: yTitleChart, titleChart,
    });

    data.value = response.tableData;

    createTable();
}
</script>

<style>
@import 'datatables.net-dt';
@import 'datatables.net-buttons-dt';
</style>
