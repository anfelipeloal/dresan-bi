import { eventHandler, getQuery } from '#imports';
import UserController from '~/server/controllers/user.controller';

export default eventHandler(async (event) => {
    const { userId } = getQuery(event);
    const userController = new UserController();
    const result = await userController.getUserData({
        userId,
    });
    return result;
});
