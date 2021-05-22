import { v4 } from 'uuid';
import { GroupDataAccess } from '../data-access';
import { PerformanceLogger } from '../decorators';
import { Injectable } from '../di';
import { NotFoundError, ValidationError } from '../errors';
import { LoggerLevel } from '../logger';
import { GroupWithPermissionsDTO } from '../models';
import { WithId } from '../types';
import { groupWithPermissionsDTOValidtor } from '../validation';

@Injectable()
export class GroupService {
    constructor(private groupAccessService: GroupDataAccess) {}

    @PerformanceLogger(LoggerLevel.DEBUG)
    public async getGroups(): Promise<WithId<GroupWithPermissionsDTO>[]> {
        return this.groupAccessService.getGroups();
    }

    @PerformanceLogger(LoggerLevel.DEBUG)
    public async getGroupById(groupId: string): Promise<WithId<GroupWithPermissionsDTO>> {
        const findedGroup = await this.groupAccessService.getGroupById(groupId);

        if (!findedGroup) {
            throw new NotFoundError(`group with id ${groupId} does not exist`);
        }
        return findedGroup;
    }

    @PerformanceLogger(LoggerLevel.DEBUG)
    public async deleteGroupById(groupId: string): Promise<WithId<GroupWithPermissionsDTO>> {
        const deletedGroup = await this.groupAccessService.deleteGroupById(groupId);

        if (!deletedGroup) {
            throw new NotFoundError(`group with id ${groupId} does not exist`);
        }
        return deletedGroup;
    }

    @PerformanceLogger(LoggerLevel.DEBUG)
    public async createGroup(
        groupDTO: GroupWithPermissionsDTO
    ): Promise<WithId<GroupWithPermissionsDTO>> {
        const { error } = groupWithPermissionsDTOValidtor.validate(groupDTO);

        if (error) {
            throw new ValidationError(error.message);
        }

        const groupInfo = this.generateGroupInfo(groupDTO);

        return this.groupAccessService.createGroup(groupInfo);
    }

    @PerformanceLogger(LoggerLevel.DEBUG)
    public async updateGroupById(
        groupId: string,
        groupDTO: GroupWithPermissionsDTO
    ): Promise<WithId<GroupWithPermissionsDTO>> {
        const { error } = groupWithPermissionsDTOValidtor.validate(groupDTO);

        if (error) {
            throw new ValidationError(error.message);
        }

        const updatedGroup = await this.groupAccessService.updateGroupById(groupId, groupDTO);

        if (!updatedGroup) {
            throw new NotFoundError(`group with id ${groupId} does not exist`);
        }
        return updatedGroup;
    }

    private generateGroupInfo(groupDTO: GroupWithPermissionsDTO): WithId<GroupWithPermissionsDTO> {
        return { ...groupDTO, id: v4() };
    }
}
