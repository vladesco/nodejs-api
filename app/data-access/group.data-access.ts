import { groupAccessObjectToken, Inject, Injectable } from '../di';
import { GroupWithPermissionsDTO } from '../models';
import { WithId } from '../types';
import { ManyToManyDataAccess } from './types';

@Injectable()
export class GroupDataAccess {
    constructor(
        @Inject(groupAccessObjectToken)
        private dataAccess: ManyToManyDataAccess<WithId<GroupWithPermissionsDTO>>
    ) {}

    public async getGroups(): Promise<WithId<GroupWithPermissionsDTO>[]> {
        return this.dataAccess.get();
    }

    public async getGroupById(groupId: string): Promise<WithId<GroupWithPermissionsDTO>> {
        return this.dataAccess.getByPK(groupId);
    }

    public async deleteGroupById(groupId: string): Promise<WithId<GroupWithPermissionsDTO>> {
        return this.dataAccess.deleteByPK(groupId);
    }

    public async addGroup(
        group: WithId<GroupWithPermissionsDTO>
    ): Promise<WithId<GroupWithPermissionsDTO>> {
        return this.dataAccess.create(group);
    }

    public async updateGroupById(
        groupId: string,
        groupDTO: Partial<WithId<GroupWithPermissionsDTO>>
    ): Promise<WithId<GroupWithPermissionsDTO>> {
        const updateGroup = await this.dataAccess.getByPK(groupId);
        await this.dataAccess.updateByPK(groupId, groupDTO);

        return updateGroup;
    }
}
