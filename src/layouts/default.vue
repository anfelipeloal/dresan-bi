<template>
    <Sidebar v-if="$auth.loggedIn.value"/>
    <main :class="$auth.loggedIn.value ? 'p-4 sm:ml-64' : ''">
        <slot/>
    </main>
</template>

<script setup>
useHead({
    titleTemplate: (pageTitle) => (pageTitle ? `${pageTitle} - BI Cloud` : 'BI Cloud'),
});

</script>

<style lang="scss">
@use "~/assets/styles/main.scss";

.title {
    color: var(--primary-color);
}
</style>
