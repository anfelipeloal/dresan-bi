<template>
    <div class="w-full h-[80vh] flex flex-col justify-center items-center">
       <h1 class="text-gray-200 font-bold text-[140px]">403</h1>
       <h3 class="text-[#7585ff] font-medium text-4xl">We are Sorry...</h3>
       <p class="text-center mt-4">the page you're trying to access has restricted access.<br>Please refer to your system administrator</p>
    </div>
</template>

<script setup>

definePageMeta({
    auth: true,
});

</script>
