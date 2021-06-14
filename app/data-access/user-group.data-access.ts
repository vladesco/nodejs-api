import { Inject, Injectable, userGroupAccessObjectToken } from '../di';
import { UserWithGroupsDTO } from '../models';
import { ManyToManyDataAccess } from './types';

@Injectable()
export class UserGroupDataService {
    constructor(
        @Inject(userGroupAccessObjectToken)
        private dataAccess: ManyToManyDataAccess<UserWithGroupsDTO>
    ) {}

    public async getUserWithGroupsByPk(primaryKey: string): Promise<UserWithGroupsDTO> {
        return this.dataAccess.getByPK(primaryKey);
    }

    public async getUsersWithGroups(): Promise<UserWithGroupsDTO[]> {
        return this.dataAccess.get();
    }

    public async addUsersToGroup(userIds: string[], groupId: string): Promise<UserWithGroupsDTO[]> {
        return Promise.all(userIds.map((userId) => this.dataAccess.linkEntities(userId, groupId)));
    }
}
