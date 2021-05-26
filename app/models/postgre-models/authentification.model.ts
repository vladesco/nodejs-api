import { DataTypes, Sequelize } from 'sequelize';
import { OneToManyModel } from './base.models';
import { UserModel } from './user.model';

const authentificationSchema = {
    userId: {
        type: DataTypes.UUIDV4,
        references: {
            model: UserModel,
            key: 'userId',
        },
        primaryKey: true,
    },
    deviceId: {
        type: DataTypes.CHAR(50),
        primaryKey: true,
        allowNull: false,
    },
    refreshToken: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
};

export class AuthentificationModel extends OneToManyModel<typeof authentificationSchema> {}

export const initializeAuthentificationModel = (sequelize: Sequelize) => {
    AuthentificationModel.init(authentificationSchema, {
        tableName: 'authentifications',
        sequelize,
        createdAt: false,
        updatedAt: false,
        underscored: true,
    });

    UserModel.hasMany(AuthentificationModel, {
        as: AuthentificationModel.tableName,
        foreignKey: 'userId',
    });
};
