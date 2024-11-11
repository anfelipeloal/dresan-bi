export const useNotification = () => {
    function show(message, options) {
        useNuxtApp().$toast(message, options);
    }

    return {
        show,
    };
};
