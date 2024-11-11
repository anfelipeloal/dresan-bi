<template>
    <div>
        <div class="flex items-end justify-between">
            <UFormGroup
                class="mr-1 w-full"
                :label="label"
                name="date"
            >
                <UInput
                    type="text"
                    :class="{'border-red-a': isInvalid}"
                    v-model="formattedDate"
                    placeholder="MM/DD/AA"
                    @keydown.enter="handleSubmit"
                    @blur="updateDate"
                    @keypress="validateKeypress"
                /> <!-- @keydown.enter="updateDate" TODO: se quita por conflicto con el submit -->
            </UFormGroup>
            <UPopover :popper="{ placement: 'bottom-start' }">
                <UButton icon="i-heroicons-calendar-days-20-solid" tabindex="-1"/>

                <template #panel="{ close }">
                    <BaseDatePicker
                        is-required
                        v-model="date"
                        :max-date="max"
                        @close="close"
                    />
                </template>
            </UPopover>
        </div>
        <span class="text-red-500" v-if="isInvalid">{{ invalidMessage }}</span>
    </div>
</template>

<script setup lang="ts">
import { FORMAT_DATE } from '@/config/constants';
import { format, parse, isValid } from 'date-fns';
import moment from 'moment';

const emit = defineEmits(['update:model-value', 'handle-submit']);

const props = defineProps({
    modelValue: {
        type: String,
        default: null,
    },
    label: {
        type: String,
        default: '',
    },
    max: {
        type: String,
    },
    required: {
        type: Boolean,
        default: false,
    }
});

const date = ref(props.modelValue ? moment(props.modelValue).toDate() : null);
const formattedDate = ref(props.modelValue ? format(date.value, FORMAT_DATE.american_format) : '');
const isInvalid = ref(false);
const invalidMessage = ref('Invalid date');

watch(date, (newDate) => {
    if (newDate) {
        formattedDate.value = format(new Date(newDate), FORMAT_DATE.american_format);
        emit('update:model-value', moment(formattedDate.value).format(FORMAT_DATE.iso_format));
    } else {
        formattedDate.value = '';
        emit('update:model-value', null);
    }
});

watch(() => props.modelValue, (newValue) => {
    if (newValue) {
        date.value = moment(newValue).toDate();
    } else {
        date.value = null;
    }
});

function updateDate() {
    let inputDate = formattedDate.value.trim();
    isInvalid.value = false;

    if (!inputDate) {
        if (props.required) {
            isInvalid.value = true;
            invalidMessage.value = `${props.label} is required`;
        } else {
            date.value = null;
            emit('update:model-value', null);
        }
        return;
    }

    inputDate = inputDate.replace(/[.,-]/g, '/');

    // Check if year has 2 digits, convert it to a valid year
    if (/^\d{1,2}\/\d{1,2}\/\d{2}$/.test(inputDate)) {
        const currentYear = new Date().getFullYear();
        const inputYear = parseInt(inputDate.split('/')[2], 10);
        if (inputYear >= 0 && inputYear <= 99) {
            const currentCentury = Math.floor(currentYear / 100) * 100;
            const fullYear = currentCentury + inputYear;
            inputDate = inputDate.replace(/\d{2}$/, fullYear.toString());
        }
    }

    // Handle various input formats
    if (/^\d{1,2}$/.test(inputDate)) {
        // If only month is provided
        const currentYear = new Date().getFullYear();
        inputDate = `${inputDate}/01/${currentYear}`;
    } else if (/^\d{1,2}\/\d{1,2}$/.test(inputDate)) {
        // If format is like "mm/dd"
        const currentYear = new Date().getFullYear();
        inputDate = `${inputDate}/${currentYear}`;
    }

    // Parse the date and set the value
    const parsedDate = parse(inputDate, FORMAT_DATE.american_format, new Date());

    if (isValid(parsedDate)) {
        date.value = parsedDate;
        if (props.max) {
            if (date.value > moment(props.max).toDate()) {
                isInvalid.value = true;
                if (moment().isSame(moment(props.max), 'day')) {
                    invalidMessage.value = `${props.label} should be less or equal than today's date`;
                } else {
                    invalidMessage.value =  `${props.label} should be less or equal than ${moment(props.max).format(FORMAT_DATE.american_format)}`;
                }

            }
        }
    } else {
        isInvalid.value = true;
        invalidMessage.value = 'Invalid date';
    }
}

function validateKeypress(event: KeyboardEvent) {
    const allowedCharacters = /[0-9.,\/-]/;
    const key = event.key;
    if (!allowedCharacters.test(key)) {
        event.preventDefault();
    }
}

function handleSubmit() {
    emit('handle-submit');
}
</script>

<style scoped>
.border-red-a {
    border: 1px solid red;
    border-radius: 6px;
}
</style>
