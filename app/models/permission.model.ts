import { DataTypes, Sequelize } from 'sequelize';
import { Permission } from '../types';
import { BaseModel } from './base.model';

const permissionSchema = {
    name: {
        type: DataTypes.STRING(20),
        primaryKey: true,
    },
};

export class PermissionModel extends BaseModel<{ name: Permission }> {
    public name!: Permission;
}

export const initializePermissionModel = (sequelize: Sequelize) => {
    PermissionModel.init(permissionSchema, {
        tableName: 'permissions',
        sequelize,
        createdAt: false,
        updatedAt: false,
    });
};
