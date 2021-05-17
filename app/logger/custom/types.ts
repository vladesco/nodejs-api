import { LoggerLevel } from '../types';

export type LoggerConfig = {
    transport: LoggerTransport[];
    level: LoggerLevel;
};

export interface LoggerTransport {
    log(info: LoggerInfo): void;
}

export type LoggerTransportConfig = {
    messageFormat: (value: any) => any;
    messageTemplate: (info: LoggerInfo) => string;
    level: LoggerLevel;
};

export type FileLoggerTransportConfig = LoggerTransportConfig & {
    filePath: string;
};

export type LoggerInfo = {
    date: Date;
    level: LoggerLevel;
    message: any[];
};

export type LoggerTemplatePart = (info: LoggerInfo) => string;
