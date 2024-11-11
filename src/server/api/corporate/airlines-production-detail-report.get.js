import { eventHandler, getQuery } from '#imports';
import CorporateController from '~/server/controllers/corporate.controller';

export default eventHandler(async (event) => {
    const { startDate, endDate, profileId } = getQuery(event);
    const corporateController = new CorporateController();
    const result = await corporateController.getAirlinesProductionDetail({
        startDate,
        endDate,
        profileId,
    });
    return result;
});
