<template>
    <div>
        <h2>{{ `${props.error.statusCode} - ${props.error.statusMessage}` }}</h2>
        Path: {{ props.error.data?.path || route.path }}
        <br>
        <br>
        Message: {{ props.error.message }}
        <br>
        <br>
        Stack: {{ props.error.stack }}
        <br>
        <br>
        <button @click="handleError">Clear errors</button>
    </div>
</template>

<script setup>
const props = defineProps({
    error: Object,
});

const route = useRoute();

const redirectPath = (!props.error.data || route.path === props.error.data.path) ? '/' : route.path;

function handleError() {
    clearError({ redirect: redirectPath });
}
</script>
