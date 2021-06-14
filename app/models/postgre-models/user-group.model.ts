import { DataTypes, Sequelize } from 'sequelize';
import { BaseModel } from './base.models';
import { GroupModel } from './group.model';
import { UserModel } from './user.model';

const userGroupSchema = {
    groupId: {
        type: DataTypes.UUIDV4,
        references: {
            model: GroupModel,
            key: 'id',
        },
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUIDV4,
        references: {
            model: UserModel,
            key: 'id',
        },
        primaryKey: true,
    },
};

export class UserGroupModel extends BaseModel<typeof userGroupSchema> {}

export const initializeUserGroupModel = (sequelize: Sequelize) => {
    UserGroupModel.init(userGroupSchema, {
        tableName: 'usergroups',
        sequelize,
        createdAt: false,
        updatedAt: false,
        underscored: true,
    });

    GroupModel.belongsToMany(UserModel, {
        through: UserGroupModel,
        foreignKey: 'groupId',
        as: UserModel.tableName,
    });

    UserModel.belongsToMany(GroupModel, {
        through: UserGroupModel,
        foreignKey: 'userId',
        as: GroupModel.tableName,
    });
};
