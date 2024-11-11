import { eventHandler, getQuery } from '#imports';
import AirlineController from '~/server/controllers/airline.controller';

export default eventHandler(async (event) => {
    const {
        startDate, endDate, originCity, destinationCity, clientId,
    } = getQuery(event);
    const airlineController = new AirlineController();
    const result = await airlineController.getCityPairClientAirlines({
        startDate,
        endDate,
        originCity,
        destinationCity,
        clientId,
    });
    return result;
});
