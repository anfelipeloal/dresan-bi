import { eventHandler, getQuery } from '#imports';
import FinanceController from '~/server/controllers/finance.controller';

export default eventHandler(async (event) => {
    const {
        startDate,
        endDate,
        serviceSubTypeId,
    } = getQuery(event);
    const financeController = new FinanceController();
    const result = await financeController.getSalesCurrentMonthDetailed({
        startDate,
        endDate,
        serviceSubTypeId,
    });
    return result;
});
