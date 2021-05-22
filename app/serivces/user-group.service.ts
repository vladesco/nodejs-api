import { UserGroupDataService } from '../data-access';
import { PerformanceLogger } from '../decorators';
import { Injectable } from '../di';
import { ValidationError } from '../errors';
import { LoggerLevel } from '../logger';
import { UserWithGroupsDTO, UsersGroupDTO } from '../models';
import { usersGroupDTOValidtor } from '../validation';

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
    public async adaddUsersToGroup(usersGroupDTO: UsersGroupDTO): Promise<UserWithGroupsDTO[]> {
        const { error } = usersGroupDTOValidtor.validate(usersGroupDTO);

        if (error) {
            throw new ValidationError(error.message);
        }

        const { userIds, groupId } = usersGroupDTO;

        return this.userGroupAccessService.addUsersToGroup(userIds, groupId);
    }
}
