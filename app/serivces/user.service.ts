import { v4 } from 'uuid';
import { NotFoundError, ValidationError } from '../errors';
import { UserDTO } from '../models';
import { UserInfo, UserRepository } from '../repositories';
import { userDTOValidtor } from '../validation';

export class UserService {
    constructor(private userRepository: UserRepository) {}

    public async addUser(userDTO: UserDTO): Promise<UserInfo> {
        const { error } = userDTOValidtor.validate(userDTO);

        if (error) {
            throw new ValidationError(error.message);
        }

        const isLoginNotUnique = await this.userRepository.getUserByLogin(
            userDTO.login
        );

        if (isLoginNotUnique) {
            throw new ValidationError(
                'there is any user with the same login. Login must be unique'
            );
        }

        const userInfo = this.generateUserInfo(userDTO);

        return this.userRepository.addUser(userInfo);
    }

    public async getUsers(): Promise<UserInfo[]> {
        return this.userRepository.getUsers();
    }

    public async getUserById(userId: string): Promise<UserInfo> {
        const user = await this.userRepository.getUserById(userId);

        if (!user) {
            throw new NotFoundError('user with this id does not exist');
        }

        return user;
    }

    public async deletedUserById(
        userId: string
    ): Promise<UserInfo | undefined> {
        const deletedUser = await this.userRepository.deletedUserById(userId);

        if (!deletedUser) {
            throw new NotFoundError('user with this id does not exist');
        }
        return deletedUser;
    }

    public async updateUserById(
        userId: string,
        userDTO: UserDTO
    ): Promise<UserInfo> {
        const { error } = userDTOValidtor.validate(userDTO);

        if (error) {
            throw new ValidationError(error.message);
        }

        const updatedUser = await this.userRepository.updateUserById(
            userId,
            userDTO
        );

        if (!updatedUser) {
            throw new NotFoundError(`user with id ${userId} does not exist`);
        }

        return updatedUser;
    }

    public async getAutoSuggestUsers(subString: string, limit: number) {
        if (subString == null || limit == null) {
            throw new ValidationError(
                'subString and limit params must be specified'
            );
        }

        return this.userRepository.getAutoSuggestUsers(subString, limit);
    }

    private generateUserInfo(user: UserDTO): UserInfo {
        return { ...user, id: v4() };
    }
}
