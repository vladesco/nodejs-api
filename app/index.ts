import 'express-async-errors';
import { getConfig } from './config';
import { setupDI, setupErrorHandling, setupExpress, setupSequelize } from './loaders';

export const bootstrapApp = async () => {
    const config = getConfig();

    await setupDI(config);
    await setupErrorHandling(config);
    await setupSequelize(config);
    await setupExpress(config);
};
