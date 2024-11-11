import { eventHandler, getQuery } from '#imports';
import GlobalController from '~/server/controllers/global.controller';

export default eventHandler(async (event) => {
    const { id } = getQuery(event);
    const globalController = new GlobalController();
    const result = await globalController.getProfile({
        id,
    });
    return result;
});
