import { Config, getConfig } from '../config';
import { PostgreManyToMany, PostgreSingle } from '../data-access';
import {
    configToken,
    container,
    groupAccessObjectToken,
    loggerToken,
    userAccessObjectToken,
    userGroupAccessObjectToken,
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
} from '../models';
import { PropertyType, WithId } from '../types';

export const setupDI = async () => {
    const config = getConfig();

    container.provide(configToken, config);
    container.provide(loggerToken, getLogger(config.logger));
    container.provide(userAccessObjectToken, new PostgreSingle<WithId<UserDTO>>(UserModel));

    container.provide(
        groupAccessObjectToken,
        new PostgreManyToMany<WithId<GroupWithPermissionsDTO>>(GroupModel, PermissionModel)
    );

    container.provide(
        userGroupAccessObjectToken,
        new PostgreManyToMany<UserWithGroupsDTO>(UserModel, GroupModel)
    );
};

const getLogger = (logger: PropertyType<Config, 'logger'>) => {
    if (logger === 'custom') {
        return getCustomLogger();
    }
    return getWinstonLogger();
};
