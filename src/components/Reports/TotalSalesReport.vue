<!-- eslint-disable no-await-in-loop -->
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

    <UProgress :value="progressBar" v-if="isLoading" />

</template>

<script setup>
import ReportsSchema from '@/schemas/reports.schema';
import { formatDate } from '@/utils/date';
import CorporateProvider from '~/providers/corporate.provider';

const emit = defineEmits(['dataUpdated', 'isLoading']);

const {
    baseData, isLoading, processResponse, startDate, todayDate,
} = useBaseReport({ emit });

const progressBar = ref(0);

const formState = ref({
    startDate,
    endDate: todayDate,
});

onMounted(() => {
    isLoading.value = true;
    handleSubmit({ data: formState.value });
});

function calculateMonthsBetweenDates(initialDate, endDate) {
    const start = new Date(initialDate);
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

// Función para obtener los meses del año inmediatamente anterior
function getUTCMonthsPreviousYear(months) {
    return months.map((month) => {
        const startDate2 = new Date(month.startDate);
        const endDate = new Date(month.endDate);
        startDate2.setFullYear(startDate2.getUTCFullYear() - 1);
        endDate.setFullYear(endDate.getUTCFullYear() - 1);
        return {
            startDate: startDate2.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
        };
    });
}

function getFirstOrLastDay(isYear = false, isCurrentYear = true) {
    const currentDate = new Date();
    const year = isCurrentYear ? currentDate.getUTCFullYear() : currentDate.getUTCFullYear() - 1;

    if (isYear) {
        return new Date(year, 0, 1);
    }

    const firstDayOfCurrentMonth = new Date(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), 1);
    const lastDayOfPreviousMonth = new Date(year, firstDayOfCurrentMonth.getUTCMonth(), 0);
    return lastDayOfPreviousMonth;
}

async function handleSubmit({ data }) {
    try {
        isLoading.value = true;
        baseData.value = null;

        const corporateProvider = new CorporateProvider();
        // Obtener la fecha del primer día del año actual
        const startDateCurrentYear = formatDate(getFirstOrLastDay(true, true));
        const endDatePreviousMonthCurrentYear = formatDate(getFirstOrLastDay(false, true));

        const startDatePreviousYear = formatDate(getFirstOrLastDay(true, false));
        const endDatePreviousMonthPreviousYear = formatDate(getFirstOrLastDay(false, false));

        const tableDataSet = [];

        const currentYearData = await corporateProvider.getTotalFare({ startDate: startDateCurrentYear, endDate: endDatePreviousMonthCurrentYear });
        const lastYearData = await corporateProvider.getTotalFare({ startDate: startDatePreviousYear, endDate: endDatePreviousMonthPreviousYear });

        tableDataSet.push(...currentYearData);
        tableDataSet.push(...lastYearData);

        const monthsBetweenDate = calculateMonthsBetweenDates(data.startDate, data.endDate);
        const monthsPreviousYear = getUTCMonthsPreviousYear(monthsBetweenDate);

        const comparativeMonths = monthsBetweenDate.map((month, index) => ({
            startDate: month.startDate,
            endDate: month.endDate,
            startDatePreviousYear: monthsPreviousYear[index].startDate,
            endDatePreviousYear: monthsPreviousYear[index].endDate,
        }));

        const dataSet = [];

        const percentageValue = 100 / comparativeMonths.length;

        // eslint-disable-next-line no-restricted-syntax
        for (const month of comparativeMonths) {
            progressBar.value += percentageValue;

            // eslint-disable-next-line no-await-in-loop
            const monthData = await corporateProvider.getTotalFare({ startDate: month.startDate, endDate: month.endDate });

            // Obtener el año y mes de startDate y formatearlo como "yyyy-mm"
            const yearMonth = month.startDate.substring(0, 7);

            monthData.index = yearMonth;

            dataSet.push(monthData);
        }

        progressBar.value = 0;

        processResponse({ dataSet });

        emit('dataUpdated', { dataSet: baseData.value, tableData: tableDataSet });
    } catch (error) {
        useUtils().errorHandler(error);
    } finally {
        isLoading.value = false;
    }
}
</script>
