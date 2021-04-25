import { config as loadConfig } from 'dotenv';
import { Config } from '../types';

const DEFAULT_CONNECTION_STRING =
    'postgres://user:pass@example.com:5432/dbname';
const DEFAULT_PORT = 8080;

export const getConfig: () => Config = () => {
    loadConfig();
    const config: Config = {
        dbConnectionString:
            process.env.DB_CONNECTION_STRING || DEFAULT_CONNECTION_STRING,
        port: Number(process.env.PORT) || DEFAULT_PORT,
    };

    return config;
};
