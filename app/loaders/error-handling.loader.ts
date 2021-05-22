import { Config } from '../config';
import { container, loggerToken } from '../di';
import { LoggerMap } from '../logger';

export const setupErrorHandling = async (config: Config) => {
    const logger = container.resolve<LoggerMap>(loggerToken);

    process.on('uncaughtException', (error) => {
        logger.error('CRITICAL ERROR', error.message);
        process.exit(1);
    });

    process.on('unhandledRejection', (error) => {
        logger.error('UNHANDLED PROMISE REJECTION', error);
        process.exit(1);
    });
};
