<template>
    <UForm
        class="flex space-x-4 my-4"
        :schema="ReportsSchema.startAndEndDate"
        :state="formState"
        @submit="handleSubmit"
    >
        <UFormGroup
            class="mb-4"
            label="Start Date"
            name="startDate"
        >
            <UInput
                type="date"
                v-model="formState.startDate"
            />
        </UFormGroup>

        <UFormGroup
            class="mb-4"
            label="End Date"
            name="endDate"
        >
            <UInput
                type="date"
                :max="todayDate"
                v-model="formState.endDate"
            />
        </UFormGroup>

        <UFormGroup
            class="mb-4"
            label="Display as"
            name="displayAs"
        >
             <USelect
                option-attribute="name"
                :options="displayAsOptions"
                v-model="displayAs"
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
import { DISPLAY_AS, START_DATE } from '@/config/constants';
import ReportsSchema from '@/schemas/reports.schema';
import { formatDate } from '@/utils/date';
import CorporateProvider from '~/providers/corporate.provider';

const emit = defineEmits(['dataUpdated', 'isLoading']);

const todayDate = formatDate(new Date());
const displayAsOptions = [
    DISPLAY_AS.BAR_CHART, DISPLAY_AS.COLUMN_CHART, DISPLAY_AS.TABLE,
];

const isLoading = ref(false);
const displayAs = ref('bar');
const baseData = ref(null);

const formState = ref({
    startDate: START_DATE,
    endDate: todayDate,
});

onMounted(() => {
    isLoading.value = true;
    handleSubmit({ data: formState.value });
});

watch(displayAs, (newVal) => {
    if (!baseData.value) {
        return;
    }

    emit('dataUpdated', baseData.value, newVal);
});

watch(isLoading, (newVal) => {
    emit('isLoading', newVal);
});

async function handleSubmit({ data }) {
    try {
        isLoading.value = true;
        baseData.value = null;

        const corporateProvider = new CorporateProvider();
        const dataSet = await corporateProvider.getTravelTypeSumary(data);

        if (!dataSet) {
            useUtils().showMessage('An error has ocurred during the query', 'error');
            emit('dataUpdated', null);

            return;
        }

        if (dataSet.length === 0) {
            useUtils().showMessage('No data found', 'warning');
            emit('dataUpdated', null);

            return;
        }

        baseData.value = dataSet;

        emit('dataUpdated', baseData.value, displayAs.value);
    } catch (error) {
        useUtils().errorHandler(error);
    } finally {
        isLoading.value = false;
    }
}
</script>
