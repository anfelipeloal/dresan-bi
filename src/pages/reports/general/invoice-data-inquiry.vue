<template>
    <h1 class="text-3xl font-medium">
        <span :class="drillDownData ? 'cursor-pointer text-blue-500 border-b' : ''" @click="toggleMainTableVisibility">Invoice Data Inquiry</span>
        <span>
            {{ drillDownData ? ` / ${drillDownData[0].invoice_number}` : ''}}
        </span>
    </h1><br>
    <hr class="mb-6">

    <ReportsGeneralDataInquiry
        :type="DATA_INQUIRY_TYPES.invoice"
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
            :data="precessedData"
            :options="tableOptions"
            ref="tableRef"
            v-if="invoices && showMainTable"
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

        <ReportsGeneralBookingDataInquiryTable
            :data="drillDownData"
            v-if="drillDownData"/>
    </ClientOnly>

</template>

<script setup>
import { DataTable, DataTablesCore } from '~/config/dataTables';
import {
    DATA_INQUIRY_TYPES, DATA_TYPES, DRILLDOWN_REPORTS, TABLE_COLUMNS_FORMATS,
} from '@/config/constants';
import GeneralProvider from '~/providers/general.provider';

definePageMeta({
    auth: true,
});

const isLoading = ref(false);
const invoices = ref(null);

const tableRef = ref();

const generalProvider = new GeneralProvider();

const showMainTable = ref(true);

const COMMON_DRILL_DOWN = {
    isDrillDown: true,
    drillDownReport: DRILLDOWN_REPORTS.booking_data_inquiry,
    drillDownFn: generalProvider.getBookingsByInvoice,
};

const columnsDefinition = [
    {
        key: 'issue_date',
        displayName: 'Issue Date',
        format: {
            ...DATA_TYPES.SHORT_DATES,
        },
        ...COMMON_DRILL_DOWN,
    }, {
        key: 'invoice_number',
        displayName: 'INV',
        searchable: true,
        totalize: true,
        ...COMMON_DRILL_DOWN,
    }, {
        key: 'pnr',
        displayName: 'PNR',
        ...COMMON_DRILL_DOWN,
    }, {
        key: 'inv_type',
        displayName: 'Type',
        ...COMMON_DRILL_DOWN,
    }, {
        key: 'passenger',
        displayName: 'Passanger',
        trim: true,
        trimLength: 15,
        ...COMMON_DRILL_DOWN,
    }, {
        key: 'client_name',
        displayName: 'Client',
        ...COMMON_DRILL_DOWN,
    }, {
        key: 'agent',
        displayName: 'Agent',
        trim: true,
        trimLength: 25,
        ...COMMON_DRILL_DOWN,
    }, {
        key: 'booking_count',
        displayName: 'Bookings',
        format: {
            ...TABLE_COLUMNS_FORMATS.NUMBER_FORMAT,
        },
        ...COMMON_DRILL_DOWN,
    }, {
        key: 'inv_total',
        displayName: 'Total Invoice',
        format: {
            ...TABLE_COLUMNS_FORMATS.SALES_DOLLAR_FORMAT,
        },
        ...COMMON_DRILL_DOWN,
    },
];

const {
    createTable,
    tableColumns,
    tableOptions,
    precessedData,
    drillDownData,
    drillDownProgressBar,
} = useTables(DataTablesCore, columnsDefinition, tableRef);

async function onDataUpdated(dataSet) {
    invoices.value = dataSet;

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
