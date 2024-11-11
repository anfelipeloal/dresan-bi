<template>
    <UProgress :value="progress" />
</template>

<script setup>
import { onBeforeUnmount } from 'vue';

// Props
const props = defineProps({
    speed: {
        type: Number,
        default: 2,
    },
});

// State
const progress = ref(0);
const intervalId = ref();

// Methods
function startCounter() {
    intervalId.value = setInterval(() => {
        if (progress.value < 98) {
            progress.value += props.speed;
        } else {
            clearInterval(intervalId.value);
        }
    }, 500);
}

onMounted(() => {
    startCounter();
});

onBeforeUnmount(() => {
    progress.value = 100;
    if (intervalId.value) {
        clearInterval(intervalId.value);
    }
});
</script>
