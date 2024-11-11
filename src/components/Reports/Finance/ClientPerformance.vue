<!-- eslint-disable no-await-in-loop -->
<template>
    <div>
        <UForm
            class="flex space-x-4 my-4"
            :schema="ReportsSchema.startAndEndDate"
            :state="formState"
            @submit="handleFormSubmit"
        >
            <USelectMenu
                class="min-w-44"
                :options="BUSINESS_UNITS"
                value-attribute="id"
                option-attribute="name"
                placeholder="Select business unit"
                v-model="formState.businessUnit"/>

            <UFormGroup
                class="mb-4"
            >
                <UButton
                    type="submit"
                    :loading="isLoading"
                    @click="handleFormSubmit"
                >
                    Submit
                </UButton>
            </UFormGroup>

        </UForm>

        <ProgressBar :speed="10" v-if="isLoading"/>
    </div>
</template>

<script setup>
import ReportsSchema from '@/schemas/reports.schema';
import { BUSINESS_UNITS, LOADING_MESSAGES } from '~/config/constants';
import FinanceProvider from '~/providers/finance.provider';

const formState = ref({
    businessUnit: 0,
});

const emit = defineEmits(['dataUpdated', 'isLoading', 'LoadingMessage']);

const {
    baseData, isLoading, processResponse,
} = useBaseReport({ emit });

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
        const dataSet = await financeProvider.getClientPerformance(data);

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
