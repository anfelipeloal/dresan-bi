import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

export default class AuthModel {
    async createUser({ email, name, password }) {
        const user = await this.findUserByEmail({ email });

        if (user) {
            throw createError({
                message: 'Email already exists!',
                statusCode: 409,
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const prisma = new PrismaClient();
        const result = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
            },
        });

        return result;
    }

    async findUserByEmail({ email }) {
        const prisma = new PrismaClient();
        const result = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        return result;
    }
}
