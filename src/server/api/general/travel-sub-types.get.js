import { eventHandler } from '#imports';
import GeneralController from '~/server/controllers/general.controller';

export default eventHandler(async () => {
    const generalController = new GeneralController();
    const result = await generalController.getTravelSubTypes();
    return result;
});
