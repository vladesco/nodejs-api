export type Logger = (...messageParts: any[]) => void;

export enum LoggerLevel {
    ERROR = 'error',
    WARN = 'warn',
    INFO = 'info',
    VERBOSE = 'verbose',
    DEBUG = 'debug',
}

export type LoggerMap = { [level in LoggerLevel]: Logger };
