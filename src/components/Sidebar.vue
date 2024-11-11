<template>
    <button
        data-drawer-target="sidebar-multi-level-sidebar"
        data-drawer-toggle="sidebar-multi-level-sidebar"
        aria-controls="sidebar-multi-level-sidebar"
        type="button"
        class="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
    >
        <span class="sr-only">Open sidebar</span>
        <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"/>
        </svg>
    </button>

    <aside
        id="sidebar-multi-level-sidebar"
        class="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
    >
        <div
            class="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800"
        >
            <a href="/">
                <img src="/img/logos/original_logo.png" alt="" >
            </a>
            <UVerticalNavigation
                :links="links"
            />
        </div>
    </aside>
</template>

<script setup>
import { REPORTS } from '~/config/reports';
import AuthProvider from '~/providers/auth.provider';

const authProvider = new AuthProvider();

const links = computed(() => {
    const modules = {};
    REPORTS.forEach((item) => {
        if (item.moduleHeader) {
            if (!modules[item.moduleHeader]) {
                modules[item.moduleHeader] = [];
            }
            modules[item.moduleHeader].push(item);
        }
        if (item.module) {
            if (!modules[item.module]) {
                modules[item.module] = [];
            }
            modules[item.module].push(item);
        }
    });

    // Remove headers with no permitted items
    const finalMenu = Object.values(modules).flat().filter((item, index, array) => {
        if (item.moduleHeader) {
            const associatedItems = array.filter((i) => i.module === item.moduleHeader);
            return associatedItems.length > 0;
        }
        return true;
    });

    let loginStatus;

    if (!authProvider.useAuth().loggedIn.value) {
        loginStatus = [{
            label: 'Login',
            icon: 'i-mdi-login',
            to: '/login',
        }];
    } else {
        loginStatus = [{
            label: authProvider.useAuth().session.value.name,
            icon: 'i-mdi-user',
            to: '/user/profile',
        }, {
            label: 'Logout',
            icon: 'i-mdi-logout',
            click: async () => {
                await handleLogout();
            },
        }];
    }

    return [finalMenu, loginStatus];
});

async function handleLogout() {
    try {
        await authProvider.logout();
    } catch (error) {
        useUtils().errorHandler(error);
    }
}
</script>
