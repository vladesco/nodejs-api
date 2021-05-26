import { Config, getConfig } from '../config';
import { PostgreManyToMany, PostgreSingle } from '../data-access';
import { PostgreOneToMany } from '../data-access/postgre-dao';
import {
    configToken,
    container,
    groupAccessObjectToken,
    loggerToken,
    userAccessObjectToken,
    UserAuthentificationObjectToken,
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
    AuthentificationModel,
    UserAuthentifications,
} from '../models';
import { PropertyType, WithId } from '../types';

export const setupDI = async () => {
    const config = getConfig();

    container.provide(configToken, config);
    container.provide(loggerToken, getLogger(config.logger));
    container.provide(userAccessObjectToken, new PostgreSingle<WithId<UserDTO>>(UserModel));

    container.provide(
        UserAuthentificationObjectToken,
        new PostgreOneToMany<UserAuthentifications>(UserModel, AuthentificationModel)
    );

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
