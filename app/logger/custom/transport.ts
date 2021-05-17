import { WriteStream, createWriteStream } from 'fs';

import { LoggerLevel } from '../types';
import {
    FileLoggerTransportConfig,
    LoggerInfo,
    LoggerTransport,
    LoggerTransportConfig,
} from './types';
import { loggerLevelSeniority } from './const';

abstract class BaseTransport<
    T extends LoggerTransportConfig = LoggerTransportConfig
> implements LoggerTransport
{
    constructor(private config: T) {}

    public log = (info: LoggerInfo): void => {
        if (this.isAllowed(info.level)) {
            const formattedMessageParts = info.message.map(this.format);
            const formattedMessage = {
                ...info,
                message: formattedMessageParts,
            };

            this.write(info.level, this.getMessage(formattedMessage));
        }
    };

    protected abstract write(level: LoggerLevel, message: string): void;

    private isAllowed = (level: LoggerLevel): boolean => {
        const loggerLevel = this.config.level;

        return loggerLevelSeniority[level] >= loggerLevelSeniority[loggerLevel];
    };

    private format = (value: any): string => {
        return this.config.messageFormat(value);
    };

    private getMessage = (info: LoggerInfo): string => {
        return this.config.messageTemplate(info);
    };
}

class ConsoleTransport extends BaseTransport {
    protected write = (level: LoggerLevel, message: string): void => {
        const consoleLogMethod = this.getConsoleMethod(level);
        consoleLogMethod(message);
    };

    private getConsoleMethod = (level: LoggerLevel): Function => {
        switch (level) {
            case LoggerLevel.DEBUG:
                return console.debug;
            case LoggerLevel.INFO:
                return console.info;
            case LoggerLevel.WARN:
                return console.warn;
            case LoggerLevel.ERROR:
                return console.error;
            default:
                return console.log;
        }
    };
}

class FileTransport extends BaseTransport<FileLoggerTransportConfig> {
    private fileStream: WriteStream;

    constructor(config: FileLoggerTransportConfig) {
        super(config);
        this.fileStream = createWriteStream(config.filePath);
    }

    protected write = (level: LoggerLevel, message: string): void => {
        this.fileStream.write(message);
    };
}

export const transports = {
    console: ConsoleTransport,
    file: FileTransport,
};
