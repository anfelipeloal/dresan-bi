<template>
    <button class="bg-gray-200 text-black text-xs p-1 rounded hover:bg-gray-300"
            title="Copiar"
            style="margin-left: 10px"
            @click="copyToClipboard">
      {{ copied ? 'Copiado!' : '' }}
      <span class="i-mdi-content-copy text-black" v-if="!copied"/>
    </button>
</template>

<script setup>
const props = defineProps({
    data: null,
});

const copied = ref(false);

const copyToClipboard = () => {
    const tempInput = document.createElement('input');
    tempInput.value = props.data;
    document.body.appendChild(tempInput);

    tempInput.select();
    tempInput.setSelectionRange(0, 99999);

    document.execCommand('copy');

    document.body.removeChild(tempInput);

    copied.value = true;

    setTimeout(() => {
        copied.value = false;
    }, 2000);
};

</script>
