<template>
    <UForm
        class="flex space-x-4 my-4"
        :schema="ReportsSchema.startAndEndDate"
        :state="formState"
        @submit="handleSubmit"
    >

        <div>
            <span class="font-medium text-sm">Start Year</span>
            <USelectMenu
                label="Start Year"
                :options="startYearOptions"
                placeholder="Select a year"
                v-model="startYear"
                @update:model-value="updateEndYear"/>
        </div>

        <div>
            <span class="font-medium text-sm">End Year</span>
            <USelectMenu
                label="Start Year"
                :options="endYearOptions"
                placeholder="Select a year"
                v-model="endYear"
                @update:model-value="updateStartYear"/>
        </div>

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
import moment from 'moment';
import ReportsSchema from '@/schemas/reports.schema';
import GlobalProvider from '~/providers/global.provider';
import { LOADING_MESSAGES } from '~/config/constants';

const props = defineProps({
    profileId: {
        type: String,
        default: null,
    },
    profileType: {
        type: Number,
        default: 1,
    },
});

const startYear = ref(2023);
const endYear = ref(2024);

const years = computed(() => {
    const currentYear = moment().year();
    return Array.from({ length: currentYear - 2018 + 1 }, (_, index) => 2018 + index);
});

const startYearOptions = computed(() => (endYear.value
    ? years.value.filter((year) => year < endYear.value)
    : years.value));

const endYearOptions = computed(() => (startYear.value
    ? years.value.filter((year) => year > startYear.value)
    : years.value));

function updateEndYear(newStartYear) {
    if (endYear.value && newStartYear >= endYear.value) {
        endYear.value = null;
    }
}

function updateStartYear(newEndYear) {
    if (startYear.value && newEndYear <= startYear.value) {
        startYear.value = newEndYear - 1;
    }
}

const emit = defineEmits(['dataUpdated', 'isLoading', 'LoadingMessage']);

const {
    baseData, isLoading, processResponse, todayDate,
} = useBaseReport({ emit });

const formState = ref({
    startDate: '01/01/2023',
    endDate: todayDate,
    profileId: props.profileId,
    profileType: props.profileType,
});

watch([startYear, endYear], ([newStartYear, newEndYear]) => {
    formState.value.startDate = `${newStartYear}-01-01`;
    const isCurrentYear = newEndYear === moment().year();
    formState.value.endDate = isCurrentYear
        ? todayDate
        : `${newEndYear}-12-31`;
}, { immediate: true });

onMounted(() => {
    isLoading.value = true;
    handleSubmit({ data: formState.value });
});

async function handleSubmit({ data }) {
    try {
        isLoading.value = true;
        baseData.value = null;
        emit('LoadingMessage', LOADING_MESSAGES.requesting_report);

        const globalProvider = new GlobalProvider();
        const dataSet = await globalProvider.get360ProductivityHistory(data);

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
