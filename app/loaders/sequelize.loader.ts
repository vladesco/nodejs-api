import { Sequelize } from 'sequelize';
import { Config } from '../config';
import {
    initializeGroupModel,
    initializeGroupPermissionModel,
    initializePermissionModel,
    initializeUserGroupModel,
    initializeUserModel,
} from '../models';

export const setupSequelize = async ({ dbConnectionString }: Config) => {
    const sequelize = new Sequelize(dbConnectionString);
    process.on('exit', () => sequelize.close());

    try {
        await sequelize.authenticate();
        await sequelize.sync({ force: true });
    } catch {
        process.exit(1);
    }

    initializeUserModel(sequelize);
    initializeGroupModel(sequelize);
    initializePermissionModel(sequelize);
    initializeGroupPermissionModel(sequelize);
    initializeUserGroupModel(sequelize);
};
