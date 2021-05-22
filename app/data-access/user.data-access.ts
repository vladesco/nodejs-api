import { Inject, Injectable, userAccessObjectToken } from '../di';
import { UserDTO } from '../models';
import { WithId } from '../types';
import { DataAccess } from './types';

@Injectable()
export class UserDataAccess {
    constructor(
        @Inject(userAccessObjectToken)
        private dataAccess: DataAccess<WithId<UserDTO>>
    ) {}

    public async addUser(user: WithId<UserDTO>): Promise<WithId<UserDTO>> {
        return this.dataAccess.create(user);
    }

    public async getUsers(): Promise<WithId<UserDTO>[]> {
        return this.dataAccess.get();
    }

    public async getUserById(userId: string): Promise<WithId<UserDTO>> {
        return this.dataAccess.getByPK(userId);
    }

    public async deletedUserById(userId: string): Promise<WithId<UserDTO>> {
        return this.dataAccess.deleteByPK(userId);
    }

    public async updateUserById(
        userId: string,
        user: Partial<WithId<UserDTO>>
    ): Promise<WithId<UserDTO>> {
        return this.dataAccess.updateByPK(userId, user);
    }

    public async getAutoSuggestUsers(subString: string, limit: number): Promise<WithId<UserDTO>[]> {
        return this.dataAccess.getByFields({ login: subString }, { limit });
    }
}
