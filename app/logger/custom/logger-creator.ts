import { LoggerLevel, LoggerMap } from '../types';
import { LoggerConfig } from './types';
import { noop, stringify } from '../../utils';
import { loggerLevelSeniority } from './const';
import { transports } from './transport';
import { createTemplate, templateParts } from './template';

const createLogger = (config: LoggerConfig) => {
    const log = (level: LoggerLevel) => {
        if (loggerLevelSeniority[level] >= loggerLevelSeniority[config.level]) {
            return (...messageParts: any[]) => {
                const messageTime = new Date();
                config.transport.forEach((transport) => {
                    transport.log({
                        date: messageTime,
                        message: messageParts,
                        level,
                    });
                });
            };
        } else {
            return noop;
        }
    };
    return {
        log,
        [LoggerLevel.DEBUG]: log(LoggerLevel.DEBUG),
        [LoggerLevel.ERROR]: log(LoggerLevel.ERROR),
        [LoggerLevel.INFO]: log(LoggerLevel.INFO),
        [LoggerLevel.VERBOSE]: log(LoggerLevel.VERBOSE),
        [LoggerLevel.WARN]: log(LoggerLevel.WARN),
    };
};

export const getCustomLogger: () => LoggerMap = () =>
    createLogger({
        level: LoggerLevel.DEBUG,
        transport: [
            new transports.console({
                messageFormat: stringify,
                messageTemplate: createTemplate(
                    templateParts.newLine(),
                    templateParts.date(),
                    templateParts.level(),
                    templateParts.displayText('message from custom logger'),
                    templateParts.newLine(),
                    templateParts.message()
                ),
                level: LoggerLevel.DEBUG,
            }),
        ],
    });
