import { LoggerLevel } from '../types';

export const loggerLevelSeniority = {
    [LoggerLevel.DEBUG]: 0,
    [LoggerLevel.VERBOSE]: 1,
    [LoggerLevel.INFO]: 2,
    [LoggerLevel.WARN]: 3,
    [LoggerLevel.ERROR]: 4,
};
