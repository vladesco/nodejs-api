import 'express-async-errors';
import { setupDI, setupErrorHandling, setupExpress, setupSequelize } from './loaders';

export const bootstrapApp = async () => {
    await setupDI();
    await setupErrorHandling();
    await setupSequelize();
    await setupExpress();
};
