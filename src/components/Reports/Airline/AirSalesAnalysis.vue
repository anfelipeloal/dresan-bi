<!-- eslint-disable no-await-in-loop -->
<template>
    <div>
        <UForm
            class="flex space-x-4 my-4"
            :schema="ReportsSchema.startAndEndDate"
            :state="formState"
            @submit="handleFormSubmit"
        >

            <SearchByFilter
                :filters="filterConfig"
                :reset="resetForm"
                v-model="formState.conditions"
                @handle-submit="handleFormSubmit"/>

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

            <UFormGroup
                    class="mb-4"
                >
                <UButton
                    class=" bg-gray-200 text-gray-600 hover:bg-gray-300"
                    @click.prevent="clearFilters"
                >
                    Reset
                </UButton>
            </UFormGroup>

        </UForm>

        <ProgressBar :speed="10" v-if="isLoading"/>
    </div>

</template>

<script setup>
import ReportsSchema from '@/schemas/reports.schema';
import { LOADING_MESSAGES, SEARCH_BY_FILTER_TYPES } from '~/config/constants';
import AirlineProvider from '~/providers/airline.provider';

const formState = ref({
    conditions: '',
});

const resetForm = ref(false);

const emit = defineEmits(['dataUpdated', 'isLoading', 'LoadingMessage']);

const filterConfig = ref([
    {
        name: 'client_id',
        displayName: 'Client',
        type: SEARCH_BY_FILTER_TYPES.client,
        trackBy: 'id',
        table: 'i',
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

        const airlineProvider = new AirlineProvider();
        const dataSet = await airlineProvider.getAirSalesAnalysis(data);

        processResponse({ dataSet });

        emit('LoadingMessage', LOADING_MESSAGES.graphing_report);

        emit('dataUpdated', baseData.value);
    } catch (error) {
        useUtils().errorHandler(error);
    } finally {
        isLoading.value = false;
    }
}

function clearFilters() {
    formState.value.conditions = '';
    resetForm.value = true;
    emit('dataUpdated', null);
    setTimeout(() => {
        resetForm.value = false;
    }, 200);
}
</script>
