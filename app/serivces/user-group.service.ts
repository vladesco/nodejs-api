import { UserGroupDataService } from '../data-access';
import { PerformanceLogger } from '../decorators';
import { Injectable } from '../di';
import { ValidationError } from '../errors';
import { LoggerLevel } from '../logger';
import { UserWithGroupsDTO, GroupWithUsersDTO } from '../models';
import { GroupWithUsersDTOValidtor } from '../validation';

@Injectable()
export class UserGroupService {
    constructor(private userGroupAccessService: UserGroupDataService) {}

    @PerformanceLogger(LoggerLevel.INFO)
    public async getUserWithGroupsByPk(primaryKey: string): Promise<UserWithGroupsDTO> {
        return this.userGroupAccessService.getUserWithGroupsByPk(primaryKey);
    }

    @PerformanceLogger(LoggerLevel.INFO)
    public async getUsersWithGroups(): Promise<UserWithGroupsDTO[]> {
        return this.userGroupAccessService.getUsersWithGroups();
    }

    @PerformanceLogger(LoggerLevel.INFO)
    public async adaddUsersToGroup(
        GroupWithUsersDTO: GroupWithUsersDTO
    ): Promise<UserWithGroupsDTO[]> {
        const { error } = GroupWithUsersDTOValidtor.validate(GroupWithUsersDTO);

        if (error) {
            throw new ValidationError(error.message);
        }

        const { userIds, groupId } = GroupWithUsersDTO;

        return this.userGroupAccessService.addUsersToGroup(userIds, groupId);
    }
}
