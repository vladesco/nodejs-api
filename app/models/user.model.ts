import { DataTypes, Model, Sequelize } from 'sequelize';
import { UserDTO, WithId } from '../types';

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

export class UserModel extends Model<WithId<UserDTO>> {
    public id!: number;
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
