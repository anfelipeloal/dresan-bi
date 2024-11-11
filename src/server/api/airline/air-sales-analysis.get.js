import { eventHandler, getQuery } from '#imports';
import AirlineController from '~/server/controllers/airline.controller';

export default eventHandler(async (event) => {
    const { conditions } = getQuery(event);
    const airlineController = new AirlineController();
    const result = await airlineController.getAirSalesAnalysis({
        conditions,
    });
    return result;
});
