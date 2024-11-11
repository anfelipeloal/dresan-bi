<template>
    <div>
        <DataTable
            class="display compact nowrap"
            :columns="tableColumns"
            :data="precessedData"
            :options="tableOptions"
            ref="tableRef"
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
    </div>
</template>

<script setup>
import { DataTable, DataTablesCore } from '~/config/dataTables';
import {
    DATA_TYPES,
    TABLE_COLUMNS_FORMATS,
} from '@/config/constants';

const props = defineProps({
    data: {
        type: Object,
        required: true,
    },
});

const tableRef = ref();

const columnsDefinition = [
    {
        key: 'date',
        displayName: 'Date',
        format: {
            ...DATA_TYPES.DATES,
        },
    }, {
        key: 'inv',
        displayName: 'INV',
        copyToClipboard: true,
    }, {
        key: 'vendor_name',
        displayName: 'Vendor',
        trim: true,
        trimLength: 20,
    }, {
        key: 'client_name',
        displayName: 'Client',
        trim: true,
        trimLength: 20,
    }, {
        key: 'passenger_name',
        displayName: 'Passenger',
        trim: true,
        trimLength: 20,
    }, {
        key: 'total_fare',
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
    },
];

const {
    createTable,
    tableColumns,
    tableOptions,
    precessedData,
} = useTables(DataTablesCore, columnsDefinition, tableRef);

createTable({
    tableConfigOptions: {
        ordering: true,
        pageLength: 100,
        lengthMenu: [
            [10, 25, 50, 100, 250, 500, 1000],
            [10, 25, 50, 100, 250, 500, 1000],
        ],
        order: [[0, 'desc']],
    },
    dataSet: props.data,
    serverSideRendering: true,
});

</script>
