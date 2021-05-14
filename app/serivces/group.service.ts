import { v4 } from 'uuid';
import { NotFoundError, ValidationError } from '../errors';
import { DataAccess, GroupWithPermissionsDTO, WithId } from '../types';
import { groupWithPermissionsDTOValidtor } from '../validation';

export class GroupService {
    constructor(
        private groupAccessService: DataAccess<WithId<GroupWithPermissionsDTO>>
    ) {}

    public async getGroups(): Promise<WithId<GroupWithPermissionsDTO>[]> {
        return this.groupAccessService.get();
    }

    public async getGroupById(
        groupId: string
    ): Promise<WithId<GroupWithPermissionsDTO>> {
        const findedGroup = await this.groupAccessService.getByPK(groupId);

        if (!findedGroup) {
            throw new NotFoundError(`group with id ${groupId} does not exist`);
        }
        return findedGroup;
    }

    public async deleteGroupById(
        groupId: string
    ): Promise<WithId<GroupWithPermissionsDTO>> {
        const deletedGroup = await this.groupAccessService.deleteByPK(groupId);

        if (!deletedGroup) {
            throw new NotFoundError(`group with id ${groupId} does not exist`);
        }
        return deletedGroup;
    }

    public async createGroup(
        groupDTO: GroupWithPermissionsDTO
    ): Promise<WithId<GroupWithPermissionsDTO>> {
        const { error } = groupWithPermissionsDTOValidtor.validate(groupDTO);

        if (error) {
            throw new ValidationError(error.message);
        }

        const groupInfo = this.generateGroupInfo(groupDTO);

        return this.groupAccessService.create(groupInfo);
    }

    public async updateGroupById(
        groupId: string,
        groupDTO: GroupWithPermissionsDTO
    ): Promise<WithId<GroupWithPermissionsDTO>> {
        const { error } = groupWithPermissionsDTOValidtor.validate(groupDTO);

        if (error) {
            throw new ValidationError(error.message);
        }

        const updatedGroup = await this.groupAccessService.updateByPK(
            groupId,
            groupDTO
        );

        if (!updatedGroup) {
            throw new NotFoundError(`group with id ${groupId} does not exist`);
        }
        return updatedGroup;
    }

    private generateGroupInfo(
        groupDTO: GroupWithPermissionsDTO
    ): WithId<GroupWithPermissionsDTO> {
        return { ...groupDTO, id: v4() };
    }
}
