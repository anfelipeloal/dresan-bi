<template>
    <div>
        <span class="text-red-500" v-if="isInvalidForm">{{ invalidMessage }}</span>
        <UForm
            class="flex space-x-4 mt-4"
            :schema="ReportsSchema.startAndEndDate"
            :state="formState"
            @submit="handleFormSubmit"
        >
            <DatePicker class="mb-4" label="Start Date" required v-model="formState.startDate" @handle-submit="handleFormSubmit"/>
            <DatePicker class="mb-4" label="End Date" required v-model="formState.endDate" @handle-submit="handleFormSubmit"/>

            <UFormGroup
                :style="{ width: '40%' }"
                class="mb-1"
                label="Report"
                name="endDate"
            >
                <USelectMenu
                    :loading="loadingSearch"
                    :searchable="search"
                    :debounce="500"
                    placeholder="Search Report..."
                    option-attribute="report_title"
                    trailing
                    by="id"
                    v-model="selected"
                    @change="selectedReportType"
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

            <UFormGroup
                    class="mb-4"
                >
                <UButton
                    class="mt-6 bg-gray-200 text-gray-600 hover:bg-gray-300"
                    @click.prevent="clearFilters"
                >
                    Reset
                </UButton>
            </UFormGroup>

        </UForm>

        <div class="mb-3" v-if="selected">
            <UFormGroup
                v-if="selected.has_filters">
                <p>Filters</p>
                <SearchByFilter
                    class="md:w-1/2 xl:w-1/2"
                    :filters="selected.filters"
                    :reset="resetForm"
                    :multiFilters="selected.allow_multiple_filters"
                    v-model="formState.conditions"/>
            </UFormGroup>
        </div>

        <div class="w-full my-2 flex flex-col justify-center items-center mt-20" v-if="hasData && !loadingSearch && !isLoading">
            <span class="text-gray-500">The report was created successfully</span>
            <button class="bg-indigo-500 border text-white px-8 py-4 rounded mt-6 mb-4 flex justify-center items-center hover:bg-indigo-400" @click.prevent="exportData">
                <UIcon class="mr-1" name="i-ph-download" dynamic />
                Download
            </button>
        </div>

        <ProgressBar :speed="3" v-if="isLoading"/>
    </div>
</template>

<script setup>
import { exportToExcel } from '@/utils/exportToExcel';
import ReportsSchema from '@/schemas/reports.schema';
import GeneralProvider from '~/providers/general.provider';
import { LOADING_MESSAGES } from '~/config/constants';

const emit = defineEmits(['dataUpdated', 'isLoading', 'LoadingMessage']);
const loadingSearch = ref(false);

const selected = ref('');
const hasData = ref(false);

const generalProvider = new GeneralProvider();

const totalColums = ref(0);
const columnsDefinition = ref({});

const titleReport = ref();

const resetForm = ref(false);
const isInvalidForm = ref(false);
const invalidMessage = ref('');

const { $auth } = useNuxtApp();

function exportData() {
    isLoading.value = true;
    emit('LoadingMessage', 'Preparing for export ');
    setTimeout(() => {
        exportToExcel({
            data: baseData.value,
            columnsDefinition: columnsDefinition.value,
            fileName: titleReport.value,
        });
        isLoading.value = false;
    }, 200);
}

async function search(searchable = '') {
    loadingSearch.value = true;

    try {
        // Obtener todos los reportes
        const reportType = await generalProvider.getReportType({ searchable });

        // Obtener los permisos del usuario actual
        const userPermissions = new Set(
            $auth.user.value.roles.flatMap((role) => role.permissions.map((permission) => permission.id)),
        );

        // Filtrar los reportes basados en los permisos del usuario
        const filteredReports = reportType.filter((report) => {
            // Si el reporte no requiere permiso, mostrarlo
            if (!report.permission_id) {
                return true;
            }
            // Si requiere permiso, verificar que el usuario lo tenga
            return userPermissions.has(parseInt(report.permission_id, 10));
        });

        // Procesar solo los reportes filtrados
        processResponse({ dataSet: filteredReports });

        loadingSearch.value = false;
        return filteredReports;
    } catch (error) {
        loadingSearch.value = false;
        useUtils().errorHandler(error);
        return [];
    }
}

function selectedReportType(reportType) {
    formState.value.reportQuery = reportType.id;
    titleReport.value = reportType.report_title;
    hasData.value = false;
    totalColums.value = reportType.labels_and_columns.totalColumns;
    columnsDefinition.value = reportType.labels_and_columns.columnsDefinition;
}

const {
    baseData, isLoading, processResponse, startDate, todayDate,
} = useBaseReport({ emit });

const formState = ref({
    startDate,
    endDate: todayDate,
    conditions: null,
    reportQuery: '',
});

function handleFormSubmit() {
    if (formState.value.startDate === null && formState.value.endDate === null) {
        invalidMessage.value = 'Select a date range!';
        isInvalidForm.value = true;
        return;
    }

    if (formState.value.endDate < formState.value.startDate) {
        invalidMessage.value = 'Select an End Date same of after Start Date!';
        isInvalidForm.value = true;
        return;
    }

    if (selected.value === '') {
        invalidMessage.value = 'Select a report!';
        isInvalidForm.value = true;
        return;
    }

    isInvalidForm.value = false;
    handleSubmit({ data: formState.value });
}

async function handleSubmit({ data }) {
    try {
        hasData.value = false;
        isLoading.value = true;
        baseData.value = null;

        emit('LoadingMessage', LOADING_MESSAGES.requesting_report);

        const dataSet = await generalProvider.execQueryReport(data);

        emit('LoadingMessage', LOADING_MESSAGES.graphing_report);

        processResponse({ dataSet });

        hasData.value = true;
    } catch (error) {
        useUtils().errorHandler(error);
    } finally {
        isLoading.value = false;
    }
}

function clearFilters() {
    invalidMessage.value = '';
    isInvalidForm.value = false;
    formState.value.startDate = null;
    formState.value.endDate = null;
    formState.value.conditions = '';
    resetForm.value = true;
    emit('dataUpdated', null);
    setTimeout(() => {
        resetForm.value = false;
    }, 200);
}

</script>
