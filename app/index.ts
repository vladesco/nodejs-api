import 'express-async-errors';
import { getConfig } from './config';
import { setupExpress, setupSequelize } from './loaders';
import { Config } from './types';

export const bootstrapApp = async () => {
    const { dbConnectionString, port }: Config = getConfig();

    await setupSequelize(dbConnectionString);
    await setupExpress(port);
};
