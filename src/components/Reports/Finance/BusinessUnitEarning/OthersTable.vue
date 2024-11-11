<template>
    <div>
        <UProgress :value="drillDownProgressBar" v-if="drillDownProgressBar != 0 && drillDownProgressBar < 101" />
        <DataTable
            class="display compact nowrap"
            :columns="tableColumns"
            :data="data"
            :options="tableOptions"
            ref="tableRef"
            v-else
        >
            <tfoot>
                <tr>
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
    DRILLDOWN_REPORTS, TABLE_COLUMNS_FORMATS,
} from '@/config/constants';
import FinanceProvider from '~/providers/finance.provider';

const emit = defineEmits(['drillDownDataUpdated']);

const props = defineProps({
    data: {
        type: Object,
        required: true,
    },
    dataQuery: {
        type: Object,
        required: true,
    },
});

const financeProvider = new FinanceProvider();

const tableRef = ref();

const columnsDefinition = [
    {
        key: 'service_sub_type',
        displayName: 'Business Unit',
        isDrillDown: true,
        drillDownReport: DRILLDOWN_REPORTS.business_earnings_and_cost,
        drillDownFn: financeProvider.getBusinessUnitEarningsAndCostDetailed,
    }, {
        key: 'corporate',
        displayName: 'Corporate',
        format: {
            ...TABLE_COLUMNS_FORMATS.SALES_DOLLAR_FORMAT,
        },
        totalize: true,
    }, {
        key: 'ic_unit',
        displayName: 'IC Unit',
        format: {
            ...TABLE_COLUMNS_FORMATS.SALES_DOLLAR_FORMAT,
        },
        searchable: true,
        totalize: true,
    }, {
        key: 'leisure',
        displayName: 'Leisure',
        format: {
            ...TABLE_COLUMNS_FORMATS.SALES_DOLLAR_FORMAT,
        },
        searchable: false,
        totalize: true,
    }, {
        key: 'consolidator',
        displayName: 'Consolidator',
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
    drillDownData,
    drillDownProgressBar,
} = useTables(DataTablesCore, columnsDefinition, tableRef);

watch(drillDownData, () => {
    emit('drillDownDataUpdated', drillDownData.value);
});

createTable({
    dataQuery: props.dataQuery,
});

</script>
