import { config as loadConfig } from 'dotenv';
import { PropertyType } from '../types';
import { Config } from './types';

const DEFAULT_PORT = 8080;
const DEFAULT_LOGGER = 'custom';
const DEFAULT_CONNECTION_STRING = 'postgres://user:pass@example.com:5432/dbname';
const DEFAULT_SECRET = 'dev_secret';
const DEFAULT_ACCESS_TOKEN_EXPIRED_TIME = 60;
const DEFAULT_REFRESH_TOKEN_EXPIRED_TIME = 10 * 60;

export const getConfig: () => Config = () => {
    loadConfig();

    const logger = process.env.LOGGER as PropertyType<Config, 'logger'>;
    const port = Number(process.env.PORT);
    const dbConnectionString = process.env.DB_CONNECTION_STRING;
    const secret = process.env.SECRET_KEY;
    const accessTokenExpiredTime = Number(process.env.ACCESS_TOKEN_EXPIRED_TIME);
    const refreshTokenExpiredTime = Number(process.env.REFRESH_TOKEN_EXPIRED_TIME);

    return {
        port: port || DEFAULT_PORT,
        logger: logger || DEFAULT_LOGGER,
        dbConnectionString: dbConnectionString || DEFAULT_CONNECTION_STRING,
        secret: secret || DEFAULT_SECRET,
        accessTokenExpiredTime: accessTokenExpiredTime || DEFAULT_ACCESS_TOKEN_EXPIRED_TIME,
        refreshTokenExpiredTime: refreshTokenExpiredTime || DEFAULT_REFRESH_TOKEN_EXPIRED_TIME,
    };
};
