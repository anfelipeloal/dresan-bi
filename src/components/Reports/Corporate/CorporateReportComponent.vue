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
            :style="{ width: '40%' }"
            class="mb-1"
            label="Client"
            name="endDate"
        >
            <USelectMenu
                :loading="loading"
                :searchable="search"
                :debounce="500"
                placeholder="Search for a Client Profile..."
                option-attribute="name"
                trailing
                by="id"
                v-model="selected"
                @change="selectedClient"
            />
        </UFormGroup>

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
import GlobalProvider from '~/providers/global.provider';

const loading = ref(false);
const selected = ref();

async function search(searchable = '') {
    if (!searchable.trim()) {
        return [];
    }

    loading.value = true;

    const globalProvider = new GlobalProvider();
    const users = await globalProvider.getClients({ searchable });

    loading.value = false;

    return users;
}

function selectedClient(client) {
    formState.value.clientId = client.id;
}

const emit = defineEmits(['dataUpdated', 'isLoading']);

const {
    baseData, isLoading, processResponse, startDate, todayDate,
} = useBaseReport({ emit });

const formState = ref({
    startDate,
    endDate: todayDate,
    clientId: '',
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

        const corporateProvider = new CorporateProvider();
        const dataSet = await corporateProvider.getTravelSummaryReport(data);

        processResponse({ dataSet });

        emit('dataUpdated', baseData.value);
    } catch (error) {
        useUtils().errorHandler(error);
    } finally {
        isLoading.value = false;
    }
}
</script>
