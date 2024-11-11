import { eventHandler, getQuery } from '#imports';
import AirlineController from '~/server/controllers/airline.controller';

export default eventHandler(async (event) => {
    const { startDate, endDate, conditions } = getQuery(event);
    const airlineController = new AirlineController();
    const result = await airlineController.getCityPairsAnalysis({
        startDate,
        endDate,
        conditions,
    });
    return result;
});
