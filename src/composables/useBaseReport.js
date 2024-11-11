/* import { defineEmits } from 'vue'; */
import { formatDate } from '@/utils/date';

export const useBaseReport = ({ emit } = {}) => {
    const isLoading = ref(false);
    const baseData = ref(null);
    const todayDate = formatDate(new Date());
    const startDate = getStartDate(3);
    const firstDayMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10);

    watch(isLoading, (newVal) => {
        emit('isLoading', newVal);
    });

    function processResponse({ dataSet }) {
        if (!dataSet) {
            useUtils().showMessage('An error has ocurred during the query', 'error');
            emit('dataUpdated', null);

            return;
        }

        if (dataSet.length === 0) {
            useUtils().showMessage('No data found', 'warning');
            emit('dataUpdated', null);

            return;
        }

        baseData.value = dataSet;
    }

    function getStartDate(monthsBefore) {
        const currentDate = new Date();
        currentDate.setMonth(currentDate.getMonth() - monthsBefore);
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    return {
        baseData,
        firstDayMonth,
        isLoading,
        processResponse,
        startDate,
        todayDate,
    };
};
