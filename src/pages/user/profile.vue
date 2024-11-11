<template>
    <h1>User Profile Page</h1>
    <br>
    <p>Session Id:  {{ authData.id }}</p>
    <p>User Id:  {{ authData.data.id }}</p>
    <p>User Name:  {{ authData.data.name }}</p>
    <p>User Email:  {{ authData.data.email }}</p>
</template>

<script setup>

definePageMeta({
    auth: true,
});

const data = await useFetch('/api/user/profile');
const authData = data.data.value.auth;
</script>
