<template>
    <UContainer
        class="grid place-content-center"
    >
        <UCard
            class="w-[500px] mt-[250px]"
        >
            <template #header>
                <h2
                    class="text-xl font-bold"
                >
                    Login
                </h2>
            </template>

            <UForm
                :schema="AuthSchema.authLoginValidation"
                :state="formState"
                @submit="handleLogin"
            >
                <UFormGroup
                    class="mb-4"
                    label="Email"
                    name="email"
                >
                    <UInput
                        placeholder="john@email.com"
                        type="email"
                        v-model="formState.email"
                    />
                </UFormGroup>

                <UFormGroup
                    class="mb-4"
                    label="Password"
                    name="password"
                >
                    <UInput
                        placeholder="Password"
                        type="password"
                        v-model="formState.password"
                    />
                </UFormGroup>

                <UButton
                    type="submit"
                    :loading="isLoading"
                >
                    Login
                </UButton>
            </UForm>
        </UCard>
    </UContainer>
</template>

<script setup>
import AuthProvider from '@/providers/auth.provider';
import AuthSchema from '@/schemas/auth.schema';

definePageMeta({
    guest: true,
});

useHead({
    title: 'Login',
});

const isLoading = ref(false);
const formState = ref({
    email: undefined,
    password: undefined,
});

async function handleLogin({ data }) {
    try {
        isLoading.value = true;

        const authProvider = new AuthProvider();
        await authProvider.login(data);
    } catch (error) {
        useUtils().errorHandler(error);
    } finally {
        isLoading.value = false;
    }
}
</script>
