<template>
    <h3 class="text-3xl font-medium mb-5 flex items-center">
        <div class="w-10 mr-2">
            <img src="../../../components/icons/invoice.png" alt="">
        </div>
        Air Sales Analysis {{ currentYear }}
    </h3>
    <hr class="mb-6">

    <h5 class="text-sm mb-1 text-gray-500">Values are displayed in thousands</h5>
    <h5 class="text-sm mb-1 text-gray-500" v-if="conditions">Showing % of total company volume</h5>
    <ReportsAirlineAirSalesAnalysis class="mt-6"
        @data-updated="onDataUpdated"
        @is-loading="isLoading = $event"
        @loading-message="loadingMessage = $event"
    />

    <AssetBoxLoader
        :message="loadingMessage"
        v-if="isLoading"/>

    <ClientOnly v-else>
        <h1 class="text-2xl mb-5 font-medium w-full text-gray-600">Sales</h1>
        <DataTable
            class="display compact nowrap"
            :columns="tableColumns"
            :data="sales"
            :options="tableOptions"
            ref="tableRef"
            v-if="sales"
        >
            <tfoot>
                <tr>
                    <td :key="n" v-for="n in columnsDefinition"/>
                </tr>
            </tfoot>
        </DataTable>
        <hr class="mb-8 mt-2">
        <h1 class="text-2xl mb-5 font-medium w-full text-gray-600">Commissions</h1>
        <DataTable
            class="display compact nowrap"
            :columns="tableCommissionColumns"
            :data="commissions"
            :options="tableCommissionOptions"
            ref="tableCommissionRef"
            v-if="commissions"
        >
            <tfoot>
                <tr>
                    <td :key="n" v-for="n in columnsDefinition"/>
                </tr>
            </tfoot>
        </DataTable>
    </ClientOnly>

</template>

<script setup>
import moment from 'moment';
import { TABLE_COLUMNS_FORMATS } from '~/config/constants';
import { DataTable, DataTablesCore } from '~/config/dataTables';

definePageMeta({
    auth: true,
});

const isLoading = ref(false);
const loadingMessage = ref(null);
const sales = ref(null);
const commissions = ref(null);
const conditions = ref(null);

const currentYear = moment().year();

const tableRef = ref();
const tableCommissionRef = ref();

const currentMonth = new Date().getMonth() + 1;
const lastYear = moment().subtract(1, 'year').year();
const lastMonth = moment().subtract(1, 'month').format('MMM');
const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

const columnsDefinition = [
    {
        key: 'airline',
        displayName: 'Airline',
        trim: true,
        trimLength: 25,
    },
    ...months.slice(0, currentMonth - 1).map((month) => ({
        key: month,
        displayName: moment().month(month).format('MMM'),
        especialTotalize: true,
    })),
    {
        key: 'ytd',
        displayName: `YTD ${currentYear % 100}`,
        especialTotalize: true,
    }, {
        key: 'lastYtd',
        displayName: `YTD ${lastYear % 100}`,
        especialTotalize: true,
    }, {
        key: 'last_ytd_vs_current_ytd',
        displayName: `YTD ${lastYear % 100} vs YTD ${currentYear % 100}`,
        format: {
            ...TABLE_COLUMNS_FORMATS.PORCENTAGE_FORMAT,
        },
        trafficLight: true,
    }, {
        key: 'avg_current_year',
        displayName: `AVG ${currentYear % 100}`,
        displayInThousands: true,
        searchable: true,
    }, {
        key: 'avg_last_year',
        displayName: `AVG ${lastYear % 100}`,
        displayInThousands: true,
        searchable: true,
    }, {
        key: 'last_month_vs_avg',
        displayName: `${lastMonth} vs AVG ${currentYear % 100}`,
        format: {
            ...TABLE_COLUMNS_FORMATS.PORCENTAGE_FORMAT,
        },
        trafficLight: true,
    }, {
        key: 'lm_last_year',
        displayName: `${lastMonth} ${lastYear % 100}`,
        displayInThousands: true,
        searchable: true,
        totalize: true,
    }, {
        key: 'lm_current_year_vs_lm_last_year',
        displayName: `${lastMonth} ${currentYear % 100} vs ${lastMonth} ${lastYear % 100}`,
        format: {
            ...TABLE_COLUMNS_FORMATS.PORCENTAGE_FORMAT,
        },
        trafficLight: true,
    }, {
        key: months[currentMonth - 1],
        displayName: `Current (${moment().month(months[currentMonth - 1]).format('MMM')})`,
        especialTotalize: true,
    }, {
        key: 'month_projection',
        displayName: 'Month Projection',
        displayInThousands: true,
        searchable: true,
        totalize: true,
    },
];

const {
    createTable,
    tableColumns,
    tableOptions,
} = useTables(DataTablesCore, columnsDefinition, tableRef);

const {
    createTable: createCommissionTable,
    tableColumns: tableCommissionColumns,
    tableOptions: tableCommissionOptions,
} = useTables(DataTablesCore, columnsDefinition, tableCommissionRef);

async function onDataUpdated(dataSet) {
    if (!dataSet) {
        console.error('dataSet is undefined');
        return;
    }

    sales.value = dataSet.sales || [];
    commissions.value = dataSet.commissions || [];
    conditions.value = dataSet.conditions || null;

    createTable({
        tableConfigOptions: {
            ordering: true,
            order: [[months.slice(0, currentMonth).length, 'desc']],
            scrollY: '600px',
            scrollCollapse: true,
        },
    });

    createCommissionTable({
        tableConfigOptions: {
            ordering: true,
            order: [[months.slice(0, currentMonth).length, 'desc']],
            scrollY: '600px',
            scrollCollapse: true,
        },
    });
}
</script>

<style>
@import 'datatables.net-dt';
@import 'datatables.net-buttons-dt';
</style>
