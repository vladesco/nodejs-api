import { DataTypes, Sequelize } from 'sequelize';
import { ManyToManyModel } from './base.models';

const groupSchema = {
    id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
};

export class GroupModel extends ManyToManyModel<typeof groupSchema> {}

export const initializeGroupModel = (sequelize: Sequelize) => {
    GroupModel.init(groupSchema, {
        tableName: 'groups',
        sequelize,
        createdAt: false,
        updatedAt: false,
    });
};
