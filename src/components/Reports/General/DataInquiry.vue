<template>
    <div class="mt-6">
        <span class="text-red-500" v-if="isInvalidForm">{{ invalidMessage }}</span>
        <UForm
            class="flex space-x-4 mb-4"
            :schema="ReportsSchema.startAndEndDate"
            :state="formState"
            @submit="handleFormSubmit"
        >
            <SearchByFilter class="mt-6" :filters="filterConfig" :reset="resetForm" multiFilters v-model="formState.conditions" @handle-submit="handleFormSubmit"/>
            <DatePicker class="mb-4" label="Start Date" v-model="formState.startDate" @handle-submit="handleFormSubmit"/>
            <DatePicker class="mb-4" label="End Date" v-model="formState.endDate" @handle-submit="handleFormSubmit"/>

            <UFormGroup
                class="mb-4"
            >
                <UButton
                    class="mt-6"
                    type="submit"
                    :loading="isLoading"
                    @click="handleFormSubmit"
                >
                    Submit
                </UButton>
            </UFormGroup>

            <UFormGroup
                class="mb-4"
            >
                <UButton
                    class="mt-6 bg-gray-200 text-gray-600 hover:bg-gray-300"
                    @click.prevent="clearFilters"
                >
                    Reset
                </UButton>
            </UFormGroup>

        </UForm>
    </div>
</template>

<script setup>
import ReportsSchema from '@/schemas/reports.schema';
import GeneralProvider from '@/providers/general.provider';
import { DATA_INQUIRY_TYPES, LOADING_MESSAGES, SEARCH_BY_FILTER_TYPES } from '@/config/constants';

const props = defineProps({
    type: {
        type: Number,
        required: true,
    },
});

const filterConfig = ref([
    {
        name: 'number',
        displayName: 'INV',
        type: SEARCH_BY_FILTER_TYPES.number,
        table: 'i',
    },
    {
        name: 'record_locator',
        displayName: 'PNR',
        type: SEARCH_BY_FILTER_TYPES.alphanumeric,
        table: 'i',
    },
    {
        name: 'confirm_no',
        displayName: 'Confirmation Number',
        type: SEARCH_BY_FILTER_TYPES.alphanumeric,
        table: 'b',
    },
    {
        name: 'starting_ticket_no',
        displayName: 'Ticket Number',
        type: SEARCH_BY_FILTER_TYPES.number,
        table: 'b',
        like: true,
    },
    {
        name: 'name',
        displayName: 'Submit to',
        type: SEARCH_BY_FILTER_TYPES.multiselect,
        table: 'st',
        trackBy: 'name',
        options: [
            { id: 1, name: 'ARC' },
            { id: 2, name: 'CommTrack' },
            { id: 3, name: 'Supplier' },
            { id: 4, name: 'Voucher' },
        ],
    },
    {
        name: 'action_id',
        displayName: 'Agent action',
        type: SEARCH_BY_FILTER_TYPES.select,
        table: 'bai',
        trackBy: 'id',
        options: [
            { id: 1, name: 'Booking' },
            { id: 2, name: 'Ticketing' },
            { id: 3, name: 'Not assigned agent action' },
        ],
    },
    {
        name: 'name',
        displayName: 'Travel sub type',
        type: SEARCH_BY_FILTER_TYPES.travelSubTypes,
        table: 'sst',
        trackBy: 'name',
    },
    {
        name: 'name',
        displayName: 'Client',
        type: SEARCH_BY_FILTER_TYPES.client,
        trackBy: 'name',
        table: 'c',
    },
    {
        name: 'name',
        displayName: 'Vendor',
        type: SEARCH_BY_FILTER_TYPES.vendor,
        trackBy: 'name',
        table: 'v',
    },
    {
        name: 'name',
        displayName: 'Agent',
        type: SEARCH_BY_FILTER_TYPES.agent,
        trackBy: 'name',
        table: 'abp',
    },
    {
        name: 'passenger_name',
        displayName: 'Passenger',
        type: SEARCH_BY_FILTER_TYPES.text,
        table: 'b',
        like: true,
    },
    {
        name: 'name',
        displayName: 'Client Status',
        type: SEARCH_BY_FILTER_TYPES.multiselect,
        table: 'cps',
        trackBy: 'name',
        options: [
            { id: 1, name: 'Closed' },
            { id: 2, name: 'N/A' },
            { id: 3, name: 'Open' },
            { id: 4, name: 'Voided' },
        ],
    },
    {
        name: 'name',
        displayName: 'Vendor Status',
        type: SEARCH_BY_FILTER_TYPES.multiselect,
        table: 'vps',
        trackBy: 'name',
        options: [
            { id: 1, name: 'Closed' },
            { id: 2, name: 'N/A' },
            { id: 3, name: 'Open' },
            { id: 4, name: 'Voided' },
        ],
    },
    {
        name: 'name',
        displayName: 'Business Unit',
        type: SEARCH_BY_FILTER_TYPES.multiselect,
        table: 'bu',
        trackBy: 'name',
        options: [
            { id: 1, name: 'CORPORATE' },
            { id: 2, name: 'CONSOLIDATOR' },
            { id: 3, name: 'IC UNIT' },
            { id: 4, name: 'LEISURE' },
        ],
    },
]);

const emit = defineEmits(['dataUpdated', 'isLoading', 'LoadingMessage']);

const {
    baseData, isLoading, processResponse,
} = useBaseReport({ emit });

const formState = ref({
    startDate: null,
    endDate: null,
    conditions: '',
});

const resetForm = ref(false);
const isInvalidForm = ref(false);
const invalidMessage = ref('');

watch(() => formState.value.startDate, (newStartDate) => {
    if (newStartDate && (!formState.value.endDate || formState.value.endDate === '')) {
        formState.value.endDate = newStartDate;
    }
});

async function handleSubmit({ data }) {
    try {
        isLoading.value = true;
        baseData.value = null;

        emit('dataUpdated', baseData.value);

        emit('LoadingMessage', LOADING_MESSAGES.requesting_report);

        const generalProvider = new GeneralProvider();
        const dataSet = props.type === DATA_INQUIRY_TYPES.booking ? await generalProvider.getBookings(data) : await generalProvider.getInvoices(data);

        emit('LoadingMessage', LOADING_MESSAGES.graphing_report);

        processResponse({ dataSet });

        emit('dataUpdated', baseData.value);
    } catch (error) {
        useUtils().errorHandler(error);
    } finally {
        isLoading.value = false;
    }
}

function handleFormSubmit() {
    if (formState.value.startDate === null && formState.value.endDate === null && formState.value.conditions === '') {
        invalidMessage.value = 'Select at least one filter!';
        isInvalidForm.value = true;
        return;
    }

    if (formState.value.endDate < formState.value.startDate) {
        invalidMessage.value = 'Select an End Date same of after Start Date!';
        isInvalidForm.value = true;
        return;
    }

    if (!(formState.value.conditions.includes('i.number') || formState.value.conditions.includes('i.record_locator')) && formState.value.startDate === null) {
        invalidMessage.value = 'Select a date range';
        isInvalidForm.value = true;
        return;
    }

    if (!(formState.value.conditions.includes('i.number') || formState.value.conditions.includes('i.record_locator'))
        && (formState.value.startDate != null || formState.value.startDate !== '')
        && (formState.value.endDate == null || formState.value.endDate === '')) {
        invalidMessage.value = 'Select an End Date!';
        isInvalidForm.value = true;
        return;
    }

    isInvalidForm.value = false;
    handleSubmit({ data: formState.value });
}

function clearFilters() {
    invalidMessage.value = '';
    isInvalidForm.value = false;
    formState.value.startDate = null;
    formState.value.endDate = null;
    formState.value.conditions = '';
    resetForm.value = true;
    emit('dataUpdated', null);
    setTimeout(() => {
        resetForm.value = false;
    }, 200);
}

</script>
