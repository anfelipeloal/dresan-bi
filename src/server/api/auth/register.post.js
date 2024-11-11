import AuthController from '../../controllers/auth.controller';

export default eventHandler(async (event) => {
    const { email, name, password } = await readBody(event);

    const authController = new AuthController();
    const response = authController.register({ email, name, password });

    return response;
});
