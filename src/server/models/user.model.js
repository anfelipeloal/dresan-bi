import { PrismaClient } from '@prisma/client';

export default class UserModel {
    async getUserData({ userId }) {
        const prisma = new PrismaClient();

        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(userId, 10),
            },
        });

        if (user) {
            delete user.password;
        }

        return user;
    }
}
