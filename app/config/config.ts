import { config as loadConfig } from 'dotenv';
import { PropertyType } from '../types';
import { Config } from './types';

const DEFAULT_PORT = 8080;
const DEFAULT_LOGGER = 'custom';
const DEFAULT_CONNECTION_STRING = 'postgres://user:pass@example.com:5432/dbname';

export const getConfig: () => Config = () => {
    loadConfig();
    const logger = process.env.LOGGER as PropertyType<Config, 'logger'>;
    const port = Number(process.env.PORT);
    const dbConnectionString = process.env.DB_CONNECTION_STRING;

    return {
        port: port || DEFAULT_PORT,
        logger: logger || DEFAULT_LOGGER,
        dbConnectionString: dbConnectionString || DEFAULT_CONNECTION_STRING,
    };
};
