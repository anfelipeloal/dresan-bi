<template>
    <div class="bg-gray-50 rounded-md p-5 border flex flex-col justify-between"> <!-- bg-gradient-to-b from-blue-50 to-white -->
        <div class="flex justify-between">
            <h3 class="text-blue-900">{{ title }}</h3>
            <h3 class="text-blue-900" v-if="avg">AVG</h3>
        </div>
        <div class="flex justify-between">
            <span class="font-medium text-4xl text-black"><slot/></span>
            <span class="font-medium text-4xl text-black"><slot name="avg"/></span>
        </div>
        <div class="text-gray-600 mt-2">
            <slot name="goals"/>
            <!-- <UProgress :value="50" class="mt-2" color="grey"/> -->
        </div>
        <div class="flex justify-between border-t mt-1 pt-1 text-black">
            <div class="mr-4" v-if="prevMTD">
                <small>Prev MTD</small>
                <div class="flex items-center space-x-2">
                    <p>{{ prevAVG ? prevMTD : numberFormat(prevMTD) }}</p>
                    <div class="w-5 h-5 rounded-full flex justify-center items-center" :class="prevMTDPercentage < 0 ? 'bg-red-100' : 'bg-green-100'">
                        <Icon name="i-mdi-arrow-down" size="15" class="text-red-600" v-if="prevMTDPercentage < 0"/>
                        <Icon name="i-mdi-arrow-up" size="15" class="text-green-600" v-else/>
                    </div>
                    <p :class="prevMTDPercentage < 0 ? 'text-red-600' : 'text-green-600'">{{ prevMTDPercentage }}%</p>
                </div>
            </div>
            <div v-if="prevAVG">
                <small>Prev AVG</small>
                <div class="flex items-center space-x-2">
                    <p>{{ prevAVG }}/day</p>
                    <div class="w-5 h-5 rounded-full flex justify-center items-center" :class="prevAVGPercentage < 0 ? 'bg-red-100' : 'bg-green-100'">
                        <Icon name="i-mdi-arrow-down" size="15" class="text-red-600" v-if="prevAVGPercentage < 0"/>
                        <Icon name="i-mdi-arrow-up" size="15" class="text-green-600" v-else/>
                    </div>
                    <p :class="prevAVGPercentage < 0 ? 'text-red-600' : 'text-green-600'">{{ prevAVGPercentage }}%</p>
                </div>
            </div>
        </div>
        <div>
            <slot name="info"/>
        </div>
    </div>
</template>

<script setup>
import { numberFormat } from '@/utils/numberFormats';

defineProps({
    title: {
        type: String,
        required: true,
    },
    avg: {
        type: Boolean,
        required: false,
        default: false,
    },
    prevMTD: {
        type: String,
        required: false,
    },
    prevMTDPercentage: {
        type: String,
        required: false,
    },
    prevAVG: {
        type: Number,
        required: false,
    },
    prevAVGPercentage: {
        type: String,
        required: false,
    },
});
</script>
