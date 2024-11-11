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
import moment from 'moment';
import ReportsSchema from '@/schemas/reports.schema';
import CorporateProvider from '~/providers/corporate.provider';
import { START_DATE } from '~/config/constants';

const emit = defineEmits(['dataUpdated', 'isLoading']);

const {
    isLoading, processResponse, todayDate,
} = useBaseReport({ emit });

const progressBar = ref(0);

const formState = ref({
    startDate: START_DATE,
    endDate: moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD'),
});

onMounted(() => {
    isLoading.value = true;
    handleSubmit({ data: formState.value });
});

function calculateMonthsBetweenDates(initDate, endDate) {
    const start = new Date(initDate);
    const end = new Date(endDate);
    const months = [];

    start.setUTCDate(1);
    end.setUTCDate(1);

    while (start <= end) {
        const year = start.getUTCFullYear();
        const month = start.getUTCMonth() + 1;
        const startDateOfMonth = new Date(year, month - 1, 1);
        const endDateOfMonth = new Date(year, month, 0);
        months.push({
            startDate: startDateOfMonth.toISOString().split('T')[0],
            endDate: endDateOfMonth.toISOString().split('T')[0],
        });
        start.setUTCMonth(start.getUTCMonth() + 1);
    }
    return months;
}

function handleFormSubmit() {
    handleSubmit({ data: formState.value });
}

async function handleSubmit({ data }) {
    try {
        isLoading.value = true;

        const corporateProvider = new CorporateProvider();
        const tableDataSet = await corporateProvider.getAirlineProductionHistory(data);

        const dataKeys = tableDataSet.map((element) => element.vendor_name);

        const reportData = [];

        dataKeys.forEach((element) => {
            reportData.push({ name: element, data: [] });
        });

        const monthsBetweenDate = calculateMonthsBetweenDates(data.startDate, data.endDate);

        const comparativeMonths = monthsBetweenDate.map((month) => ({
            startDate: month.startDate,
            endDate: month.endDate,
        }));

        const dataSet = [];
        const monthsDataSet = [];

        const percentageValue = 100 / comparativeMonths.length;

        // eslint-disable-next-line no-restricted-syntax
        for (const month of comparativeMonths) {
            progressBar.value += percentageValue;

            // eslint-disable-next-line no-await-in-loop
            const responseData = await corporateProvider.getAirlineProductionHistory({ startDate: month.startDate, endDate: month.endDate });

            const yearMonth = month.startDate.substring(0, 7);

            monthsDataSet.push(yearMonth);

            dataSet.push(...responseData);
        }

        progressBar.value = 0;

        // eslint-disable-next-line no-restricted-syntax
        for (const reportElement of reportData) {
            const efectiveElement = dataSet.filter((element) => element.vendor_name === reportElement.name).map((element) => parseFloat(element.total_fare));

            reportElement.data = efectiveElement;
        }

        processResponse({ dataSet });

        emit('dataUpdated', { dataSet: reportData, categories: monthsDataSet, tableData: tableDataSet });
    } catch (error) {
        useUtils().errorHandler(error);
    } finally {
        isLoading.value = false;
    }
}
</script>
