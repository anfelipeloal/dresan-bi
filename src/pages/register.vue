<template>
    <UContainer
        class="grid place-content-center"
    >
        <UCard
            class="w-[500px]"
        >
            <template #header>
                <h2
                    class="text-xl font-bold"
                >
                    Register
                </h2>
            </template>

            <UForm
                :schema="AuthSchema.authRegisterValidation"
                :state="formState"
                @submit="handleRegister"
            >
                <UFormGroup
                    class="mb-4"
                    label="Name"
                    name="name"
                >
                    <UInput
                        placeholder="John Doe"
                        type="text"
                        v-model="formState.name"
                    />
                </UFormGroup>

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

                <UFormGroup
                    class="mb-4"
                    label="Confirm Password"
                    name="confirmPassword"
                >
                    <UInput
                        placeholder="Confirm Password"
                        type="password"
                        v-model="formState.confirmPassword"
                    />
                </UFormGroup>

                <UButton
                    type="submit"
                    :loading="isLoading"
                >
                    Register
                </UButton>
            </UForm>
        </UCard>
    </UContainer>
</template>

<script setup>
import AuthProvider from '@/providers/auth.provider';
import AuthSchema from '@/schemas/auth.schema';

useHead({
    title: 'Register',
});

const isLoading = ref(false);
const formState = ref({
    name: undefined,
    email: undefined,
    password: undefined,
    confirmPassword: undefined,
});

async function handleRegister({ data }) {
    try {
        isLoading.value = true;

        const authProvider = new AuthProvider();
        await authProvider.register(data);
    } catch (error) {
        useUtils().errorHandler(error);
    } finally {
        isLoading.value = false;
    }
}
</script>
