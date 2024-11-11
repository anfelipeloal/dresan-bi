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

    </UForm>
</template>

<script setup>
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
        const dataSet = await corporateProvider.getAirlineProduction(data);

        processResponse({ dataSet });

        emit('dataUpdated', { tableData: baseData.value, dataQuery: data });
    } catch (error) {
        useUtils().errorHandler(error);
    } finally {
        isLoading.value = false;
    }
}
</script>
