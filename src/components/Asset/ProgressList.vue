<template>
    <div class="border p-4 rounded-lg" v-if="data">
        <div class="w-full flex justify-between">
            <h3 class="text-xl font-medium">{{ title }}</h3>
            <h4 class="text-xl font-medium" v-if="totalSales">Total Sales {{ numberFormat((totalSales / 1000).toFixed(0), 0) }}K</h4>
        </div>
        <div class="mt-5">
            <div class="pt-3" :key="index" v-for="(data, index) in shownData">
                <div class="flex justify-between mb-3">
                    <p :title="data.name" class="cursor-pointer">{{ data.name ? trimText(25, data.name) : 'Name not found' }} | <b class="text-sm">{{ data.fare_percentage }}% of total sales</b></p>
                    <p>{{ numberFormat((data.total_fare / 1000).toFixed(0), 0) }}K at {{ calculateMargin(data.commission, data.total_fare) }} margin</p>
                </div>
                <UProgress :value="parseInt(data.fare_percentage, 10)" />
            </div>
        </div>
        <div class="w-full text-left mt-5" v-if="data.length > quantity">
            <button class="text-blue-700 underline" v-if="!allData" @click="showAllDataStatus">Show all</button>
            <button class="text-blue-700 underline" v-else @click="showAllDataStatus">Show less</button>
        </div>
    </div>
</template>

<script setup>
import { calculateMargin, trimText } from '~/utils/globals';
import { numberFormat } from '@/utils/numberFormats';

const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    totalSales: {
        type: Number,
        required: false,
    },
    data: {
        type: Object,
        required: true,
    },
    quantity: {
        type: Number,
        required: false,
        default: 15,
    },
});

const allData = ref(false);
const shownData = computed(() => (allData.value ? props.data : props.data.slice(0, props.quantity)));

const showAllDataStatus = () => {
    allData.value = !allData.value;
};
</script>
