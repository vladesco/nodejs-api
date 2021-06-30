import { v4 } from 'uuid';
import { UserDataAccess } from '../data-access';
import { PerformanceLogger } from '../decorators';
import { Injectable } from '../di';
import { NotFoundError, ValidationError } from '../errors';
import { LoggerLevel } from '../logger';
import { UserDTO } from '../models';
import { WithId } from '../types';
import { userDTOValidtor } from '../validation';

@Injectable()
export class UserService {
    constructor(private userDataAccess: UserDataAccess) {}

    @PerformanceLogger(LoggerLevel.DEBUG)
    public async addUser(userDTO: UserDTO): Promise<WithId<UserDTO>> {
        const { error } = userDTOValidtor.validate(userDTO);

        if (error) {
            throw new ValidationError(error.message);
        }

        const userInfo = this.generateUserInfo(userDTO);

        return this.userDataAccess.addUser(userInfo);
    }

    @PerformanceLogger(LoggerLevel.DEBUG)
    public async getUsers(): Promise<WithId<UserDTO>[]> {
        return this.userDataAccess.getUsers();
    }

    @PerformanceLogger(LoggerLevel.DEBUG)
    public async getUserById(userId: string): Promise<WithId<UserDTO>> {
        const user = await this.userDataAccess.getUserById(userId);

        if (!user) {
            throw new NotFoundError('user with this id does not exist');
        }

        return user;
    }

    @PerformanceLogger(LoggerLevel.DEBUG)
    public async deleteUserById(userId: string): Promise<WithId<UserDTO>> {
        const deletedUser = await this.userDataAccess.deletedUserById(userId);

        if (!deletedUser) {
            throw new NotFoundError('user with this id does not exist');
        }
        return deletedUser;
    }

    @PerformanceLogger(LoggerLevel.DEBUG)
    public async updateUserById(userId: string, userDTO: UserDTO): Promise<WithId<UserDTO>> {
        const { error } = userDTOValidtor.validate(userDTO);

        if (error) {
            throw new ValidationError(error.message);
        }

        const updatedUser = await this.userDataAccess.updateUserById(userId, userDTO);

        if (!updatedUser) {
            throw new NotFoundError(`user with id ${userId} does not exist`);
        }

        return updatedUser;
    }

    @PerformanceLogger(LoggerLevel.DEBUG)
    public async getAutoSuggestUsers(subString: string, limit: number): Promise<WithId<UserDTO>[]> {
        if (subString == null || limit == null) {
            throw new ValidationError('subString and limit params must be specified');
        }

        return this.userDataAccess.getAutoSuggestUsers(subString, limit);
    }

    private generateUserInfo(user: UserDTO): WithId<UserDTO> {
        return { ...user, id: v4() };
    }
}
