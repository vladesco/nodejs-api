import { ValidationError } from '../errors';
import {
    DataAccess,
    UserGroupDTO,
    UsersGroupDTO,
    UserWithGroupsDTO,
} from '../types';
import { usersGroupDTOValidtor } from '../validation';

export class UserGroupService {
    constructor(
        private userGroupAccessService: DataAccess<UserWithGroupsDTO>,
        private linkingUserAndGroupAccessService: DataAccess<UserGroupDTO>
    ) {}

    public async getUserGroupsByPk(
        primaryKey: string
    ): Promise<UserWithGroupsDTO> {
        return this.userGroupAccessService.getByPK(primaryKey);
    }

    public async getUsersWithGroups(): Promise<UserWithGroupsDTO[]> {
        return this.userGroupAccessService.get();
    }

    public async linkUsersAndGroup(
        usersGroupDTO: UsersGroupDTO
    ): Promise<UserWithGroupsDTO[]> {
        const { error } = usersGroupDTOValidtor.validate(usersGroupDTO);

        if (error) {
            throw new ValidationError(error.message);
        }

        const { userIds, groupId } = usersGroupDTO;

        await Promise.all(
            userIds.map(async (userId) => {
                await this.linkingUserAndGroupAccessService.create({
                    userId,
                    groupId,
                });
            })
        );

        return Promise.all(
            userIds.map((userId) => {
                return this.userGroupAccessService.getByPK(userId);
            })
        );
    }
}
