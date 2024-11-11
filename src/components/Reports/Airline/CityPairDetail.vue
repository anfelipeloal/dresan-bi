<template>
    <div>
        <div>
            <h4 class="text-xl font-medium w-full text-gray-600 mb-3">Airlines</h4>
            <DataTable
                class="display compact nowrap"
                :columns="tableAirlinesColumns"
                :data="data.cityPairAirlines"
                :options="tableAirlinesOptions"
                ref="tableAirlinesRef"
                v-if="data.cityPairAirlines"
            >
                <tfoot>
                    <tr>
                        <td :key="n" v-for="n in columnsDefinitionAirline"/>
                    </tr>
                </tfoot>
            </DataTable>
        </div>
        <div>
            <hr class="my-2">
            <h4 class="text-xl font-medium w-full text-gray-600 mb-3">Clients</h4>
            <DataTable
                class="display compact nowrap"
                :columns="tableColumns"
                :data="data.cityPairClients"
                :options="tableOptions"
                ref="tableRef"
                v-if="data.cityPairClients"
            >
                <tfoot>
                    <tr>
                        <td :key="n" v-for="n in columnsDefinition"/>
                    </tr>
                </tfoot>
            </DataTable>
        </div>
        <div>
            <UModal prevent-close v-model="drillDownLoading">
                <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
                    <Loader class="my-20"/>
                </UCard>
            </UModal>
            <UModal prevent-close class="max-w-4xl w-11/12 mx-auto" v-if="drillDownData" v-model="isOpen">
                <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
                    <template #header>
                    <div class="flex items-center justify-between">
                        <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                        Client Airlines
                        </h3>
                        <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="drillDownData = null" />
                    </div>
                    </template>

                    <div>
                        <UTable :rows="drillDownData"/>
                    </div>
                </UCard>
            </UModal>
        </div>
    </div>
</template>

<script setup>
import { DataTable, DataTablesCore } from '~/config/dataTables';
import {
    DRILLDOWN_REPORTS,
    TABLE_COLUMNS_FORMATS,
} from '@/config/constants';
import AirlineProvider from '~/providers/airline.provider';

defineProps({
    data: {
        type: Object,
        required: true,
    },
});
const airlineProvider = new AirlineProvider();

const tableRef = ref();
const tableAirlinesRef = ref();

const isOpen = ref(false);

const sameColumnDefinition = [
    {
        key: 'total_fare',
        displayName: 'Total Fare',
        format: {
            ...TABLE_COLUMNS_FORMATS.SALES_DOLLAR_FORMAT,
        },
        totalize: true,
    },
    {
        key: 'total_commission',
        displayName: 'Total Commission',
        format: {
            ...TABLE_COLUMNS_FORMATS.SALES_DOLLAR_FORMAT,
        },
        totalize: true,
    },
    {
        key: 'tickets',
        displayName: 'Tickets',
        format: {
            ...TABLE_COLUMNS_FORMATS.NUMBER_FORMAT,
        },
        totalize: true,
    }, {
        key: 'percentage_of',
        displayName: '% of',
        format: {
            ...TABLE_COLUMNS_FORMATS.PORCENTAGE_FORMAT,
        },
        totalize: true,
    },
];

const columnsDefinition = [
    {
        key: 'profile_name',
        displayName: 'Client',
    },
    ...sameColumnDefinition,
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
                callBack: airlineProvider.getCityPairsClientAirlines,
                isDrillDown: true,
                drillDownReport: DRILLDOWN_REPORTS.city_pairs_client_airlines,
            },
        ],

    },
];

const columnsDefinitionAirline = [
    {
        key: 'profile_name',
        displayName: 'Airline',
    },
    ...sameColumnDefinition,
];

const {
    createTable,
    tableColumns,
    tableOptions,
    drillDownData,
    drillDownLoading,
} = useTables(DataTablesCore, columnsDefinition, tableRef);

const {
    createTable: createAirlinesTable,
    tableColumns: tableAirlinesColumns,
    tableOptions: tableAirlinesOptions,
} = useTables(DataTablesCore, columnsDefinitionAirline, tableAirlinesRef);

createTable({
    tableConfigOptions: {
        ordering: true,
        paging: false,
        buttons: [{
            text: 'Export',
            extend: 'excel',
            split: ['excel'],
            className: 'focus:outline-none disabled:cursor-not-allowed disabled:opacity-75 flex-shrink-0 font-medium rounded-md text-sm gap-x-1.5 px-2.5 py-1.5 shadow-sm text-white dark:text-gray-900 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-500 dark:bg-primary-400 dark:hover:bg-primary-500 dark:disabled:bg-primary-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 dark:focus-visible:outline-primary-400 inline-flex items-center',
        }],
        lengthChange: false,
        order: [[1, 'desc']],
    },
});
createAirlinesTable({
    tableConfigOptions: {
        ordering: true,
        paging: false,
        buttons: [{
            text: 'Export',
            extend: 'excel',
            split: ['excel'],
            className: 'focus:outline-none disabled:cursor-not-allowed disabled:opacity-75 flex-shrink-0 font-medium rounded-md text-sm gap-x-1.5 px-2.5 py-1.5 shadow-sm text-white dark:text-gray-900 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-500 dark:bg-primary-400 dark:hover:bg-primary-500 dark:disabled:bg-primary-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 dark:focus-visible:outline-primary-400 inline-flex items-center',
        }],
        lengthChange: false,
        order: [[1, 'desc']],
    },
});

watch(drillDownData, (newVal) => {
    isOpen.value = !!newVal;
});

</script>
