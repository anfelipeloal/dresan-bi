import { eventHandler, getQuery } from '#imports';
import FinanceController from '~/server/controllers/finance.controller';

export default eventHandler(async (event) => {
    const { businessUnit } = getQuery(event);
    const financeController = new FinanceController();
    const result = await financeController.getClientPerformance({
        businessUnit,
    });
    return result;
});
