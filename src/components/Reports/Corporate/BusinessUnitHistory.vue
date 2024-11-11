<template>
    <UForm
        class="flex space-x-4 my-4"
        :schema="ReportsSchema.startAndEndDate"
        :state="formState"
        @submit="handleSubmit"
    >
        <DatePicker class="mb-4" label="Start Date" required v-model="formState.startDate" @handle-submit="handleFormSubmit"/>
        <DatePicker class="mb-4" label="End Date" :max="todayDate" required v-model="formState.endDate" @handle-submit="handleFormSubmit"/>

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

        <button class="bg-gray-100 border text-black px-4 rounded mt-6 mb-4 flex justify-center items-center hover:bg-gray-200" v-if="baseData" @click="exportData">
            <UIcon class="mr-1" name="i-ph-download" dynamic />
            Export .xlsx
        </button>

    </UForm>
</template>

<script setup>
import { exportToExcel } from '@/utils/exportToExcel';
import ReportsSchema from '@/schemas/reports.schema';
import CorporateProvider from '~/providers/corporate.provider';

const emit = defineEmits(['dataUpdated', 'isLoading']);

const {
    baseData, isLoading, processResponse, startDate, todayDate,
} = useBaseReport({ emit });

const formState = ref({
    startDate,
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

        const corporateProvider = new CorporateProvider();
        const dataSet = await corporateProvider.getSalesByBusinessUnitHistory(data);

        processResponse({ dataSet });

        emit('dataUpdated', baseData.value);
    } catch (error) {
        useUtils().errorHandler(error);
    } finally {
        isLoading.value = false;
    }
}

function exportData() {
    exportToExcel(baseData.value, 'Business unit history');
}
</script>
