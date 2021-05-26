import { DataTypes, Sequelize } from 'sequelize';
import { BaseModel } from './base.models';
import { GroupModel } from './group.model';
import { PermissionModel } from './permission.model';
import { UserModel } from './user.model';

const groupPermissionSchema = {
    permissionName: {
        type: DataTypes.STRING(20),
        references: {
            model: PermissionModel,
            key: 'name',
        },
        userId: {
            type: DataTypes.UUIDV4,
            references: {
                model: UserModel,
                key: 'id',
            },
        },
    },
};

export class GroupPermissionModel extends BaseModel<typeof groupPermissionSchema> {}

export const initializeGroupPermissionModel = (sequelize: Sequelize) => {
    GroupPermissionModel.init(groupPermissionSchema, {
        tableName: 'grouppermissions',
        sequelize,
        createdAt: false,
        updatedAt: false,
        underscored: true,
    });

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
