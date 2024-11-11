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
        const dataSet = await corporateProvider.getTravelType(data);

        dataSet.sort((a, b) => {
            const order = {
                Air: 0,
                Hotel: 1,
                Car: 2,
                'Service Fee': 3,
                Others: 4,
            };

            return order[a.service_type] - order[b.service_type];
        });

        const dataOthers = data;

        const travelTypes = dataSet.map((test) => test.service_type);

        dataOthers.primaryTravelTypes = travelTypes.join(',');

        const otherDataSet = await corporateProvider.getTravelTypeOther(dataOthers);

        processResponse({ dataSet });

        emit('dataUpdated', { dataSet: baseData.value, otherDataSet });
    } catch (error) {
        useUtils().errorHandler(error);
    } finally {
        isLoading.value = false;
    }
}
</script>
