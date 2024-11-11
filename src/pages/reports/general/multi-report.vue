<template>
    <h4 class="text-3xl font-medium">
        Report Generator
    </h4>
    <br>
    <hr class="mb-6">

    <ReportsGeneralMultiReportComponent class="mt-10"
        @data-updated="onDataUpdated"
        @is-loading="isLoading = $event"
        @loading-message="loadingMessage = $event"
    />

    <AssetBoxLoader :message="loadingMessage" v-if="isLoading"/>
</template>

<script setup>
definePageMeta({
    auth: true,
});

const isLoading = ref(false);
const loadingMessage = ref(null);
const data = ref(null);

async function onDataUpdated(dataSet) {
    nextTick();
    data.value = dataSet.baseData;
}
</script>

<style>
@import 'datatables.net-dt';
@import 'datatables.net-buttons-dt';
</style>
