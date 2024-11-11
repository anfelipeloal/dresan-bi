<template>
    <div>
        <div class="mb-8">
            <div class="flex mb-6">
                <div class="mr-6">
                    Invoice type
                    <span class="px-6 py-1 border rounded-sm bg-gray-100">{{ data[0].inv_type }}</span>
                </div>
                <div class="mr-6">
                    Invoice number
                    <span class="px-6 py-1 border rounded-sm bg-gray-100">{{ data[0].invoice_number }}</span>
                </div>
                <div>
                    Branch
                    <span class="px-6 py-1 border rounded-sm bg-gray-100">{{ data[0].branch }}</span>
                </div>
            </div>
            <div class="flex mb-3">
                <div class="mr-6">
                    Issue date
                    <span class="px-6 py-1 border rounded-sm bg-gray-100">{{ moment(data[0].issue_date).format('MM/DD/YY') }}</span>
                </div>
                <div class="mr-6">
                    Rec loc
                    <span class="px-6 py-1 border rounded-sm bg-gray-100">{{ data[0].pnr }}</span>
                </div>
                <div class="mr-6">
                    Client
                    <span class="px-6 py-1 border rounded-sm bg-gray-100">{{ data[0].client_name }}</span>
                </div>
                <div>
                    Business Unit
                    <span class="px-6 py-1 border rounded-sm bg-gray-100">{{ data[0].business_unit }}</span>
                </div>
            </div>
        </div>
        <hr>
        <h2 class="my-3 font-medium text-xl mb-8">Bookings</h2>
        <DataTable
            class="display compact nowrap"
            :columns="tableColumns"
            :data="data"
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
                    <td/>
                    <td/>
                </tr>
            </tfoot>
        </DataTable>
        <div>
            <UModal prevent-close v-model="drillDownLoading">
                <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
                    <Loader class="my-20"/>
                </UCard>
            </UModal>
            <UModal prevent-close v-if="drillDownData" v-model="isOpen">
                <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
                    <template #header>
                    <div class="flex items-center justify-between">
                        <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                        Agents
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
import moment from 'moment';
import { DataTable, DataTablesCore } from '~/config/dataTables';
import {
    CHARACTER_NUMBER,
    DRILLDOWN_REPORTS,
    TABLE_COLUMNS_FORMATS,
} from '@/config/constants';
import GeneralProvider from '~/providers/general.provider';

defineProps({
    data: {
        type: Object,
        required: true,
    },
});

const isOpen = ref(false);

const generalProvider = new GeneralProvider();

const tableRef = ref();

const columnsDefinition = [
    {
        key: 'submit_to',
        displayName: 'Submit',
    }, {
        key: 'service_sub_type',
        displayName: 'Type',
    }, {
        key: 'vendor_name',
        displayName: 'Vendor',
        trim: true,
        trimLength: 25,
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
        displayName: 'Client Status',
    }, {
        key: 'vendor_status',
        displayName: 'Vendor Status',
    }, {
        key: 'agent',
        displayName: 'Agent',
        trim: true,
        trimLength: 25,
        isDrillDown: true,
        drillDownReport: DRILLDOWN_REPORTS.bookings,
        drillDownFn: generalProvider.getBookingAgents,
    },
];

const {
    createTable,
    tableColumns,
    tableOptions,
    drillDownData,
    drillDownLoading,
} = useTables(DataTablesCore, columnsDefinition, tableRef);

watch(drillDownData, (newVal) => {
    isOpen.value = !!newVal;
});

createTable();

</script>
