import { eventHandler, getQuery } from '#imports';
import GeneralController from '~/server/controllers/general.controller';

export default eventHandler(async (event) => {
    const { bookingId } = getQuery(event);
    const generalController = new GeneralController();
    const result = await generalController.getBookingAgents({
        bookingId,
    });
    return result;
});
