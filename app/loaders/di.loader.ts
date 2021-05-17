import { Config } from '../config';
import { PostgreManyToMany, PostgreSingle } from '../data-access';
import {
    container,
    groupAccessServiceToken,
    linkingUserAndGroupAccessServiceToken,
    loggerToken,
    userAccessServiceToken,
    userGroupAccessServiceToken,
} from '../di';
import { getCustomLogger } from '../logger/custom';
import { getWinstonLogger } from '../logger/winston';
import {
    GroupWithPermissionsDTO,
    GroupModel,
    PermissionModel,
    UserDTO,
    UserModel,
    UserWithGroupsDTO,
    UserGroupDTO,
    UserGroupModel,
} from '../models';
import { PropertyType, WithId } from '../types';

export const setupDI = async ({ logger }: Config) => {
    container.provide(loggerToken, getLogger(logger));
    container.provide(userAccessServiceToken, new PostgreSingle<WithId<UserDTO>>(UserModel));

    container.provide(
        groupAccessServiceToken,
        new PostgreManyToMany<WithId<GroupWithPermissionsDTO>>(GroupModel, PermissionModel)
    );

    container.provide(
        userGroupAccessServiceToken,
        new PostgreManyToMany<UserWithGroupsDTO>(UserModel, GroupModel)
    );

    container.provide(
        linkingUserAndGroupAccessServiceToken,
        new PostgreSingle<UserGroupDTO>(UserGroupModel)
    );
};

const getLogger = (logger: PropertyType<Config, 'logger'>) => {
    if (logger === 'custom') {
        return getCustomLogger();
    }
    return getWinstonLogger();
};
