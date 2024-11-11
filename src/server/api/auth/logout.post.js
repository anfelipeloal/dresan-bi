import AuthController from '../../controllers/auth.controller';

export default eventHandler(async (event) => {
    const authController = new AuthController();
    const response = await authController.logout({ event });

    return response;
});
