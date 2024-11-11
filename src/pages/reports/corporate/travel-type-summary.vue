<template>
    <h1 class="text-xl">
        Sales Activity by Travel Type Summary
    </h1>

    <ReportsCorporateTravelTypeSummaryForm
        @data-updated="onDataUpdated"
        @is-loading="isLoading = $event"
    />

    <Loader
        class="mt-40"
        v-if="isLoading"
    />

    <ClientOnly v-else>
        <highcharts
            :options="chartOptions"
            :constructor-type="'chart'"
            v-if="isChartView && data"
        />

        <DataTable
            class="display compact nowrap"
            :columns="tableColumns"
            :data="data"
            :options="tableOptions"
            ref="tableRef"
            v-if="!isChartView && data"
        >
            <tfoot>
                <tr>
                    <td/>
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
import { DISPLAY_AS } from '@/config/constants';
import { DataTable, DataTablesCore } from '@/config/dataTables';

definePageMeta({
    auth: true,
});

let dataSetKeys = [];

const isChartView = ref(true);
const isLoading = ref(false);
const data = ref(null);

const {
    chartOptions,
    createChart,
} = useChartBar();

const tableRef = ref();
const numericColumns = [1, 2, 3, 4, 5, 6];

const {
    createTable,
    tableColumns,
    tableOptions,
} = useTables(DataTablesCore, numericColumns, tableRef);

async function onDataUpdated(dataSet, displayAs) {
    isChartView.value = displayAs !== DISPLAY_AS.TABLE.value;
    dataSetKeys = Object.keys(dataSet[0]);
    data.value = dataSet;

    if (isChartView.value) {
        createChart(dataSet, displayAs, dataSetKeys);
    } else {
        createTable(dataSetKeys);
    }
}
</script>

<style>
@import 'datatables.net-dt';
@import 'datatables.net-buttons-dt';
</style>
