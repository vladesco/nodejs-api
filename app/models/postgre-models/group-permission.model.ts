import { Sequelize } from 'sequelize';
import { BaseModel } from './base.models';
import { GroupModel } from './group.model';
import { PermissionModel } from './permission.model';

export class GroupPermissionModel extends BaseModel {}

export const initializeGroupPermissionModel = (sequelize: Sequelize) => {
    GroupPermissionModel.init(
        {},
        {
            tableName: 'grouppermissions',
            sequelize,
            createdAt: false,
            updatedAt: false,
            underscored: true,
        }
    );

    GroupModel.belongsToMany(PermissionModel, {
        through: GroupPermissionModel,
        foreignKey: 'groupId',
        as: PermissionModel.tableName,
    });

    PermissionModel.belongsToMany(GroupModel, {
        through: GroupPermissionModel,
        foreignKey: 'permissionName',
        as: GroupModel.tableName,
    });
};
