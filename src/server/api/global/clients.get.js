import { eventHandler, getQuery } from '#imports';
import GlobalController from '~/server/controllers/global.controller';

export default eventHandler(async (event) => {
    const { searchable } = getQuery(event);
    const globalController = new GlobalController();
    const result = await globalController.getClients({
        searchable,
    });
    return result;
});
