import { eventHandler, getQuery } from '#imports';
import GeneralController from '~/server/controllers/general.controller';

export default eventHandler(async (event) => {
    const { startDate, endDate, conditions } = getQuery(event);
    const generalController = new GeneralController();
    const result = await generalController.getInvoices({
        startDate,
        endDate,
        conditions,
    });
    return result;
});
