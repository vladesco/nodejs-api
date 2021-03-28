import { WithId } from 'types';
import { UserDTO } from '../models';
import { UserMapper } from '../mappers';

export type UserInfo = WithId<UserDTO>;
export type UserDatabasePresentation = UserInfo & { isDeleted: boolean };

export class UserRepository {
    constructor(private userMapper: UserMapper) {}

    public async addUser(userModel: UserInfo): Promise<UserInfo> {
        return this.userMapper.addUser({ ...userModel, isDeleted: false });
    }

    public async getUsers(): Promise<UserInfo[]> {
        return this.userMapper.getUsers(() => true);
    }

    public async getUserByLogin(userLogin: string): Promise<UserInfo> {
        const users = await this.userMapper.getUsers(
            (user) => user.login === userLogin
        );
        return users[0];
    }

    public async getUserById(
        userId: string
    ): Promise<UserDatabasePresentation> {
        const users = await this.userMapper.getUsers(
            (user) => user.id === userId
        );
        return users[0];
    }

    public async deletedUserById(
        userId: string
    ): Promise<UserInfo | undefined> {
        const deletedUser = await this.userMapper.updateUsers(
            (user) => user.id === userId,
            (user) => ({ ...user, isDeleted: true })
        );
        return deletedUser[0];
    }

    public async updateUserById(
        userId: string,
        updaedUserInfo: UserDTO
    ): Promise<UserInfo | undefined> {
        const updatedUsers = await this.userMapper.updateUsers(
            (user) => user.id === userId,
            (user) => ({ ...user, ...updaedUserInfo })
        );
        return updatedUsers[0];
    }

    public async getAutoSuggestUsers(
        loginSubString: string,
        limit: number
    ): Promise<UserInfo[]> {
        const findedUsers = await this.userMapper.getUsers((user) =>
            user.login.includes(loginSubString)
        );
        return findedUsers.slice(0, limit);
    }
}
