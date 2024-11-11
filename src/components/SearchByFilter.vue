<template>
    <div class="w-full border p-2 rounded-md">
        <div class="flex mb-2 border-b border-gray-200 pb-2 w-full" :key="filter.id" v-for="filter in filterBy.filters">
            <USelectMenu
                class="mr-1 w-1/4"
                :options="filters"
                option-attribute="displayName"
                v-model="filter.filter"
                @change="resetFilter(filter)"/>

            <!-- Type text -->
            <UInput
                class="mr-1 w-3/4"
                color="white"
                variant="outline"
                placeholder="Search..."
                v-if="filter.filter.type === SEARCH_BY_FILTER_TYPES.text"
                v-model="filter.searchContent"
                @keydown.enter="handleSubmit"/>

            <!-- Type number -->
            <UInput
                class="mr-1 w-3/4"
                color="white"
                variant="outline"
                placeholder="Search..."
                v-if="filter.filter.type === SEARCH_BY_FILTER_TYPES.number"
                v-model="filter.searchContent"
                @keydown.enter="handleSubmit"
                @keypress="validNumber"/>

            <!-- Type money -->
            <UInput
                class="mr-1 w-3/4"
                color="white"
                variant="outline"
                placeholder="Search..."
                v-if="filter.filter.type === SEARCH_BY_FILTER_TYPES.money"
                v-model="filter.searchContent"
                @keydown.enter="handleSubmit"
                @input="formatPrice"
                @keypress="validNumber"/>

            <!-- Type alphanumeric -->
            <UInput
                class="mr-1 w-3/4"
                color="white"
                variant="outline"
                placeholder="Search..."
                v-if="filter.filter.type === SEARCH_BY_FILTER_TYPES.alphanumeric"
                v-model="filter.searchContent"
                @keydown.enter="handleSubmit"
                @input="setUpperCase"
                @keypress="validAlphaNumeric"/>

            <!-- Type date -->
            <DatePicker
                v-if="filter.filter.type === SEARCH_BY_FILTER_TYPES.date"
                v-model="filter.searchContent"/>

            <!-- Type select -->
            <USelectMenu
                class="mr-1 w-3/4"
                :options="filter.filter.options"
                placeholder="Select option"
                option-attribute="name"
                v-if="filter.filter.type === SEARCH_BY_FILTER_TYPES.select"
                v-model="filter.searchContent"/>

            <!-- Type multiselect -->
            <USelectMenu
                :options="filter.filter.options"
                multiple
                option-attribute="name"
                 placeholder="Select options"
                v-if="filter.filter.type === SEARCH_BY_FILTER_TYPES.multiselect"
                v-model="filter.multipleContent"/>

            <USelectMenu
                :options="travelSubTypes"
                multiple
                option-attribute="name"
                 placeholder="Select options"
                v-if="filter.filter.type === SEARCH_BY_FILTER_TYPES.travelSubTypes"
                v-model="filter.multipleContent"/>

            <span
                class="border border-gray-300 shadow-sm flex justify-center items-center px-2 rounded ml-1 bg-gray-100 text-gray-600"
                :key="index"
                v-for="(option, index) in filter.multipleContent">
                {{ option.name }}
            </span>

            <!-- search client -->
            <USelectMenu
                class="mr-1 w-3/4"
                :loading="loading"
                :searchable="searchClient"
                :debounce="500"
                placeholder="Search for a Client Profile..."
                option-attribute="name"
                trailing
                by="id"
                v-if="filter.filter.type === SEARCH_BY_FILTER_TYPES.client"
                v-model="filter.searchContent"/>

            <!-- search vendor -->
            <USelectMenu
                class="mr-1 w-3/4"
                :loading="loading"
                :searchable="searchVendor"
                :debounce="500"
                placeholder="Search for a Vendor Profile..."
                option-attribute="name"
                trailing
                by="id"
                v-if="filter.filter.type === SEARCH_BY_FILTER_TYPES.vendor"
                v-model="filter.searchContent"/>

            <!-- search agent -->
            <USelectMenu
                class="mr-1 w-3/4"
                :loading="loading"
                :searchable="searchAgent"
                :debounce="500"
                placeholder="Search for a Vendor Profile..."
                option-attribute="name"
                trailing
                by="id"
                v-if="filter.filter.type === SEARCH_BY_FILTER_TYPES.agent"
                v-model="filter.searchContent"/>

            <UButton
                class="ml-1"
                icon="i-mdi-delete-outline"
                size="sm"
                color="gray"
                square
                variant="solid"
                v-if="filterBy.filters.length > 1"
                @click.prevent="removeFilter(filter.id)"
            />
        </div>
        <button class="flex justify-center items-center text-sm" v-if="multiFilters" @click.prevent="addFilter">
            <span class="i-mdi-plus-circle text-blue-500 mr-1"/> Add new condition
        </button>
    </div>
</template>

<script setup>
import { SEARCH_BY_FILTER_TYPES } from '@/config/constants';
import GeneralProvider from '~/providers/general.provider';
import GlobalProvider from '~/providers/global.provider';

const emit = defineEmits(['update:model-value', 'handle-submit']);

const props = defineProps({
    modelValue: {
        type: String,
        default: null,
    },
    filters: {
        type: Array,
        required: true,
        default: null,
    },
    reset: {
        type: Boolean,
        required: false,
        default: false,
    },
    multiFilters: {
        type: Boolean,
        required: false,
        default: false,
    },
});

const travelSubTypes = ref([]);

const loading = ref(false);

const filterBy = ref({
    filters: [{
        id: 1,
        filter: props.filters[0],
        searchContent: '',
        multipleContent: [],
    }],
});

onMounted(() => {
    getTravelSubTypes();
});

async function getTravelSubTypes() {
    try {
        const generalProvider = new GeneralProvider();
        travelSubTypes.value = await generalProvider.getTravelSubTypes();
    } catch (error) {
        useUtils().errorHandler(error);
    }
}

watch(
    () => filterBy.value,
    () => {
        createQuery();
    },
    { deep: true },
);

watch(() => props.reset, (newValue) => {
    if (newValue) {
        filterBy.value.filters = [{
            id: 1,
            filter: props.filters[0],
            searchContent: '',
            multipleContent: [],
        }];
    }
});

let nextId = 1;

const addFilter = () => {
    nextId += 1;
    filterBy.value.filters.push({
        id: nextId,
        filter: props.filters[0],
        searchContent: '',
        multipleContent: [],
    });
    createQuery();
};

const removeFilter = (id) => {
    if (filterBy.value.filters.length > 1) {
        filterBy.value.filters = filterBy.value.filters.filter((item) => item.id !== id);
        createQuery();
    }
};

const resetFilter = (filter) => {
    filter.searchContent = '';
    filter.multipleContent = [];
};

async function searchClient(searchable = '') {
    if (!searchable.trim()) {
        return [];
    }

    loading.value = true;

    const globalProvider = new GlobalProvider();
    const users = await globalProvider.getClients({ searchable });

    loading.value = false;

    return users;
}

async function searchVendor(searchable = '') {
    if (!searchable.trim()) {
        return [];
    }

    loading.value = true;

    const globalProvider = new GlobalProvider();
    const users = await globalProvider.getVendors({ searchable });

    loading.value = false;

    return users;
}

async function searchAgent(searchable = '') {
    if (!searchable.trim()) {
        return [];
    }

    loading.value = true;

    const globalProvider = new GlobalProvider();
    const users = await globalProvider.getAgents({ searchable });

    loading.value = false;

    return users;
}

function validNumber(event) {
    const allowedCharacters = /[0-9.]/;
    const { key } = event;
    if (!allowedCharacters.test(key)) {
        event.preventDefault();
    }
}

function validAlphaNumeric(event) {
    const allowedCharacters = /[0-9a-zA-Z]/;
    const { key } = event;
    if (!allowedCharacters.test(key)) {
        event.preventDefault();
    }
}

function formatPrice(event) {
    const input = event.target;
    let value = input.value.replace(/[^0-9.]/g, '');
    value = value.replace(/(\..*)\./g, '$1');

    const parts = value.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Agrega separadores de miles
    input.value = parts.join('.');
}

function setUpperCase(event) {
    const input = event.target;
    input.value = input.value.toUpperCase();
}

function createQuery() {
    let result = '';
    filterBy.value.filters.forEach((filter) => {
        // Manejo de búsqueda simple
        if (filter.searchContent) {
            const tablePrefix = filter.filter.table ? `${filter.filter.table}.` : '';
            const fieldName = `${tablePrefix}${filter.filter.name}`;
            const value = filter.filter.trackBy
                ? filter.searchContent[filter.filter.trackBy]
                : filter.searchContent;

            if (filter.filter.like) {
                // Mantener el LIKE para búsquedas parciales
                result += ` AND ${fieldName} LIKE '%${value}%'`;
            } else {
                // Usar IN para valores exactos individuales
                result += ` AND ${fieldName} IN('${value}')`;
            }
        }

        // Manejo de múltiples valores
        if (filter.multipleContent.length > 0) {
            const tablePrefix = filter.filter.table ? `${filter.filter.table}.` : '';
            const fieldName = `${tablePrefix}${filter.filter.name}`;

            // Crear array de valores
            const values = filter.multipleContent.map((e) => (filter.filter.trackBy ? e[filter.filter.trackBy] : e));

            // Usar IN para múltiples valores
            result += ` AND ${fieldName} IN('${values.join("','")}')`;
        }
    });

    emit('update:model-value', result);
}

function handleSubmit() {
    emit('handle-submit');
}
</script>
