import { eventHandler, getQuery } from '#imports';
import CorporateController from '~/server/controllers/corporate.controller';

export default eventHandler(async (event) => {
    const { startDate, endDate, primaryTravelTypes } = getQuery(event);
    const corporateController = new CorporateController();
    const result = await corporateController.getTravelTypeOthers({
        startDate,
        endDate,
        primaryTravelTypes,
    });
    return result;
});
