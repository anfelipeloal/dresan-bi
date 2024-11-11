import { eventHandler, getQuery } from '#imports';
import CorporateController from '~/server/controllers/corporate.controller';

export default eventHandler(async (event) => {
    const { startDate, endDate, clientId } = getQuery(event);
    const corporateController = new CorporateController();
    const result = await corporateController.getTravelSummaryReport({
        startDate,
        endDate,
        clientId,
    });
    return result;
});
