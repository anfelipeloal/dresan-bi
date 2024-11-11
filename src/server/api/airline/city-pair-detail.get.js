import { eventHandler, getQuery } from '#imports';
import AirlineController from '~/server/controllers/airline.controller';

export default eventHandler(async (event) => {
    const {
        startDate, endDate, originCity, destinationCity,
    } = getQuery(event);
    const airlineController = new AirlineController();
    const result = await airlineController.getCityPairDetail({
        startDate,
        endDate,
        originCity,
        destinationCity,
    });
    return result;
});
