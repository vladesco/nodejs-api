import { Sequelize } from 'sequelize';
import { BaseModel } from './base.model';
import { GroupModel } from './group.model';
import { UserModel } from './user.model';

export class UserGroupModel extends BaseModel {}

export const initializeUserGroupModel = (sequelize: Sequelize) => {
    UserGroupModel.init(
        {},
        {
            tableName: 'usergroups',
            sequelize,
            createdAt: false,
            updatedAt: false,
            underscored: true,
        }
    );

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
