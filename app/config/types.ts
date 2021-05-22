export type Config = {
    dbConnectionString: string;
    port: number;
    logger: 'custom' | 'winston';
};
