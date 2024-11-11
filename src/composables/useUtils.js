import { useNotification } from './useNotification';

export const useUtils = () => {
    const { show } = useNotification();

    function errorHandler(error) {
        console.error(error);
        const message = error?.data?.message || error?.message || error;
        showMessage(message, 'error');
    }

    function showMessage(message, type = 'info') {
        show(message, {
            type,
        });
    }

    function formatDBColumn(value) {
        // Capitalize the first letter
        const capitalizedStr = value.charAt(0).toUpperCase() + value.slice(1);

        // Replace underscores with spaces
        return capitalizedStr.replace(/_/g, ' ');
    }

    return {
        errorHandler,
        formatDBColumn,
        showMessage,
    };
};
