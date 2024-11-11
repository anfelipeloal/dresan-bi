import { eventHandler, getQuery } from '#imports';
import GeneralController from '~/server/controllers/general.controller';

export default eventHandler(async (event) => {
    const { searchable } = getQuery(event);
    const generalController = new GeneralController();
    const result = await generalController.getTypeReport({
        searchable,
    });
    return result;
});
