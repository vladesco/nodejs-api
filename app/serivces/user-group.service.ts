import { DataAccess } from '../data-access';
import { PerformanceLogger } from '../decorators';
import {
    Inject,
    Injectable,
    linkingUserAndGroupAccessServiceToken,
    userGroupAccessServiceToken,
} from '../di';
import { ValidationError } from '../errors';
import { LoggerLevel } from '../logger';
import { UserWithGroupsDTO, UserGroupDTO, UsersGroupDTO } from '../models';
import { usersGroupDTOValidtor } from '../validation';

@Injectable()
export class UserGroupService {
    constructor(
        @Inject(userGroupAccessServiceToken)
        private userGroupAccessService: DataAccess<UserWithGroupsDTO>,
        @Inject(linkingUserAndGroupAccessServiceToken)
        private linkingUserAndGroupAccessService: DataAccess<UserGroupDTO>
    ) {}

    @PerformanceLogger(LoggerLevel.INFO)
    public async getUserGroupsByPk(primaryKey: string): Promise<UserWithGroupsDTO> {
        return this.userGroupAccessService.getByPK(primaryKey);
    }

    @PerformanceLogger(LoggerLevel.INFO)
    public async getUsersWithGroups(): Promise<UserWithGroupsDTO[]> {
        return this.userGroupAccessService.get();
    }

    @PerformanceLogger(LoggerLevel.INFO)
    public async linkUsersAndGroup(usersGroupDTO: UsersGroupDTO): Promise<UserWithGroupsDTO[]> {
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
