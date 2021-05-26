export type Config = {
    dbConnectionString: string;
    port: number;
    logger: 'custom' | 'winston';
    secret: string;
    accessTokenExpiredTime: number;
    refreshTokenExpiredTime: number;
};
