import { LoggerTemplatePart, LoggerInfo } from './types';

export const templateParts: {
    [key: string]: (...args: any[]) => LoggerTemplatePart;
} = {
    newLine: () => () => '\n',
    displayText: (displayingText: string) => () => displayingText,
    date:
        () =>
        ({ date }) =>
            date.toISOString(),
    message:
        () =>
        ({ message }) =>
            message.join(' '),
    level:
        () =>
        ({ level }) =>
            level.toUpperCase(),
};

export const createTemplate = (...templateParts: LoggerTemplatePart[]) => {
    return (info: LoggerInfo) => {
        return templateParts.reduce((prev, curr) => {
            return `${prev} ${curr(info)}`;
        }, '');
    };
};
