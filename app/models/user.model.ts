import { DataTypes, Sequelize } from 'sequelize';
import { UserDTO, WithId } from '../types';
import { BaseModel } from './base.model';

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

export class UserModel extends BaseModel<WithId<UserDTO>> {
    public id!: string;
    public login!: string;
    public age!: number;
    public password!: string;
}

export const initializeUserModel = (sequelize: Sequelize) => {
    UserModel.init(userSchema, {
        tableName: 'users',
        sequelize,
        createdAt: false,
        updatedAt: false,
    });
};
