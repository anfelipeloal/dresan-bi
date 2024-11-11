import UserModel from '../models/user.model';

export default class UserController {
    async getUserData({ userId }) {
        const userModel = new UserModel();
        const data = await userModel.getUserData({
            userId,
        });

        return data;
    }
}
