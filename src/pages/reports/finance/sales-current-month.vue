<template>
    <h1 class="text-3xl font-medium">
        <span :class="drillDownData ? 'cursor-pointer text-blue-500 border-b' : ''" @click="toggleMainTableVisibility">Sales Current Month</span> {{ drillDownData ? `/ ${drillDownData[0].service_sub_type}` : ''}}
    </h1>
    <hr class="mb-6">

    <ReportsFinanceSalesCurrentMonth
        @data-updated="onDataUpdated"
        @is-loading="isLoading = $event"
        @loading-message="loadingMessage = $event"
    />

    <AssetBoxLoader
        :message="loadingMessage"
        v-if="isLoading"/>

    <UProgress :value="drillDownProgressBar" v-if="drillDownProgressBar != 0 && drillDownProgressBar < 101" />

    <ClientOnly v-else>

        <h1 class="text-xl font-medium mb-6 w-full text-gray-600">Sales Result</h1>
        <DataTable
            class="display compact nowrap"
            :columns="mainTableColumns"
            :data="data"
            :options="mainTableOptions"
            ref="tableRef"
            v-if="data && showMainTable"
        >
            <thead>
                <tr>
                    <th/>
                    <th colspan="2" style="text-align: center; background-color: #e2edff;">Period A</th>
                    <th colspan="3" style="text-align: center; background-color: #e6e2ff;">Period B</th>
                    <th colspan="3" style="text-align: center; background-color: #ffecd3;">YTD {{ currentYear }}</th>
                </tr>
                <tr>
                    <th/>
                    <th/>
                    <th/>
                    <th/>
                    <th/>
                    <th/>
                    <th/>
                    <th/>
                    <th/>
                </tr>
            </thead>
            <tfoot>
                <tr>
                    <td/>
                    <td/>
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

        <h1 class="text-xl font-medium mb-6 w-full text-gray-600 mt-5">Commission Result</h1>
        <DataTable
            class="display compact nowrap"
            :columns="commissionTableColumns"
            :data="data"
            :options="commissionTableOptions"
            ref="commissionTableRef"
            v-if="data && showMainTable"
        >
            <thead>
                <tr>
                    <th/>
                    <th colspan="2" style="text-align: center; background-color: #e2edff;">Period A</th>
                    <th colspan="3" style="text-align: center; background-color: #e6e2ff;">Period B</th>
                    <th colspan="3" style="text-align: center; background-color: #ffecd3;">YTD {{ currentYear }}</th>
                </tr>
                <tr>
                    <th/>
                    <th/>
                    <th/>
                    <th/>
                    <th/>
                    <th/>
                    <th/>
                    <th/>
                    <th/>
                </tr>
            </thead>
            <tfoot>
                <tr>
                    <td/>
                    <td/>
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

        <span class="" v-if="!drillDownData && !showMainTable">No details found!</span>

        <ReportsFinanceCurrentMonthDetailedTable
            :data="drillDownData"
            v-if="drillDownData && !showMainTable"/>
    </ClientOnly>
</template>

<script setup>
import moment from 'moment';
import {
    DRILLDOWN_REPORTS, TABLE_COLUMNS_FORMATS, TABLES_FORMATS,
} from '@/config/constants';
import { DataTable, DataTablesCore } from '~/config/dataTables';
import FinanceProvider from '~/providers/finance.provider';

definePageMeta({
    auth: true,
});

const currentYear = moment().year();

const isLoading = ref(false);
const loadingMessage = ref(null);
const data = ref(null);
const financeProvider = new FinanceProvider();

const tableRef = ref();
const commissionTableRef = ref();
const dataQuery = ref();

const showMainTable = ref(true);

const columnsDefinition = [
    {
        key: 'service_sub_type',
        displayName: '',
        isDrillDown: true,
        drillDownReport: DRILLDOWN_REPORTS.current_sales_report,
        drillDownFn: financeProvider.getSalesCurrentMonthDetailed,
    }, {
        key: 'total_fare_dtd',
        displayName: 'Sales',
        format: {
            ...TABLE_COLUMNS_FORMATS.SALES_DOLLAR_FORMAT,
        },
        totalize: true,
    }, {
        key: 'total_sales_dtd_percentage',
        displayName: '% of',
        format: {
            ...TABLE_COLUMNS_FORMATS.PORCENTAGE_FORMAT,
        },
        searchable: false,
        totalize: true,
    }, {
        key: 'total_fare_mtd',
        displayName: 'Sales',
        format: {
            ...TABLE_COLUMNS_FORMATS.SALES_DOLLAR_FORMAT,
        },
        totalize: true,
    }, {
        key: 'sales_budget_mtd',
        displayName: 'Budget',
        format: {
            ...TABLE_COLUMNS_FORMATS.SALES_DOLLAR_FORMAT,
        },
        searchable: true,
        totalize: true,
    }, {
        key: 'total_sales_mtd_percentage',
        displayName: '',
        format: {
            ...TABLE_COLUMNS_FORMATS.PORCENTAGE_FORMAT,
        },
        totalize: true,
    }, {
        key: 'total_fare_ytd',
        displayName: 'Sales',
        format: {
            ...TABLE_COLUMNS_FORMATS.SALES_DOLLAR_FORMAT,
        },
        searchable: true,
        totalize: true,
    }, {
        key: 'sales_budget_ytd',
        displayName: 'Budget',
        format: {
            ...TABLE_COLUMNS_FORMATS.SALES_DOLLAR_FORMAT,
        },
        searchable: true,
        totalize: true,
    }, {
        key: 'total_sales_ytd_percentage',
        displayName: '',
        format: {
            ...TABLE_COLUMNS_FORMATS.PORCENTAGE_FORMAT,
        },
        totalize: true,
    },
];

const commissionColumnsDefinition = [
    {
        key: 'service_sub_type',
        displayName: '',
        isDrillDown: true,
        drillDownReport: DRILLDOWN_REPORTS.current_sales_report,
        drillDownFn: financeProvider.getSalesCurrentMonthDetailed,
    }, {
        key: 'total_commission_dtd',
        displayName: 'Commission',
        format: {
            ...TABLE_COLUMNS_FORMATS.SALES_DOLLAR_FORMAT,
        },
        totalize: true,
    }, {
        key: 'total_commission_dtd_percentage',
        displayName: '% of',
        format: {
            ...TABLE_COLUMNS_FORMATS.PORCENTAGE_FORMAT,
        },
        searchable: false,
        totalize: true,
    }, {
        key: 'total_commission_mtd',
        displayName: 'Commission',
        format: {
            ...TABLE_COLUMNS_FORMATS.SALES_DOLLAR_FORMAT,
        },
        totalize: true,
    }, {
        key: 'commission_budget_mtd',
        displayName: 'Budget',
        format: {
            ...TABLE_COLUMNS_FORMATS.SALES_DOLLAR_FORMAT,
        },
        searchable: true,
        totalize: true,
    }, {
        key: 'total_commission_mtd_percentage',
        displayName: '',
        format: {
            ...TABLE_COLUMNS_FORMATS.PORCENTAGE_FORMAT,
        },
        totalize: true,
    }, {
        key: 'total_commission_ytd',
        displayName: 'Commission',
        format: {
            ...TABLE_COLUMNS_FORMATS.SALES_DOLLAR_FORMAT,
        },
        searchable: true,
        totalize: true,
    }, {
        key: 'commission_budget_ytd',
        displayName: 'Budget',
        format: {
            ...TABLE_COLUMNS_FORMATS.SALES_DOLLAR_FORMAT,
        },
        searchable: true,
        totalize: true,
    }, {
        key: 'total_commission_ytd_percentage',
        displayName: '',
        format: {
            ...TABLE_COLUMNS_FORMATS.PORCENTAGE_FORMAT,
        },
        totalize: true,
    },
];

const {
    createTable: createMainTable,
    tableColumns: mainTableColumns,
    tableOptions: mainTableOptions,
    drillDownData,
    drillDownProgressBar,
} = useTables(DataTablesCore, columnsDefinition, tableRef);

const {
    createTable: createCommissionTable,
    tableColumns: commissionTableColumns,
    tableOptions: commissionTableOptions,
} = useTables(DataTablesCore, commissionColumnsDefinition, commissionTableRef);

watch(drillDownData, () => {
    showMainTable.value = drillDownData.value == null;
});

async function onDataUpdated(response) {
    drillDownData.value = null;

    dataQuery.value = response.dataQuery;

    data.value = response.tableData;

    createMainTable({
        dataQuery: dataQuery.value,
        tableConfigOptions: TABLES_FORMATS.CONCRETE,
    });

    createCommissionTable({
        dataQuery: dataQuery.value,
        tableConfigOptions: TABLES_FORMATS.CONCRETE,
    });
}

function toggleMainTableVisibility() {
    showMainTable.value = true;
    drillDownData.value = null;
}
</script>

<style>
@import 'datatables.net-dt';
@import 'datatables.net-buttons-dt';
</style>
