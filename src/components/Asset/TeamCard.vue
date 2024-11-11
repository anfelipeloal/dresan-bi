<template>
     <div class="bg-gray-50 rounded-md p-5 border flex flex-col justify-between"> <!-- bg-gradient-to-b from-blue-50 to-white -->
        <b>TEAM</b>
        <div class="flex justify-between">
            <h3 class="text-blue-900">Team Commission MTD</h3>
            <h3 class="text-blue-900">Team Goal</h3>
        </div>
        <div class="flex justify-between">
            <span class="font-medium text-4xl text-black">{{ numberFormat(MTD.commission) }}</span>
            <span class="font-medium text-4xl text-black">{{ numberFormat(AGENTS_TEAM_GOAL) }}</span>
        </div>
        <div class="flex justify-between">
            <p class="text-gray-600 mt-2">My contribution {{ numberFormat(agentComission) }} ({{ contribution }}% of team)</p>
            <p class="text-gray-600 mt-2">{{ numberFormat(parseFloat(AGENTS_TEAM_GOAL) - parseFloat(MTD.commission)) }} to Goal</p>
        </div>
        <div class="flex justify-between border-t mt-1 pt-1 text-black">
            <div class="mr-4">
                <small>Team Commission Prev MTD</small>
                <div class="flex items-center space-x-2">
                    <p>{{ numberFormat(prevMTD.commission) }}</p>
                    <div class="w-5 h-5 rounded-full flex justify-center items-center" :class="prevMTDPercentage < 0  ? 'bg-red-100' : 'bg-green-100'">
                        <Icon name="i-mdi-arrow-down" size="15" class="text-red-600" v-if="prevMTDPercentage < 0"/>
                        <Icon name="i-mdi-arrow-up" size="15" class="text-green-600" v-else/>
                    </div>
                    <p :class="prevMTDPercentage < 0 ? 'text-red-600' : 'text-green-600'">{{ prevMTDPercentage }}%</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { calculateDifferencePercentage } from '~/utils/globals';
import { numberFormat } from '@/utils/numberFormats';
import { AGENTS_TEAM_GOAL } from '~/config/constants';

const props = defineProps({
    team: {
        type: String,
        required: true,
    },
    agentComission: {
        type: Number,
        required: true,
    },
});

const [MTD] = props.team.MTDTeamProductivity;
const [prevMTD] = props.team.prevMonthMTDTeamProductivity;

const prevMTDPercentage = calculateDifferencePercentage(MTD.commission, prevMTD.commission);
const contribution = ((props.agentComission / MTD.commission || 0) * 100).toFixed(2);
</script>
