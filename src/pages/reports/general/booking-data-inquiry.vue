<template>
    <h1 class="text-xl">
        Booking Data Inquiry
    </h1>

    <ReportsGeneralDataInquiry
        :type="DATA_INQUIRY_TYPES.booking"
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
                    <td/>
                </tr>
            </tfoot>
        </DataTable>
    </ClientOnly>

</template>

<script setup>
import { DataTable, DataTablesCore } from '~/config/dataTables';
import {
    TABLE_COLUMNS_FORMATS, DATA_TYPES, CHARACTER_NUMBER, DATA_INQUIRY_TYPES,
} from '@/config/constants';

definePageMeta({
    auth: true,
});

const isLoading = ref(false);
const data = ref(null);

const tableRef = ref();

const columnsDefinition = [
    {
        key: 'issue_date',
        displayName: 'Issue Date',
        format: {
            ...DATA_TYPES.SHORT_DATES,
        },
        sumOne: true,
    }, {
        key: 'invoice_number',
        displayName: 'INV',
        searchable: true,
        totalize: true,
    }, {
        key: 'submit_to',
        displayName: 'Submit',
    }, {
        key: 'service_sub_type',
        displayName: 'Type',
    }, {
        key: 'pnr',
        displayName: 'PNR',
    }, {
        key: 'vendor_name',
        displayName: 'Vendor',
        trim: true,
        trimLength: CHARACTER_NUMBER.COL_VENDOR_NAME,
    }, {
        key: 'client_name',
        displayName: 'Client',
        trim: true,
        trimLength: CHARACTER_NUMBER.COL_CLIENT_NAME,
    }, {
        key: 'passenger_name',
        displayName: 'Passenger',
        trim: true,
        trimLength: CHARACTER_NUMBER.COL_PASSENGER_NAME,
    }, {
        key: 'total_fare',
        format: {
            ...TABLE_COLUMNS_FORMATS.SALES_DOLLAR_FORMAT,
        },
        searchable: false,
    }, {
        key: 'commission',
        displayName: 'Commision',
        format: {
            ...TABLE_COLUMNS_FORMATS.SALES_DOLLAR_FORMAT,
        },
    }, {
        key: 'client_status',
        displayName: 'C. Status',
    }, {
        key: 'vendor_status',
        displayName: 'V. Status',
    }, {
        key: 'agent',
        displayName: 'Agent',
        trim: true,
        trimLength: CHARACTER_NUMBER.COL_PASSENGER_NAME,
    }, {
        key: 'business_unit',
        displayName: 'Business Unit',
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
            order: [[1, 'asc'], [0, 'asc']],
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
