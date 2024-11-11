import bcrypt from 'bcrypt';
import AuthModel from '../models/auth.model';

export default class AuthController {
    async login({ event, email, password }) {
        const sesion = await useAuthSession(event);

        const authModel = new AuthModel();
        const user = await authModel.findUserByEmail({ email });

        if (!user) {
            throw createError({
                message: 'Email not found! Please register.',
                statusCode: 401,
            });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            throw createError({
                message: 'Incorrect password!',
                statusCode: 401,
            });
        }

        await sesion.update({
            id: user.id,
            name: user.name,
            email: user.email,
        });

        return sesion;
    }

    async register({ email, name, password }) {
        const authModel = new AuthModel();
        await authModel.createUser({
            email,
            name,
            password,
        });

        return {
            message: 'User succesfully registered!',
        };
    }

    async logout({ event }) {
        const sesion = await useAuthSession(event);
        await sesion.clear();

        return {
            message: 'Succesfully logged out!',
        };
    }
}
