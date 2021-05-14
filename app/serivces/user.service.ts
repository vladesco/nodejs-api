import { v4 } from 'uuid';
import { NotFoundError, ValidationError } from '../errors';
import { DataAccess, UserDTO, WithId } from '../types';
import { userDTOValidtor } from '../validation';

export class UserService {
    constructor(private userAccessService: DataAccess<WithId<UserDTO>>) {}

    public async addUser(userDTO: UserDTO): Promise<WithId<UserDTO>> {
        const { error } = userDTOValidtor.validate(userDTO);

        if (error) {
            throw new ValidationError(error.message);
        }

        const userInfo = this.generateUserInfo(userDTO);

        return this.userAccessService.create(userInfo);
    }

    public async getUsers(): Promise<WithId<UserDTO>[]> {
        return this.userAccessService.get();
    }

    public async getUserById(userId: string): Promise<WithId<UserDTO>> {
        const user = await this.userAccessService.getByPK(userId);

        if (!user) {
            throw new NotFoundError('user with this id does not exist');
        }

        return user;
    }

    public async deletedUserById(userId: string): Promise<WithId<UserDTO>> {
        const deletedUser = await this.userAccessService.deleteByPK(userId);

        if (!deletedUser) {
            throw new NotFoundError('user with this id does not exist');
        }
        return deletedUser;
    }

    public async updateUserById(
        userId: string,
        userDTO: UserDTO
    ): Promise<WithId<UserDTO>> {
        const { error } = userDTOValidtor.validate(userDTO);

        if (error) {
            throw new ValidationError(error.message);
        }

        const updatedUser = await this.userAccessService.updateByPK(
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

        return this.userAccessService.getByField(
            'login',
            subString,
            Number(limit)
        );
    }

    private generateUserInfo(user: UserDTO): WithId<UserDTO> {
        return { ...user, id: v4() };
    }
}
