import { eventHandler, getQuery } from '#imports';
import FinanceController from '~/server/controllers/finance.controller';

export default eventHandler(async (event) => {
    const { previusDayReportDates, monthReportDates, yearReportDates } = getQuery(event);
    const financeController = new FinanceController();
    const result = await financeController.getSalesCurrentMonth({
        previusDayReportDates,
        monthReportDates,
        yearReportDates,
    });
    return result;
});
