import { eventHandler, getQuery } from '#imports';
import FinanceController from '~/server/controllers/finance.controller';

export default eventHandler(async (event) => {
    const { startDate, endDate } = getQuery(event);
    const financeController = new FinanceController();
    const result = await financeController.getTotalSales({
        startDate,
        endDate,
    });
    return result;
});
