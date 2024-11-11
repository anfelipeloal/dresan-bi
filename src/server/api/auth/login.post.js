import AuthController from '../../controllers/auth.controller';

export default eventHandler(async (event) => {
    const { email, password } = await readBody(event);

    const authController = new AuthController();
    const session = await authController.login({ event, email, password });

    return session;
});
