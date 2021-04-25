import { Sequelize } from 'sequelize';
import { initializeUserModel } from '../models';

export const setupSequelize = async (dbConnectionString: string) => {
    const sequelize = new Sequelize(dbConnectionString);
    process.on('exit', () => sequelize.close());

    try {
        await sequelize.authenticate();
    } catch {
        process.exit(1);
    }

    initializeUserModel(sequelize);
};
