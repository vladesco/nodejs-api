import { DataTypes, Sequelize } from 'sequelize';
import { Permission } from '../types';
import { ManyToManyModel } from './base.models';

const permissionSchema = {
    name: {
        type: DataTypes.STRING(20),
        primaryKey: true,
    },
};

export class PermissionModel extends ManyToManyModel<{ name: Permission }> {
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
