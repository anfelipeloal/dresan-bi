import { eventHandler } from '#imports';
import GeneralController from '~/server/controllers/general.controller';

export default eventHandler(async (event) => {
    try {
        const {
            startDate, endDate, conditions, reportQuery,
        } = await readBody(event);

        const generalController = new GeneralController();
        const result = await generalController.execQueryReport({
            startDate,
            endDate,
            conditions,
            reportQuery,
        });
        return result;
    } catch (err) {
        return err;
    }
});
