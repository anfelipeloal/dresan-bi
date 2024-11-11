import CorporateController from '~/server/controllers/corporate.controller';

export default eventHandler(async (event) => {
    const { startDate, endDate } = getQuery(event);

    const corporateController = new CorporateController();
    const result = await corporateController.getTravelTypeSummary({
        startDate,
        endDate,
    });

    return result;
});