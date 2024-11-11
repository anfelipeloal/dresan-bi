<template>
    <h4 class="text-3xl font-medium">
        Total Sales (P&L)
    </h4>
    <br>
    <hr class="mb-6">

    <ReportsFinanceTotalSales class="mt-10"
        @data-updated="onDataUpdated"
        @is-loading="isLoading = $event"
        @loading-message="loadingMessage = $event"
    />

    <AssetBoxLoader
        :message="loadingMessage"
        v-if="isLoading"/>

    <ClientOnly v-else>
        <DataTable
            class="display compact nowrap"
            :columns="tableColumns"
            :data="precessedData"
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
                    <td/>
                    <td/>
                </tr>
            </tfoot>
        </DataTable>
    </ClientOnly>
</template>

<script setup>

import { DataTable, DataTablesCore } from '~/config/dataTables';
import { TABLE_COLUMNS_FORMATS, CHARACTER_NUMBER, DATA_TYPES } from '@/config/constants';

definePageMeta({
    auth: true,
});

const isLoading = ref(false);
const loadingMessage = ref(null);
const data = ref(null);

const tableRef = ref();

const columnsDefinition = [
    {
        key: 'pyl_date',
        displayName: 'P&L Date',
        format: {
            ...DATA_TYPES.DATES,
        },
    }, {
        key: 'service_sub_type',
        displayName: 'Travel Sub type',
    }, {
        key: 'invoice_number',
        displayName: 'INV',
        searchable: true,
        totalize: true,
        copyToClipboard: true,
    }, {
        key: 'client_name',
        displayName: 'Client Name',
        copyToClipboard: true,
        trim: true,
        trimLength: CHARACTER_NUMBER.COL_CLIENT_NAME,
    }, {
        key: 'vendor_name',
        displayName: 'Vendor Name',
        copyToClipboard: true,
        trim: true,
        trimLength: CHARACTER_NUMBER.COL_VENDOR_NAME,
    }, {
        key: 'confirm_no',
        displayName: 'Confirmation Number',
    }, {
        key: 'total_fare',
        format: {
            ...TABLE_COLUMNS_FORMATS.SALES_DOLLAR_FORMAT,
        },
        searchable: false,
        totalize: true,
    }, {
        key: 'commission',
        displayName: 'Commision',
        format: {
            ...TABLE_COLUMNS_FORMATS.SALES_DOLLAR_FORMAT,
        },
        totalize: true,
    },
];

const {
    createTable,
    tableColumns,
    tableOptions,
    precessedData,
} = useTables(DataTablesCore, columnsDefinition, tableRef);

async function onDataUpdated(dataSet) {
    data.value = dataSet;

    createTable({
        tableConfigOptions: {
            ordering: true,
            pageLength: 100,
            lengthMenu: [
                [10, 25, 50, 100, 250, 500, 1000],
                [10, 25, 50, 100, 250, 500, 1000],
            ],
            order: [[0, 'desc']],
            scrollY: '600px',
            scrollCollapse: true,
        },
        dataSet,
        serverSideRendering: true,
    });
}
</script>

<style>
@import 'datatables.net-dt';
@import 'datatables.net-buttons-dt';
</style>
