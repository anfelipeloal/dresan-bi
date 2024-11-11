<template>
    <UForm
        :schema="ReportsSchema.endDate"
        :state="formState"
        @submit="handleSubmit"

    >
        <div class="grid grid-cols-2">
            <h3 class="font-medium text-md text-gray-500">Period A</h3>
            <h3 class="text-end font-medium text-md text-gray-500">Period B</h3>
            <div class="flex space-x-4 my-4">
                <DatePicker class="mb-4" label="Start Date" required v-model="formState.startDateA" @handle-submit="handleFormSubmit"/>
                <DatePicker class="mb-4" label="End Date" required v-model="formState.endDateA" @handle-submit="handleFormSubmit"/>

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
            </div>
            <div class="flex space-x-4 my-4 justify-end">
                <DatePicker class="mb-4" label="Start Date" required v-model="formState.startDateB" @handle-submit="handleFormSubmit"/>
                <DatePicker class="mb-4" label="End Date" required v-model="formState.endDateB" @handle-submit="handleFormSubmit"/>

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
            </div>
        </div>
    </UForm>

</template>

<script setup>
import moment from 'moment';
import ReportsSchema from '@/schemas/reports.schema';
import FinanceProvider from '~/providers/finance.provider';
import { LOADING_MESSAGES } from '~/config/constants';

const emit = defineEmits(['dataUpdated', 'isLoading', 'LoadingMessage']);

const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');

const isLoading = ref(false);
const baseData = ref(null);

const formState = ref({
    startDateA: yesterday,
    endDateA: yesterday,
    startDateB: moment().startOf('month').format('YYYY-MM-DD'),
    endDateB: moment().format('YYYY-MM-DD'),
});

onMounted(() => {
    isLoading.value = true;
    handleSubmit({ data: formState.value });
});

watch(isLoading, (newVal) => {
    emit('isLoading', newVal);
});

function handleFormSubmit() {
    handleSubmit({ data: formState.value });
}

async function handleSubmit({ data }) {
    try {
        isLoading.value = true;
        baseData.value = null;

        const previusDayReportDates = {
            startDate: data.startDateA,
            endDate: data.endDateA,
        };
        const monthReportDates = {
            startDate: data.startDateB,
            endDate: data.endDateB,
        };
        const yearReportDates = {
            startDate: moment().startOf('year').format('YYYY-MM-DD'),
            endDate: moment().format('YYYY-MM-DD'),
        };

        emit('LoadingMessage', LOADING_MESSAGES.requesting_report);

        const financeProvider = new FinanceProvider();

        const dataReport = await financeProvider.getSalesCurrentMonth({ previusDayReportDates, monthReportDates, yearReportDates });

        baseData.value = dataReport;

        emit('LoadingMessage', LOADING_MESSAGES.graphing_report);

        emit('dataUpdated', { tableData: baseData.value, dataQuery: previusDayReportDates });
    } catch (error) {
        useUtils().errorHandler(error);
    } finally {
        isLoading.value = false;
    }
}
</script>
