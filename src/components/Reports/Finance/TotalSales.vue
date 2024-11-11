<!-- eslint-disable no-await-in-loop -->
<template>
    <UForm
        class="flex space-x-4 my-4"
        :schema="ReportsSchema.startAndEndDate"
        :state="formState"
        @submit="handleSubmit"
    >

        <DatePicker class="mb-4" label="Start Date" required v-model="formState.startDate" @handle-submit="handleFormSubmit"/>
        <DatePicker class="mb-4" label="End Date" required v-model="formState.endDate" @handle-submit="handleFormSubmit"/>

        <UFormGroup
            class="mb-4"
        >
            <UButton
                class="mt-6"
                type="submit"
                :loading="isLoading"
            >
                Submit
            </UButton>
        </UFormGroup>
    </UForm>
</template>

<script setup>
import ReportsSchema from '@/schemas/reports.schema';
import { LOADING_MESSAGES } from '~/config/constants';
import FinanceProvider from '~/providers/finance.provider';

const emit = defineEmits(['dataUpdated', 'isLoading', 'LoadingMessage']);

const {
    baseData, firstDayMonth, isLoading, processResponse, todayDate,
} = useBaseReport({ emit });

const formState = ref({
    startDate: firstDayMonth,
    endDate: todayDate,
});

onMounted(() => {
    isLoading.value = true;
    handleSubmit({ data: formState.value });
});

function handleFormSubmit() {
    handleSubmit({ data: formState.value });
}

async function handleSubmit({ data }) {
    try {
        isLoading.value = true;
        baseData.value = null;

        emit('LoadingMessage', LOADING_MESSAGES.requesting_report);

        const financeProvider = new FinanceProvider();
        const dataSet = await financeProvider.getTtoalSales(data);

        processResponse({ dataSet });

        emit('LoadingMessage', LOADING_MESSAGES.graphing_report);

        emit('dataUpdated', baseData.value);
    } catch (error) {
        useUtils().errorHandler(error);
    } finally {
        isLoading.value = false;
    }
}
</script>
