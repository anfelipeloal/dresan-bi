<template>
    <h1 class="text-3xl font-medium">
        <span :class="drillDownData ? 'cursor-pointer text-blue-500 border-b' : ''" @click="toggleMainTableVisibility">City Pairs Analysis (Top 100)</span>
        <span>
            {{ drillDownData ? ` / ${drillDownData.data.cityPairClients[0].dept} - ${drillDownData.data.cityPairClients[0].dest}` : ''}}
        </span>
        <span class="text-sm text-gray-400">
            {{ drillDownData ? ` / ${drillDownData.dateRage.startDate} -  ${drillDownData.dateRage.endDate}` : ''}}
        </span>
    </h1><br>
    <hr class="mb-6">

    <ReportsAirlineCityPairsAnalysis class="mt-6"
        v-if="showMainTable"
        @data-updated="onDataUpdated"
        @is-loading="isLoading = $event"
        @loading-message="loadingMessage = $event"
    />

    <AssetBoxLoader
        :message="loadingMessage"
        v-if="isLoading"/>

    <UProgress :value="drillDownProgressBar" v-if="drillDownProgressBar != 0 && drillDownProgressBar < 101" />

    <ClientOnly v-else>
        <DataTable
            class="display compact nowrap"
            :columns="tableColumns"
            :data="data"
            :options="tableOptions"
            ref="tableRef"
            v-if="data && showMainTable"
        >
            <tfoot>
                <tr>
                    <td :key="n" v-for="n in columnsDefinition"/>
                </tr>
            </tfoot>
        </DataTable>
    </ClientOnly>

    <ReportsAirlineCityPairDetail
            :data="drillDownData.data"
            v-if="drillDownData"/>
</template>

<script setup>
import { DRILLDOWN_REPORTS, TABLE_COLUMNS_FORMATS } from '~/config/constants';
import { DataTable, DataTablesCore } from '~/config/dataTables';
import AirlineProvider from '~/providers/airline.provider';

definePageMeta({
    auth: true,
});

const airlineProvider = new AirlineProvider();

const isLoading = ref(false);
const loadingMessage = ref(null);
const data = ref(null);
const conditions = ref(null);

const tableRef = ref();

const showMainTable = ref(true);

const columnsDefinition = [
    {
        key: 'dept',
        displayName: 'Dept',
    },
    {
        key: 'dest',
        displayName: 'Dest',
    },
    {
        key: 'total_fare',
        displayName: 'Total Fare',
        format: {
            ...TABLE_COLUMNS_FORMATS.SALES_DOLLAR_FORMAT,
        },
    },
    {
        key: 'total_commission',
        displayName: 'Total Commission',
        format: {
            ...TABLE_COLUMNS_FORMATS.SALES_DOLLAR_FORMAT,
        },
    },
    {
        key: 'tickets',
        displayName: 'Tickets',
        format: {
            ...TABLE_COLUMNS_FORMATS.NUMBER_FORMAT,
        },
    },
    {
        key: 'avg_ticket',
        displayName: 'AVG Ticket',
        format: {
            ...TABLE_COLUMNS_FORMATS.SALES_DOLLAR_FORMAT,
        },
    },
    {
        key: 'actions',
        displayName: 'Actions',
        render: () => `
            <button class="i-mdi-eye-outline text-gray-400 view-btn"></button>
        `,
        orderable: false,
        searchable: false,
        buttonActions: [
            {
                ref: 'view-btn',
                callBack: airlineProvider.getCityPairsDetail,
                isDrillDown: true,
                drillDownReport: DRILLDOWN_REPORTS.city_pairs,
            },
        ],

    },
];

const {
    createTable,
    tableColumns,
    tableOptions,
    drillDownData,
    drillDownProgressBar,
} = useTables(DataTablesCore, columnsDefinition, tableRef);

async function onDataUpdated(dataSet) {
    if (!dataSet) {
        console.error('dataSet is undefined');
        return;
    }

    data.value = dataSet.cityPairs || [];
    conditions.value = dataSet.conditions || null;

    const percentageOfColumnIndex = columnsDefinition.findIndex((col) => col.key === 'percentage_of');
    if (conditions.value !== null) {
        if (percentageOfColumnIndex === -1) {
            columnsDefinition.push({
                key: 'percentage_of',
                displayName: '% of BTM volume',
                format: {
                    ...TABLE_COLUMNS_FORMATS.PORCENTAGE_FORMAT,
                },
            });
        }
    } else if (percentageOfColumnIndex !== -1) {
        columnsDefinition.splice(percentageOfColumnIndex, 1);
    }

    createTable({
        tableConfigOptions: {
            ordering: true,
            /* order: [[months.slice(0, currentMonth).length, 'desc']], */
            scrollY: '600px',
            scrollCollapse: true,
        },
    });
}

watch(drillDownData, () => {
    showMainTable.value = drillDownData.value == null;
});

function toggleMainTableVisibility() {
    showMainTable.value = true;
    drillDownData.value = null;
}
</script>

<style>
@import 'datatables.net-dt';
@import 'datatables.net-buttons-dt';
</style>
