import { DataTypes, Sequelize } from 'sequelize';
import { ManyToManyModel } from './base.models';

const userSchema = {
    id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
    },
    login: {
        type: DataTypes.STRING(20),
    },
    password: {
        type: DataTypes.STRING(15),
    },
    age: {
        type: DataTypes.SMALLINT,
    },
};

export class UserModel extends ManyToManyModel<typeof userSchema> {}

export const initializeUserModel = (sequelize: Sequelize) => {
    UserModel.init(userSchema, {
        tableName: 'users',
        sequelize,
        createdAt: false,
        updatedAt: false,
    });
};
