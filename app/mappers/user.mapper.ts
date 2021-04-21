import { UserDatabasePresentation } from '../repositories';

export class UserMapper {
    private users: UserDatabasePresentation[] = [];

    private get relevantUsers() {
        return this.users.filter((user) => !user.isDeleted);
    }

    public async addUser(
        userInfo: UserDatabasePresentation
    ): Promise<UserDatabasePresentation> {
        this.users.push(userInfo);
        return userInfo;
    }

    public async getUsers(
        condition: (user: UserDatabasePresentation) => boolean
    ): Promise<UserDatabasePresentation[]> {
        return this.relevantUsers.filter(condition);
    }

    public async updateUsers(
        condition: (user: UserDatabasePresentation) => boolean,
        updater: (user: UserDatabasePresentation) => UserDatabasePresentation
    ): Promise<UserDatabasePresentation[]> {
        const selectedUsers = await this.getUsers(condition);

        selectedUsers.forEach((user) => Object.assign(user, updater(user)));
        return selectedUsers;
    }
}
