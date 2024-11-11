<template>
    <div class="shadow bg-gray-50 flex flex-col justify-center items-center rounded" :class="small ? 'h-[90px]' : 'h-[120px]'">
        <p class="text-black" :class="small ? 'text-sm' : 'text-lg'">{{ title }}</p>
        <span class="font-medium" :class="small ? 'text-[20px]' : 'text-[28px]'"><slot/></span>
        <small class="text-center p-2"><slot name="info"/></small>
    </div>
</template>

<script setup>

defineProps({
    title: {
        type: String,
        required: true,
    },
    small: {
        type: Boolean,
        required: false,
        default: false,
    },
});
</script>
